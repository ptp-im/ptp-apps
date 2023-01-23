import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyInputPhoneContactReq_Type } from './types';

export default class BuddyInputPhoneContactReq extends BaseMsg {
  constructor(msg?: BuddyInputPhoneContactReq_Type) {
    super('PTP.Buddy.BuddyInputPhoneContactReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyInputPhoneContactReq);
  }
  getMsg(): BuddyInputPhoneContactReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyInputPhoneContactReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyInputPhoneContactReq().decode(pdu.getPbBody());
    return msg;
  }
}
