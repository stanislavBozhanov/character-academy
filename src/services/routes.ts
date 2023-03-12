const serverUrl = 'http://localhost:4000';

const serverRoute = (name: string | URL): string => {
  return new URL(name, serverUrl).href;
};

export const serverRoutes = {
  login: serverRoute('login'),
  register: serverRoute('register'),
  tokenRefresh: serverRoute('refresh-token'),
  test: serverRoute('test-api'),
};

export const clientRoutes = {
  login: 'login',
  register: 'register',
  addWorkout: 'add-workout',
  history: 'history',
  dashboard: '/',
  error: 'error',
};
