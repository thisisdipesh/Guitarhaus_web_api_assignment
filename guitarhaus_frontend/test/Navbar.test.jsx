import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/common/customer/Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Customer Navbar', () => {
  it('renders and contains expected links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Guitars/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });
}); 