// jest.mock for lucide-react icons to fix ESM import error
jest.mock('lucide-react', () => ({
  Calendar: () => <div>Calendar</div>,
  ChevronDown: () => <div>ChevronDown</div>,
  ChevronLeft: () => <div>ChevronLeft</div>,
  ChevronRight: () => <div>ChevronRight</div>,
  ChevronUp: () => <div>ChevronUp</div>,
  Home: () => <div>Home</div>,
  LogOut: () => <div>LogOut</div>,
  Package: () => <div>Package</div>,
  Settings: () => <div>Settings</div>,
  ShoppingCart: () => <div>ShoppingCart</div>,
  Star: () => <div>Star</div>,
  User: () => <div>User</div>,
  Users: () => <div>Users</div>,
  CreditCard: () => <div>CreditCard</div>,
  // add more icons as needed
}));

import { render, screen } from '@testing-library/react';
import Sidebar from '../src/components/common/admin/Sidebar.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Admin Sidebar', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/guitars/i)).toBeInTheDocument();
  });
}); 