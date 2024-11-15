export interface BaseResponse<T> {
  data: T;
  error: string;
  success: boolean;
  message: string;
}
