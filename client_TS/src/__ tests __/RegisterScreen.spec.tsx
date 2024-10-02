import { render, fireEvent } from '@testing-library/react';
import RegisterScreen from '../components/registerScreen/registerScreen';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

test('shows error message if form fields are empty on registration', () => {
  const { getByLabelText, getByRole } = render(
    <MemoryRouter>
      <RegisterScreen />
    </MemoryRouter>
  );

  const registerButton = getByRole('button', { name: /Register/i });
  fireEvent.click(registerButton);

  expect(getByLabelText(/Name/i)).toHaveAttribute('aria-invalid', 'false');
  expect(getByLabelText(/Email/i)).toHaveAttribute('aria-invalid', 'false');
  expect(getByLabelText(/Password/i)).toHaveAttribute('aria-invalid', 'false');
});
