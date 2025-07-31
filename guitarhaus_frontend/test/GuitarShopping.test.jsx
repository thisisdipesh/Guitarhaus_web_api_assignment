import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import GuitarCard from '../src/components/common/customer/GuitarCard';

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

describe('Guitar Shopping System', () => {
  const mockGuitar = {
    _id: '1',
    name: 'Acoustic Guitar',
    brand: 'Fender',
    price: 2500,
    description: 'Beautiful acoustic guitar',
    images: ['guitar1.jpg'],
    category: 'Acoustic',
    rating: 4.5,
    numReviews: 10,
    countInStock: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');
  });

  describe('GuitarCard Component', () => {
    it('renders guitar information correctly', () => {
      render(
        <MemoryRouter>
          <GuitarCard guitarData={mockGuitar} />
        </MemoryRouter>
      );

      expect(screen.getByText('Acoustic Guitar')).toBeInTheDocument();
      expect(screen.getByText('Fender')).toBeInTheDocument();
      expect(screen.getByText('₹2,500')).toBeInTheDocument();
      expect(screen.getByText('Beautiful acoustic guitar')).toBeInTheDocument();
    });

    it('displays guitar image', () => {
      render(
        <MemoryRouter>
          <GuitarCard guitarData={mockGuitar} />
        </MemoryRouter>
      );

      const guitarImage = screen.getByAltText('Acoustic Guitar');
      expect(guitarImage).toBeInTheDocument();
      expect(guitarImage.src).toContain('guitar1.jpg');
    });

    it('shows view details button', () => {
      render(
        <MemoryRouter>
          <GuitarCard guitarData={mockGuitar} />
        </MemoryRouter>
      );

      expect(screen.getByRole('link', { name: /view details/i })).toBeInTheDocument();
    });

    it('handles view details navigation', () => {
      render(
        <MemoryRouter>
          <GuitarCard guitarData={mockGuitar} />
        </MemoryRouter>
      );

      const viewDetailsLink = screen.getByRole('link', { name: /view details/i });
      expect(viewDetailsLink).toHaveAttribute('href', '/guitars/1');
    });

    it('shows category badge', () => {
      render(
        <MemoryRouter>
          <GuitarCard guitarData={mockGuitar} />
        </MemoryRouter>
      );

      expect(screen.getByText('Acoustic')).toBeInTheDocument();
    });
  });
}); 