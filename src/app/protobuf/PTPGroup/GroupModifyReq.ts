import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupModifyReq_Type } from './types';

export default class GroupModifyReq extends BaseMsg {
  constructor(msg?: GroupModifyReq_Type) {
    super('PTP.Group.GroupModifyReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupModifyReq);
  }
  getMsg(): GroupModifyReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupModifyReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupModifyReq().decode(pdu.getPbBody());
    return msg;
  }
}
