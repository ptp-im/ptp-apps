import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyModifyUpdatePairReq_Type } from './types';

export default class BuddyModifyUpdatePairReq extends BaseMsg {
  constructor(msg?: BuddyModifyUpdatePairReq_Type) {
    super('PTP.Buddy.BuddyModifyUpdatePairReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyModifyUpdatePairReq);
  }
  getMsg(): BuddyModifyUpdatePairReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyModifyUpdatePairReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyModifyUpdatePairReq().decode(pdu.getPbBody());
    return msg;
  }
}
