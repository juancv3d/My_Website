import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

function ThemeToggle({ darkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      title={`Currently in ${darkMode ? 'dark' : 'light'} mode, switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
