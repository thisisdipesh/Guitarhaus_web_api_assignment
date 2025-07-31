import { render, screen } from '@testing-library/react';
import Dashboard from '../src/components/private/dashboard/Dashboard.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Dashboard Page', () => {
  it('renders dashboard heading', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
}); 