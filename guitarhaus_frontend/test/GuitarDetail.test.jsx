import { render, screen } from '@testing-library/react';
import GuitarDetail from '../src/components/public/GuitarDetail';
import { MemoryRouter } from 'react-router-dom';

describe('GuitarDetail Page', () => {
  it('renders guitar detail heading', () => {
    render(
      <MemoryRouter>
        <GuitarDetail />
      </MemoryRouter>
    );
    expect(screen.getByText(/Guitar Detail/i)).toBeInTheDocument();
  });
}); 