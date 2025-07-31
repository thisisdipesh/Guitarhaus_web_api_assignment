import { render, screen } from '@testing-library/react';
import Register from '../src/components/public/Register.jsx';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Register Page', () => {
  it('renders registration form', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Create an Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    // There are two password fields, so use getAllByLabelText
    expect(screen.getAllByLabelText(/Password/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CREATE ACCOUNT/i })).toBeInTheDocument();
  });
}); 