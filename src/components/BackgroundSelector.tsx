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

const themeOptions: ThemeOption[] = [
  { id: 'particles', icon: <HiSparkles />, label: 'Particles' },
  { id: 'fluid', icon: <RiWaterFlashLine />, label: 'Fluid' },
  { id: 'space', icon: <IoMdPlanet />, label: 'Space' },
];

const BackgroundSelector = () => {
  const { backgroundTheme, setBackgroundTheme } = useBackground();
  const { playClick, playHover } = useSound();

  const currentTheme = themeOptions.find((t) => t.id === backgroundTheme);

  const handleClick = () => {
    const currentIndex = themeOptions.findIndex((t) => t.id === backgroundTheme);
    const nextIndex = (currentIndex + 1) % themeOptions.length;
    const nextTheme = themeOptions[nextIndex].id;
    
    playClick();
    setBackgroundTheme(nextTheme);
  };

  return (
    <button
      className="theme-button"
      onClick={handleClick}
      onMouseEnter={playHover}
      aria-label={`Current theme: ${currentTheme?.label}. Click to switch.`}
      title={`Current: ${currentTheme?.label}`}
    >
      {currentTheme?.icon}
    </button>
  );
};

export default BackgroundSelector;
