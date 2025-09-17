// Re-export Radix UI TextArea for compatibility
import { TextArea } from '@radix-ui/themes';
import * as React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Re-export as Textarea for backward compatibility
export const Textarea = TextArea;
export { TextArea };