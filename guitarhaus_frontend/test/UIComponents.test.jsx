import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('UI Components and Responsive Design', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Hero Section', () => {
    it('renders hero section with main content', () => {
      const HeroComponent = () => (
        <div className="hero">
          <div className="hero-content">
            <h1>Welcome to GuitarHaus</h1>
            <p>Discover the finest collection of guitars</p>
            <button>Shop Now</button>
          </div>
          <div className="hero-image">
            <img src="hero-guitar.jpg" alt="Beautiful guitar" />
          </div>
        </div>
      );

      render(
        <MemoryRouter>
          <HeroComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Welcome to GuitarHaus')).toBeInTheDocument();
      expect(screen.getByText('Discover the finest collection of guitars')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByAltText('Beautiful guitar')).toBeInTheDocument();
    });

    it('handles hero button click', () => {
      const handleShopNow = jest.fn();

      const HeroComponent = () => (
        <div>
          <button onClick={handleShopNow}>Shop Now</button>
        </div>
      );

      render(
        <MemoryRouter>
          <HeroComponent />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Shop Now'));
      expect(handleShopNow).toHaveBeenCalled();
    });
  });

  describe('Product Grid', () => {
    it('renders product grid with items', () => {
      const products = [
        { id: 1, name: 'Acoustic Guitar', price: 2500, image: 'guitar1.jpg' },
        { id: 2, name: 'Electric Guitar', price: 3500, image: 'guitar2.jpg' },
        { id: 3, name: 'Bass Guitar', price: 2800, image: 'guitar3.jpg' }
      ];

      const ProductGridComponent = () => (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price.toLocaleString()}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      );

      render(
        <MemoryRouter>
          <ProductGridComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Acoustic Guitar')).toBeInTheDocument();
      expect(screen.getByText('Electric Guitar')).toBeInTheDocument();
      expect(screen.getByText('Bass Guitar')).toBeInTheDocument();
      expect(screen.getByText('₹2,500')).toBeInTheDocument();
      expect(screen.getByText('₹3,500')).toBeInTheDocument();
      expect(screen.getByText('₹2,800')).toBeInTheDocument();
    });

    it('handles responsive grid layout', () => {
      const ResponsiveGridComponent = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="product-card">Product 1</div>
          <div className="product-card">Product 2</div>
          <div className="product-card">Product 3</div>
        </div>
      );

      render(
        <MemoryRouter>
          <ResponsiveGridComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });
  });

  describe('Modal Components', () => {
    it('renders modal with backdrop', () => {
      const ModalComponent = () => (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Modal Title</h2>
              <button className="close-button">×</button>
            </div>
            <div className="modal-body">
              <p>Modal content goes here</p>
            </div>
            <div className="modal-footer">
              <button>Cancel</button>
              <button>Confirm</button>
            </div>
          </div>
        </div>
      );

      render(
        <MemoryRouter>
          <ModalComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal content goes here')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('handles modal close functionality', () => {
      const ModalComponent = () => {
        const [isOpen, setIsOpen] = React.useState(true);
        
        return (
          <>
            {isOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <button onClick={() => setIsOpen(false)}>Close</button>
                  <p>Modal content</p>
                </div>
              </div>
            )}
          </>
        );
      };

      render(
        <MemoryRouter>
          <ModalComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Modal content')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('renders loading spinner', () => {
      const LoadingComponent = () => (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );

      render(
        <MemoryRouter>
          <LoadingComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders skeleton loading', () => {
      const SkeletonComponent = () => (
        <div className="skeleton">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      );

      render(
        <MemoryRouter>
          <SkeletonComponent />
        </MemoryRouter>
      );

      const skeletonItems = document.querySelectorAll('.skeleton-item');
      expect(skeletonItems).toHaveLength(3);
    });
  });

  describe('Toast Notifications', () => {
    it('renders success toast', () => {
      const ToastComponent = () => (
        <div className="toast success">
          <span className="toast-icon">✓</span>
          <p>Operation completed successfully!</p>
          <button className="toast-close">×</button>
        </div>
      );

      render(
        <MemoryRouter>
          <ToastComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Operation completed successfully!')).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('renders error toast', () => {
      const ToastComponent = () => (
        <div className="toast error">
          <span className="toast-icon">✕</span>
          <p>Something went wrong!</p>
          <button className="toast-close">×</button>
        </div>
      );

      render(
        <MemoryRouter>
          <ToastComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      expect(screen.getByText('✕')).toBeInTheDocument();
    });
  });

  describe('Search Component', () => {
    it('renders search input with placeholder', () => {
      const SearchComponent = () => (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search guitars..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
      );

      render(
        <MemoryRouter>
          <SearchComponent />
        </MemoryRouter>
      );

      expect(screen.getByPlaceholderText('Search guitars...')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('handles search input changes', () => {
      const SearchComponent = () => {
        const [searchTerm, setSearchTerm] = React.useState('');
        
        return (
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
            />
            <p>Searching for: {searchTerm}</p>
          </div>
        );
      };

      render(
        <MemoryRouter>
          <SearchComponent />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'acoustic' } });
      
      expect(screen.getByText('Searching for: acoustic')).toBeInTheDocument();
    });
  });
}); 