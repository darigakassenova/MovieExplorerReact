import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login'

test('renders login page', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText(/Email or username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('handles user login', async () => {
  const mockLogin = jest.fn();
  render(<Login onLogin={mockLogin} />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/Email or username/i), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
});
