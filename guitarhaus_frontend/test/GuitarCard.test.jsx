import { render, screen } from '@testing-library/react';
import GuitarCard from '../src/components/common/customer/GuitarCard';
import { MemoryRouter } from 'react-router-dom';

const mockGuitar = {
  _id: '1',
  name: 'Fender Stratocaster',
  price: 1200,
  images: ['test.jpg'],
};

describe('GuitarCard', () => {
  it('renders guitar info and view details link', () => {
    render(
      <MemoryRouter>
        <GuitarCard guitarData={mockGuitar} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Fender Stratocaster/i)).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Details/i })).toBeInTheDocument();
  });
}); 