// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface BuddyGetALLReq_Type {
  buddy_updated_time: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyGetALLRes_Type {
  buddy_updated_time: number;
  error: PTPCommon.ERR;
  buddy_list?: PTPCommon.UserInfo_Type[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyGetListReq_Type {
  user_ids?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyGetListRes_Type {
  error: PTPCommon.ERR;
  buddy_list?: PTPCommon.UserInfo_Type[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyGetStatReq_Type {
  user_ids?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyGetStatRes_Type {
  error: PTPCommon.ERR;
  user_stat_list?: PTPCommon.UserStat[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyModifyNotify_Type {
  buddy_modify_action: PTPCommon.BuddyModifyAction;
  uid: number;
  value: string;
}
export interface BuddyModifyReq_Type {
  buddy_modify_action: PTPCommon.BuddyModifyAction;
  value: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyModifyRes_Type {
  error: PTPCommon.ERR;
  buddy_modify_action: PTPCommon.BuddyModifyAction;
  value: string;
  notify_pairs?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface BuddyModifyUpdatePair_Type {
  pair_uid_list?: number[];
  auth_uid: number;
}
export interface BuddyStatNotify_Type {
  user_stat: PTPCommon.UserStat;
}
