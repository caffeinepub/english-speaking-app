import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import type { SpeakingPrompt } from '../backend';

interface PromptCardProps {
  prompt: SpeakingPrompt;
  onStartPractice: (promptId: bigint) => void;
  isStarting?: boolean;
}

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

export default function PromptCard({ prompt, onStartPractice, isStarting }: PromptCardProps) {
  const level = Number(prompt.difficultyLevel);
  const colorClass = difficultyColors[level] || difficultyColors[3];
  const label = difficultyLabels[level] || 'Intermediate';

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{prompt.title}</CardTitle>
          <Badge className={colorClass} variant="outline">
            {label}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          onClick={() => onStartPractice(prompt.id)}
          disabled={isStarting}
          className="w-full gap-2 shadow-sm"
        >
          <img src="/assets/generated/microphone-icon.dim_64x64.png" alt="" className="w-4 h-4" />
          <span>{isStarting ? 'Starting...' : 'Start Practice'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
