import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BackgroundProvider, useBackground } from './context';
import { ThemeToggle, SocialLinks, BackgroundSelector, BackgroundRenderer } from './components';
import Itinerario from './pages/Itinerario';

function HomePage() {
  const { darkMode, backgroundTheme } = useBackground();

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'} theme-${backgroundTheme}`}>
      <BackgroundRenderer />
      
      <div className="controls">
        <ThemeToggle />
        <BackgroundSelector />
      </div>
      
      <main className="content">
        <h1 className="name">Juan Camilo Villarreal Rios</h1>
        <h2 className="title">Solution Engineer</h2>
        <SocialLinks />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <BackgroundProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/itinerario" element={<Itinerario />} />
        </Routes>
      </BackgroundProvider>
    </BrowserRouter>
  );
}

export default App;
