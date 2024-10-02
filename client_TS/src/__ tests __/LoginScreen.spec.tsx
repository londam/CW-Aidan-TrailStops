import { render, fireEvent } from '@testing-library/react';
import LoginScreen from '../components/loginScreen/loginScreen';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

test('show errors if the form fields are empty', () => {
  const { getByText } = render(
    <MemoryRouter>
      <LoginScreen />
    </MemoryRouter>
  );

  const loginButton = getByText('Login');
  fireEvent.click(loginButton);

  expect(getByText(/Email is required/)).toBeInTheDocument();
  expect(getByText(/Password is required/)).toBeInTheDocument();
});
