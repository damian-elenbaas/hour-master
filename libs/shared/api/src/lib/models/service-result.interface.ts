export interface IServiceResult<T> {
  data: T | null;
  success: boolean;
  message: string;
}
