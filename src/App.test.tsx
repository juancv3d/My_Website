import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock useSound hook
vi.mock('./hooks', () => ({
  useSound: () => ({
    playToggle: vi.fn(),
    playHover: vi.fn(),
    playClick: vi.fn(),
  }),
}));

// Mock background components (they use WebGL which isn't available in tests)
vi.mock('./components/backgrounds/ParticlesBackground', () => ({
  default: () => <div data-testid="particles-bg">Particles Background</div>,
}));

vi.mock('./components/backgrounds/SpaceBackground', () => ({
  default: () => <div data-testid="space-bg">Space Background</div>,
}));

vi.mock('./components/backgrounds/FluidBackground', () => ({
  default: () => <div data-testid="fluid-bg">Fluid Background</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the main heading with name', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Juan Camilo Villarreal Rios');
  });

  it('renders the job title', () => {
    render(<App />);
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Solution Engineer');
  });

  it('renders theme toggle button', () => {
    render(<App />);
    const themeToggle = screen.getByRole('button', { name: /switch to/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('renders background selector button', () => {
    render(<App />);
    const bgSelector = screen.getByRole('button', { name: /current theme/i });
    expect(bgSelector).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<App />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('applies dark mode class by default', () => {
    localStorageMock.getItem.mockReturnValue('true');
    render(<App />);
    const appDiv = document.querySelector('.app');
    expect(appDiv).toHaveClass('dark');
  });
});
