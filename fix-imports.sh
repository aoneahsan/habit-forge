#!/bin/bash

# Fix type-only imports for TypeScript verbatimModuleSyntax

# Component type imports
sed -i "s/import { LucideIcon }/import type { LucideIcon }/g" src/components/dashboard/StatsCard.tsx
sed -i "s/import { Habit }/import type { Habit }/g" src/components/habits/HabitCard.tsx
sed -i "s/import { Habit }/import type { Habit }/g" src/components/habits/HabitList.tsx
sed -i "s/import { Habit }/import type { Habit }/g" src/components/visualization/RopeVisualization.tsx
sed -i "s/import { ButtonHTMLAttributes }/import type { ButtonHTMLAttributes }/g" src/components/ui/Button.tsx
sed -i "s/import { InputHTMLAttributes }/import type { InputHTMLAttributes }/g" src/components/ui/Input.tsx
sed -i "s/import { ReactNode }/import type { ReactNode }/g" src/features/auth/providers/AuthProvider.tsx
sed -i "s/import { User }/import type { User }/g" src/features/auth/providers/AuthProvider.tsx
sed -i "s/import { User }/import type { User }/g" src/services/firebase/auth.service.ts
sed -i "s/import { User }/import type { User }/g" src/services/firebase/user.service.ts
sed -i "s/import { Habit, HabitFormData, HabitCompletion }/import type { Habit, HabitFormData, HabitCompletion }/g" src/services/firebase/habit.service.ts

# Fix Sidebar NavLink import
sed -i "s/import { Link, useLocation, NavLink }/import { Link, useLocation }/g" src/components/layout/Sidebar.tsx

echo "Fixed type-only imports"