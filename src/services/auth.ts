import { serverRoutes } from './routes';

export const getAccessJwtToken = () => {
  return sessionStorage.getItem('jwtAccess');
};

export const setAccessJwtToken = (token: string) => {
  sessionStorage.setItem('jwtAccess', token);
};

export const getRefreshJwtToken = () => {
  return sessionStorage.getItem('jwtRefresh');
};

export const setRefreshJwtToken = (token: string) => {
  sessionStorage.setItem('jwtRefresh', token);
};

export const handleLogin = async (email: string, password: string) => {
  const response = await fetch(serverRoutes.login, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // handle error from the backend
  const { accessToken, refreshToken } = await response.json();

  setAccessJwtToken(accessToken);
  setRefreshJwtToken(refreshToken);
};

export const handleRegister = async (email: string, password: string, username: string) => {
  const response = await fetch(serverRoutes.register, {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
  debugger;

  return response;
};
