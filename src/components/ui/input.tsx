// Re-export Radix UI TextField as Input for compatibility
import { TextField } from '@radix-ui/themes';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, value, onChange, disabled, ...props }, ref) => {
    // Convert value to string or number for TextField compatibility
    const textFieldValue = typeof value === 'string' || typeof value === 'number' ? value : undefined;
    
    return <TextField.Root 
      placeholder={placeholder}
      value={textFieldValue}
      onChange={onChange}
      disabled={disabled}
    />;
  }
);

Input.displayName = 'Input';