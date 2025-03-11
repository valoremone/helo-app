import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPassword() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <ForgotPasswordForm className="w-full max-w-md" />
    </div>
  );
}