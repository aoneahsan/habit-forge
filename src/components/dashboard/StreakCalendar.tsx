import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flex, Grid, Box, Text, IconButton } from '@radix-ui/themes';

export function StreakCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const monthYear = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date().getDate();
  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() && 
    currentMonth.getFullYear() === new Date().getFullYear();
  
  // Mock data for completed days
  const completedDays = new Set([1, 2, 3, 5, 8, 10, 11, 12, 15, 18, 20, 21, 22]);
  
  return (
    <Box>
      {/* Month Navigation */}
      <Flex align="center" justify="between" mb="4">
        <IconButton
          size="1"
          variant="ghost"
          onClick={previousMonth}
        >
          <ChevronLeft size={16} />
        </IconButton>
        <Text size="2" weight="medium">{monthYear}</Text>
        <IconButton
          size="1"
          variant="ghost"
          onClick={nextMonth}
        >
          <ChevronRight size={16} />
        </IconButton>
      </Flex>
      
      {/* Calendar Grid */}
      <Grid columns="7" gap="1" style={{ textAlign: 'center' }}>
        {/* Day Headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} size="1" weight="medium" color="gray">
            {day}
          </Text>
        ))}
        
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <Box key={`empty-${index}`} />
        ))}
        
        {/* Calendar Days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isCompleted = completedDays.has(day);
          const isToday = isCurrentMonth && day === today;
          
          return (
            <Flex
              key={day}
              align="center"
              justify="center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? 'var(--teal-9)' : undefined,
                border: !isCompleted && isToday ? '2px solid var(--teal-9)' : undefined,
                color: isCompleted ? 'white' : !isToday ? 'var(--gray-11)' : undefined,
              }}
            >
              <Text size="1">{day}</Text>
            </Flex>
          );
        })}
      </Grid>
      
      {/* Legend */}
      <Flex align="center" justify="center" gap="4" mt="4">
        <Flex align="center" gap="1">
          <Box
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--teal-9)',
            }}
          />
          <Text size="1" color="gray">Completed</Text>
        </Flex>
        <Flex align="center" gap="1">
          <Box
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid var(--teal-9)',
            }}
          />
          <Text size="1" color="gray">Today</Text>
        </Flex>
      </Flex>
    </Box>
  );
}