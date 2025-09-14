import { createFileRoute } from '@tanstack/react-router';
import { rootRedirect } from '@/lib/auth-guards';

export const Route = createFileRoute('/')({
  beforeLoad: rootRedirect,
});