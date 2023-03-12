export const jwtAccess = 'jwtAccess';
export const jwtRefresh = 'jwtRefresh';

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
