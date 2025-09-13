#!/bin/bash

echo "Fixing all build errors..."

# Fix type-only imports that weren't caught before
sed -i "s/import { ButtonHTMLAttributes }/import type { ButtonHTMLAttributes }/g" src/components/ui/Button.tsx
sed -i "s/import { InputHTMLAttributes }/import type { InputHTMLAttributes }/g" src/components/ui/Input.tsx

# Fix possibly undefined properties in components
sed -i "s/habit\.streak/\(habit\.streak || 0\)/g" src/components/habits/HabitCard.tsx
sed -i "s/h\.streak/\(h\.streak || 0\)/g" src/routes/_protected/habits.tsx
sed -i "s/h\.streak/\(h\.streak || 0\)/g" src/routes/_protected/analytics.tsx
sed -i "s/a\.streak/\(a\.streak || 0\)/g" src/routes/_protected/analytics.tsx
sed -i "s/b\.streak/\(b\.streak || 0\)/g" src/routes/_protected/analytics.tsx
sed -i "s/h\.totalCompletions/\(h\.totalCompletions || 0\)/g" src/routes/_protected/analytics.tsx

# Fix route paths - replace /auth/ with just /
sed -i "s|to=\"/auth/signin\"|to=\"/signin\"|g" src/routes/_auth/*.tsx src/routes/*.tsx src/routes/_protected.tsx
sed -i "s|to=\"/auth/signup\"|to=\"/signup\"|g" src/routes/_auth/*.tsx
sed -i "s|to=\"/auth/forgot-password\"|to=\"/forgot-password\"|g" src/routes/_auth/*.tsx
sed -i "s|'/auth/signin'|'/signin'|g" src/routes/_auth/*.tsx src/routes/*.tsx src/routes/_protected.tsx

# Fix habit service undefined checks
sed -i "s/habit\.streak/(habit\.streak || 0)/g" src/services/firebase/habit.service.ts
sed -i "s/Math\.max(habit\.longestStreak/Math.max((habit.longestStreak || 0)/g" src/services/firebase/habit.service.ts
sed -i "s/Math\.max(habit\.points/Math.max((habit.points || 0)/g" src/services/firebase/habit.service.ts

echo "Build errors fixed!"