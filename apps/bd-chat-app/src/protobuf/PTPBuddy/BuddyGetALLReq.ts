import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyGetALLReq_Type } from './types';

export default class BuddyGetALLReq extends BaseMsg {
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
}
