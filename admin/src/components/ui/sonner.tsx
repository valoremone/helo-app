import { useTheme } from '@/components/theme-provider';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as 'light' | 'dark'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg',
          title: 'text-gray-900 dark:text-white font-medium',
          description: 'text-gray-500 dark:text-gray-400',
          actionButton: 'bg-blue-500 text-white',
          cancelButton: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
          closeButton: 'text-gray-500 dark:text-gray-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };