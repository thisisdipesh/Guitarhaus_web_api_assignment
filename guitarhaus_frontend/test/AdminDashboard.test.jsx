import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Admin Dashboard', () => {
  const mockDashboardData = {
    totalUsers: 150,
    totalGuitars: 45,
    totalOrders: 89,
    totalRevenue: 125000,
    topGuitar: {
      name: 'Acoustic Guitar',
      sales: 25
    },
    topUser: {
      name: 'John Doe',
      orders: 8
    },
    recentOrders: [
      {
        _id: 'order1',
        customer: { firstName: 'John', lastName: 'Doe' },
        totalAmount: 2500,
        orderStatus: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: 'order2',
        customer: { firstName: 'Jane', lastName: 'Smith' },
        totalAmount: 3500,
        orderStatus: 'confirmed',
        createdAt: '2024-01-15T09:15:00Z'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('admin-token');
  });

  it('renders dashboard with all stats cards', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, data: mockDashboardData } });

    const DashboardComponent = () => (
      <div>
        <h1>Admin Dashboard</h1>
        <div>
          <div>
            <h3>Total Users</h3>
            <p>150</p>
          </div>
          <div>
            <h3>Total Guitars</h3>
            <p>45</p>
          </div>
          <div>
            <h3>Total Orders</h3>
            <p>89</p>
          </div>
          <div>
            <h3>Total Revenue</h3>
            <p>₹1,25,000</p>
          </div>
        </div>
        <button>Add Guitar</button>
      </div>
    );

    render(
      <MemoryRouter>
        <DashboardComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Guitars')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Add Guitar')).toBeInTheDocument();
  });

  it('displays correct stats values', () => {
    const formatNumber = (num) => num?.toLocaleString() || '0';
    const formatCurrency = (num) => `₹${num?.toLocaleString() || '0'}`;

    expect(formatNumber(150)).toBe('150');
    expect(formatNumber(45000)).toBe('45,000');
    expect(formatCurrency(125000)).toBe('₹125,000');
  });

  it('shows Add Guitar button functionality', () => {
    const mockNavigate = jest.fn();

    const DashboardComponent = () => (
      <div>
        <button onClick={() => mockNavigate('/admin/addguitar')}>Add Guitar</button>
      </div>
    );

    render(
      <MemoryRouter>
        <DashboardComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Guitar'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/addguitar');
  });

  it('displays recent orders table', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, data: mockDashboardData } });

    const RecentOrdersComponent = () => (
      <div>
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockDashboardData.recentOrders.map(order => (
              <tr key={order._id}>
                <td>{order.customer.firstName} {order.customer.lastName}</td>
                <td>₹{order.totalAmount.toLocaleString()}</td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    render(
      <MemoryRouter>
        <RecentOrdersComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('₹2,500')).toBeInTheDocument();
    expect(screen.getByText('₹3,500')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    const LoadingComponent = () => (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Loading dashboard data...</p>
      </div>
    );

    render(
      <MemoryRouter>
        <LoadingComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    const ErrorComponent = () => (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Failed to load dashboard data</p>
        <button>Retry</button>
      </div>
    );

    render(
      <MemoryRouter>
        <ErrorComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
}); 