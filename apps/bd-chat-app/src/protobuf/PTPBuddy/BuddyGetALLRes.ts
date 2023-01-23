import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { BuddyGetALLRes_Type } from './types';

export default class BuddyGetALLRes extends BaseMsg {
  constructor(msg?: BuddyGetALLRes_Type) {
    super('PTP.Buddy.BuddyGetALLRes', msg);
  }
  getMsg(): BuddyGetALLRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetALLRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyGetALLRes().decode(pdu.getPbBody());
    return msg;
  }
}
