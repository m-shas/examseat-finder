
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Seat, Student, Classroom, Exam } from '@/types';
import { MapPin, User, Info, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from './AnimatedTransition';
import { Badge } from '@/components/ui/badge';

interface SeatDetailsProps {
  student: Student;
  seat: Seat;
  classroom: Classroom;
  nearbyLandmarks: Landmark[];
  exam?: Exam;
}

const SeatDetails: React.FC<SeatDetailsProps> = ({
  student,
  seat,
  classroom,
  nearbyLandmarks,
  exam
}) => {
  return (
    <AnimatedTransition show={true} animation="fade" delay="medium">
      <Card className="glass-panel border border-opacity-20 shadow-lg overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="flex items-center text-primary space-x-2">
            <MapPin size={18} />
            <span>Seat Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <User size={16} />
                Student Details
              </h3>
              <div className="pl-6 space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Name:</span> {student.name}</p>
                <p className="text-sm"><span className="text-muted-foreground">Hall Ticket:</span> {student.hallTicketNumber}</p>
                <p className="text-sm"><span className="text-muted-foreground">Section:</span> {student.section}</p>
              </div>
            </div>
            
            {exam && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} />
                    Exam Details
                  </h3>
                  <div className="pl-6 space-y-1">
                    <p className="text-sm"><span className="text-muted-foreground">Subject:</span> {exam.name}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Date:</span> {exam.date}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Duration:</span> {exam.duration}</p>
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Seat Location
              </h3>
              <div className="pl-6 space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Classroom:</span> {classroom.name}</p>
                <p className="text-sm"><span className="text-muted-foreground">Seat Number:</span> Row {seat.row}, Column {seat.column}</p>
                {seat.landmarkDescription && (
                  <p className="text-sm"><span className="text-muted-foreground">Position:</span> {seat.landmarkDescription}</p>
                )}
              </div>
            </div>
            
            {nearbyLandmarks.length > 0 && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Info size={16} />
                    Nearby Landmarks
                  </h3>
                  <div className="pl-6">
                    <div className="flex flex-wrap gap-2">
                      {nearbyLandmarks.map((landmark) => (
                        <Badge key={landmark.id} variant="outline" className="bg-background">
                          {landmark.description}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedTransition>
  );
};

export default SeatDetails;
