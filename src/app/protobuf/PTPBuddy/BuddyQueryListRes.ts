import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { BuddyQueryListRes_Type } from './types';

export default class BuddyQueryListRes extends BaseMsg {
  constructor(msg?: BuddyQueryListRes_Type) {
    super('PTP.Buddy.BuddyQueryListRes', msg);
  }
  getMsg(): BuddyQueryListRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyQueryListRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyQueryListRes().decode(pdu.getPbBody());
    return msg;
  }
}
