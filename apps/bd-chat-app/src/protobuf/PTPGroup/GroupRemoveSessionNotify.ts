import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupRemoveSessionNotify_Type } from './types';

export default class GroupRemoveSessionNotify extends BaseMsg {
  constructor(msg?: GroupRemoveSessionNotify_Type) {
    super('PTP.Group.GroupRemoveSessionNotify', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupRemoveSessionNotify);
  }
  getMsg(): GroupRemoveSessionNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupRemoveSessionNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupRemoveSessionNotify().decode(pdu.getPbBody());
    return msg;
  }
}
