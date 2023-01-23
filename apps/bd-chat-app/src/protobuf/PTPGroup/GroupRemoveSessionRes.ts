import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { GroupRemoveSessionRes_Type } from './types';

export default class GroupRemoveSessionRes extends BaseMsg {
  constructor(msg?: GroupRemoveSessionRes_Type) {
    super('PTP.Group.GroupRemoveSessionRes', msg);
  }
  getMsg(): GroupRemoveSessionRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupRemoveSessionRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupRemoveSessionRes().decode(pdu.getPbBody());
    return msg;
  }
}
