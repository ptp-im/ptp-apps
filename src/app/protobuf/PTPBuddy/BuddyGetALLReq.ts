import AccountController from '../../helpers/AccountController';
import MsgConn from '../../helpers/MsgConn';
import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { BuddyGetALLReq_Type } from './types';

export default class BuddyGetALLReq extends BaseMsg {
  static running = false;
  constructor(msg?: BuddyGetALLReq_Type) {
    super('PTP.Buddy.BuddyGetALLReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyGetALLReq);
  }
  getMsg(): BuddyGetALLReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetALLReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyGetALLReq().decode(pdu.getPbBody());
    return msg;
  }
  static async run(accountId: number) {
    if (!BuddyGetALLReq.running) {
      BuddyGetALLReq.running = true;
      const group_members_updated_time =
        AccountController.getInstance(accountId).getBuddyUpdatedTime();
      return MsgConn.getInstance(accountId)?.SendPduWithCallback(
        new BuddyGetALLReq({
          buddy_updated_time: group_members_updated_time,
        }).pack()
      );
    } else {
      return null;
    }
  }
}
