import { useState, useEffect, lazy, Suspense } from 'react';
import { useBackground } from '../context';

// Lazy load background components for code splitting
const ParticlesBackground = lazy(() => import('./backgrounds/ParticlesBackground'));
const SpaceBackground = lazy(() => import('./backgrounds/SpaceBackground'));
const FluidBackground = lazy(() => import('./backgrounds/FluidBackground'));

// Loading fallback component
const BackgroundFallback = () => (
  <div className="background-loading" style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 100%)',
  }} />
);

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
      <Suspense fallback={<BackgroundFallback />}>
        {renderBackground()}
      </Suspense>
    </div>
  );
};

export default BackgroundRenderer;
