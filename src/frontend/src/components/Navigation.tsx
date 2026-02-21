import { Link, useRouterState } from '@tanstack/react-router';
import { BookOpen, Mic, GraduationCap, Library } from 'lucide-react';
import LoginButton from './LoginButton';
import UserProfileDisplay from './UserProfileDisplay';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Navigation() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isAuthenticated = !!identity;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Mic className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                SpeakEasy
              </span>
            </Link>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/practice"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/practice') || isActive('/')
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span className="font-medium">Practice</span>
                </Link>

                <Link
                  to="/library"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/library')
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Library className="w-4 h-4" />
                  <span className="font-medium">Library</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/teacher"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive('/teacher') || currentPath.startsWith('/teacher')
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Teacher</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/prompts"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/prompts')
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Manage</span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && <UserProfileDisplay />}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
