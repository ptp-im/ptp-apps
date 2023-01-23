import type { Pdu } from '../protobuf/Pdu';
import {
  AuthCaptchaRes,
  AuthLoginRes,
  AuthLogoutRes,
} from '../protobuf/PTPAuth';
import {
  BuddyGetALLRes,
  BuddyGetListRes,
  BuddyGetStatRes,
  BuddyModifyNotify,
  BuddyModifyRes,
  BuddyStatNotify,
} from '../protobuf/PTPBuddy';
import {
  SID,
  CID_AUTH,
  CID_GROUP,
  CID_MSG,
  CID_BUDDY,
  CID_FILE,
  CID_OTHER,
  CID_SWITCH,
} from '../protobuf/PTPCommon';
import { FileImgUploadRes } from '../protobuf/PTPFile';
import {
  GroupChangeMemberNotify,
  GroupChangeMemberRes,
  GroupCreateRes,
  GroupGetListRes,
  GroupGetMembersListRes,
  GroupModifyNotify,
  GroupModifyRes,
  GroupPreCreateRes,
  GroupRemoveSessionNotify,
  GroupRemoveSessionRes,
  GroupUnreadMsgRes,
} from '../protobuf/PTPGroup';
import {
  MsgRes,
  MsgGetByIdsRes,
  MsgGetMaxIdRes,
  MsgNotify,
  MsgReadNotify,
} from '../protobuf/PTPMsg';
import { HeartBeatNotify } from '../protobuf/PTPOther';
import { SwitchDevicesNotify, SwitchPtpNotify } from '../protobuf/PTPSwitch';

export const mapCidSid: any = {
  [SID.S_AUTH]: CID_AUTH,
  [SID.S_MSG]: CID_MSG,
  [SID.S_BUDDY]: CID_BUDDY,
  [SID.S_GROUP]: CID_GROUP,
  [SID.S_FILE]: CID_FILE,
  [SID.S_OTHER]: CID_OTHER,
  [SID.S_SWITCH]: CID_SWITCH,
};

export class MsgHandler {
  static handlePdu(pdu: Pdu, accountId: number): any {
    let res: any = {};
    switch (pdu.getServiceId()) {
      case SID.S_AUTH:
        switch (pdu.getCommandId()) {
          case CID_AUTH.CID_AuthCaptchaRes:
            res = AuthCaptchaRes.handlePdu(pdu, accountId);
            break;
          case CID_AUTH.CID_AuthLoginRes:
            res = AuthLoginRes.handlePdu(pdu, accountId);
            break;
          case CID_AUTH.CID_AuthLogoutRes:
            res = AuthLogoutRes.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('CID_AUTH not found cid');
            break;
        }
        break;
      case SID.S_BUDDY:
        switch (pdu.getCommandId()) {
          case CID_BUDDY.CID_BuddyGetALLRes:
            res = BuddyGetALLRes.handlePdu(pdu, accountId);
            break;
          case CID_BUDDY.CID_BuddyGetListRes:
            res = BuddyGetListRes.handlePdu(pdu, accountId);
            break;
          case CID_BUDDY.CID_BuddyGetStatRes:
            res = BuddyGetStatRes.handlePdu(pdu, accountId);
            break;
          case CID_BUDDY.CID_BuddyModifyNotify:
            res = BuddyModifyNotify.handlePdu(pdu, accountId);
            break;
          case CID_BUDDY.CID_BuddyModifyRes:
            res = BuddyModifyRes.handlePdu(pdu, accountId);
            break;
          case CID_BUDDY.CID_BuddyStatNotify:
            res = BuddyStatNotify.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('CID_BUDDY not found cid');
            break;
        }
        break;
      case SID.S_GROUP:
        switch (pdu.getCommandId()) {
          case CID_GROUP.CID_GroupGetMembersListRes:
            res = GroupGetMembersListRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupChangeMemberNotify:
            res = GroupChangeMemberNotify.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupChangeMemberRes:
            res = GroupChangeMemberRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupCreateRes:
            res = GroupCreateRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupGetListRes:
            res = GroupGetListRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupModifyNotify:
            res = GroupModifyNotify.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupModifyRes:
            res = GroupModifyRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupPreCreateRes:
            res = GroupPreCreateRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupRemoveSessionNotify:
            res = GroupRemoveSessionNotify.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupRemoveSessionRes:
            res = GroupRemoveSessionRes.handlePdu(pdu, accountId);
            break;
          case CID_GROUP.CID_GroupUnreadMsgRes:
            res = GroupUnreadMsgRes.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('CID_GROUP not found cid');
            break;
        }
        break;
      case SID.S_MSG:
        switch (pdu.getCommandId()) {
          case CID_MSG.CID_MsgNotify:
            res = MsgNotify.handlePdu(pdu, accountId);
            break;
          case CID_MSG.CID_MsgRes:
            res = MsgRes.handlePdu(pdu, accountId);
            break;
          case CID_MSG.CID_MsgGetByIdsRes:
            res = MsgGetByIdsRes.handlePdu(pdu, accountId);
            break;
          case CID_MSG.CID_MsgGetMaxIdRes:
            res = MsgGetMaxIdRes.handlePdu(pdu, accountId);
            break;
          case CID_MSG.CID_MsgReadNotify:
            res = MsgReadNotify.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('S_MSG not found cid');
            break;
        }
        break;
      case SID.S_FILE:
        switch (pdu.getCommandId()) {
          case CID_FILE.CID_FileImgUploadRes:
            res = FileImgUploadRes.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('S_FILE not found cid');
            break;
        }
        break;
      case SID.S_OTHER:
        switch (pdu.getCommandId()) {
          case CID_OTHER.CID_HeartBeatNotify:
            res = HeartBeatNotify.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('S_OTHER not found cid');
            break;
        }
        break;
      case SID.S_SWITCH:
        switch (pdu.getCommandId()) {
          case CID_SWITCH.CID_SwitchPtpNotify:
            res = SwitchPtpNotify.handlePdu(pdu, accountId);
            break;
          case CID_SWITCH.CID_SwitchDevicesNotify:
            res = SwitchDevicesNotify.handlePdu(pdu, accountId);
            break;
          default:
            console.warn('S_SWITCH not found cid');
            break;
        }
        break;
      default:
        console.warn('not found cid');
        break;
    }
    return res;
  }
}
