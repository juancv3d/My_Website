import { FaSun, FaMoon } from 'react-icons/fa';
import { useSound } from '../hooks';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

function ThemeToggle({ darkMode, toggleTheme }: ThemeToggleProps) {
  const { playToggle, playHover } = useSound();

  const handleClick = () => {
    playToggle(!darkMode);
    toggleTheme();
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleClick}
      onMouseEnter={playHover}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      title={`Currently in ${darkMode ? 'dark' : 'light'} mode, switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
