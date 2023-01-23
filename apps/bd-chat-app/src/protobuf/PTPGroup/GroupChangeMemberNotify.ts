import BaseMsg from '../BaseMsg';
import { SID, CID_GROUP } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { GroupChangeMemberNotify_Type } from './types';

export default class GroupChangeMemberNotify extends BaseMsg {
  constructor(msg?: GroupChangeMemberNotify_Type) {
    super('PTP.Group.GroupChangeMemberNotify', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupChangeMemberNotify);
  }
  getMsg(): GroupChangeMemberNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupChangeMemberNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupChangeMemberNotify().decode(pdu.getPbBody());
    return msg;
  }
}
