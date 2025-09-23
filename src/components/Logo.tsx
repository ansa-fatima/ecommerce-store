import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const imageSizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
    xxl: 'h-32 w-32',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    xxl: 'text-4xl',
  };

  return (
    <Link href="/" className={`flex items-center hover:opacity-80 transition-opacity duration-200 ${className}`}>
      {/* Logo Image */}
      <div className={`${imageSizeClasses[size]} relative rounded-full overflow-hidden`}>
        <Image
          src="/logo-1.png"
          alt="AZH Collection Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="ml-3">
          <h1 className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
            AZH Collection
          </h1>
        </div>
      )}
    </Link>
  );
}
