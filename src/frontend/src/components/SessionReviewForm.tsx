import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useReviewSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface SessionReviewFormProps {
  sessionId: bigint;
  onSuccess?: () => void;
}

export default function SessionReviewForm({ sessionId, onSuccess }: SessionReviewFormProps) {
  const [feedback, setFeedback] = useState('');
  const reviewSession = useReviewSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Please enter feedback');
      return;
    }

    try {
      await reviewSession.mutateAsync({ sessionId, feedback: feedback.trim() });
      toast.success('Feedback submitted successfully');
      setFeedback('');
      onSuccess?.();
    } catch (error) {
      console.error('Review error:', error);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="feedback">Teacher Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="Provide constructive feedback on pronunciation, grammar, fluency, and areas for improvement..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={6}
          disabled={reviewSession.isPending}
        />
      </div>
      <Button type="submit" disabled={reviewSession.isPending || !feedback.trim()} className="gap-2">
        <Send className="w-4 h-4" />
        {reviewSession.isPending ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
}
