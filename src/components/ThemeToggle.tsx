import { FaSun, FaMoon } from 'react-icons/fa';
import { useSound } from '../hooks';
import { useBackground } from '../context';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useBackground();
  const { playToggle, playHover } = useSound();

  const handleClick = () => {
    playToggle(!darkMode);
    toggleDarkMode();
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
