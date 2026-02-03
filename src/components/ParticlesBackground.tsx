import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type { ISourceOptions } from '@tsparticles/engine';

interface ParticlesBackgroundProps {
  darkMode: boolean;
}

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

function ParticlesBackground({ darkMode }: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },
      fpsLimit: isMobile ? 30 : 90,
      detectRetina: !isMobile,
      particles: {
        number: {
          value: isMobile ? 40 : 120,
          density: {
            enable: true,
            width: 800,
            height: 800,
          },
        },
        color: {
          value: darkMode 
            ? ['#0066ff', '#00aaff', '#0044cc', '#00ccff', '#3399ff', '#66bbff', '#99ddff']
            : ['#0044aa', '#0066cc', '#0088ee', '#00aaff'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.6, max: 1 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 2, max: 5 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 120, // Mayor distancia = más conexiones
          color: darkMode ? '#4488cc' : '#336699',
          opacity: 0.7,
          width: 1.2,
          triangles: {
            enable: true, // Triángulos entre conexiones
            color: darkMode ? '#223355' : '#ddeeff',
            opacity: 0.1,
          },
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'bounce',
          },
          attract: {
            enable: true,
            rotate: {
              x: 600,
              y: 1200,
            },
          },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.03,
            opacity: 1,
            color: {
              value: '#ffffff',
            },
          },
        },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: {
            enable: !isMobile,
            mode: ['grab', 'bubble'],
            parallax: {
              enable: !isMobile,
              force: 60,
              smooth: 10,
            },
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 1,
              color: '#00ffff',
            },
          },
          bubble: {
            distance: 150,
            size: 8,
            duration: 2,
            opacity: 0.8,
          },
          push: {
            quantity: isMobile ? 2 : 5,
          },
          repulse: {
            distance: 150,
            duration: 0.4,
          },
        },
      },
      background: {
        color: {
          value: 'transparent',
        },
      },
    }),
    [darkMode, isMobile]
  );

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={options}
    />
  );
}

export default ParticlesBackground;
