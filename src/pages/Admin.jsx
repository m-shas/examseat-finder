
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getClassroomLayout, getAllStudents } from '@/utils/api';
import ClassroomLayout from '@/components/ClassroomLayout';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserCheck } from 'lucide-react';

const Admin = () => {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [classroomData, studentsData] = await Promise.all([
          getClassroomLayout('classroom-1'),
          getAllStudents(),
        ]);
        
        setClassroom(classroomData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    
    // Find student assigned to this seat
    const student = students.find(s => s.seatId === seat.id);
    
    if (student) {
      toast({
        title: 'Seat Information',
        description: `This seat is assigned to ${student.name} (${student.hallTicketNumber})`,
      });
    } else {
      toast({
        title: 'Seat Information',
        description: 'This seat is currently unassigned',
      });
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.hallTicketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Admin Dashboard" showBackButton>
      <div className="max-w-6xl mx-auto">
        <AnimatedTransition show={true} animation="fade">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
        </AnimatedTransition>
        
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="classroom">Classroom Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck size={20} />
                  <span>Student Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline">Export CSV</Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Hall Ticket</TableHead>
                        <TableHead>Seat</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            Loading student data...
                          </TableCell>
                        </TableRow>
                      ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          const seat = classroom?.seats.find(s => s.id === student.seatId);
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.hallTicketNumber}</TableCell>
                              <TableCell>
                                {seat ? `Row ${seat.row}, Col ${seat.column}` : 'Unassigned'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No students found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classroom">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Classroom Layout Management</CardTitle>
              </CardHeader>
              <CardContent>
                {classroom ? (
                  <div className="space-y-6">
                    <div className="text-sm text-muted-foreground mb-4">
                      Click on any seat to view or edit its details.
                    </div>
                    
                    <ClassroomLayout
                      rows={classroom.rows}
                      columns={classroom.columns}
                      seats={classroom.seats}
                      landmarks={classroom.landmarks}
                      selectedSeatId={selectedSeat?.id}
                      onSeatClick={handleSeatClick}
                      isInteractive={true}
                    />
                    
                    {selectedSeat && (
                      <Card className="border border-primary/20 bg-primary/5 mt-6">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Seat Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Position</p>
                              <p className="font-medium">Row {selectedSeat.row}, Column {selectedSeat.column}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Status</p>
                              <p className="font-medium">{selectedSeat.isOccupied ? 'Occupied' : 'Available'}</p>
                            </div>
                            {selectedSeat.landmarkDescription && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                                <p className="font-medium">{selectedSeat.landmarkDescription}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button size="sm">Update</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {isLoading ? 'Loading classroom layout...' : 'No classroom layout found.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
