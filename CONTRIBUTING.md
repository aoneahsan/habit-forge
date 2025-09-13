# Contributing to HabitForge

First off, thank you for considering contributing to HabitForge! It's people like you that make HabitForge such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our values of:
- Being respectful and inclusive
- Welcoming to newcomers
- Focused on what is best for the community
- Showing empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (browser, OS, device)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- Detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes following our coding standards
3. Ensure the test suite passes
4. Update documentation as needed
5. Submit your pull request

## Development Setup

### Prerequisites

- Node.js 22+ LTS
- Yarn package manager
- Firebase account
- Git

### Local Development

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/habitforge.git
cd habitforge
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Firebase config
```

4. **Start development server**
```bash
yarn dev
```

5. **Run tests**
```bash
yarn test
yarn lint
```

## Coding Standards

### TypeScript

- Use strict mode
- All variables and functions must be properly typed
- Avoid `any` type unless absolutely necessary
- Use interfaces over type aliases for object shapes
- Export types separately from implementations

### React Components

- Use functional components with hooks
- Keep components small and focused (< 500 lines)
- Extract reusable logic into custom hooks
- Use proper prop typing with TypeScript
- Implement proper error boundaries

### File Organization

```typescript
// 1. Imports - grouped and ordered
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Type imports
import type { User } from '@/types';

// Component imports
import { Button } from '@/components/ui';

// 2. Type definitions
interface Props {
  userId: string;
}

// 3. Component
export function Component({ userId }: Props) {
  // hooks
  // handlers
  // render
}

// 4. Exports
```

### State Management

- Use Zustand for global state
- Use React Query for server state
- Keep state as local as possible
- Avoid prop drilling with context when needed

### Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and sizing
- Use CSS variables for theming
- Avoid inline styles

### Git Commit Messages

Follow conventional commits:

```
feat: add new habit reminder feature
fix: resolve streak calculation bug
docs: update README with new features
style: format code with prettier
refactor: simplify habit completion logic
test: add tests for achievement system
chore: update dependencies
```

### Code Quality Checklist

Before submitting a PR, ensure:

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.logs left in code
- [ ] Tests pass locally
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Lint issues resolved

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for 80% coverage minimum
- Use descriptive test names

### Integration Tests

- Test feature workflows
- Test API integrations
- Verify data persistence
- Test error scenarios

### E2E Tests

- Test critical user paths
- Test cross-browser compatibility
- Test responsive design
- Test offline functionality

## Documentation

- Update README.md for new features
- Add JSDoc comments for complex functions
- Update CLAUDE.md for AI-specific instructions
- Document API changes
- Include examples for new features

## Firebase Specific Guidelines

### Firestore

- Always use the `hf2024_` prefix for collections
- Implement proper security rules
- Create indexes for queries
- Handle offline scenarios

### Authentication

- Support multiple auth providers
- Handle auth errors gracefully
- Implement proper session management
- Test auth flows thoroughly

### Storage

- Validate file types and sizes
- Implement proper access control
- Handle upload errors
- Clean up orphaned files

## Performance Considerations

- Lazy load components when possible
- Optimize images and assets
- Implement proper caching strategies
- Monitor bundle size
- Use React.memo for expensive components
- Implement virtual scrolling for long lists

## Accessibility

- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios
- Provide alternative text for images

## Security

- Never commit secrets or API keys
- Validate all user inputs
- Implement proper CORS policies
- Use HTTPS everywhere
- Follow OWASP guidelines
- Regular dependency updates

## Release Process

1. Create feature branch from `main`
2. Implement feature/fix
3. Write/update tests
4. Update documentation
5. Create pull request
6. Code review
7. Merge to `main`
8. Automatic deployment

## Getting Help

- Check documentation first
- Search existing issues
- Ask in discussions
- Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HabitForge! 🚀