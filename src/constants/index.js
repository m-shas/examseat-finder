
// Student, Seat, Classroom, Landmark, and SearchResult structure definitions moved to constants
// These are just for documentation purposes since we no longer have TypeScript interfaces

// Student: {
//   id: string
//   name: string
//   hallTicketNumber: string
//   seatId: string
// }

// Seat: {
//   id: string
//   row: number
//   column: number
//   isOccupied: boolean
//   studentId?: string
//   landmarkDescription?: string
// }

// Classroom: {
//   id: string
//   name: string
//   rows: number
//   columns: number
//   seats: Seat[]
//   landmarks: Landmark[]
// }

// Landmark: {
//   id: string
//   type: 'door' | 'window' | 'teacher' | 'board' | 'other'
//   description: string
//   position: {
//     x: number
//     y: number
//   }
// }

// SearchResult: {
//   student: Student
//   seat: Seat
//   classroom: Classroom
//   nearbyLandmarks: Landmark[]
// }

export const LANDMARK_TYPES = ['door', 'window', 'teacher', 'board', 'other'];
