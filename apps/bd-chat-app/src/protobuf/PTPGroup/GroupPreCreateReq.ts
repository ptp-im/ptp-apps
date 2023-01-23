import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupPreCreateReq_Type } from './types';

export default class GroupPreCreateReq extends BaseMsg {
  constructor(msg?: GroupPreCreateReq_Type) {
    super('PTP.Group.GroupPreCreateReq', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupPreCreateReq);
  }
  getMsg(): GroupPreCreateReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupPreCreateReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupPreCreateReq().decode(pdu.getPbBody());
    return msg;
  }
}
