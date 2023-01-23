import BaseMsg from '../BaseMsg';
import { SID, CID_MSG } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { MsgGetMaxIdReq_Type } from './types';

export default class MsgGetMaxIdReq extends BaseMsg {
  constructor(msg?: MsgGetMaxIdReq_Type) {
    super('PTP.Msg.MsgGetMaxIdReq', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgGetMaxIdReq);
  }
  getMsg(): MsgGetMaxIdReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgGetMaxIdReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgGetMaxIdReq().decode(pdu.getPbBody());
    return msg;
  }
}
