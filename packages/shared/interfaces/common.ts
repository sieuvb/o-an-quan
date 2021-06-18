import { SocketResponseStatus } from '../enums';

export interface ISocketResponse<T = any> {
  status: SocketResponseStatus;
  data: T;
}
