import Link from 'next/link';
import Image from 'next/image';

type Props = {
    heightClass?: string,
}

export const LogoFeORms = ({ heightClass = 'h-5' }: Props) => {
    return (
        <div className={`${heightClass} aspect-16/2`}>
            <Link
                href={'/'}
            >
                <Image
                    src={'/logo-feorms.svg'}
                    priority
                    alt='Logo fernandaorms'
                    height={24}
                    width={180}
                />
            </Link>
        </div>
    )
}
