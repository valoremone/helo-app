import { BRAND } from '@/lib/constants';
import appIcon from '@/assets/logos/HELOAppIconBlue.png';

interface BrandIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandIcon({ className = '', size = 'md' }: BrandIconProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={appIcon} 
        alt={`${BRAND.name} Icon`} 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
} 