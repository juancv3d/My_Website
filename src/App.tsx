import { useState, useEffect } from 'react';
import { ParticlesBackground, ThemeToggle, SocialLinks } from './components';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <ParticlesBackground darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="content">
        <h1 className="name">Juan Camilo Villarreal Rios</h1>
        <h2 className="title">Solution Engineer</h2>
        <SocialLinks />
      </main>
    </div>
  );
}

export default App;
