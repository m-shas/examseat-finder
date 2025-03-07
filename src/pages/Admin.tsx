import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getAllStudents, getAllExams, getClassroomLayout } from '@/utils/api';
import { Student, Classroom, Seat, Exam } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ClassroomLayout from '@/components/ClassroomLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [selectedTab, setSelectedTab] = useState('students');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState({
    students: false,
    classroom: false,
    exams: false,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(prev => ({ ...prev, students: true }));
      try {
        const studentData = await getAllStudents();
        setStudents(studentData);
        if (studentData.length > 0) {
          setSelectedStudentId(studentData[0].id);
        }
      } catch (err) {
        console.error('Error loading students:', err);
        toast({
          title: 'Error',
          description: 'Failed to load student data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(prev => ({ ...prev, students: false }));
      }
    };

    const fetchClassroom = async () => {
      setIsLoading(prev => ({ ...prev, classroom: true }));
      try {
        const classroomData = await getClassroomLayout('classroom-1');
        setClassroom(classroomData);
      } catch (err) {
        console.error('Error loading classroom:', err);
        toast({
          title: 'Error',
          description: 'Failed to load classroom layout',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(prev => ({ ...prev, classroom: false }));
      }
    };
    
    const fetchExams = async () => {
      setIsLoading(prev => ({ ...prev, exams: true }));
      try {
        const examData = await getAllExams();
        setExams(examData);
        if (examData.length > 0) {
          setSelectedExamId(examData[0].id);
        }
      } catch (err) {
        console.error('Error loading exams:', err);
        toast({
          title: 'Error',
          description: 'Failed to load exam data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(prev => ({ ...prev, exams: false }));
      }
    };

    fetchStudents();
    fetchClassroom();
    fetchExams();
  }, [toast]);

  const getSelectedStudentSeat = () => {
    if (!selectedStudentId || !selectedExamId) return null;
    
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return null;
    
    const examAllocation = student.exams.find(e => e.examId === selectedExamId);
    return examAllocation?.seatId || null;
  };

  const handleSeatClick = (seat: Seat) => {
    console.log('Seat clicked:', seat);
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid grid-cols-2 w-[300px] mb-6">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="seating">Seating Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading.students ? (
                  <div className="text-center py-4">Loading students...</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Hall Ticket</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.slice(0, 10).map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.hallTicketNumber}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {students.length > 10 && (
                      <div className="py-3 px-4 text-center text-sm text-muted-foreground">
                        Showing 10 of {students.length} students
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="seating" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Classroom Layout</CardTitle>
                <div className="flex space-x-2">
                  {exams.length > 0 && (
                    <select 
                      className="px-2 py-1 border rounded"
                      value={selectedExamId || ''}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                    >
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading.classroom ? (
                  <div className="text-center py-4">Loading classroom layout...</div>
                ) : classroom ? (
                  <ClassroomLayout
                    rows={classroom.rows}
                    columns={classroom.columns}
                    seats={classroom.seats}
                    landmarks={classroom.landmarks}
                    selectedSeatId={getSelectedStudentSeat()}
                    onSeatClick={handleSeatClick}
                    isInteractive={true}
                  />
                ) : (
                  <div className="text-center py-4">No classroom layout available</div>
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
