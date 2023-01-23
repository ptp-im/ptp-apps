import AccountController from '../../helpers/AccountController';
import MsgConn from '../../helpers/MsgConn';
import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { SID, CID_GROUP } from '../PTPCommon';
import type { GroupGetListReq_Type } from './types';

export default class GroupGetListReq extends BaseMsg {
  static running = false;
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
  static async run(accountId: number) {
    const group_info_updated_time =
      AccountController.getInstance(accountId)!.getGroupInfoUpdatedTime();
    return MsgConn.getInstance(accountId).SendPduWithCallback(
      new GroupGetListReq({
        group_info_updated_time,
      }).pack()
    );
  }
}
