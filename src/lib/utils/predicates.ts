import axios, { type AxiosError } from "axios";

// Type safe unknown | any axios responses
export function isAxiosError<ResponseType>(
  error: unknown,
): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error);
}
