import { ResponseData } from '../interfaces/index';
import { serverRoutes } from './routes';

const createErrorResponse = (error: Object) => {
  const result: ResponseData = {
    status: 'FAIL',
    error: error,
    data: null,
  };
  return result;
};

const createSuccessResponse = (data: Object) => {
  const result: ResponseData = {
    status: 'SUCCESS',
    error: null,
    data: data,
  };
  return result;
};

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

const handledFetch = async (resource: string, options?: Object) => {
  try {
    const data = await fetch(resource, options);
    return [data, null];
  } catch (error) {
    console.error(error); // TODO Would be nice to have some error pop ups like toasty
    return [null, error];
  }
};

export const handleLogin = async (email: string, password: string) => {
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
  const { accessToken, refreshToken } = jsonData;

  setAccessJwtToken(accessToken);
  setRefreshJwtToken(refreshToken);

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
  debugger;
  if (error) {
    return createErrorResponse(error);
  }

  const jsonData = await response.json();
  return createSuccessResponse(jsonData);
};
