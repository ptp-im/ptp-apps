import BaseMsg from '../BaseMsg';
import { SID, CID_MSG } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { MsgUnNotify_Type } from './types';

export default class MsgUnNotify extends BaseMsg {
  constructor(msg?: MsgUnNotify_Type) {
    super('PTP.Msg.MsgUnNotify', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgUnNotify);
  }
  getMsg(): MsgUnNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgUnNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgUnNotify().decode(pdu.getPbBody());
    return msg;
  }
}
