import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { SID, CID_GROUP } from '../PTPCommon';
import type { GroupModifyNotify_Type } from './types';

export default class GroupModifyNotify extends BaseMsg {
  constructor(msg?: GroupModifyNotify_Type) {
    super('PTP.Group.GroupModifyNotify', msg);
    this.setServiceId(SID.S_GROUP);
    this.setCommandId(CID_GROUP.CID_GroupModifyNotify);
  }
  getMsg(): GroupModifyNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): GroupModifyNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new GroupModifyNotify().decode(pdu.getPbBody());
    return {
      msg,
      dispatch: {
        type: 'im/updateGroup',
        payload: {
          ...msg,
        },
      },
    };
  }
}
