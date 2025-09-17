// Re-export Radix UI Dialog components for compatibility
import { Dialog, Heading, Text, Box } from '@radix-ui/themes';
import * as React from 'react';

export { Dialog };
export const DialogTrigger = Dialog.Trigger;
export const DialogContent = Dialog.Content;
export const DialogClose = Dialog.Close;

// Custom wrapper components for backward compatibility
export const DialogHeader = ({ children, className, ...props }: any) => (
  <Box mb="4" {...props}>
    {children}
  </Box>
);

export const DialogTitle = ({ children, className, ...props }: any) => (
  <Dialog.Title>
    <Heading size="6" {...props}>
      {children}
    </Heading>
  </Dialog.Title>
);

export const DialogDescription = ({ children, className, ...props }: any) => (
  <Dialog.Description>
    <Text size="2" color="gray" {...props}>
      {children}
    </Text>
  </Dialog.Description>
);

export const DialogFooter = ({ children, className, ...props }: any) => (
  <Box mt="4" {...props}>
    {children}
  </Box>
);

// Additional exports for compatibility
export const DialogOverlay = () => null;
export const DialogPortal = ({ children }: any) => children;