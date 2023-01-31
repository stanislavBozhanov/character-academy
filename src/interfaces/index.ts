export const responseSuccess = 'SUCCESS';
export const responseFail = 'FAIL';
export type ResponseStatus = 'FAIL' | 'SUCCESS';

export interface ResponseData {
  status: ResponseStatus;
  error: Object;
  data: Object;
}
