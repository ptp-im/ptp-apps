import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { SID, CID_MSG, MsgInfo_Type } from '../PTPCommon';
import type { MsgReadAckReq_Type } from './types';
import MsgConn from '../../helpers/MsgConn';

export default class MsgReadAckReq extends BaseMsg {
  constructor(msg?: MsgReadAckReq_Type) {
    super('PTP.Msg.MsgReadAckReq', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgReadAckReq);
  }
  getMsg(): MsgReadAckReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgReadAckReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static run(group_id: number, msg_id: number) {
    MsgConn.SendMessage(
      new MsgReadAckReq({
        group_id: group_id,
        msg_id: msg_id,
      }).pack()
    );
  }
}
