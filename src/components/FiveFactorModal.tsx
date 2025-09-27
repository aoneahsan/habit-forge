import { useState } from 'react';
import {
  Dialog,
  Button,
  Flex,
  Text,
  Heading,
  Select,
  TextArea,
  Badge,
  Card,
  Box,
  Separator
} from '@radix-ui/themes';
import {
  MapPin, Heart, Users, Clock, Zap,
  Home, Briefcase, Coffee, Car, ShoppingBag, TreePine,
  Smile, Meh, Frown, Angry, Sparkles, AlertCircle,
  User, Users2, UsersIcon, Crown,
  Sun, Sunrise, Sunset, Moon,
  Brain, Calendar, Bell, Activity, Target, Coffee as CoffeeIcon
} from 'lucide-react';
// import type { FiveFactors } from '@/types';
import toast from 'react-hot-toast';

// Simple interface for the modal
interface SimpleFiveFactors {
  location: string;
  emotion: string;
  people: string;
  timeOfDay: string;
  trigger: string;
  userId: string;
  notes?: string;
  duration?: number;
}

interface FiveFactorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (factors: any) => Promise<void>;
  habitTitle: string;
  userId: string;
}

const locations = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'gym', label: 'Gym', icon: Activity },
  { value: 'cafe', label: 'Cafe', icon: Coffee },
  { value: 'commute', label: 'Commute', icon: Car },
  { value: 'store', label: 'Store', icon: ShoppingBag },
  { value: 'outdoors', label: 'Outdoors', icon: TreePine },
  { value: 'other', label: 'Other', icon: MapPin }
];

const emotions = [
  { value: 'excited', label: 'Excited', icon: Sparkles, color: 'yellow' },
  { value: 'happy', label: 'Happy', icon: Smile, color: 'green' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'gray' },
  { value: 'stressed', label: 'Stressed', icon: AlertCircle, color: 'orange' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'blue' },
  { value: 'angry', label: 'Angry', icon: Angry, color: 'red' }
];

const peopleOptions = [
  { value: 'alone', label: 'Alone', icon: User },
  { value: 'partner', label: 'Partner', icon: Heart },
  { value: 'family', label: 'Family', icon: Users2 },
  { value: 'friends', label: 'Friends', icon: UsersIcon },
  { value: 'colleagues', label: 'Colleagues', icon: Briefcase },
  { value: 'crowd', label: 'Crowd', icon: Crown }
];

const timeOptions = [
  { value: 'early-morning', label: 'Early Morning (5-7 AM)', icon: Sunrise },
  { value: 'morning', label: 'Morning (7-12 PM)', icon: Sun },
  { value: 'afternoon', label: 'Afternoon (12-5 PM)', icon: Sun },
  { value: 'evening', label: 'Evening (5-9 PM)', icon: Sunset },
  { value: 'night', label: 'Night (9 PM-12 AM)', icon: Moon },
  { value: 'late-night', label: 'Late Night (12-5 AM)', icon: Moon }
];

const triggers = [
  { value: 'routine', label: 'Routine', icon: Calendar },
  { value: 'reminder', label: 'Reminder', icon: Bell },
  { value: 'craving', label: 'Craving', icon: Brain },
  { value: 'boredom', label: 'Boredom', icon: CoffeeIcon },
  { value: 'stress', label: 'Stress', icon: AlertCircle },
  { value: 'reward', label: 'Reward', icon: Target },
  { value: 'social', label: 'Social', icon: Users },
  { value: 'other', label: 'Other', icon: Zap }
];

