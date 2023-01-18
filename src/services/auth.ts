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
  const response = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // handle error from the backend
  const { accessToken, refreshToken } = await response.json();

  setAccessJwtToken(accessToken);
  setRefreshJwtToken(refreshToken);
};

export const handleRegister = async (email: string, password: string, username: string) => {
  const response = await fetch('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });

  if (response.ok) {
    // redirect to login?
  } else {
    // return error
  }
};
