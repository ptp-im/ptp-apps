import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyQueryListReq_Type } from './types';

export default class BuddyQueryListReq extends BaseMsg {
  constructor(msg?: BuddyQueryListReq_Type) {
    super('PTP.Buddy.BuddyQueryListReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyQueryListReq);
  }
  getMsg(): BuddyQueryListReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyQueryListReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyQueryListReq().decode(pdu.getPbBody());
    return msg;
  }
}
