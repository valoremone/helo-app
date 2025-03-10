import { BRAND } from '@/lib/constants';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'small';
}

export function Logo({ className = '', variant = 'default' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`font-bold tracking-tighter ${variant === 'small' ? 'text-2xl' : 'text-3xl'}`}>
        {BRAND.name}
      </div>
      {variant === 'default' && (
        <div className="ml-2 text-xs uppercase tracking-wider text-muted-foreground">
          {BRAND.description}
        </div>
      )}
    </div>
  );
}