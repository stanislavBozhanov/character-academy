import { useNavigate } from 'react-router-dom';
import { httpMethod, APIResponse } from '../interfaces/index';
import { serverRoutes } from './routes';

export const myLocalStorage = (key: string, defaultValue: Object = null) => {
  let storedValue;
  try {
    const item = localStorage.getItem(key);
    storedValue = item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // TODO log errors somewhere
    console.error(error);
    storedValue = defaultValue;
  }

  const setValue = (newValue: Object) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const createErrorResponse = (error: Object) => {
  const result: APIResponse = {
    status: 'FAIL',
    error: error,
    data: null,
  };
  return result;
};

export const createSuccessResponse = (data: Object) => {
  const result: APIResponse = {
    status: 'SUCCESS', // probably useless status
    error: null,
    data: data,
  };
  return result;
};

export const headers = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

export const handledFetch = async (resource: string, options?: Object) => {
  try {
    const data = await fetch(resource, options);
    return [data, null];
  } catch (error) {
    console.error(error); // TODO Would be nice to have some error pop ups like toasty
    return [null, error];
  }
};

// Fetch wrapper expects that we have an token stored in session storage for auth
// If not so tries to get a new token
const fetchWrapper = () => {
  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
  };

  function authHeader() {
    // TODO: For extra security I can check if the url we are requesting belongs to our API
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      return new Headers({ Authorization: `Bearer ${accessToken}` });
    }
    return new Headers({});
  }

  /*
  1. Hit server with expired jwt access
  2. Server return 401
  3. Hit server refresh endpoint with refresh jwt
  4 Sever returns new access and refresh token 
  5. Client saves them and repeats the initial request
  
  */
  async function setNewTokens() {
    const [user, _] = myLocalStorage('user');
    const refreshToken = sessionStorage.getItem('refreshToken');

    if (!user || !refreshToken) {
      throw new Error('Missing user or refresh token!');
    }

    const [data, error] = await handledFetch(serverRoutes.tokenRefresh, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email: user.email, refreshToken: refreshToken }),
    });

    // Error or codes different than 2XX
    if (error || !data.ok) {
      throw new Error(`${error.message}/nCannot get new token!`); // TODO gotta figure some decent error handling
    }

    const { accessToken: newAccsess, refreshToken: newRefresh } = await data.json();
    sessionStorage.setItem('accessToken', newAccsess);
    sessionStorage.setItem('refreshToken', newRefresh);
  }

  function request(method: httpMethod) {
    return async (url: string, body?: object): Promise<any> => {
      const requestOptions: any = {
        method,
        headers: authHeader(),
      };
      if (body) {
        requestOptions.headers.append('Content-Type', 'application/json');
        requestOptions.body = JSON.stringify(body);
      }

      // TODO До тук си стигнал. Трябва да разбереш как да го хенлънеш с грешки и тн
      try {
        const response = await fetch(url, requestOptions); // handle error?
        return handleResponse(response, method, url, body);
      } catch (error) {
        return Promise.reject(error);
      }
    };
  }

  async function handleResponse(response: Response, method?: httpMethod, url?: string, body?: object): Promise<Object> {
    const navigate = useNavigate();

    // accessToken expired
    if (response.status === 401) {
      try {
        console.log('Set new tokens');
        await setNewTokens();
      } catch (error) {
        console.error(error);
        localStorage.setItem('user', null);
        navigate('/login');
        return Promise.reject({ error: { message: 'Unable to fetch fresh tokens!' } });
      }

      return request(method)(url, body);
    }

    // Response.ok is true for codes between 200 and 299
    if (response.ok) {
      return Promise.resolve(response);
    }

    return Promise.reject({ error: { message: 'Problem with server response' } });
  }
};

export const fetchGet = (url: string, body?: object) => fetchWrapper().get(url, body);
export const fetchPost = (url: string, body?: object) => fetchWrapper().post(url, body);
export const fetchPut = (url: string, body?: object) => fetchWrapper().put(url, body);
export const fetchDelete = (url: string, body?: object) => fetchWrapper().delete(url, body);
