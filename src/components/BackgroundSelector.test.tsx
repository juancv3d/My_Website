import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackgroundProvider } from '../context';
import BackgroundSelector from '../components/BackgroundSelector';

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

describe('BackgroundSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders selector button', () => {
    renderWithProvider(<BackgroundSelector />);
    const button = screen.getByRole('button', { name: /current theme/i });
    expect(button).toBeInTheDocument();
  });

  it('shows particles theme by default', () => {
    renderWithProvider(<BackgroundSelector />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Particles'));
  });

  it('cycles through themes on click', async () => {
    const user = userEvent.setup();
    renderWithProvider(<BackgroundSelector />);
    
    const button = screen.getByRole('button');
    
    // Default is particles
    expect(button).toHaveAttribute('title', 'Current: Particles');
    
    // Click to go to fluid
    await user.click(button);
    expect(button).toHaveAttribute('title', 'Current: Fluid');
    
    // Click to go to space
    await user.click(button);
    expect(button).toHaveAttribute('title', 'Current: Space');
    
    // Click to cycle back to particles
    await user.click(button);
    expect(button).toHaveAttribute('title', 'Current: Particles');
  });

  it('persists theme selection to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProvider(<BackgroundSelector />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('backgroundTheme', 'fluid');
  });
});
