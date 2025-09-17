import type { LucideIcon } from 'lucide-react';
import { Card, Flex, Box, Text } from '@radix-ui/themes';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  change?: string;
}

const colorMap = {
  blue: { bg: 'var(--blue-3)', text: 'var(--blue-9)' },
  green: { bg: 'var(--green-3)', text: 'var(--green-9)' },
  purple: { bg: 'var(--purple-3)', text: 'var(--purple-9)' },
  yellow: { bg: 'var(--yellow-3)', text: 'var(--yellow-9)' },
  red: { bg: 'var(--red-3)', text: 'var(--red-9)' },
};

export function StatsCard({ title, value, icon: Icon, color, change }: StatsCardProps) {
  const colors = colorMap[color];
  
  return (
    <Card>
      <Box p="6">
        <Flex justify="between" align="start">
          <Box>
            <Text size="2" weight="medium" color="gray">{title}</Text>
            <Text size="7" weight="bold" mt="2" style={{ display: 'block' }}>
              {value}
            </Text>
            {change && (
              <Text size="2" color="gray" mt="2" style={{ display: 'block' }}>
                {change}
              </Text>
            )}
          </Box>
          <Box 
            style={{ 
              backgroundColor: colors.bg, 
              color: colors.text,
              padding: '12px',
              borderRadius: 'var(--radius-2)'
            }}
          >
            <Icon size={24} />
          </Box>
        </Flex>
      </Box>
    </Card>
  );
}