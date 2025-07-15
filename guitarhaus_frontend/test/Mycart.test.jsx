import { render, screen } from '@testing-library/react';
import Mycart from '../src/components/public/Mycart';
import { MemoryRouter } from 'react-router-dom';

describe('Mycart Page', () => {
  it('renders cart heading and checkout button', () => {
    render(
      <MemoryRouter>
        <Mycart />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cart|My Cart/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Checkout/i })).toBeInTheDocument();
  });
}); 