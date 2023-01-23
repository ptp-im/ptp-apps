import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupRemoveSessionReq_Type } from './types';

export default class GroupRemoveSessionReq extends BaseMsg {
  constructor(msg?: GroupRemoveSessionReq_Type) {
    super('PTP.Group.GroupRemoveSessionReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupRemoveSessionReq);
  }
  getMsg(): GroupRemoveSessionReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupRemoveSessionReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupRemoveSessionReq().decode(pdu.getPbBody());
    return msg;
  }
}
