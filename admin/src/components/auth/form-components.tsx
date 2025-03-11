import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { z } from 'zod';
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Common form styles
export const formStyles = {
  container: 'w-full max-w-md mx-auto space-y-6 p-6',
  header: 'text-center space-y-2',
  title: 'text-2xl font-bold tracking-tight',
  subtitle: 'text-sm text-muted-foreground',
  form: 'space-y-4',
  field: 'space-y-2',
  button: 'w-full',
};

// Common form error component
export function FormError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

// Common loading button component
export function LoadingButton({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <Button type="submit" className={formStyles.button} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

// Common form field component
export const FormField = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, name, type = 'text', placeholder, error, ...props }, ref) => {
  return (
    <div className={formStyles.field}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});

FormField.displayName = 'FormField';

// Common form schema
export const baseFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Common form hook
export function useBaseForm<T extends z.ZodType>(schema: T) {
  type FormValues = z.infer<T>;
  
  return useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues
  });
}