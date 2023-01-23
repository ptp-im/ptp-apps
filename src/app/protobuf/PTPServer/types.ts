// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface ServerLoginReq_Type {
  address: string;
  captcha: string;
  sign: Buffer;
  attach_data?: Buffer;
}
export interface ServerLoginRes_Type {
  error: PTPCommon.ERR;
  user_info?: PTPCommon.UserInfo_Type;
  attach_data?: Buffer;
}
