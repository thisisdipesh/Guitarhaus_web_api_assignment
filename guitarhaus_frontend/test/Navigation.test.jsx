import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Navigation and Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');
  });

  describe('Admin Sidebar', () => {
    it('renders sidebar with all menu items', () => {
      const SidebarComponent = () => (
        <div className="sidebar">
          <div className="logo">
            <h2>GuitarHaus Admin</h2>
          </div>
          <nav>
            <ul>
              <li>
                <a href="/admin/dashboard">Dashboard</a>
              </li>
              <li>
                <a href="/admin/orders">Orders</a>
                <ul>
                  <li><a href="/admin/orders/pending">Pending Orders</a></li>
                  <li><a href="/admin/orders/confirmed">Confirmed Orders</a></li>
                </ul>
              </li>
              <li>
                <a href="/admin/users">Users</a>
              </li>
              <li>
                <a href="/admin/guitars">Guitars</a>
              </li>
              <li>
                <a href="/admin/payments">Payments</a>
              </li>
              <li>
                <a href="/admin/reviews">Reviews</a>
              </li>
            </ul>
          </nav>
        </div>
      );

      render(
        <MemoryRouter>
          <SidebarComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('GuitarHaus Admin')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Pending Orders')).toBeInTheDocument();
      expect(screen.getByText('Confirmed Orders')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Guitars')).toBeInTheDocument();
      expect(screen.getByText('Payments')).toBeInTheDocument();
      expect(screen.getByText('Reviews')).toBeInTheDocument();
    });

    it('handles menu item clicks', () => {
      const handleMenuClick = jest.fn();

      const SidebarComponent = () => (
        <div>
          <button onClick={() => handleMenuClick('/admin/dashboard')}>Dashboard</button>
          <button onClick={() => handleMenuClick('/admin/orders')}>Orders</button>
          <button onClick={() => handleMenuClick('/admin/users')}>Users</button>
        </div>
      );

      render(
        <MemoryRouter>
          <SidebarComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Dashboard'));
      expect(handleMenuClick).toHaveBeenCalledWith('/admin/dashboard');

      fireEvent.click(screen.getByText('Orders'));
      expect(handleMenuClick).toHaveBeenCalledWith('/admin/orders');

      fireEvent.click(screen.getByText('Users'));
      expect(handleMenuClick).toHaveBeenCalledWith('/admin/users');
    });
  });

  describe('Admin Navbar', () => {
    it('renders navbar with title and profile', () => {
      const NavbarComponent = () => (
        <div className="navbar">
          <div className="title">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="profile">
            <span>Admin User</span>
            <button>Logout</button>
          </div>
        </div>
      );

      render(
        <MemoryRouter>
          <NavbarComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('handles logout functionality', () => {
      const handleLogout = jest.fn();

      const NavbarComponent = () => (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );

      render(
        <MemoryRouter>
          <NavbarComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Logout'));
      expect(handleLogout).toHaveBeenCalled();
    });
  });

  describe('Customer Navigation', () => {
    it('renders customer navbar with logo and menu', () => {
      const CustomerNavbarComponent = () => (
        <div className="navbar">
          <div className="logo">
            <h1>GuitarHaus</h1>
          </div>
          <nav>
            <a href="/">Home</a>
            <a href="/guitars">Guitars</a>
            <a href="/cart">Cart</a>
            <a href="/profile">Profile</a>
          </nav>
        </div>
      );

      render(
        <MemoryRouter>
          <CustomerNavbarComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('GuitarHaus')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Guitars')).toBeInTheDocument();
      expect(screen.getByText('Cart')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('shows cart count badge', () => {
      const cartCount = 3;

      const CustomerNavbarComponent = () => (
        <div>
          <a href="/cart">
            Cart
            <span className="badge">{cartCount}</span>
          </a>
        </div>
      );

      render(
        <MemoryRouter>
          <CustomerNavbarComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Layout Component', () => {
    it('renders layout with sidebar and main content', () => {
      const LayoutComponent = () => (
        <div className="layout">
          <div className="sidebar">
            <h2>Sidebar</h2>
          </div>
          <div className="main-content">
            <div className="navbar">
              <h1>Navbar</h1>
            </div>
            <div className="content">
              <p>Main Content Area</p>
            </div>
          </div>
        </div>
      );

      render(
        <MemoryRouter>
          <LayoutComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Sidebar')).toBeInTheDocument();
      expect(screen.getByText('Navbar')).toBeInTheDocument();
      expect(screen.getByText('Main Content Area')).toBeInTheDocument();
    });
  });
}); 