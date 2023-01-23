import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyStatNotify_Type } from './types';

export default class BuddyStatNotify extends BaseMsg {
  constructor(msg?: BuddyStatNotify_Type) {
    super('PTP.Buddy.BuddyStatNotify', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyStatNotify);
  }
  getMsg(): BuddyStatNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyStatNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyStatNotify().decode(pdu.getPbBody());
    return msg;
  }
}
