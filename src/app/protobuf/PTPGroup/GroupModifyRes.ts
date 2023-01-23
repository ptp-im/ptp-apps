import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { GroupModifyRes_Type } from './types';

export default class GroupModifyRes extends BaseMsg {
  constructor(msg?: GroupModifyRes_Type) {
    super('PTP.Group.GroupModifyRes', msg);
  }
  getMsg(): GroupModifyRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupModifyRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupModifyRes().decode(pdu.getPbBody());
    return msg;
  }
}
