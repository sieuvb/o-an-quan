import { SocketResponseStatus, StepAction } from '../enums';
import { IMoveStep } from './entities';

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

export interface ICursorPayload extends Partial<IMoveStep> {
  top: number;
  left: number;
}
