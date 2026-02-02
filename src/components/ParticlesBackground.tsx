import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type { ISourceOptions } from '@tsparticles/engine';

interface ParticlesBackgroundProps {
  darkMode: boolean;
}

function ParticlesBackground({ darkMode }: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);

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
      fpsLimit: 90,
      detectRetina: true,
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            width: 800,
            height: 800,
          },
        },
        color: {
          value: [
            '#0066ff', // Azul brillante
            '#00aaff', // Azul cielo
            '#0044cc', // Azul oscuro
            '#00ccff', // Cian
            '#3399ff', // Azul medio
            '#0088ff', // Azul eléctrico
          ],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: 0.9,
        },
        size: {
          value: {
            min: 2,
            max: 4,
          },
        },
        links: {
          enable: true,
          distance: 75,
          color: darkMode ? '#6699cc' : '#336699',
          opacity: 0.9,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          outModes: {
            default: 'bounce',
          },
          attract: {
            enable: false,
          },
        },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
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
          attract: {
            distance: 100,
            duration: 1,
            speed: 5,
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 0.8,
          },
          grab: {
            distance: 400,
            links: {
              opacity: 1,
            },
          },
          push: {
            quantity: 3,
          },
          remove: {
            quantity: 2,
          },
          repulse: {
            distance: 100,
            duration: 1,
          },
        },
      },
      background: {
        color: {
          value: 'transparent',
        },
      },
    }),
    [darkMode]
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
