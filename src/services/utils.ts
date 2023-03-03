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

// Fetch wrapper expects that we have an token stored in session storage
export const fetchWrapper = () => {
  // const [token, setToken] = useState(async () => {
  //   const accessToken = sessionStorage.getItem('accessToken');
  //   const refreshToken = sessionStorage.getItem('refreshToken');
  //   if (!accessToken) {
  //     try {
  //       const response = await fetch(serverRoutes.tokenRefresh, {
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         method: 'POST',
  //         body: JSON.stringify({ email, token }),
  //       });
  //     }

  //   }
  //  // implement access and refresh logic
  //   const setToken = () => sessionStorage.setItem('');
  //   return [token, setToken];
  // });

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
    const [user, setUser] = myLocalStorage('user');
    const refreshToken = sessionStorage.getItem('refreshToken');

    const [data, error] = await handledFetch(serverRoutes.tokenRefresh, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ email: user.email, refreshToken: refreshToken }),
    });

    if (error) {
      throw new Error(`${error.message}/nCannot get new token!`); // TODO gotta figure some decent error handling
    }

    // TODO make a second check for bad response codes

    const { accessToken: newAccsess, refreshToken: newRefresh } = await data.json();
    sessionStorage.setItem('accessToken', newAccsess);
    sessionStorage.setItem('refreshToken', newRefresh);
  }

  function request(method: httpMethod) {
    return async (url: string, body: object): Promise<any> => {
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

  function handleResponse(response: Response, method?: httpMethod, url?: string, body?: object): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      // accessToken expired
      const navigate = useNavigate();
      if (response.status === 401) {
        try {
          console.log('Set new tokens');
          await setNewTokens();
        } catch (error) {
          console.error(error);
          localStorage.setItem('user', null);
          navigate('/login');
        }

        return request(method)(url, body);
      }

      if (!response.ok) {
        throw new Error('....-');
      }
    });

    // return response.text().then((text) => {
    //   const data = text && JSON.parse(text);

    //   if (!response.ok) {
    //     if ([401, 403].includes(response.status) && auth?.token) {
    //       // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    //       localStorage.removeItem('user');
    //       setAuth(null);
    //       history.push('/login');
    //     }

    //     const error = (data && data.message) || response.statusText;
    //     return Promise.reject(error);
    //   }

    //   return data;
    // });
  }
};

export const fetchGet = (url: string, body: object) => fetchWrapper().get(url, body);
export const fetchPost = (url: string, body: object) => fetchWrapper().post(url, body);
export const fetchPut = (url: string, body: object) => fetchWrapper().put(url, body);
export const fetchDelete = (url: string, body: object) => fetchWrapper().delete(url, body);
