#!/bin/bash

# Fix remaining type-only imports
sed -i "s/import { ButtonHTMLAttributes }/import type { ButtonHTMLAttributes }/g" src/components/ui/Button.tsx
sed -i "s/import { InputHTMLAttributes }/import type { InputHTMLAttributes }/g" src/components/ui/Input.tsx
sed -i "s/import { ReactNode }/import type { ReactNode }/g" src/features/auth/providers/AuthProvider.tsx
sed -i "s/import { User as FirebaseUser/import type { User as FirebaseUser/g" src/features/auth/providers/AuthProvider.tsx
sed -i "s/  User,/  type User,/g" src/services/firebase/auth.service.ts
sed -i "s/import { HabitFormData }/import type { HabitFormData }/g" src/routes/_protected/habits/new.tsx

# Fix undefined checks
sed -i "s/habit.streak/\(habit.streak || 0\)/g" src/components/visualization/RopeVisualization.tsx
sed -i "s/h.streak/\(h.streak || 0\)/g" src/components/visualization/RopeVisualization.tsx
sed -i "s/habit.totalCompletions/\(habit.totalCompletions || 0\)/g" src/services/firebase/habit.service.ts
sed -i "s/habit.points/\(habit.points || 0\)/g" src/services/firebase/habit.service.ts

echo "Fixed remaining type issues"