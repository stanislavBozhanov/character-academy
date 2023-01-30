const serverUrl = 'http://localhost:4000';

const serverRoute = (name: string | URL): string => {
  return new URL(name, serverUrl).href;
};

export const serverRoutes = {
  login: serverRoute('login'),
  register: serverRoute('register'),
};

export const clientRoutes = {
  login: 'login',
  register: 'register',
  history: 'history',
  dashboard: '/',
};
