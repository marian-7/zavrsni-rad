import { AxiosResponse } from "axios";

export function mapData<T>(res: AxiosResponse<T>) {
  return res.data;
}
