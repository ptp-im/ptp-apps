import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupUnreadMsgReq_Type } from './types';

export default class GroupUnreadMsgReq extends BaseMsg {
  constructor(msg?: GroupUnreadMsgReq_Type) {
    super('PTP.Group.GroupUnreadMsgReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupUnreadMsgReq);
  }
  getMsg(): GroupUnreadMsgReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupUnreadMsgReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupUnreadMsgReq().decode(pdu.getPbBody());
    return msg;
  }
}
