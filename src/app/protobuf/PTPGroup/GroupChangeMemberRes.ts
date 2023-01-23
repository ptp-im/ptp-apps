import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { GroupChangeMemberRes_Type } from './types';

export default class GroupChangeMemberRes extends BaseMsg {
  constructor(msg?: GroupChangeMemberRes_Type) {
    super('PTP.Group.GroupChangeMemberRes', msg);
  }
  getMsg(): GroupChangeMemberRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupChangeMemberRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupChangeMemberRes().decode(pdu.getPbBody());
    return msg;
  }
}
