// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface FileImgDownloadReq_Type {
  file_path: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface FileImgDownloadRes_Type {
  error?: PTPCommon.ERR;
  file_data?: Buffer;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface FileImgUploadReq_Type {
  file_id: string;
  file_part: number;
  file_total_parts: number;
  file_data: Buffer;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface FileImgUploadRes_Type {
  error?: PTPCommon.ERR;
  file_path: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
