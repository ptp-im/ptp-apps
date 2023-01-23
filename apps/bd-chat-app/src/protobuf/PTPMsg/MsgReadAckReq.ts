import BaseMsg from '../BaseMsg';
import { SID, CID_MSG } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { MsgReadAckReq_Type } from './types';

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
  static handlePdu(pdu: Pdu) {
    const msg = new MsgReadAckReq().decode(pdu.getPbBody());
    return msg;
  }
}
