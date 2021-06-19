import { SocketResponseStatus } from '../enums';

export interface ISocketResponsePayload<
  SuccessResponse = any,
  ErrorResponse = any
> {
  status: SocketResponseStatus;
  data: SuccessResponse;
  error: ErrorResponse;
}

export interface ISocketResponse<SuccessResponse = any, ErrorResponse = any> {
  event: string;
  roomId?: string;
  payload: ISocketResponsePayload<SuccessResponse, ErrorResponse>;
}
