import { render, screen } from '@testing-library/react';
import Footer from '../src/components/common/customer/Footer';
import { MemoryRouter } from 'react-router-dom';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    // Match the actual text in the footer
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
}); 