export function FiveFactorModal({
  open,
  onClose,
  onSubmit,
  habitTitle,
  userId
}: FiveFactorModalProps) {
  const [factors, setFactors] = useState<SimpleFiveFactors>({
    location: 'home',
    emotion: 'neutral',
    people: 'alone',
    timeOfDay: 'morning',
    trigger: 'routine',
    userId
  });
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(15);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Convert SimpleFiveFactors to FiveFactors
      const fiveFactors: any = {
        location: factors.location,
        emotionalState: factors.emotion,
        otherPeople: [factors.people],
        time: new Date(),
        precedingAction: factors.trigger,
        notes,
        duration
      };
      
      await onSubmit(fiveFactors);
      toast.success('✅ Habit tracked with all five factors!');
      onClose();
      // Reset form
      setNotes('');
      setDuration(15);
    } catch (error) {
      toast.error('Failed to track habit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content maxWidth="600px" className="max-h-[90vh] overflow-y-auto">
        <Dialog.Title>
          <Flex align="center" gap="2">
            <Target className="h-5 w-5 text-blue-600" />
            <Heading size="5">Track: {habitTitle}</Heading>
          </Flex>
        </Dialog.Title>
        
        <Dialog.Description size="2" mb="4" color="gray">
          Track the five crucial factors that influence your habit formation
        </Dialog.Description>

        <Flex direction="column" gap="5">
          {/* Location */}
          <Box>
            <Flex align="center" gap="2" mb="2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <Text weight="medium">Where were you?</Text>
            </Flex>
            <Select.Root value={factors.location} onValueChange={(value) => 
              setFactors({...factors, location: value})
            }>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Group>
                  {locations.map(loc => (
                    <Select.Item key={loc.value} value={loc.value}>
                      <Flex align="center" gap="2">
                        <loc.icon className="h-4 w-4" />
                        {loc.label}
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Emotion */}
          <Box>
            <Flex align="center" gap="2" mb="2">
              <Heart className="h-4 w-4 text-red-600" />
              <Text weight="medium">How did you feel?</Text>
            </Flex>
            <Flex gap="2" wrap="wrap">
              {emotions.map(emotion => (
                <Card
                  key={emotion.value}
                  className={`cursor-pointer transition-all ${
                    factors.emotion === emotion.value 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setFactors({...factors, emotion: emotion.value})}
                >
                  <Flex align="center" gap="2" p="2">
                    <emotion.icon className={`h-4 w-4 text-${emotion.color}-600`} />
                    <Text size="2">{emotion.label}</Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Box>

          {/* People */}
          <Box>
            <Flex align="center" gap="2" mb="2">
              <Users className="h-4 w-4 text-green-600" />
              <Text weight="medium">Who was with you?</Text>
            </Flex>
            <Select.Root value={factors.people} onValueChange={(value) => 
              setFactors({...factors, people: value})
            }>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Group>
                  {peopleOptions.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      <Flex align="center" gap="2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Time of Day */}
          <Box>
            <Flex align="center" gap="2" mb="2">
              <Clock className="h-4 w-4 text-purple-600" />
              <Text weight="medium">What time was it?</Text>
            </Flex>
            <Flex gap="2" wrap="wrap">
              {timeOptions.map(time => (
                <Badge
                  key={time.value}
                  variant={factors.timeOfDay === time.value ? 'solid' : 'soft'}
                  className="cursor-pointer"
                  onClick={() => setFactors({...factors, timeOfDay: time.value})}
                >
                  <time.icon className="h-3 w-3 mr-1" />
                  {time.label}
                </Badge>
              ))}
            </Flex>
          </Box>

          {/* Trigger */}
          <Box>
            <Flex align="center" gap="2" mb="2">
              <Zap className="h-4 w-4 text-orange-600" />
              <Text weight="medium">What triggered this habit?</Text>
            </Flex>
            <Select.Root value={factors.trigger} onValueChange={(value) => 
              setFactors({...factors, trigger: value})
            }>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Group>
                  {triggers.map(trigger => (
                    <Select.Item key={trigger.value} value={trigger.value}>
                      <Flex align="center" gap="2">
                        <trigger.icon className="h-4 w-4" />
                        {trigger.label}
                      </Flex>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Box>

          <Separator size="4" />

          {/* Additional Info */}
          <Box>
            <Text weight="medium" mb="2">Duration (minutes)</Text>
            <Select.Root value={duration.toString()} onValueChange={(value) => 
              setDuration(parseInt(value))
            }>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item value="5">5 minutes</Select.Item>
                <Select.Item value="10">10 minutes</Select.Item>
                <Select.Item value="15">15 minutes</Select.Item>
                <Select.Item value="20">20 minutes</Select.Item>
                <Select.Item value="30">30 minutes</Select.Item>
                <Select.Item value="45">45 minutes</Select.Item>
                <Select.Item value="60">1 hour</Select.Item>
                <Select.Item value="90">1.5 hours</Select.Item>
                <Select.Item value="120">2 hours</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          {/* Notes */}
          <Box>
            <Text weight="medium" mb="2">Notes (optional)</Text>
            <TextArea
              placeholder="Any additional thoughts or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Box>
        </Flex>

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Tracking...' : 'Track Habit'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}