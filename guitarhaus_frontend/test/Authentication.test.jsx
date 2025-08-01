import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../src/components/public/Login';
import Register from '../src/components/public/Register';
import axios from 'axios';

jest.mock('axios');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Authentication System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Login Component', () => {
    it('renders login form with all required elements', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('handles successful login', async () => {
      const mockResponse = { data: { success: true, token: 'test-token', user: { role: 'customer' } } };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/v1/customers/login',
          {
            email: 'test@example.com',
            password: 'password123',
          }
        );
      });
    });
  });

  describe('Register Component', () => {
    it('renders registration form with all required elements', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.getByText('Create an Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('123-456-7890')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    });

    it('handles successful registration', async () => {
      const mockResponse = { data: { success: true, message: 'Registration successful' } };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('123-456-7890'), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/v1/customers/register',
          {
            fname: 'John',
            lname: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            password: 'password123',
            confirmPassword: 'password123',
          }
        );
      });
    });
  });
}); 