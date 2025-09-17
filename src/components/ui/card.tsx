// Re-export Radix UI Card components for compatibility
import { Card as RadixCard, Box, Heading, Text } from '@radix-ui/themes';
import * as React from 'react';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <RadixCard {...props}>
    {children}
  </RadixCard>
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <Box p="6" pb="0" {...props}>
    {children}
  </Box>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => (
  <Heading size="6" {...props}>
    {children}
  </Heading>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className, ...props }, ref) => (
  <Text size="2" color="gray" {...props}>
    {children}
  </Text>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <Box p="6" {...props}>
    {children}
  </Box>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <Box p="6" pt="0" {...props}>
    {children}
  </Box>
));
CardFooter.displayName = 'CardFooter';