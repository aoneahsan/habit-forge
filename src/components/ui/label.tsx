// Re-export Radix UI Text as Label for compatibility
import { Text } from '@radix-ui/themes';
import * as React from 'react';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ children, ...props }, ref) => (
  <Text as="label" size="2" weight="medium">
    {children}
  </Text>
));

Label.displayName = 'Label';