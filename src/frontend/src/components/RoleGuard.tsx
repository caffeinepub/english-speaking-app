import { type ReactNode } from 'react';
import { useGetCallerUserRole } from '../hooks/useQueries';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: 'admin' | 'user';
}

export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { data: userRole, isLoading } = useGetCallerUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasAccess =
    requiredRole === 'admin' ? userRole === 'admin' : userRole === 'admin' || userRole === 'user';

  if (!hasAccess) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
