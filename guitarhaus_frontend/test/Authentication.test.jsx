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

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
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

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/v1/auth/login',
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

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
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
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Phone'), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/v1/auth/register',
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            password: 'password123',
          }
        );
      });
    });
  });
}); 