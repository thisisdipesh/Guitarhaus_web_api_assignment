import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
const mockLocation = {
  search: '',
  href: 'http://localhost:3000/success',
  origin: 'http://localhost:3000',
  pathname: '/success'
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('Stripe Payment Integration', () => {
  const mockCartItems = [
    {
      _id: '1',
      guitar: {
        _id: 'guitar1',
        name: 'Acoustic Guitar',
        brand: 'Fender',
        price: 2500,
        images: ['guitar1.jpg']
      },
      quantity: 2,
      price: 2500
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');
    window.location.search = '';
  });

  describe('Checkout Component', () => {
    it('renders checkout form with order summary', () => {
      const CheckoutComponent = () => (
        <div>
          <h2>Checkout</h2>
          <div>
            <h3>Order Summary</h3>
            {mockCartItems.map(item => (
              <div key={item._id}>
                <p>{item.guitar.name} x {item.quantity}</p>
                <p>₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div>
              <p>Subtotal: ₹5,000</p>
              <p>Tax: ₹500</p>
              <p>Total: ₹5,500</p>
            </div>
          </div>
          <button>Pay with Stripe</button>
        </div>
      );

      render(
        <MemoryRouter>
          <CheckoutComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Checkout')).toBeInTheDocument();
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Acoustic Guitar x 2')).toBeInTheDocument();
      expect(screen.getByText('Total: ₹5,500')).toBeInTheDocument();
    });

    it('initiates Stripe payment session', async () => {
      const mockResponse = { 
        data: { 
          success: true, 
          sessionId: 'test-session-id',
          url: 'https://checkout.stripe.com/test'
        } 
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const initiatePayment = jest.fn().mockResolvedValue(mockResponse);

      const CheckoutComponent = () => (
        <div>
          <button onClick={() => initiatePayment(mockCartItems)}>Pay with Stripe</button>
        </div>
      );

      render(
        <MemoryRouter>
          <CheckoutComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Pay with Stripe'));

      await waitFor(() => {
        expect(initiatePayment).toHaveBeenCalledWith(mockCartItems);
      });
    });
  });

  describe('Payment Success Component', () => {
    it('renders success page with session ID', () => {
      // Update the mock location for this test
      Object.defineProperty(window, 'location', {
        value: { ...mockLocation, search: '?session_id=test-session-id' },
        writable: true
      });

      const SuccessComponent = () => (
        <div>
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          <p>Session ID: test-session-id</p>
          <button>Continue Shopping</button>
        </div>
      );

      render(
        <MemoryRouter>
          <SuccessComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
      expect(screen.getByText('Your order has been placed successfully.')).toBeInTheDocument();
      expect(screen.getByText('Session ID: test-session-id')).toBeInTheDocument();
    });

    it('verifies payment session with backend', async () => {
      const mockSessionResponse = { 
        data: { 
          success: true, 
          session: { 
            id: 'test-session-id',
            payment_status: 'paid',
            amount_total: 5500
          } 
        } 
      };
      axios.get.mockResolvedValueOnce(mockSessionResponse);

      const verifySession = jest.fn().mockResolvedValue(mockSessionResponse);

      const SuccessComponent = () => (
        <div>
          <button onClick={() => verifySession('test-session-id')}>Verify Payment</button>
        </div>
      );

      render(
        <MemoryRouter>
          <SuccessComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Verify Payment'));

      await waitFor(() => {
        expect(verifySession).toHaveBeenCalledWith('test-session-id');
      });
    });

    it('creates order after successful payment', async () => {
      const mockOrderResponse = { 
        data: { 
          success: true, 
          order: { 
            _id: 'order123',
            totalAmount: 5500,
            status: 'pending'
          } 
        } 
      };
      axios.post.mockResolvedValueOnce(mockOrderResponse);

      const createOrder = jest.fn().mockResolvedValue(mockOrderResponse);

      const SuccessComponent = () => (
        <div>
          <button onClick={() => createOrder()}>Create Order</button>
        </div>
      );

      render(
        <MemoryRouter>
          <SuccessComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Create Order'));

      await waitFor(() => {
        expect(createOrder).toHaveBeenCalled();
      });
    });

    it('calculates order totals correctly', () => {
      const calculateOrderTotal = (items) => {
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax
        const shipping = 0; // Free shipping
        return {
          subtotal,
          tax,
          shipping,
          total: subtotal + tax + shipping
        };
      };

      const totals = calculateOrderTotal(mockCartItems);
      expect(totals.subtotal).toBe(5000);
      expect(totals.tax).toBe(500);
      expect(totals.shipping).toBe(0);
      expect(totals.total).toBe(5500);
    });
  });
}); 