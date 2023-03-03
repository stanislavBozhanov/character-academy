export const responseSuccess = 'SUCCESS';
export const responseFail = 'FAIL';
export type ResponseStatus = 'FAIL' | 'SUCCESS';
export type httpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface APIResponse {
  status: ResponseStatus;
  error: string | Object;
  data: any;
}

export interface LoginResponse extends Omit<APIResponse, 'data'> {
  data: {
    user: Object;
    accessToken: string;
    refreshToken: string;
  };
}
