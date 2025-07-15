import { render, screen } from '@testing-library/react';
import Home from '../src/components/public/Home';
import { MemoryRouter } from 'react-router-dom';

describe('Home Page', () => {
  it('renders hero and guitars section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/GuitarHaus/i)).toBeInTheDocument();
    expect(screen.getByText(/Guitars/i)).toBeInTheDocument();
  });
}); 