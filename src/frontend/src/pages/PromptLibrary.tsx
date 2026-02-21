import { useState } from 'react';
import { useGetAllPrompts } from '../hooks/useQueries';
import PromptFilters from '../components/PromptFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Library } from 'lucide-react';

const difficultyColors: Record<number, string> = {
  1: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  2: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  3: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  4: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  5: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
};

const difficultyLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

export default function PromptLibrary() {
  const { data: prompts, isLoading } = useGetAllPrompts();
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = prompts?.filter((prompt) => {
    const matchesDifficulty = difficultyFilter === 'all' || prompt.difficultyLevel.toString() === difficultyFilter;
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-md">
          <Library className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Prompt Library</h1>
          <p className="text-muted-foreground">Browse all available speaking exercises</p>
        </div>
      </div>

      <PromptFilters
        difficultyFilter={difficultyFilter}
        searchQuery={searchQuery}
        onDifficultyChange={setDifficultyFilter}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredPrompts && filteredPrompts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPrompts.map((prompt) => {
            const level = Number(prompt.difficultyLevel);
            const colorClass = difficultyColors[level] || difficultyColors[3];
            const label = difficultyLabels[level] || 'Intermediate';

            return (
              <Card key={prompt.id.toString()} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <Badge className={colorClass} variant="outline">
                      {label}
                    </Badge>
                  </div>
                  <CardDescription>{prompt.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No prompts found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
