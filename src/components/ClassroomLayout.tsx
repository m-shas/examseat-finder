
import React, { useEffect, useState } from 'react';
import { Landmark, Seat } from '@/types';
import AnimatedTransition from './AnimatedTransition';
import { cn } from '@/lib/utils';

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
  const padding = 40;
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
    const x = landmark.position.x * cellSize + padding;
    const y = landmark.position.y * cellSize + padding;
    
    // Determine icon based on landmark type
    let icon;
    switch (landmark.type) {
      case 'door':
        icon = (
          <rect x={x} y={y} width={20} height={30} rx={2} className="fill-accent" />
        );
        break;
      case 'window':
        icon = (
          <rect x={x} y={y} width={30} height={15} rx={2} className="fill-accent" />
        );
        break;
      case 'teacher':
        icon = (
          <rect x={x} y={y} width={30} height={20} rx={2} className="fill-accent" />
        );
        break;
      case 'board':
        icon = (
          <rect x={x} y={y} width={40} height={10} rx={1} className="fill-accent" />
        );
        break;
      default:
        icon = (
          <circle cx={x} cy={y} r={8} className="fill-accent" />
        );
    }
    
    return (
      <g key={landmark.id} className="landmark opacity-80">
        {icon}
        <title>{landmark.description}</title>
      </g>
    );
  });

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
            {/* Background grid */}
            <g className="grid">
              {Array.from({ length: rows }).map((_, rowIndex) => (
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
              {Array.from({ length: columns }).map((_, colIndex) => (
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
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default ClassroomLayout;
