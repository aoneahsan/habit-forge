// Re-export Radix UI Select components for compatibility
export { 
  Select
} from '@radix-ui/themes';

// For backward compatibility with compound components
import { Select } from '@radix-ui/themes';

export const SelectTrigger = Select.Trigger;
export const SelectContent = Select.Content;
export const SelectItem = Select.Item;
export const SelectValue = ({ placeholder, ...props }: any) => placeholder;
export const SelectGroup = Select.Group;
export const SelectLabel = Select.Label;
export const SelectSeparator = Select.Separator;