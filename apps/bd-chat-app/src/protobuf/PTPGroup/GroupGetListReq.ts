import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupGetListReq_Type } from './types';

export default class GroupGetListReq extends BaseMsg {
  constructor(msg?: GroupGetListReq_Type) {
    super('PTP.Group.GroupGetListReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupGetListReq);
  }
  getMsg(): GroupGetListReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupGetListReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupGetListReq().decode(pdu.getPbBody());
    return msg;
  }
}
