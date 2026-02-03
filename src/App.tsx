import { BackgroundProvider, useBackground } from './context';
import { ThemeToggle, SocialLinks, BackgroundSelector, BackgroundRenderer } from './components';

function AppContent() {
  const { darkMode } = useBackground();

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
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
    <BackgroundProvider>
      <AppContent />
    </BackgroundProvider>
  );
}

export default App;
