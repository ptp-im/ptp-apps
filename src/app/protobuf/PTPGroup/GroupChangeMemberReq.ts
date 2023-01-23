import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupChangeMemberReq_Type } from './types';

export default class GroupChangeMemberReq extends BaseMsg {
  constructor(msg?: GroupChangeMemberReq_Type) {
    super('PTP.Group.GroupChangeMemberReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupChangeMemberReq);
  }
  getMsg(): GroupChangeMemberReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupChangeMemberReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupChangeMemberReq().decode(pdu.getPbBody());
    return msg;
  }
}
