import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
    expect(screen.getAllByText(/GuitarHaus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Guitars/i).length).toBeGreaterThan(0);
  });
}); 