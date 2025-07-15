import { render, screen } from '@testing-library/react';
import Hero from '../src/components/common/customer/Hero';
import { MemoryRouter } from 'react-router-dom';

describe('Hero', () => {
  it('renders hero text and call-to-action', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    expect(screen.getByText(/GuitarHaus/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
}); 