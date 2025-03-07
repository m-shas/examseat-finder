
export interface Student {
  id: string;
  name: string;
  hallTicketNumber: string;
  seatId: string;
}

export interface Seat {
  id: string;
  row: number;
  column: number;
  isOccupied: boolean;
  studentId?: string;
  landmarkDescription?: string;
}

export interface Classroom {
  id: string;
  name: string;
  rows: number;
  columns: number;
  seats: Seat[];
  landmarks: Landmark[];
}

export interface Landmark {
  id: string;
  type: 'door' | 'window' | 'teacher' | 'board' | 'dais' | 'other';
  description: string;
  position: {
    x: number;
    y: number;
  };
  dimension?: {
    width: number;
    height: number;
  };
  orientation?: 'top' | 'right' | 'bottom' | 'left';
}

export interface SearchResult {
  student: Student;
  seat: Seat;
  classroom: Classroom;
  nearbyLandmarks: Landmark[];
}
