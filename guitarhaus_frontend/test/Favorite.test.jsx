import { render, screen } from '@testing-library/react';
import Favorite from '../src/components/public/Favorite';
import { MemoryRouter } from 'react-router-dom';

describe('Favorite Page', () => {
  it('renders favorites heading', () => {
    render(
      <MemoryRouter>
        <Favorite />
      </MemoryRouter>
    );
    expect(screen.getByText(/Favorites|Wishlist/i)).toBeInTheDocument();
  });
}); 