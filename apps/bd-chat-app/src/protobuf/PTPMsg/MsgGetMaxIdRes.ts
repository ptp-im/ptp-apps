import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { MsgGetMaxIdRes_Type } from './types';

export default class MsgGetMaxIdRes extends BaseMsg {
  constructor(msg?: MsgGetMaxIdRes_Type) {
    super('PTP.Msg.MsgGetMaxIdRes', msg);
  }
  getMsg(): MsgGetMaxIdRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgGetMaxIdRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgGetMaxIdRes().decode(pdu.getPbBody());
    return msg;
  }
}
