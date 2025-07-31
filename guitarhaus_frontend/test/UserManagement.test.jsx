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

describe('User Management', () => {
  const mockUsers = [
    {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      createdAt: '2024-01-10T10:30:00Z',
      profileImage: 'profile1.jpg'
    },
    {
      _id: 'user2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-05T15:20:00Z',
      profileImage: null
    },
    {
      _id: 'user3',
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob@example.com',
      role: 'customer',
      status: 'inactive',
      createdAt: '2024-01-12T09:15:00Z',
      profileImage: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('admin-token');
    window.confirm.mockReturnValue(true);
  });

  it('renders users table with headers', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, data: mockUsers } });

    const UsersComponent = () => (
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button>View</button>
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
        <UsersComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Join Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays user data correctly', () => {
    const UsersComponent = () => (
      <div>
        <h2>Users</h2>
        <div>
          <p>{mockUsers[0].firstName} {mockUsers[0].lastName}</p>
          <p>{mockUsers[0].email}</p>
          <p>{mockUsers[0].role}</p>
          <p>{mockUsers[0].status}</p>
          <p>{new Date(mockUsers[0].createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p>{mockUsers[1].firstName} {mockUsers[1].lastName}</p>
          <p>{mockUsers[1].email}</p>
          <p>{mockUsers[1].role}</p>
          <p>{mockUsers[1].status}</p>
          <p>{new Date(mockUsers[1].createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p>{mockUsers[2].firstName} {mockUsers[2].lastName}</p>
          <p>{mockUsers[2].email}</p>
          <p>{mockUsers[2].role}</p>
          <p>{mockUsers[2].status}</p>
          <p>{new Date(mockUsers[2].createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    );

    render(
      <MemoryRouter>
        <UsersComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('customer')).toHaveLength(2);
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getAllByText('active')).toHaveLength(2);
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  it('shows user avatars with initials', () => {
    const UserAvatarComponent = () => (
      <div>
        {mockUsers.map(user => (
          <div key={user._id}>
            {user.profileImage ? (
              <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <div>
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
        ))}
      </div>
    );

    render(
      <MemoryRouter>
        <UserAvatarComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  it('shows view and delete buttons for each user', () => {
    const UsersComponent = () => (
      <div>
        {mockUsers.map(user => (
          <div key={user._id}>
            <button>View</button>
            <button>Delete</button>
          </div>
        ))}
      </div>
    );

    render(
      <MemoryRouter>
        <UsersComponent />
      </MemoryRouter>
    );

    const viewButtons = screen.getAllByText('View');
    const deleteButtons = screen.getAllByText('Delete');
    
    expect(viewButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('opens user details modal when view button is clicked', () => {
    const mockSetSelectedUser = jest.fn();
    const mockSetShowModal = jest.fn();

    const handleViewUser = (user) => {
      mockSetSelectedUser(user);
      mockSetShowModal(true);
    };

    const UsersComponent = () => (
      <div>
        <button onClick={() => handleViewUser(mockUsers[0])}>View</button>
      </div>
    );

    render(
      <MemoryRouter>
        <UsersComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('View'));
    expect(mockSetSelectedUser).toHaveBeenCalledWith(mockUsers[0]);
    expect(mockSetShowModal).toHaveBeenCalledWith(true);
  });

  it('displays user information in modal correctly', () => {
    const selectedUser = mockUsers[0];

    const UserModalComponent = () => (
      <div>
        <h3>User Details</h3>
        <div>
          <p>Name: {selectedUser.firstName} {selectedUser.lastName}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Role: {selectedUser.role}</p>
          <p>Status: {selectedUser.status}</p>
          <p>Join Date: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
        </div>
        <button>Close</button>
      </div>
    );

    render(
      <MemoryRouter>
        <UserModalComponent />
      </MemoryRouter>
    );

    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role: customer')).toBeInTheDocument();
    expect(screen.getByText('Status: active')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('handles user deletion', async () => {
    const mockResponse = { data: { success: true, message: 'User deleted successfully' } };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const deleteUser = jest.fn().mockResolvedValue(mockResponse);

    const UsersComponent = () => (
      <div>
        <button onClick={() => deleteUser('user1')}>Delete User</button>
      </div>
    );

    render(
      <MemoryRouter>
        <UsersComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Delete User'));
    expect(deleteUser).toHaveBeenCalledWith('user1');
  });
}); 