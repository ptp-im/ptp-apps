import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { BuddyGetListRes_Type } from './types';

export default class BuddyGetListRes extends BaseMsg {
  constructor(msg?: BuddyGetListRes_Type) {
    super('PTP.Buddy.BuddyGetListRes', msg);
  }
  getMsg(): BuddyGetListRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetListRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyGetListRes().decode(pdu.getPbBody());
    return msg;
  }
}
