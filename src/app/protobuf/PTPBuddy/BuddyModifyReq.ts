import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyModifyReq_Type } from './types';

export default class BuddyModifyReq extends BaseMsg {
  constructor(msg?: BuddyModifyReq_Type) {
    super('PTP.Buddy.BuddyModifyReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyModifyReq);
  }
  getMsg(): BuddyModifyReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyModifyReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
}
