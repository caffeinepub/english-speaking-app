import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import PracticePage from './pages/PracticePage';
import SessionPage from './pages/SessionPage';
import PromptLibrary from './pages/PromptLibrary';
import TeacherDashboard from './pages/TeacherDashboard';
import SessionReviewPage from './pages/SessionReviewPage';
import AdminPromptManagement from './pages/AdminPromptManagement';
import ProfileSetupModal from './components/ProfileSetupModal';
import RoleGuard from './components/RoleGuard';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetupModal />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PracticePage,
});

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/practice',
  component: PracticePage,
});

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session/$sessionId',
  component: SessionPage,
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/library',
  component: PromptLibrary,
});

const teacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher',
  component: () => (
    <RoleGuard requiredRole="admin">
      <TeacherDashboard />
    </RoleGuard>
  ),
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/review/$sessionId',
  component: () => (
    <RoleGuard requiredRole="admin">
      <SessionReviewPage />
    </RoleGuard>
  ),
});

const adminPromptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/prompts',
  component: () => (
    <RoleGuard requiredRole="admin">
      <AdminPromptManagement />
    </RoleGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  practiceRoute,
  sessionRoute,
  libraryRoute,
  teacherRoute,
  reviewRoute,
  adminPromptsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
