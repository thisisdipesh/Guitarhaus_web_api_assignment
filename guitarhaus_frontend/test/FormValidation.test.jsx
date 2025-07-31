import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

describe('Form Validation and Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Email Validation', () => {
    it('validates correct email format', () => {
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('shows email validation error', () => {
      const EmailFormComponent = () => {
        const [email, setEmail] = React.useState('');
        const [emailError, setEmailError] = React.useState('');

        const handleEmailChange = (value) => {
          setEmail(value);
          if (!value) {
            setEmailError('Email is required');
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Please enter a valid email address');
          } else {
            setEmailError('');
          }
        };

        return (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Email"
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <EmailFormComponent />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });

  describe('Password Validation', () => {
    it('validates password strength', () => {
      const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
          errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
          errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
          errors.push('Password must contain at least one number');
        }
        
        return errors;
      };

      expect(validatePassword('weak')).toContain('Password must be at least 8 characters long');
      expect(validatePassword('password123')).toContain('Password must contain at least one uppercase letter');
      expect(validatePassword('PASSWORD123')).toContain('Password must contain at least one lowercase letter');
      expect(validatePassword('Password')).toContain('Password must contain at least one number');
      expect(validatePassword('StrongPass123')).toHaveLength(0);
    });

    it('shows password strength indicator', () => {
      const PasswordFormComponent = () => {
        const [password, setPassword] = React.useState('');
        const [strength, setStrength] = React.useState('');

        const checkPasswordStrength = (pass) => {
          let score = 0;
          if (pass.length >= 8) score++;
          if (/[A-Z]/.test(pass)) score++;
          if (/[a-z]/.test(pass)) score++;
          if (/\d/.test(pass)) score++;
          if (/[^A-Za-z0-9]/.test(pass)) score++;

          if (score < 2) return 'Weak';
          if (score < 4) return 'Medium';
          return 'Strong';
        };

        const handlePasswordChange = (value) => {
          setPassword(value);
          setStrength(checkPasswordStrength(value));
        };

        return (
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Password"
            />
            {password && <p className={`strength ${strength.toLowerCase()}`}>{strength}</p>}
          </div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PasswordFormComponent />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      expect(screen.getByText('Weak')).toBeInTheDocument();

      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });

  describe('Required Field Validation', () => {
    it('validates required fields', () => {
      const validateRequired = (value, fieldName) => {
        if (!value || value.trim() === '') {
          return `${fieldName} is required`;
        }
        return '';
      };

      expect(validateRequired('', 'Name')).toBe('Name is required');
      expect(validateRequired('   ', 'Name')).toBe('Name is required');
      expect(validateRequired('John', 'Name')).toBe('');
    });

    it('shows required field errors', () => {
      const RequiredFormComponent = () => {
        const [formData, setFormData] = React.useState({
          firstName: '',
          lastName: '',
          email: ''
        });
        const [errors, setErrors] = React.useState({});

        const validateForm = () => {
          const newErrors = {};
          
          if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
          }
          if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
          }
          if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
          }
          
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e) => {
          e.preventDefault();
          validateForm();
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="First Name"
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
            
            <input
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
            
            <input
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
            
            <button type="submit">Submit</button>
          </form>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RequiredFormComponent />
          </MemoryRouter>
        </QueryClientProvider>
      );

      fireEvent.click(screen.getByText('Submit'));
      
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  describe('API Error Handling', () => {
    it('handles network errors', async () => {
      axios.post.mockRejectedValueOnce({ 
        message: 'Network Error',
        code: 'NETWORK_ERROR'
      });

      const handleApiError = (error) => {
        if (error.code === 'NETWORK_ERROR') {
          return 'Network connection failed. Please check your internet connection.';
        }
        return 'An unexpected error occurred. Please try again.';
      };

      const ErrorComponent = () => {
        const [error, setError] = React.useState('');

        const testApiCall = async () => {
          try {
            await axios.post('/api/test');
          } catch (err) {
            setError(handleApiError(err));
          }
        };

        return (
          <div>
            <button onClick={testApiCall}>Test API</button>
            {error && <p className="error">{error}</p>}
          </div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ErrorComponent />
          </MemoryRouter>
        </QueryClientProvider>
      );

      fireEvent.click(screen.getByText('Test API'));

      await waitFor(() => {
        expect(screen.getByText('Network connection failed. Please check your internet connection.')).toBeInTheDocument();
      });
    });

    it('handles validation errors from API', async () => {
      const mockValidationError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: {
              email: 'Email already exists',
              password: 'Password is too weak'
            }
          }
        }
      };

      axios.post.mockRejectedValueOnce(mockValidationError);

      const ValidationErrorComponent = () => {
        const [errors, setErrors] = React.useState({});

        const handleApiError = (error) => {
          if (error.response?.status === 400 && error.response?.data?.errors) {
            setErrors(error.response.data.errors);
          }
        };

        const testApiCall = async () => {
          try {
            await axios.post('/api/register');
          } catch (err) {
            handleApiError(err);
          }
        };

        return (
          <div>
            <button onClick={testApiCall}>Register</button>
            {errors.email && <p className="error">{errors.email}</p>}
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ValidationErrorComponent />
          </MemoryRouter>
        </QueryClientProvider>
      );

      fireEvent.click(screen.getByText('Register'));

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
        expect(screen.getByText('Password is too weak')).toBeInTheDocument();
      });
    });
  });
}); 