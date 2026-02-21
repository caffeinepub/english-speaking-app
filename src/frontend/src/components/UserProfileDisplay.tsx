import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

export default function UserProfileDisplay() {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (isLoading || !profile) {
    return null;
  }

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-accent/50">
      <Avatar className="w-8 h-8 border-2 border-primary/20">
        <AvatarFallback className="bg-gradient-to-br from-primary to-chart-1 text-primary-foreground text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium leading-none">{profile.name}</span>
        {profile.role === 'teacher' && (
          <Badge variant="secondary" className="mt-1 text-xs w-fit">
            Teacher
          </Badge>
        )}
      </div>
    </div>
  );
}
