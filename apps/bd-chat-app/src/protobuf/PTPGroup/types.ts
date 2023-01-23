// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface GroupChangeMemberNotify_Type {
  group_member_modify_action: PTPCommon.GroupMemberModifyAction;
  group_id: number;
  members_chang?: string[];
}
export interface GroupChangeMemberReq_Type {
  group_member_modify_action: PTPCommon.GroupMemberModifyAction;
  group_id: number;
  members?: string[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupChangeMemberRes_Type {
  group_member_modify_action: PTPCommon.GroupMemberModifyAction;
  group_id: number;
  members_chang?: string[];
  error: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupCreateReq_Type {
  group_idx: number;
  sign: Buffer;
  captcha: string;
  group_type: PTPCommon.GroupType;
  name?: string;
  avatar?: string;
  members?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupCreateRes_Type {
  group?: PTPCommon.GroupInfo_Type;
  group_members?: PTPCommon.GroupMember_Type[];
  error: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupGetListReq_Type {
  group_info_updated_time: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupGetListRes_Type {
  group_info_updated_time: number;
  groups?: PTPCommon.GroupInfo_Type[];
  error: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupGetMembersListReq_Type {
  group_members_updated_time: number;
  group_id: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupGetMembersListRes_Type {
  group_members_updated_time: number;
  group_id: number;
  members?: PTPCommon.UserInfo_Type[];
  group_members?: PTPCommon.GroupMember_Type[];
  error: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupModifyNotify_Type {
  group_modify_action: PTPCommon.GroupModifyAction;
  group_id: number;
  value: string;
}
export interface GroupModifyReq_Type {
  group_modify_action: PTPCommon.GroupModifyAction;
  group_id: number;
  value: string;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupModifyRes_Type {
  group_modify_action: PTPCommon.GroupModifyAction;
  value: string;
  group_id: number;
  error: PTPCommon.ERR;
  notify_members?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupPreCreateReq_Type {
  group_type: PTPCommon.GroupType;
  members?: number[];
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupPreCreateRes_Type {
  group_adr?: string;
  group_idx: number;
  error: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupRemoveSessionNotify_Type {
  group_id: number;
  from_uid: number;
}
export interface GroupRemoveSessionReq_Type {
  group_id: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupRemoveSessionRes_Type {
  error: PTPCommon.ERR;
  group_id: number;
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupUnreadMsgReq_Type {
  attach_data?: Buffer;
  auth_uid?: number;
}
export interface GroupUnreadMsgRes_Type {
  unread_list?: PTPCommon.MsgInfo_Type[];
  unread_cnt: number;
  error: PTPCommon.ERR;
  attach_data?: Buffer;
  auth_uid?: number;
}
