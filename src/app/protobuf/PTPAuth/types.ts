// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface AuthCaptchaReq_Type {}
export interface AuthCaptchaRes_Type {
  captcha: string;
  address: Buffer;
  iv: Buffer;
  aad: Buffer;
  sign: Buffer;
  error: PTPCommon.ERR;
}
export interface AuthLoginReq_Type {
  address: string;
  captcha: string;
  client_type: PTPCommon.ClientType;
  client_version?: string;
  sign: Buffer;
}
export interface AuthLoginRes_Type {
  error: PTPCommon.ERR;
  user_info?: PTPCommon.UserInfo_Type;
}
export interface AuthLogoutReq_Type {}
export interface AuthLogoutRes_Type {
  error: PTPCommon.ERR;
}
