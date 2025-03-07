
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

// Create 7 different classroom layouts
const createClassroomLayouts = (): Classroom[] => {
  const layouts: Classroom[] = [];
  
  // Common landmarks with slight variations
  const createStandardLandmarks = (
    classroomId: string, 
    xOffset: number = 0, 
    yOffset: number = 0
  ): Landmark[] => [
    // White Board (front of room)
    {
      id: `${classroomId}-landmark-board`,
      type: 'board',
      description: 'White Board at the front of the room',
      position: { x: 2 + xOffset, y: -0.8 + yOffset },
      dimension: { width: 3.5, height: 0.3 },
      orientation: 'top'
    },
    // Lecture Dais
    {
      id: `${classroomId}-landmark-dais`,
      type: 'dais',
      description: 'Lecture Dais',
      position: { x: 2 + xOffset, y: 0 + yOffset },
      dimension: { width: 2.5, height: 0.6 },
      orientation: 'top'
    },
    // Teacher's position
    {
      id: `${classroomId}-landmark-teacher`,
      type: 'teacher',
      description: 'Teacher\'s position',
      position: { x: 2 + xOffset, y: 0.3 + yOffset },
      orientation: 'top'
    },
    // Door at top left
    {
      id: `${classroomId}-landmark-door-topleft`,
      type: 'door',
      description: 'Door (Top Left)',
      position: { x: 0.2 + xOffset, y: 0.2 + yOffset },
      dimension: { width: 0.5, height: 0.5 },
      orientation: 'left'
    },
    // Door at top right
    {
      id: `${classroomId}-landmark-door-topright`,
      type: 'door',
      description: 'Door (Top Right)',
      position: { x: 4.5 + xOffset, y: 0.2 + yOffset },
      dimension: { width: 0.5, height: 0.5 },
      orientation: 'right'
    },
    // Windows on left wall
    {
      id: `${classroomId}-landmark-window-left`,
      type: 'window',
      description: 'Windows (Left Wall)',
      position: { x: -0.3 + xOffset, y: 4 + yOffset },
      dimension: { width: 0.2, height: 6 },
      orientation: 'left'
    },
    // Windows on right wall
    {
      id: `${classroomId}-landmark-window-right`,
      type: 'window',
      description: 'Windows (Right Wall)',
      position: { x: 4.3 + xOffset, y: 4 + yOffset },
      dimension: { width: 0.2, height: 6 },
      orientation: 'right'
    },
    // Door at bottom (entrance)
    {
      id: `${classroomId}-landmark-door-bottom`,
      type: 'door',
      description: 'Main Entrance (Bottom)',
      position: { x: 2 + xOffset, y: 8.3 + yOffset },
      dimension: { width: 1.2, height: 0.3 },
      orientation: 'bottom'
    }
  ];

  // Create 7 different layouts with varied configurations
  for (let i = 1; i <= 7; i++) {
    // Set different configurations for each classroom
    let rows, columns, name;
    switch (i) {
      case 1:
        rows = 8; columns = 4; name = 'Lecture Hall A101'; break;
      case 2:
        rows = 7; columns = 5; name = 'Seminar Room B202'; break;
      case 3:
        rows = 6; columns = 6; name = 'Auditorium C303'; break;
      case 4:
        rows = 9; columns = 4; name = 'Room D404'; break;
      case 5:
        rows = 5; columns = 8; name = 'Hall E505'; break;
      case 6:
        rows = 8; columns = 5; name = 'Classroom F606'; break;
      case 7:
        rows = 7; columns = 6; name = 'Theater G707'; break;
      default:
        rows = 8; columns = 4; name = `Classroom-${i}`;
    }
    
    // Create seats with proper spacing
    const seats: Seat[] = Array.from({ length: rows * columns }, (_, index) => {
      // Calculate row and column
      const row = Math.floor(index / columns) + 1;
      const column = (index % columns) + 1;
      
      return {
        id: `classroom-${i}-seat-${index + 1}`,
        row: row,
        column: column,
        isOccupied: false, // Initially not occupied, will be set during allocation
        landmarkDescription: getLandmarkDescription(row, column, rows, columns),
      };
    });
    
    layouts.push({
      id: `classroom-${i}`,
      name,
      rows,
      columns,
      seats,
      landmarks: createStandardLandmarks(`classroom-${i}`, (i % 2) * 0.2, (i % 3) * 0.1), // Slight variations
    });
  }
  
  return layouts;
};

