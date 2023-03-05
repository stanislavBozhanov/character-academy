import { serverRoutes } from './routes';
import { createErrorResponse, createSuccessResponse, handledFetch } from './utils';

export const jwtAccess = 'jwtAccess';
export const jwtRefresh = 'jwtRefresh';

export const handleLogin = async (email: string, password: string) => {
  // handle login to return successful data so another function can save it
  const [response, error] = await handledFetch(serverRoutes.login, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (error) {
    return createErrorResponse(error);
  }

  const jsonData = await response.json();
  return createSuccessResponse(jsonData);
};

export const handleRegister = async (email: string, password: string, username: string) => {
  const [response, error] = await handledFetch(serverRoutes.register, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });

  if (error) {
    return createErrorResponse(error);
  }

  const jsonData = await response.json();
  return createSuccessResponse(jsonData);
};

export const getAccessJwtToken = (): string => {
  return sessionStorage.getItem(jwtAccess);
};

export const setAccessJwtToken = (token: string): void => {
  sessionStorage.setItem(jwtAccess, token);
};

export const getRefreshJwtToken = (): string => {
  return sessionStorage.getItem(jwtRefresh);
};

export const setRefreshJwtToken = (token: string): void => {
  sessionStorage.setItem(jwtRefresh, token);
};

export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem('user');
  const accessToken = getAccessJwtToken();
  const refreshToken = getRefreshJwtToken();

  return user && !!accessToken && !!refreshToken;
};
