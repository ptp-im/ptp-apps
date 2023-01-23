import BaseMsg from '../BaseMsg';
import { SID, CID_AUTH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { CaptchaReq_Type } from './types';

export default class CaptchaReq extends BaseMsg {
  constructor(msg?: CaptchaReq_Type) {
    super('PTP.Auth.CaptchaReq', msg);
    this.setServiceId(SID.S_AUTH);
    this.setCommandId(CID_AUTH.CID_CaptchaReq);
  }
  getMsg(): CaptchaReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): CaptchaReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new CaptchaReq().decode(pdu.getPbBody());
    return msg;
  }
}
