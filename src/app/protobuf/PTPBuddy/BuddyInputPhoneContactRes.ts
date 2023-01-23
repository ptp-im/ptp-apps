import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { BuddyInputPhoneContactRes_Type } from './types';

export default class BuddyInputPhoneContactRes extends BaseMsg {
  constructor(msg?: BuddyInputPhoneContactRes_Type) {
    super('PTP.Buddy.BuddyInputPhoneContactRes', msg);
  }
  getMsg(): BuddyInputPhoneContactRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyInputPhoneContactRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyInputPhoneContactRes().decode(pdu.getPbBody());
    return msg;
  }
}
