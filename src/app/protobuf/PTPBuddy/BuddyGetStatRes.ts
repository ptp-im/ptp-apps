import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { BuddyGetStatRes_Type } from './types';

export default class BuddyGetStatRes extends BaseMsg {
  constructor(msg?: BuddyGetStatRes_Type) {
    super('PTP.Buddy.BuddyGetStatRes', msg);
  }
  getMsg(): BuddyGetStatRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetStatRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyGetStatRes().decode(pdu.getPbBody());
    return msg;
  }
}
