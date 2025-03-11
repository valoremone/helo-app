import { useTheme } from '@/components/theme-provider';
import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Plane className={`h-6 w-6 ${isDark ? 'text-white' : 'text-black'}`} />
      <span className="font-bold text-xl">HELO</span>
    </div>
  );
}