import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSession, useCompleteSession } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mic, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
    label: 'Under Review',
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    icon: AlertCircle,
  },
  reviewed: {
    label: 'Reviewed',
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    icon: CheckCircle,
  },
};

export default function SessionPage() {
  const { sessionId } = useParams({ from: '/session/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetSession(BigInt(sessionId));
  const completeSession = useCompleteSession();
  const [recordingUrl, setRecordingUrl] = useState('');

  const handleComplete = async () => {
    if (!recordingUrl.trim()) {
      toast.error('Please enter a recording URL');
      return;
    }

    try {
      await completeSession.mutateAsync({
        sessionId: BigInt(sessionId),
        recordingUrl: recordingUrl.trim(),
      });
      toast.success('Session completed! Your recording has been submitted for review.');
    } catch (error) {
      console.error('Complete session error:', error);
      toast.error('Failed to complete session');
    }
  };

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
        <Button onClick={() => navigate({ to: '/practice' })}>Back to Practice</Button>
      </div>
    );
  }

  const config = statusConfig[session.status];
  const StatusIcon = config.icon;
  const level = Number(session.prompt.difficultyLevel);
  const canComplete = session.status === 'inProgress';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate({ to: '/practice' })}>
          ← Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Practice Session</h1>
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

          <div className="bg-accent/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Speaking Exercise</h3>
                <p className="text-sm text-muted-foreground">Record yourself speaking on this topic</p>
              </div>
            </div>
            <img
              src="/assets/generated/learning-illustration.dim_400x300.png"
              alt="Learning illustration"
              className="rounded-lg mx-auto"
            />
          </div>

          {canComplete && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="recordingUrl">Recording URL</Label>
                <Input
                  id="recordingUrl"
                  placeholder="Enter the URL of your recording (e.g., Google Drive, Dropbox link)"
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  disabled={completeSession.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Upload your recording to a cloud service and paste the shareable link here
                </p>
              </div>
              <Button
                onClick={handleComplete}
                disabled={completeSession.isPending || !recordingUrl.trim()}
                className="w-full gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {completeSession.isPending ? 'Submitting...' : 'Complete & Submit for Review'}
              </Button>
            </div>
          )}

          {session.recordingUrl && (
            <div className="space-y-2 pt-4">
              <Label>Your Recording</Label>
              <div className="p-3 bg-accent/50 rounded-lg">
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

          {session.feedback && (
            <div className="space-y-2 pt-4">
              <Label>Teacher Feedback</Label>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm">{session.feedback}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
