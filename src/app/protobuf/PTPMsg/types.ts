// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface MsgGetByIdsReq_Type {
  group_id: number;
  msg_ids?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgGetByIdsRes_Type {
  group_id?: number;
  msg_list?: PTPCommon.MsgInfo_Type[];
  error?: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgGetMaxIdReq_Type {
  group_id: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgGetMaxIdRes_Type {
  group_id: number;
  msg_id: number;
  error?: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgNotify_Type {
  msg_info: PTPCommon.MsgInfo_Type;
  notify_users?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgReadAckReq_Type {
  group_id: number;
  msg_id: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgReadNotify_Type {
  group_id: number;
  from_uid: number;
  notify_users?: number[];
  msg_id: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgReq_Type {
  group_adr: string;
  sent_at: number;
  msg_type: PTPCommon.MsgType;
  msg_data?: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgRes_Type {
  group_id?: number;
  msg_id?: number;
  sent_at?: number;
  error?: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface MsgUnNotify_Type {
  un_notify_users?: number[];
  sent_at: number;
  group_id: number;
  from_uid: number;
}
