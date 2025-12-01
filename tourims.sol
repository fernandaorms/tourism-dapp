// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TourismReviewsSBT is ERC721 {
    struct ReviewData {
        uint256 pointId;      // ID do ponto turístico (espelha Point.id)
        address reviewer;     // carteira que avaliou (espelha Review.walletAddress)
        uint8 rating;         // nota 0..10 (espelha Review.rating)
        bytes32 reviewHash;   // hash off-chain (espelha Review.reviewHash)
        uint256 timestamp;    // momento em que foi gravado
    }

    uint256 private _tokenIdCounter;

    // pointId => wallet => already reviewed?
    mapping(uint256 => mapping(address => bool)) public hasReviewed;

    // tokenId => review data
    mapping(uint256 => ReviewData) public reviewsByToken;

    event ReviewSubmitted(
        uint256 indexed pointId,
        address indexed reviewer,
        uint8 rating,
        bytes32 reviewHash,
        uint256 indexed tokenId
    );

    constructor() ERC721("TourismReviewSBT", "TRSBT") {}

    function submitReview(
        uint256 pointId,
        uint8 rating,
        bytes32 reviewHash
    ) external returns (uint256 tokenId) {
        require(rating <= 10, "Invalid rating");
        require(!hasReviewed[pointId][msg.sender], "Already reviewed");

        hasReviewed[pointId][msg.sender] = true;

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);

        reviewsByToken[newTokenId] = ReviewData({
            pointId: pointId,
            reviewer: msg.sender,
            rating: rating,
            reviewHash: reviewHash,
            timestamp: block.timestamp
        });

        emit ReviewSubmitted(pointId, msg.sender, rating, reviewHash, newTokenId);

        return newTokenId;
    }

    // SBT behavior: disable transfers between non-zero addresses
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);

        // allow only mint (from == address(0)) or burn (to == address(0))
        if (from != address(0) && to != address(0)) {
            revert("SBT: non-transferable");
        }

        return super._update(to, tokenId, auth);
    }
}
