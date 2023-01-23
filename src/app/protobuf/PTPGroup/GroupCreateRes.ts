import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { GroupCreateRes_Type } from './types';

export default class GroupCreateRes extends BaseMsg {
  constructor(msg?: GroupCreateRes_Type) {
    super('PTP.Group.GroupCreateRes', msg);
  }
  getMsg(): GroupCreateRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupCreateRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupCreateRes().decode(pdu.getPbBody());
    return msg;
  }
}
