
import { Classroom, SearchResult, Student, Seat, Landmark } from '../types';

// Mock data for classroom layout based on the provided image
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
    // Top of the room (white board area)
    {
      id: 'landmark-1',
      type: 'board',
      description: 'White Board at the front of the room',
      position: { x: 2, y: -0.5 },
      dimension: { width: 3, height: 0.3 },
      orientation: 'top'
    },
    // Lecture Dais
    {
      id: 'landmark-2',
      type: 'dais',
      description: 'Lecture Dais',
      position: { x: 2, y: 0.2 },
      dimension: { width: 2, height: 0.8 },
      orientation: 'top'
    },
    // Teacher's position
    {
      id: 'landmark-3',
      type: 'teacher',
      description: 'Teacher\'s position',
      position: { x: 2, y: 0.5 },
      orientation: 'top'
    },
    // Door at top left
    {
      id: 'landmark-4',
      type: 'door',
      description: 'Door (Top Left)',
      position: { x: 0, y: 0 },
      dimension: { width: 0.5, height: 0.5 },
      orientation: 'left'
    },
    // Door at top right
    {
      id: 'landmark-5',
      type: 'door',
      description: 'Door (Top Right)',
      position: { x: 5, y: 0 },
      dimension: { width: 0.5, height: 0.5 },
      orientation: 'right'
    },
    // Windows on left wall
    {
      id: 'landmark-6',
      type: 'window',
      description: 'Windows (Left Wall)',
      position: { x: -0.5, y: 4 },
      dimension: { width: 0.2, height: 6 },
      orientation: 'left'
    },
    // Windows on right wall
    {
      id: 'landmark-7',
      type: 'window',
      description: 'Windows (Right Wall)',
      position: { x: 4.5, y: 4 },
      dimension: { width: 0.2, height: 6 },
      orientation: 'right'
    },
    // Door at bottom (entrance)
    {
      id: 'landmark-8',
      type: 'door',
      description: 'Main Entrance (Bottom)',
      position: { x: 2, y: 8.5 },
      dimension: { width: 1, height: 0.3 },
      orientation: 'bottom'
    }
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
