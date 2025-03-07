
import React, { useEffect, useState } from 'react';
import { Landmark, Seat } from '@/types';
import AnimatedTransition from './AnimatedTransition';
import { cn } from '@/lib/utils';
import { DoorClosed, MessageSquare } from 'lucide-react';

interface ClassroomLayoutProps {
  rows: number;
  columns: number;
  seats: Seat[];
  landmarks?: Landmark[];
  selectedSeatId?: string;
  onSeatClick?: (seat: Seat) => void;
  showLegend?: boolean;
  isInteractive?: boolean;
}

const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({
  rows,
  columns,
  seats,
  landmarks = [],
  selectedSeatId,
  onSeatClick,
  showLegend = true,
  isInteractive = true,
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate SVG dimensions
  const cellSize = 60;
  const padding = 80; // Increased padding to make room for landmarks
  const width = columns * cellSize + 2 * padding;
  const height = rows * cellSize + 2 * padding;

  // Generate seat elements
  const seatElements = seats.map((seat) => {
    const x = (seat.column - 1) * cellSize + padding;
    const y = (seat.row - 1) * cellSize + padding;
    
    const isSelected = seat.id === selectedSeatId;
    const seatClass = isSelected
      ? 'seat-selected'
      : seat.isOccupied
      ? 'seat-occupied'
      : 'seat-available';
    
    const handleClick = () => {
      if (isInteractive && onSeatClick) {
        onSeatClick(seat);
      }
    };

    return (
      <g key={seat.id} onClick={handleClick} className={cn("transition-opacity", mounted ? "opacity-100" : "opacity-0")}>
        <rect
          x={x}
          y={y}
          width={cellSize - 10}
          height={cellSize - 10}
          rx={8}
          className={`seat ${seatClass}`}
          style={{ transitionDelay: `${(seat.row + seat.column) * 50}ms` }}
        />
        <text
          x={x + (cellSize - 10) / 2}
          y={y + (cellSize - 10) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-current text-foreground pointer-events-none"
        >
          {seat.row}-{seat.column}
        </text>
      </g>
    );
  });

  // Generate landmark elements
  const landmarkElements = landmarks.map((landmark) => {
    // Calculate position based on the landmark's coordinates and orientation
    let x, y, width, height;
    
    switch (landmark.type) {
      case 'board':
        x = landmark.position.x * cellSize;
        y = padding / 2 - 20;
        width = landmark.dimension?.width ? landmark.dimension.width * cellSize : 180;
        height = landmark.dimension?.height ? landmark.dimension.height * cellSize : 20;
        return (
          <g key={landmark.id} className="landmark">
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={1}
              className="fill-accent stroke-accent-foreground"
            />
            <text
              x={x + width / 2}
              y={y + height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-current text-accent-foreground"
            >
              White Board
            </text>
            <title>{landmark.description}</title>
          </g>
        );
      
      case 'dais':
        x = landmark.position.x * cellSize;
        y = padding / 2 + 15;
        width = landmark.dimension?.width ? landmark.dimension.width * cellSize : 120;
        height = landmark.dimension?.height ? landmark.dimension.height * cellSize : 50;
        return (
          <g key={landmark.id} className="landmark">
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={2}
              className="fill-muted stroke-muted-foreground"
            />
            <text
              x={x + width / 2}
              y={y + height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-current text-muted-foreground"
            >
              Lecture Dais
            </text>
            <title>{landmark.description}</title>
          </g>
        );
      
      case 'door':
        if (landmark.orientation === 'left') {
          x = 5;
          y = landmark.position.y * cellSize + padding;
          return (
            <g key={landmark.id} className="landmark opacity-80">
              <DoorClosed className="h-8 w-8 stroke-accent" x={x} y={y} />
              <title>{landmark.description}</title>
            </g>
          );
        } else if (landmark.orientation === 'right') {
          x = width - 25;
          y = landmark.position.y * cellSize + padding;
          return (
            <g key={landmark.id} className="landmark opacity-80">
              <DoorClosed className="h-8 w-8 stroke-accent" x={x} y={y} />
              <title>{landmark.description}</title>
            </g>
          );
        } else if (landmark.orientation === 'bottom') {
          x = landmark.position.x * cellSize;
          y = height - 30;
          width = landmark.dimension?.width ? landmark.dimension.width * cellSize : 80;
          height = 20;
          return (
            <g key={landmark.id} className="landmark opacity-80">
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={2}
                className="fill-accent stroke-accent-foreground"
              />
              <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-current text-accent-foreground"
              >
                Door
              </text>
              <title>{landmark.description}</title>
            </g>
          );
        }
        return null;
      
      case 'window':
        if (landmark.orientation === 'left') {
          x = 5;
          y = landmark.position.y * cellSize;
          height = landmark.dimension?.height ? landmark.dimension.height * cellSize : 300;
          return (
            <g key={landmark.id} className="landmark opacity-80">
              <rect
                x={x}
                y={y}
                width={10}
                height={height}
                rx={0}
                className="fill-blue-100 stroke-blue-200"
              />
              <title>{landmark.description}</title>
            </g>
          );
        } else if (landmark.orientation === 'right') {
          x = width - 15;
          y = landmark.position.y * cellSize;
          height = landmark.dimension?.height ? landmark.dimension.height * cellSize : 300;
          return (
            <g key={landmark.id} className="landmark opacity-80">
              <rect
                x={x}
                y={y}
                width={10}
                height={height}
                rx={0}
                className="fill-blue-100 stroke-blue-200"
              />
              <title>{landmark.description}</title>
            </g>
          );
        }
        return null;
      
      case 'teacher':
        x = landmark.position.x * cellSize + 30;
        y = padding / 2 + 40;
        return (
          <g key={landmark.id} className="landmark">
            <MessageSquare className="h-6 w-6 fill-primary/20 stroke-primary" x={x} y={y} />
            <title>{landmark.description}</title>
          </g>
        );
      
      default:
        x = landmark.position.x * cellSize + padding;
        y = landmark.position.y * cellSize + padding;
        return (
          <g key={landmark.id} className="landmark opacity-80">
            <circle cx={x} cy={y} r={8} className="fill-accent" />
            <title>{landmark.description}</title>
          </g>
        );
    }
  });

  // Room outline
  const roomOutline = (
    <rect
      x={padding / 2}
      y={padding / 2}
      width={width - padding}
      height={height - padding}
      rx={0}
      className="fill-none stroke-muted-foreground/30 stroke-[2px]"
    />
  );

  // Room label
  const roomLabel = (
    <text
      x={width / 2}
      y={height / 2 - 40}
      textAnchor="middle"
      className="text-lg fill-muted-foreground font-medium"
    >
      Classroom
    </text>
  );

  // Room dimensions
  const roomDimensions = (
    <text
      x={width / 2}
      y={height / 2 - 10}
      textAnchor="middle"
      className="text-sm fill-muted-foreground"
    >
      26' x 40'
    </text>
  );

  return (
    <div className="w-full overflow-auto flex flex-col items-center">
      <AnimatedTransition show={mounted} animation="scale" delay="medium">
        <div className="glass-panel rounded-lg p-6 shadow-lg max-w-full overflow-auto">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="max-w-full h-auto"
          >
            {/* Room outline */}
            {roomOutline}
            
            {/* Room label and dimensions */}
            {roomLabel}
            {roomDimensions}
            
            {/* Background grid */}
            <g className="grid">
              {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
                <line
                  key={`row-${rowIndex}`}
                  x1={padding / 2}
                  y1={rowIndex * cellSize + padding}
                  x2={width - padding / 2}
                  y2={rowIndex * cellSize + padding}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: columns + 1 }).map((_, colIndex) => (
                <line
                  key={`col-${colIndex}`}
                  x1={colIndex * cellSize + padding}
                  y1={padding / 2}
                  x2={colIndex * cellSize + padding}
                  y2={height - padding / 2}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}
            </g>
            
            {/* Draw landmarks first so they appear behind seats */}
            {landmarkElements}
            
            {/* Draw seats */}
            {seatElements}
            
            {/* Front label */}
            <text
              x={width / 2}
              y={20}
              textAnchor="middle"
              className="text-sm fill-muted-foreground font-medium"
            >
              FRONT (BOARD)
            </text>
          </svg>
        </div>
      </AnimatedTransition>
      
      {showLegend && (
        <AnimatedTransition show={mounted} animation="fade" delay="long">
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-secondary rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm">Your Seat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-accent rounded"></div>
              <span className="text-sm">Landmark</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm">Window</span>
            </div>
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default ClassroomLayout;
