import MsgConn from '../../helpers/MsgConn';
import UserController from '../../helpers/UserController';
import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { SID, CID_BUDDY, UserInfo_Type } from '../PTPCommon';
import type { BuddyGetListReq_Type } from './types';

import { BuddyGetListRes } from './index';

export default class BuddyGetListReq extends BaseMsg {
  constructor(msg?: BuddyGetListReq_Type) {
    super('PTP.Buddy.BuddyGetListReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyGetListReq);
  }
  getMsg(): BuddyGetListReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetListReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static async handleGroupMembers(user_ids: number[], accountId: number) {
    let user_ids1 = [];
    let userInfoList: UserInfo_Type[] = [];
    for (let i = 0; i < user_ids.length; i++) {
      const uid = user_ids[i];
      const userInfo = await UserController.getInstance(
        uid
      ).getUserInfoFromDb();
      if (!userInfo) {
        user_ids1.push(uid);
      } else {
        userInfoList.push(userInfo);
      }
    }
    if (user_ids1.length > 0) {
      const pdu = await MsgConn.getInstance(accountId).SendPduWithCallback(
        new BuddyGetListReq({ user_ids: user_ids1 }).pack()
      );
      const res = BuddyGetListRes.handlePdu(pdu, accountId);
      const { buddy_list } = res.dispatch.payload.BuddyGetListRes;
      if (buddy_list && buddy_list.length > 0) {
        for (let i = 0; i < buddy_list.length; i++) {
          const userInfo = buddy_list[i];
          UserController.getInstance(userInfo.uid).setUserInfo(userInfo);
          await UserController.getInstance(userInfo.uid).saveUserInfoToDb();
          userInfoList.push(userInfo);
        }
      }
      return userInfoList;
    }
    return userInfoList;
  }
}
