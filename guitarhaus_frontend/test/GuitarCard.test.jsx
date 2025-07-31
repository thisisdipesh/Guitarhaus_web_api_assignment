import { render, screen } from '@testing-library/react';
import GuitarCard from '../src/components/common/customer/GuitarCard';
import { MemoryRouter } from 'react-router-dom';

const mockGuitarData = {
  _id: "1",
  name: "Test Guitar",
  brand: "Test Brand",
  category: "Acoustic",
  price: 1200,
  description: "A test guitar",
  images: ["test-image.jpg"]
};

describe('GuitarCard', () => {
  it('renders guitar info and view details link', () => {
    render(
      <MemoryRouter>
        <GuitarCard guitarData={mockGuitarData} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Test Guitar/i)).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Details/i })).toBeInTheDocument();
  });
}); 