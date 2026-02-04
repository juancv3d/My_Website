import { useRef, useState, useEffect } from 'react';
import { useBackground } from '../context';
import { useSound } from '../hooks';
import { BackgroundTheme } from '../types';
import { HiSparkles } from 'react-icons/hi';
import { IoMdPlanet } from 'react-icons/io';
import { RiWaterFlashLine } from 'react-icons/ri';

interface ThemeOption {
  id: BackgroundTheme;
  icon: React.ReactNode;
  label: string;
}

// Hook to detect mobile and get item height
const useItemHeight = () => {
  const [itemHeight, setItemHeight] = useState(36);
  
  useEffect(() => {
    const updateHeight = () => {
      setItemHeight(window.innerWidth <= 480 ? 32 : 36);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  return itemHeight;
};

const themeOptions: ThemeOption[] = [
  { id: 'particles', icon: <HiSparkles />, label: 'Particles' },
  { id: 'fluid', icon: <RiWaterFlashLine />, label: 'Fluid' },
  { id: 'space', icon: <IoMdPlanet />, label: 'Space' },
];

const BackgroundSelector = () => {
  const { backgroundTheme, setBackgroundTheme } = useBackground();
  const { playClick, playHover } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const itemHeight = useItemHeight();

  const currentIndex = themeOptions.findIndex((t) => t.id === backgroundTheme);

  useEffect(() => {
    setSliderPosition(currentIndex);
  }, [currentIndex]);

  const updateThemeFromPosition = (pos: number) => {
    const index = Math.round(pos);
    const clampedIndex = Math.max(0, Math.min(themeOptions.length - 1, index));
    const newTheme = themeOptions[clampedIndex].id;
    
    if (newTheme !== backgroundTheme) {
      playClick();
      setBackgroundTheme(newTheme);
    }
  };

  const getPositionFromEvent = (clientY: number): number => {
    if (!containerRef.current) return sliderPosition;
    
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 8;
    const trackHeight = rect.height - padding * 2;
    const relativeY = clientY - rect.top - padding;
    const percentage = Math.max(0, Math.min(1, relativeY / trackHeight));
    return percentage * (themeOptions.length - 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setSliderPosition(getPositionFromEvent(e.clientY));
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const rounded = Math.round(sliderPosition);
      setSliderPosition(rounded);
      updateThemeFromPosition(rounded);
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setSliderPosition(getPositionFromEvent(touch.clientY));
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      const rounded = Math.round(sliderPosition);
      setSliderPosition(rounded);
      updateThemeFromPosition(rounded);
    }
    setIsDragging(false);
  };

  const handleOptionClick = (index: number) => {
    setSliderPosition(index);
    updateThemeFromPosition(index);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, sliderPosition]);

  // Calculate thumb position within the glass container
  const thumbTop = sliderPosition * itemHeight;

  return (
    <div className="glass-selector" ref={containerRef}>
      {/* Sliding highlight behind active option */}
      <div 
        className={`glass-highlight ${isDragging ? 'dragging' : ''}`}
        style={{ transform: `translateY(${thumbTop}px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      
      {/* Options */}
      {themeOptions.map((option, index) => (
        <button
          key={option.id}
          className={`glass-option ${Math.round(sliderPosition) === index ? 'active' : ''}`}
          onClick={() => handleOptionClick(index)}
          onMouseEnter={playHover}
          aria-label={option.label}
          aria-pressed={Math.round(sliderPosition) === index}
        >
          <span className="glass-icon">{option.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default BackgroundSelector;
