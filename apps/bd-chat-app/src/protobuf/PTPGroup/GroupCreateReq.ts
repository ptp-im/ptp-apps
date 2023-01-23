import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupCreateReq_Type } from './types';

export default class GroupCreateReq extends BaseMsg {
  constructor(msg?: GroupCreateReq_Type) {
    super('PTP.Group.GroupCreateReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupCreateReq);
  }
  getMsg(): GroupCreateReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupCreateReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupCreateReq().decode(pdu.getPbBody());
    return msg;
  }
}
