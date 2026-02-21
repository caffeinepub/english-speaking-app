import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PromptFiltersProps {
  difficultyFilter: string;
  searchQuery: string;
  onDifficultyChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function PromptFilters({
  difficultyFilter,
  searchQuery,
  onDifficultyChange,
  onSearchChange,
}: PromptFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-full sm:w-48">
        <Label htmlFor="difficulty" className="sr-only">
          Difficulty Level
        </Label>
        <Select value={difficultyFilter} onValueChange={onDifficultyChange}>
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">Beginner</SelectItem>
            <SelectItem value="2">Elementary</SelectItem>
            <SelectItem value="3">Intermediate</SelectItem>
            <SelectItem value="4">Upper Intermediate</SelectItem>
            <SelectItem value="5">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
