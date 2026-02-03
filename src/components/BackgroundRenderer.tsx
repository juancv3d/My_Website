import { useState, useEffect } from 'react';
import { useBackground } from '../context';
import ParticlesBackground from './ParticlesBackground';
import { SpaceBackground, FluidBackground } from './backgrounds';

const BackgroundRenderer = () => {
  const { backgroundTheme, darkMode } = useBackground();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTheme, setActiveTheme] = useState(backgroundTheme);

  useEffect(() => {
    if (backgroundTheme !== activeTheme) {
      setIsTransitioning(true);
      
      // Wait for fade out, then switch theme
      const timeout = setTimeout(() => {
        setActiveTheme(backgroundTheme);
        setIsTransitioning(false);
      }, 300); // Half of the transition duration

      return () => clearTimeout(timeout);
    }
  }, [backgroundTheme, activeTheme]);

  const renderBackground = () => {
    switch (activeTheme) {
      case 'particles':
        return <ParticlesBackground darkMode={darkMode} />;
      case 'space':
        return <SpaceBackground darkMode={darkMode} />;
      case 'fluid':
        return <FluidBackground darkMode={darkMode} />;
      default:
        return <ParticlesBackground darkMode={darkMode} />;
    }
  };

  return (
    <div className={`background-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      {renderBackground()}
    </div>
  );
};

export default BackgroundRenderer;
