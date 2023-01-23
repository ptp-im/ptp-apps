import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupGetMembersListReq_Type } from './types';

export default class GroupGetMembersListReq extends BaseMsg {
  constructor(msg?: GroupGetMembersListReq_Type) {
    super('PTP.Group.GroupGetMembersListReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupGetMembersListReq);
  }
  getMsg(): GroupGetMembersListReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupGetMembersListReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupGetMembersListReq().decode(pdu.getPbBody());
    return msg;
  }
}
