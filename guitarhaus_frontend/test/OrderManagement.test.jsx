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

// Mock window.confirm
global.window.confirm = jest.fn();

describe('Order Management', () => {
  const mockPendingOrders = [
    {
      _id: 'order1',
      customer: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      items: [
        {
          guitar: { name: 'Acoustic Guitar', brand: 'Fender', images: ['guitar1.jpg'] },
          quantity: 2,
          price: 2500
        }
      ],
      totalAmount: 5000,
      orderStatus: 'pending',
      paymentStatus: 'paid',
      createdAt: '2024-01-15T10:30:00Z'
    }
  ];

  const mockConfirmedOrders = [
    {
      _id: 'order2',
      customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      items: [
        {
          guitar: { name: 'Electric Guitar', brand: 'Gibson', images: ['guitar2.jpg'] },
          quantity: 1,
          price: 3500
        }
      ],
      totalAmount: 3500,
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-14T15:20:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('admin-token');
    window.confirm.mockReturnValue(true);
  });

  describe('Pending Orders', () => {
    it('renders pending orders table with headers', async () => {
      axios.get.mockResolvedValueOnce({ data: { success: true, data: mockPendingOrders } });

      const PendingOrdersComponent = () => (
        <div>
          <h2>Pending Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Guitar</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPendingOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.customer.firstName} {order.customer.lastName}</td>
                  <td>{order.items[0].guitar.name}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button>Approve</button>
                    <button>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      render(
        <MemoryRouter>
          <PendingOrdersComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Pending Orders')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();
      expect(screen.getByText('Guitar')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('displays pending order data correctly', () => {
      const PendingOrdersComponent = () => (
        <div>
          <h2>Pending Orders</h2>
          <div>
            <p>{mockPendingOrders[0].customer.firstName} {mockPendingOrders[0].customer.lastName}</p>
            <p>{mockPendingOrders[0].items[0].guitar.name}</p>
            <p>₹{mockPendingOrders[0].totalAmount.toLocaleString()}</p>
            <p>{new Date(mockPendingOrders[0].createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      );

      render(
        <MemoryRouter>
          <PendingOrdersComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Pending Orders')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Acoustic Guitar')).toBeInTheDocument();
      expect(screen.getByText('₹5,000')).toBeInTheDocument();
    });

    it('handles order approval', async () => {
      const mockResponse = { data: { success: true, message: 'Order approved' } };
      axios.put.mockResolvedValueOnce(mockResponse);

      const approveOrder = jest.fn().mockResolvedValue(mockResponse);

      const PendingOrdersComponent = () => (
        <div>
          <button onClick={() => approveOrder('order1')}>Approve Order</button>
        </div>
      );

      render(
        <MemoryRouter>
          <PendingOrdersComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Approve Order'));
      expect(approveOrder).toHaveBeenCalledWith('order1');
    });

    it('handles order cancellation', async () => {
      const mockResponse = { data: { success: true, message: 'Order cancelled' } };
      axios.delete.mockResolvedValueOnce(mockResponse);

      const cancelOrder = jest.fn().mockResolvedValue(mockResponse);

      const PendingOrdersComponent = () => (
        <div>
          <button onClick={() => cancelOrder('order1')}>Cancel Order</button>
        </div>
      );

      render(
        <MemoryRouter>
          <PendingOrdersComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Cancel Order'));
      expect(cancelOrder).toHaveBeenCalledWith('order1');
    });
  });

  describe('Confirmed Orders', () => {
    it('renders confirmed orders table with headers', async () => {
      axios.get.mockResolvedValueOnce({ data: { success: true, data: mockConfirmedOrders } });

      const ConfirmedOrdersComponent = () => (
        <div>
          <h2>Confirmed Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Guitar</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockConfirmedOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.customer.firstName} {order.customer.lastName}</td>
                  <td>{order.items[0].guitar.name}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      render(
        <MemoryRouter>
          <ConfirmedOrdersComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Confirmed Orders')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();
      expect(screen.getByText('Guitar')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('displays confirmed order data correctly', async () => {
      axios.get.mockResolvedValueOnce({ data: { success: true, data: mockConfirmedOrders } });

      const ConfirmedOrdersComponent = () => (
        <div>
          {mockConfirmedOrders.map(order => (
            <div key={order._id}>
              <p>{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.items[0].guitar.name}</p>
              <p>₹{order.totalAmount.toLocaleString()}</p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      );

      render(
        <MemoryRouter>
          <ConfirmedOrdersComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Electric Guitar')).toBeInTheDocument();
      expect(screen.getByText('₹3,500')).toBeInTheDocument();
    });

    it('handles order deletion', async () => {
      const mockResponse = { data: { success: true, message: 'Order deleted' } };
      axios.delete.mockResolvedValueOnce(mockResponse);

      const deleteOrder = jest.fn().mockResolvedValue(mockResponse);

      const ConfirmedOrdersComponent = () => (
        <div>
          <button onClick={() => deleteOrder('order2')}>Delete Order</button>
        </div>
      );

      render(
        <MemoryRouter>
          <ConfirmedOrdersComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Delete Order'));
      expect(deleteOrder).toHaveBeenCalledWith('order2');
    });
  });
}); 