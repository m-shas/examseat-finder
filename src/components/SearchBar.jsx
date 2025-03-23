
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SearchBar = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Search field empty",
        description: "Please enter a hall ticket number to search",
        variant: "destructive",
      });
      return;
    }
    
    onSearch(query.trim());
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="search-bar glass-panel p-1 rounded-full flex items-center"
    >
      <Input
        type="text"
        placeholder="Enter hall ticket number..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button 
        type="submit" 
        size="sm" 
        className="rounded-full h-10 w-10 p-0"
        disabled={isLoading}
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
