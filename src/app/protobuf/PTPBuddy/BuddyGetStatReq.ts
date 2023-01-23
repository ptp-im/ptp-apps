import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyGetStatReq_Type } from './types';

export default class BuddyGetStatReq extends BaseMsg {
  constructor(msg?: BuddyGetStatReq_Type) {
    super('PTP.Buddy.BuddyGetStatReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyGetStatReq);
  }
  getMsg(): BuddyGetStatReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetStatReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyGetStatReq().decode(pdu.getPbBody());
    return msg;
  }
}
