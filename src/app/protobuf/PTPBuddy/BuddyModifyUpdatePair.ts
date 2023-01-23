import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyModifyUpdatePair_Type } from './types';

export default class BuddyModifyUpdatePair extends BaseMsg {
  constructor(msg?: BuddyModifyUpdatePair_Type) {
    super('PTP.Buddy.BuddyModifyUpdatePair', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyModifyUpdatePair);
  }
  getMsg(): BuddyModifyUpdatePair_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyModifyUpdatePair_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyModifyUpdatePair().decode(pdu.getPbBody());
    return msg;
  }
}