// Helper function to get landmark descriptions based on seat position
function getLandmarkDescription(row: number, column: number, maxRows: number, maxColumns: number): string {
  if (row === 1) return 'Near front / whiteboard';
  if (row === maxRows) return 'Near back / entrance';
  if (column === 1) return 'Near left wall / windows';
  if (column === maxColumns) return 'Near right wall / windows';
  if (row <= 2 && column <= 2) return 'Front left section';
  if (row <= 2 && column >= maxColumns - 1) return 'Front right section';
  if (row >= maxRows - 1 && column <= 2) return 'Back left section';
  if (row >= maxRows - 1 && column >= maxColumns - 1) return 'Back right section';
  return 'Middle section';
}

// Create the classroom layouts
const mockClassrooms = createClassroomLayouts();

// Generate 210 mock students (70 in each section)
const generateMockStudents = (): Student[] => {
  const sections: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
  const students: Student[] = [];

  sections.forEach(section => {
    for (let i = 1; i <= 70; i++) {
      const studentId = `student-${section}-${i}`;
      const padded = i.toString().padStart(2, '0');
      
      // Create random exam seat allocations for this student across multiple classrooms
      const examAllocations: ExamSeatAllocation[] = mockExams.map(exam => {
        // For each exam, randomly assign classroom and seat
        const randomClassroomIndex = Math.floor(Math.random() * mockClassrooms.length);
        const classroom = mockClassrooms[randomClassroomIndex];
        
        // Get random seat from that classroom
        const totalSeats = classroom.rows * classroom.columns;
        const randomSeatIndex = Math.floor(Math.random() * totalSeats);
        const seatId = `${classroom.id}-seat-${randomSeatIndex + 1}`;
        
        return {
          examId: exam.id,
          seatId: seatId
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

// Mark occupied seats based on allocations
const updateSeatOccupancy = () => {
  // Reset all seats to unoccupied
  mockClassrooms.forEach(classroom => {
    classroom.seats.forEach(seat => {
      seat.isOccupied = false;
      seat.studentId = undefined;
    });
  });
  
  // Mark seats as occupied based on student allocations
  mockStudents.forEach(student => {
    student.exams.forEach(exam => {
      // Find the classroom and seat
      const [classroomId, seatNumber] = exam.seatId.split('-seat-');
      const classroom = mockClassrooms.find(c => c.id === classroomId);
      
      if (classroom) {
        const seat = classroom.seats.find(s => s.id === exam.seatId);
        if (seat) {
          seat.isOccupied = true;
          seat.studentId = student.id;
        }
      }
    });
  });
};

// Run initially to set up seat occupancy
updateSeatOccupancy();

// Function to find seat allocation for a specific exam
const findSeatForExam = (student: Student, examId: string): string | undefined => {
  const allocation = student.exams.find(exam => exam.examId === examId);
  return allocation?.seatId;
};

// Find the classroom containing a specific seat
const findClassroomBySeatId = (seatId: string): Classroom | undefined => {
  // Extract classroom ID from seat ID
  const [classroomId] = seatId.split('-seat-');
  return mockClassrooms.find(classroom => classroom.id === classroomId);
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
  
  // Find the classroom containing this seat
  const classroom = findClassroomBySeatId(seatId);
  
  if (!classroom) {
    return null;
  }
  
  const seat = classroom.seats.find(s => s.id === seatId);
  
  if (!seat) {
    return null;
  }
  
  const exam = mockExams.find(e => e.id === examId);
  
  // Find nearby landmarks (simple proximity algorithm)
  const nearbyLandmarks = classroom.landmarks.filter(landmark => {
    const distance = Math.sqrt(
      Math.pow(landmark.position.x - seat.column, 2) + 
      Math.pow(landmark.position.y - seat.row, 2)
    );
    return distance < 3; // Consider landmarks within distance of 3 units as nearby
  });
  
  return {
    student,
    seat,
    classroom,
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

// Get specific classroom layout
export const getClassroomLayout = async (classroomId: string): Promise<Classroom | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const classroom = mockClassrooms.find(c => c.id === classroomId);
  
  if (classroom) {
    return classroom;
  }
  
  return null;
};

// Get all classroom layouts
export const getAllClassrooms = async (): Promise<Classroom[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockClassrooms;
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
  
  // Extract classroom ID from seat ID
  const [classroomId] = seatId.split('-seat-');
  const classroom = mockClassrooms.find(c => c.id === classroomId);
  
  if (!classroom) {
    return [];
  }
  
  const seat = classroom.seats.find(s => s.id === seatId);
  
  if (!seat) {
    return [];
  }
  
  return classroom.landmarks.filter(landmark => {
    const distance = Math.sqrt(
      Math.pow(landmark.position.x - seat.column, 2) + 
      Math.pow(landmark.position.y - seat.row, 2)
    );
    return distance < 3;
  });
};
