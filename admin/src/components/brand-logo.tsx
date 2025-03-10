import { BRAND } from '@/lib/constants';
import { useTheme } from 'next-themes';
import darkLogo from '@/assets/logos/HELO-full-logo-dark.svg';
import lightLogo from '@/assets/logos/HELO-full-logo-light.svg';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20'
  };
  
  const logoSrc = theme === 'dark' ? lightLogo : darkLogo;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt={`${BRAND.name} - ${BRAND.description}`} 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
}