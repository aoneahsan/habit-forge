import { Loader2 } from 'lucide-react';
import { Flex, Box, Text, Container } from '@radix-ui/themes';

export function AuthLoading() {
  return (
    <Container size="1">
      <Flex 
        align="center" 
        justify="center" 
        minHeight="100vh"
        direction="column"
      >
        <Box>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--teal-9)' }} />
        </Box>
        <Text size="2" color="gray" mt="4">
          Verifying authentication...
        </Text>
      </Flex>
    </Container>
  );
}