import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { Login } from '../Login';

jest.mock('axios');

describe('Test Login Page', () => {
  let component;
  let username;
  let password;
  let onLoginUserMock;
  let onPushMock;
  let userDetails;
  beforeEach(() => {
    jest.clearAllMocks();
    username = 'fake-username';
    password = 'fake-password';
    userDetails = {
      username,
      fullname: 'fake-fullname',
    };
    onLoginUserMock = jest.fn();
    onPushMock = jest.fn();
  });

  test('login successfully', async () => {
    axios.post = jest.fn().mockResolvedValueOnce({ data: userDetails });

    component = render(<Login loginUser={onLoginUserMock} push={onPushMock} />);

    const usernameInput = component.container.querySelector('#username');
    userEvent.type(usernameInput, username);
    const passwordInput = component.container.querySelector('#password');
    userEvent.type(passwordInput, password);
    const submitBtn = screen.queryByText('Login');
    submitBtn.click();

    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith('http://localhost:3001/api/login', {
      username,
      password,
    });

    await waitFor(() => {
      expect(screen.getByTestId('submitting-progress')).toBeInTheDocument();
    });
    expect(onLoginUserMock).toBeCalledTimes(1);
    expect(onLoginUserMock).toBeCalledWith(userDetails);
    expect(onPushMock).toBeCalledTimes(1);
    expect(onPushMock).toBeCalledWith('/');
  });

  test('login failed', async () => {
    axios.post = jest.fn().mockRejectedValueOnce('something-wrong');

    component = render(<Login loginUser={onLoginUserMock} push={onPushMock} />);

    const usernameInput = component.container.querySelector('#username');
    userEvent.type(usernameInput, username);
    const passwordInput = component.container.querySelector('#password');
    userEvent.type(passwordInput, password);
    const submitBtn = screen.queryByText('Login');
    submitBtn.click();

    expect(axios.post).toBeCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('submitting-progress')).toBeInTheDocument();
    });
    expect(onLoginUserMock).toBeCalledTimes(0);
    expect(onPushMock).toBeCalledTimes(0);
    expect(screen.getByText('Login Failed!')).toBeInTheDocument();
  });
});
