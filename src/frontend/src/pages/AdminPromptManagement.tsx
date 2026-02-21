import { useState } from 'react';
import { useCreatePrompt, useGetAllPrompts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BookOpen, Plus, Loader2 } from 'lucide-react';

const difficultyLabels: Record<string, string> = {
  '1': 'Beginner',
  '2': 'Elementary',
  '3': 'Intermediate',
  '4': 'Upper Intermediate',
  '5': 'Advanced',
};

export default function AdminPromptManagement() {
  const { data: prompts, isLoading: promptsLoading } = useGetAllPrompts();
  const createPrompt = useCreatePrompt();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('3');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createPrompt.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        difficultyLevel: BigInt(difficultyLevel),
      });
      toast.success('Prompt created successfully');
      setTitle('');
      setDescription('');
      setDifficultyLevel('3');
    } catch (error) {
      console.error('Create prompt error:', error);
      toast.error('Failed to create prompt');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-md">
          <BookOpen className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Manage Prompts</h1>
          <p className="text-muted-foreground">Create and manage speaking exercise prompts</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Prompt
            </CardTitle>
            <CardDescription>Add a new speaking exercise to the library</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Describe Your Daily Routine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={createPrompt.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed instructions for the speaking exercise..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  disabled={createPrompt.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel} disabled={createPrompt.isPending}>
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Beginner</SelectItem>
                    <SelectItem value="2">Elementary</SelectItem>
                    <SelectItem value="3">Intermediate</SelectItem>
                    <SelectItem value="4">Upper Intermediate</SelectItem>
                    <SelectItem value="5">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={createPrompt.isPending}>
                <Plus className="w-4 h-4" />
                {createPrompt.isPending ? 'Creating...' : 'Create Prompt'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Prompts</CardTitle>
            <CardDescription>All prompts in the library ({prompts?.length || 0})</CardDescription>
          </CardHeader>
          <CardContent>
            {promptsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : prompts && prompts.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {prompts.map((prompt) => (
                  <div
                    key={prompt.id.toString()}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium">{prompt.title}</h4>
                      <Badge variant="secondary" className="shrink-0">
                        {difficultyLabels[prompt.difficultyLevel.toString()]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No prompts yet. Create your first one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
