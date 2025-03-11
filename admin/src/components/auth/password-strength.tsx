import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains number or special char
    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
    
    return strength;
  };
  
  const getStrengthText = (strength: number): string => {
    if (strength === 0) return "Enter a password";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };
  
  const getStrengthColor = (strength: number): string => {
    if (strength === 0) return "bg-gray-300";
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-yellow-500";
    if (strength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const strength = calculateStrength(password);
  
  return (
    <div className="space-y-2">
      <Progress value={strength} className={getStrengthColor(strength)} />
      <p className="text-xs text-gray-500">
        Password strength: <span className="font-medium">{getStrengthText(strength)}</span>
      </p>
    </div>
  );
};