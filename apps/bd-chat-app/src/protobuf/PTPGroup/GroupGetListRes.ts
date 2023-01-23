import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { GroupGetListRes_Type } from './types';

export default class GroupGetListRes extends BaseMsg {
  constructor(msg?: GroupGetListRes_Type) {
    super('PTP.Group.GroupGetListRes', msg);
  }
  getMsg(): GroupGetListRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupGetListRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupGetListRes().decode(pdu.getPbBody());
    return msg;
  }
}
