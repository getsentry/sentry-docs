import {StaticImageData} from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import Link from 'next/link';

export function Card({
  href,
  image,
  imageAlt,
  title,
  description,
  className = '',
}: {
  description: string;
  href: string;
  image: string | StaticImageData;
  imageAlt: string;
  title: string;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      <div className="flex flex-col md:flex-row shadow dark:bg-[var(--gray-4)] p-6 rounded gap-4 h-full text-[var(--foreground)]">
        <Image
          src={image}
          height={64}
          alt={imageAlt}
          className="object-contain !border-none !shadow-none"
        />
        <div className="flex flex-col justify-center space-y-2">
          <h3 className="text-xl font-medium">{title}</h3>
          <p className="text-[length:--font-size-3]">{description}</p>
        </div>
      </div>
    </Link>
  );
}
