import { Classroom, SearchResult, Student, Seat, Landmark, Exam, ExamSeatAllocation } from '../types';

// Mock exams data
const mockExams: Exam[] = [
  { id: 'exam-1', name: 'Mathematics', date: '2023-06-10', duration: '3 hours' },
  { id: 'exam-2', name: 'Physics', date: '2023-06-12', duration: '3 hours' },
  { id: 'exam-3', name: 'Chemistry', date: '2023-06-14', duration: '3 hours' },
  { id: 'exam-4', name: 'Biology', date: '2023-06-16', duration: '3 hours' },
  { id: 'exam-5', name: 'English', date: '2023-06-18', duration: '3 hours' },
  { id: 'exam-6', name: 'Computer Science', date: '2023-06-20', duration: '3 hours' },
];

// Mock classroom layout with improved spacing
const mockClassroom: Classroom = {
  id: 'classroom-1',
  name: 'Lecture Hall A101',
  rows: 8,
  columns: 4,
  seats: Array.from({ length: 32 }, (_, index) => {
    // Calculate row and column (4 columns, 8 rows)
    const row = Math.floor(index / 4) + 1;
    const column = (index % 4) + 1;
    
    return {
      id: `seat-${index + 1}`,
      row: row,
      column: column,
      isOccupied: Math.random() > 0.3,
      studentId: Math.random() > 0.3 ? `student-${index + 1}` : undefined,
      landmarkDescription: 
        (column === 1) ? 'Near left wall' :
        (column === 4) ? 'Near right wall' :
        (row === 1) ? 'Near front' :
        (row === 8) ? 'Near back door' : undefined,
    };
  }),
  landmarks: [
    // Top of the room (white board area) - adjusted position
    {
      id: 'landmark-1',
      type: 'board',
      description: 'White Board at the front of the room',
      position: { x: 2, y: -0.8 },
      dimension: { width: 3.5, height: 0.3 },
      orientation: 'top'
    },
    // Lecture Dais - adjusted position and size
    {
      id: 'landmark-2',
      type: 'dais',
      description: 'Lecture Dais',
      position: { x: 2, y: 0 },
      dimension: { width: 2.5, height: 0.6 },
      orientation: 'top'
    },
    // Teacher's position - adjusted
    {
      id: 'landmark-3',
      type: 'teacher',
      description: 'Teacher\'s position',
      position: { x: 2, y: 0.3 },
      orientation: 'top'
    },
    // Door at top left - adjusted position
    {
      id: 'landmark-4',
      type: 'door',
      description: 'Door (Top Left)',
      position: { x: 0.2, y: 0.2 },
      dimension: { width: 0.5, height: 0.5 },
      orientation: 'left'
    },
    // Door at top right - adjusted position
    {
      id: 'landmark-5',
      type: 'door',
      description: 'Door (Top Right)',
      position: { x: 4.5, y: 0.2 },
      dimension: { width: 0.5, height: 0.5 },
      orientation: 'right'
    },
    // Windows on left wall - adjusted size
    {
      id: 'landmark-6',
      type: 'window',
      description: 'Windows (Left Wall)',
      position: { x: -0.3, y: 4 },
      dimension: { width: 0.2, height: 6 },
      orientation: 'left'
    },
    // Windows on right wall - adjusted size
    {
      id: 'landmark-7',
      type: 'window',
      description: 'Windows (Right Wall)',
      position: { x: 4.3, y: 4 },
      dimension: { width: 0.2, height: 6 },
      orientation: 'right'
    },
    // Door at bottom (entrance) - adjusted position
    {
      id: 'landmark-8',
      type: 'door',
      description: 'Main Entrance (Bottom)',
      position: { x: 2, y: 8.3 },
      dimension: { width: 1.2, height: 0.3 },
      orientation: 'bottom'
    }
  ],
};

// Generate 210 mock students (70 in each section)
const generateMockStudents = (): Student[] => {
  const sections: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
  const students: Student[] = [];

  sections.forEach(section => {
    for (let i = 1; i <= 70; i++) {
      const studentId = `student-${section}-${i}`;
      const padded = i.toString().padStart(2, '0');
      
      // Create random exam seat allocations for this student
      const examAllocations: ExamSeatAllocation[] = mockExams.map(exam => {
        // Randomly assign a seat for each exam
        const randomSeatIndex = Math.floor(Math.random() * 32) + 1;
        return {
          examId: exam.id,
          seatId: `seat-${randomSeatIndex}`
        };
      });
      
      students.push({
        id: studentId,
        name: `Student ${section}${padded}`,
        hallTicketNumber: `${section}${padded}${new Date().getFullYear()}`,
        section,
        exams: examAllocations
      });
    }
  });
  
  return students;
};

const mockStudents = generateMockStudents();

// Function to find seat allocation for a specific exam
const findSeatForExam = (student: Student, examId: string): string | undefined => {
  const allocation = student.exams.find(exam => exam.examId === examId);
  return allocation?.seatId;
};

// Modified API function to search by hall ticket and exam
export const searchByHallTicketAndExam = async (hallTicketNumber: string, examId: string): Promise<SearchResult | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const student = mockStudents.find(s => s.hallTicketNumber === hallTicketNumber);
  
  if (!student) {
    return null;
  }
  
  const seatId = findSeatForExam(student, examId);
  
  if (!seatId) {
    return null;
  }
  
  const seat = mockClassroom.seats.find(s => s.id === seatId);
  
  if (!seat) {
    return null;
  }
  
  const exam = mockExams.find(e => e.id === examId);
  
  // Find nearby landmarks (simple proximity algorithm)
  const nearbyLandmarks = mockClassroom.landmarks.filter(landmark => {
    const distance = Math.sqrt(
      Math.pow(landmark.position.x - seat.column, 2) + 
      Math.pow(landmark.position.y - seat.row, 2)
    );
    return distance < 3; // Consider landmarks within distance of 3 units as nearby
  });
  
  return {
    student,
    seat,
    classroom: mockClassroom,
    nearbyLandmarks,
    exam: exam
  };
};

// Original search function (for backward compatibility)
export const searchByHallTicket = async (hallTicketNumber: string): Promise<SearchResult | null> => {
  // Default to the first exam if no exam specified
  const student = mockStudents.find(s => s.hallTicketNumber === hallTicketNumber);
  
  if (!student) {
    return null;
  }
  
  // Use first exam by default
  return searchByHallTicketAndExam(hallTicketNumber, mockExams[0].id);
};

// Function to get all exams
export const getAllExams = async (): Promise<Exam[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockExams;
};

// Keep the original functions for backward compatibility
export const getClassroomLayout = async (classroomId: string): Promise<Classroom | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (classroomId === mockClassroom.id) {
    return mockClassroom;
  }
  
  return null;
};

export const getAllStudents = async (): Promise<Student[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockStudents;
};

export const updateStudent = async (student: Student): Promise<Student> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real implementation, this would update the database
  return student;
};

export const updateSeat = async (seat: Seat): Promise<Seat> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real implementation, this would update the database
  return seat;
};

export const getLandmarksBySeatId = async (seatId: string): Promise<Landmark[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const seat = mockClassroom.seats.find(s => s.id === seatId);
  
  if (!seat) {
    return [];
  }
  
  return mockClassroom.landmarks.filter(landmark => {
    const distance = Math.sqrt(
      Math.pow(landmark.position.x - seat.column, 2) + 
      Math.pow(landmark.position.y - seat.row, 2)
    );
    return distance < 3;
  });
};
