// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface FileImgUploadReq_Type {
  width: number;
  height: number;
  file_data: Buffer;
  file_type: string;
  file_group: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface FileImgUploadRes_Type {
  error?: PTPCommon.ERR;
  file_path: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
