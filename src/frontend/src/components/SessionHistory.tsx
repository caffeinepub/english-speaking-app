import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { SpeakingSession } from '../backend';

interface SessionHistoryProps {
  sessions: SpeakingSession[];
}

const statusConfig = {
  inProgress: {
    label: 'In Progress',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    icon: CheckCircle,
  },
  submittedForReview: {
    label: 'Under Review',
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    icon: AlertCircle,
  },
  reviewed: {
    label: 'Reviewed',
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    icon: CheckCircle,
  },
};

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Practice History</CardTitle>
          <CardDescription>Your completed practice sessions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No practice sessions yet. Start your first session to begin tracking your progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => {
    const timeA = a.endTime ? Number(a.endTime) : Number(a.startTime);
    const timeB = b.endTime ? Number(b.endTime) : Number(b.startTime);
    return timeB - timeA;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Practice History</CardTitle>
        <CardDescription>Track your progress and review feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedSessions.map((session) => {
            const config = statusConfig[session.status];
            const StatusIcon = config.icon;
            const date = new Date(Number(session.startTime) / 1000000);

            return (
              <div
                key={session.sessionId.toString()}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{session.prompt.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{date.toLocaleDateString()}</span>
                    <span>•</span>
                    <Badge variant="outline" className={config.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                  {session.feedback && (
                    <p className="text-sm text-muted-foreground italic mt-2">"{session.feedback}"</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/session/$sessionId', params: { sessionId: session.sessionId.toString() } })}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
