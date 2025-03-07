
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getAllExams } from '@/utils/api';
import { Exam } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string, examId: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const examsData = await getAllExams();
        setExams(examsData);
        if (examsData.length > 0) {
          setSelectedExamId(examsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast({
          title: 'Error',
          description: 'Failed to load exam data.',
          variant: 'destructive',
        });
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Search field empty",
        description: "Please enter a hall ticket number to search",
        variant: "destructive",
      });
      return;
    }

    if (!selectedExamId) {
      toast({
        title: "No exam selected",
        description: "Please select an exam",
        variant: "destructive",
      });
      return;
    }
    
    onSearch(query.trim(), selectedExamId);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="search-bar glass-panel p-1 rounded-full flex flex-col sm:flex-row items-center gap-2"
    >
      <div className="flex w-full sm:w-auto">
        <Input
          type="text"
          placeholder="Enter hall ticket number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-full"
        />
        <Select 
          value={selectedExamId} 
          onValueChange={setSelectedExamId}
          disabled={loadingExams}
        >
          <SelectTrigger className="min-w-[150px] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue placeholder="Select Exam" />
          </SelectTrigger>
          <SelectContent>
            {exams.map(exam => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        size="sm" 
        className="rounded-full h-10 w-10 p-0 ml-auto sm:ml-0"
        disabled={isLoading || loadingExams}
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
