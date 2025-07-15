import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
    expect(screen.getAllByText(/GuitarHaus/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Shop Guitars/i })).toBeInTheDocument();
  });
}); 