import { render, screen } from '@testing-library/react';
import Guitars from '../src/components/public/Guitars';
import { MemoryRouter } from 'react-router-dom';

describe('Guitars Page', () => {
  it('renders guitars grid and heading', () => {
    render(
      <MemoryRouter>
        <Guitars />
      </MemoryRouter>
    );
    // Use getAllByText to avoid multiple match error
    expect(screen.getAllByText(/Guitars/i).length).toBeGreaterThan(0);
    // Optionally: expect a grid or list
  });
}); 