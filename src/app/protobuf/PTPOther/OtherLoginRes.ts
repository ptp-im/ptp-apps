import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { OtherLoginRes_Type } from './types';

export default class OtherLoginRes extends BaseMsg {
  constructor(msg?: OtherLoginRes_Type) {
    super('PTP.Other.OtherLoginRes', msg);
  }
  getMsg(): OtherLoginRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): OtherLoginRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new OtherLoginRes().decode(pdu.getPbBody());
    return msg;
  }
}
