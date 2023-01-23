import BaseMsg from '../BaseMsg';
import { SID, CID_MSG } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { MsgReq_Type } from './types';

export default class MsgReq extends BaseMsg {
  constructor(msg?: MsgReq_Type) {
    super('PTP.Msg.MsgReq', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgReq);
  }
  getMsg(): MsgReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgReq().decode(pdu.getPbBody());
    console.debug(msg);
    return msg;
  }
}
