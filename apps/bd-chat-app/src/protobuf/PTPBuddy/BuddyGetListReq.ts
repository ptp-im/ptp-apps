import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyGetListReq_Type } from './types';

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
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyGetListReq().decode(pdu.getPbBody());
    return msg;
  }
}
