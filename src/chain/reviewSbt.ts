export const REVIEW_SBT_ADDRESS = "0x34103F8C0dAAdd13E24fe20fF652e1099D4673B7"

export const reviewSbtAbi = [
    {
        type: "function",
        name: "submitReview",
        stateMutability: "nonpayable",
        inputs: [
            { name: "pointId", type: "uint256" },
            { name: "rating", type: "uint8" },
            { name: "reviewHash", type: "bytes32" },
        ],
        outputs: [{ name: "tokenId", type: "uint256" }],
    },
    {
        type: "event",
        name: "ReviewSubmitted",
        inputs: [
            { name: "pointId", type: "uint256", indexed: true },
            { name: "reviewer", type: "address", indexed: true },
            { name: "rating", type: "uint8", indexed: false },
            { name: "reviewHash", type: "bytes32", indexed: false },
            { name: "tokenId", type: "uint256", indexed: true },
        ],
        anonymous: false,
    },
] as const;
