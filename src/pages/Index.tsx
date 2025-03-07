
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import ClassroomLayout from '@/components/ClassroomLayout';
import SeatDetails from '@/components/SeatDetails';
import { SearchResult } from '@/types';
import { searchByHallTicketAndExam } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (hallTicketNumber: string, examId: string) => {
    setIsSearching(true);
    setError(null);
    
    try {
      const result = await searchByHallTicketAndExam(hallTicketNumber, examId);
      
      if (result) {
        setSearchResult(result);
        toast({
          title: "Seat found!",
          description: `Found seat for ${result.student.name} in ${result.classroom.name} for ${result.exam?.name || 'exam'}`,
        });
      } else {
        setSearchResult(null);
        setError("No seat found for this hall ticket number and exam. Please verify and try again.");
      }
    } catch (err) {
      console.error(err);
      setSearchResult(null);
      setError("An error occurred while searching. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout title="Exam Seat Finder">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <AnimatedTransition show={true} animation="fade">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Find Your Exam Seat</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Enter your hall ticket number and select your exam to locate your exact seat
            </p>
          </AnimatedTransition>
          
          <AnimatedTransition show={true} animation="fade" delay="short">
            <div className="mb-10 max-w-xl mx-auto">
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>
          </AnimatedTransition>
        </div>
        
        {error && (
          <AnimatedTransition show={true} animation="scale">
            <Alert variant="destructive" className="max-w-md mx-auto mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </AnimatedTransition>
        )}
        
        {searchResult && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ClassroomLayout
                rows={searchResult.classroom.rows}
                columns={searchResult.classroom.columns}
                seats={searchResult.classroom.seats}
                landmarks={searchResult.classroom.landmarks}
                selectedSeatId={searchResult.seat.id}
                isInteractive={false}
              />
            </div>
            <div>
              <SeatDetails
                student={searchResult.student}
                seat={searchResult.seat}
                classroom={searchResult.classroom}
                nearbyLandmarks={searchResult.nearbyLandmarks}
                exam={searchResult.exam}
              />
            </div>
          </div>
        )}
        
        {!searchResult && !error && (
          <AnimatedTransition show={true} animation="fade" delay="medium">
            <div className="text-center p-10">
              <p className="text-muted-foreground">
                Enter your hall ticket number and select your exam above to view your seat information
              </p>
            </div>
          </AnimatedTransition>
        )}
      </div>
    </Layout>
  );
};

export default Index;
