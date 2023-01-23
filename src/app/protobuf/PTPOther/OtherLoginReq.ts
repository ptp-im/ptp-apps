import BaseMsg from '../BaseMsg';
import { SID, CID_OTHER } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { OtherLoginReq_Type } from './types';

export default class OtherLoginReq extends BaseMsg {
  constructor(msg?: OtherLoginReq_Type) {
    super('PTP.Other.OtherLoginReq', msg);
    this.setServiceId(SID.S_OTHER);
    this.setCommandId(CID_OTHER.CID_OtherLoginReq);
  }
  getMsg(): OtherLoginReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): OtherLoginReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new OtherLoginReq().decode(pdu.getPbBody());
    return msg;
  }
}
