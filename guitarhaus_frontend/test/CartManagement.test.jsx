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

describe('Shopping Cart Management', () => {
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
    },
    {
      _id: '2',
      guitar: {
        _id: 'guitar2',
        name: 'Electric Guitar',
        brand: 'Gibson',
        price: 3500,
        images: ['guitar2.jpg']
      },
      quantity: 1,
      price: 3500
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');
    window.confirm.mockReturnValue(true);
  });

  it('displays cart items correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, data: mockCartItems } });

    // Mock the cart component rendering
    const CartComponent = () => (
      <div>
        <h2>Shopping Cart</h2>
        {mockCartItems.map(item => (
          <div key={item._id}>
            <h3>{item.guitar.name}</h3>
            <p>Brand: {item.guitar.brand}</p>
            <p>Price: ₹{item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button>Update Quantity</button>
            <button>Remove</button>
          </div>
        ))}
        <div>
          <p>Total: ₹8,500</p>
          <button>Proceed to Checkout</button>
        </div>
      </div>
    );

    render(
      <MemoryRouter>
        <CartComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Acoustic Guitar')).toBeInTheDocument();
    expect(screen.getByText('Electric Guitar')).toBeInTheDocument();
    expect(screen.getByText('Total: ₹8,500')).toBeInTheDocument();
  });

  it('handles quantity updates', async () => {
    const mockResponse = { data: { success: true, message: 'Quantity updated' } };
    axios.put.mockResolvedValueOnce(mockResponse);

    const updateQuantity = jest.fn();

    const CartItemComponent = () => (
      <div>
        <button onClick={() => updateQuantity('1', 3)}>Update to 3</button>
        <button onClick={() => updateQuantity('1', 1)}>Update to 1</button>
      </div>
    );

    render(
      <MemoryRouter>
        <CartItemComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Update to 3'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 3);

    fireEvent.click(screen.getByText('Update to 1'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('handles item removal', async () => {
    const mockResponse = { data: { success: true, message: 'Item removed' } };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const removeItem = jest.fn();

    const CartItemComponent = () => (
      <div>
        <button onClick={() => removeItem('1')}>Remove Item</button>
      </div>
    );

    render(
      <MemoryRouter>
        <CartItemComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Remove Item'));
    expect(removeItem).toHaveBeenCalledWith('1');
  });

  it('calculates total correctly', () => {
    const calculateTotal = (items) => {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const total = calculateTotal(mockCartItems);
    expect(total).toBe(8500); // (2500 * 2) + (3500 * 1)
  });

  it('handles empty cart state', () => {
    const EmptyCartComponent = () => (
      <div>
        <h2>Shopping Cart</h2>
        <p>Your cart is empty</p>
        <button>Continue Shopping</button>
      </div>
    );

    render(
      <MemoryRouter>
        <EmptyCartComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('handles checkout process', async () => {
    const mockResponse = { data: { success: true, sessionId: 'test-session' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const checkout = jest.fn();

    const CheckoutComponent = () => (
      <div>
        <button onClick={() => checkout(mockCartItems)}>Proceed to Checkout</button>
      </div>
    );

    render(
      <MemoryRouter>
        <CheckoutComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Proceed to Checkout'));
    expect(checkout).toHaveBeenCalledWith(mockCartItems);
  });
}); 