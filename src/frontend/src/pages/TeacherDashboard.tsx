import { useGetAllSessions } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, GraduationCap, Eye } from 'lucide-react';

const statusConfig = {
  inProgress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  submittedForReview: { label: 'Needs Review', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
  reviewed: { label: 'Reviewed', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
};

export default function TeacherDashboard() {
  const { data: sessions, isLoading } = useGetAllSessions();
  const navigate = useNavigate();

  const needsReview = sessions?.filter((s) => s.status === 'submittedForReview').length || 0;
  const reviewed = sessions?.filter((s) => s.status === 'reviewed').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-md">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Review and provide feedback on student practice sessions</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-3xl">{sessions?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Needs Review</CardDescription>
            <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">{needsReview}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Reviewed</CardDescription>
            <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">{reviewed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Sessions</CardTitle>
          <CardDescription>All practice sessions from students</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => {
                    const config = statusConfig[session.status];
                    const date = new Date(Number(session.startTime) / 1000000);

                    return (
                      <TableRow key={session.sessionId.toString()}>
                        <TableCell className="font-medium">
                          {session.studentId.toString().slice(0, 8)}...
                        </TableCell>
                        <TableCell>{session.prompt.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{date.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate({
                                to: '/teacher/review/$sessionId',
                                params: { sessionId: session.sessionId.toString() },
                              })
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No student sessions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
