
import { Classroom, SearchResult, Student, Seat, Landmark } from '../types';

// Mock data for classroom layout
const mockClassroom: Classroom = {
  id: 'classroom-1',
  name: 'Lecture Hall A101',
  rows: 5,
  columns: 6,
  seats: Array.from({ length: 30 }, (_, index) => ({
    id: `seat-${index + 1}`,
    row: Math.floor(index / 6) + 1,
    column: (index % 6) + 1,
    isOccupied: Math.random() > 0.3,
    studentId: Math.random() > 0.3 ? `student-${index + 1}` : undefined,
    landmarkDescription: index === 5 ? 'Near window' : index === 0 ? 'Near door' : undefined,
  })),
  landmarks: [
    {
      id: 'landmark-1',
      type: 'door',
      description: 'Main entrance',
      position: { x: 0, y: 2 },
    },
    {
      id: 'landmark-2',
      type: 'window',
      description: 'Left side windows',
      position: { x: 0, y: 4 },
    },
    {
      id: 'landmark-3',
      type: 'board',
      description: 'Main whiteboard',
      position: { x: 3, y: 0 },
    },
    {
      id: 'landmark-4',
      type: 'teacher',
      description: 'Teacher\'s desk',
      position: { x: 3, y: 1 },
    },
  ],
};

// Mock student data
const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Alice Johnson',
    hallTicketNumber: 'A12345',
    seatId: 'seat-10',
  },
  {
    id: 'student-2',
    name: 'Bob Smith',
    hallTicketNumber: 'B67890',
    seatId: 'seat-15',
  },
  {
    id: 'student-3',
    name: 'Charlie Brown',
    hallTicketNumber: 'C13579',
    seatId: 'seat-22',
  },
  {
    id: 'student-4',
    name: 'Diana Prince',
    hallTicketNumber: 'D24680',
    seatId: 'seat-5',
  },
];

// Mock API functions
export const searchByHallTicket = async (hallTicketNumber: string): Promise<SearchResult | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const student = mockStudents.find(s => s.hallTicketNumber === hallTicketNumber);
  
  if (!student) {
    return null;
  }
  
  const seat = mockClassroom.seats.find(s => s.id === student.seatId);
  
  if (!seat) {
    return null;
  }
  
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
  };
};

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
