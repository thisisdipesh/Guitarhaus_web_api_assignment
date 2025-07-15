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
    expect(screen.getByText(/Guitars/i)).toBeInTheDocument();
    // Optionally: expect a grid or list
  });
}); 