
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  children: ReactNode;
  className?: string;
  show: boolean;
  animation?: 'fade' | 'scale' | 'slide';
  delay?: 'none' | 'short' | 'medium' | 'long';
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  show,
  animation = 'fade',
  delay = 'none',
}) => {
  const getAnimationClass = () => {
    if (!show) return 'opacity-0';
    
    switch (animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'scale':
        return 'animate-scale-in';
      case 'slide':
        return 'animate-slide-in';
      default:
        return 'animate-fade-in';
    }
  };
  
  const getDelayClass = () => {
    switch (delay) {
      case 'short':
        return 'animate-delay-100';
      case 'medium':
        return 'animate-delay-200';
      case 'long':
        return 'animate-delay-300';
      default:
        return '';
    }
  };
  
  return (
    <div className={cn(getAnimationClass(), getDelayClass(), className)}>
      {children}
    </div>
  );
};

export default AnimatedTransition;
