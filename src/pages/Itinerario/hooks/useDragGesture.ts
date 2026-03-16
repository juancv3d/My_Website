import { useState, useRef, useCallback, useEffect } from 'react';

export type SnapPoint = 'collapsed' | 'half' | 'expanded';

interface DragState {
  isDragging: boolean;
  dragOffset: number;
  velocity: number;
}

interface UseDragGestureOptions {
  snapPoints: { collapsed: number; half: number; expanded: number };
  currentSnap: SnapPoint;
  onSnapChange: (snap: SnapPoint) => void;
}

interface UseDragGestureReturn {
  isDragging: boolean;
  dragOffset: number;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
  };
}

export function useDragGesture({
  snapPoints,
  currentSnap,
  onSnapChange,
}: UseDragGestureOptions): UseDragGestureReturn {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    dragOffset: 0,
    velocity: 0,
  });

  const startY = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocityRef = useRef(0);

  const getCurrentHeight = useCallback(() => {
    return snapPoints[currentSnap];
  }, [snapPoints, currentSnap]);

  const calculateVelocity = useCallback((currentY: number, currentTime: number) => {
    const deltaY = lastY.current - currentY;
    const deltaTime = currentTime - lastTime.current;
    if (deltaTime > 0) {
      velocityRef.current = deltaY / deltaTime;
    }
    lastY.current = currentY;
    lastTime.current = currentTime;
  }, []);

  const determineSnapPoint = useCallback(
    (dragOffset: number, velocity: number): SnapPoint => {
      const currentHeight = getCurrentHeight();
      const projectedHeight = currentHeight + dragOffset + velocity * 150;
      
      const velocityThreshold = 0.5;
      if (Math.abs(velocity) > velocityThreshold) {
        if (velocity > 0) {
          if (currentSnap === 'collapsed') return 'half';
          if (currentSnap === 'half') return 'expanded';
          return 'expanded';
        } else {
          if (currentSnap === 'expanded') return 'half';
          if (currentSnap === 'half') return 'collapsed';
          return 'collapsed';
        }
      }

      const halfwayToHalf = (snapPoints.collapsed + snapPoints.half) / 2;
      const halfwayToExpanded = (snapPoints.half + snapPoints.expanded) / 2;

      if (projectedHeight < halfwayToHalf) return 'collapsed';
      if (projectedHeight < halfwayToExpanded) return 'half';
      return 'expanded';
    },
    [currentSnap, getCurrentHeight, snapPoints]
  );

  const handleStart = useCallback((clientY: number) => {
    startY.current = clientY;
    lastY.current = clientY;
    lastTime.current = performance.now();
    velocityRef.current = 0;
    setState({ isDragging: true, dragOffset: 0, velocity: 0 });
  }, []);

  const handleMove = useCallback((clientY: number) => {
    if (!state.isDragging) return;
    
    const deltaY = startY.current - clientY;
    calculateVelocity(clientY, performance.now());
    setState(prev => ({
      ...prev,
      dragOffset: deltaY,
      velocity: velocityRef.current,
    }));
  }, [state.isDragging, calculateVelocity]);

  const handleEnd = useCallback(() => {
    if (!state.isDragging) return;
    
    const newSnap = determineSnapPoint(state.dragOffset, velocityRef.current);
    onSnapChange(newSnap);
    setState({ isDragging: false, dragOffset: 0, velocity: 0 });
  }, [state.isDragging, state.dragOffset, determineSnapPoint, onSnapChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isDragging) {
        e.preventDefault();
        handleMove(e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (state.isDragging) {
        handleEnd();
      }
    };

    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging, handleMove, handleEnd]);

  const handlers = {
    onTouchStart: (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientY);
    },
    onTouchMove: (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientY);
    },
    onTouchEnd: () => {
      handleEnd();
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientY);
    },
  };

  return {
    isDragging: state.isDragging,
    dragOffset: state.dragOffset,
    handlers,
  };
}
