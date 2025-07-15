import { render, screen } from '@testing-library/react';
import GuitarCard from '../src/components/common/customer/GuitarCard';
import { MemoryRouter } from 'react-router-dom';

const mockGuitar = {
  _id: '1',
  name: 'Fender Stratocaster',
  price: 1200,
  image: 'guitar1.jpg',
};

describe('GuitarCard', () => {
  it('renders guitar info and action buttons', () => {
    render(
      <MemoryRouter>
        <GuitarCard guitar={mockGuitar} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Fender Stratocaster/i)).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
  });
}); 