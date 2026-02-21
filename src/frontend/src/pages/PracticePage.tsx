import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllPrompts, useStartSession, useGetUserSessions } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import WelcomeHero from '../components/WelcomeHero';
import PromptCard from '../components/PromptCard';
import SessionHistory from '../components/SessionHistory';
import PromptFilters from '../components/PromptFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function PracticePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: prompts, isLoading: promptsLoading } = useGetAllPrompts();
  const { data: sessions, isLoading: sessionsLoading } = useGetUserSessions();
  const startSession = useStartSession();
  const [startingPromptId, setStartingPromptId] = useState<bigint | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthenticated = !!identity;

  const handleStartPractice = async (promptId: bigint) => {
    if (!isAuthenticated) {
      toast.error('Please login to start practicing');
      return;
    }

    setStartingPromptId(promptId);
    try {
      const sessionId = await startSession.mutateAsync(promptId);
      toast.success('Practice session started!');
      navigate({ to: '/session/$sessionId', params: { sessionId: sessionId.toString() } });
    } catch (error) {
      console.error('Start session error:', error);
      toast.error('Failed to start session');
    } finally {
      setStartingPromptId(null);
    }
  };

  const filteredPrompts = prompts?.filter((prompt) => {
    const matchesDifficulty = difficultyFilter === 'all' || prompt.difficultyLevel.toString() === difficultyFilter;
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <WelcomeHero />
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ready to Start Speaking?</h2>
          <p className="text-muted-foreground mb-6">Login to access practice exercises and track your progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeHero />

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="practice">Practice Exercises</TabsTrigger>
          <TabsTrigger value="history">My History</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6 mt-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Choose Your Exercise</h2>
            <p className="text-muted-foreground">Select a speaking prompt to begin your practice session</p>
          </div>

          <PromptFilters
            difficultyFilter={difficultyFilter}
            searchQuery={searchQuery}
            onDifficultyChange={setDifficultyFilter}
            onSearchChange={setSearchQuery}
          />

          {promptsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPrompts && filteredPrompts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id.toString()}
                  prompt={prompt}
                  onStartPractice={handleStartPractice}
                  isStarting={startingPromptId === prompt.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No prompts found matching your criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <SessionHistory sessions={sessions || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
