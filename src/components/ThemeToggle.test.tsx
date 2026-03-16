import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackgroundProvider } from '../context';
import ThemeToggle from '../components/ThemeToggle';

// Mock useSound hook
vi.mock('../hooks', () => ({
  useSound: () => ({
    playToggle: vi.fn(),
    playHover: vi.fn(),
    playClick: vi.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const renderWithProvider = (component: React.ReactNode) => {
  return render(<BackgroundProvider>{component}</BackgroundProvider>);
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders toggle button', () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to/i });
    expect(button).toBeInTheDocument();
  });

  it('shows sun icon in dark mode (default)', () => {
    localStorageMock.getItem.mockReturnValue('true');
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('true');
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    
    await user.click(button);
    
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('has accessible title attribute', () => {
    localStorageMock.getItem.mockReturnValue('true');
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', expect.stringContaining('dark mode'));
  });
});
