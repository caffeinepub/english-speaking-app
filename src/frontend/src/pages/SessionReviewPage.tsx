import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSession } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SessionReviewForm from '../components/SessionReviewForm';
import { Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const difficultyLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

const statusConfig = {
  inProgress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: CheckCircle },
  submittedForReview: {
    label: 'Needs Review',
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    icon: AlertCircle,
  },
  reviewed: {
    label: 'Reviewed',
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    icon: CheckCircle,
  },
};

export default function SessionReviewPage() {
  const { sessionId } = useParams({ from: '/teacher/review/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetSession(BigInt(sessionId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
        <p className="text-muted-foreground mb-6">The session you're looking for doesn't exist</p>
        <Button onClick={() => navigate({ to: '/teacher' })}>Back to Dashboard</Button>
      </div>
    );
  }

  const config = statusConfig[session.status];
  const StatusIcon = config.icon;
  const level = Number(session.prompt.difficultyLevel);
  const canReview = session.status === 'submittedForReview' || session.status === 'completed';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate({ to: '/teacher' })}>
          ← Back to Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Review Session</h1>
        </div>
        <Badge variant="outline" className={config.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{session.prompt.title}</CardTitle>
              <CardDescription className="text-base">{session.prompt.description}</CardDescription>
            </div>
            <Badge variant="secondary">{difficultyLabels[level] || 'Intermediate'}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Student ID</p>
              <p className="font-mono text-sm">{session.studentId.toString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Started</p>
              <p className="text-sm">{new Date(Number(session.startTime) / 1000000).toLocaleString()}</p>
            </div>
          </div>

          {session.recordingUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Student Recording</p>
              <div className="p-4 bg-accent/50 rounded-lg">
                <a
                  href={session.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {session.recordingUrl}
                </a>
              </div>
            </div>
          )}

          {session.feedback ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Your Feedback</p>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm">{session.feedback}</p>
              </div>
            </div>
          ) : canReview ? (
            <>
              <Separator />
              <SessionReviewForm
                sessionId={session.sessionId}
                onSuccess={() => navigate({ to: '/teacher' })}
              />
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>This session is not ready for review yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
