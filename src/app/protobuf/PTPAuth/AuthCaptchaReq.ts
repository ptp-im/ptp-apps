import BaseMsg from '../BaseMsg';
import { SID, CID_AUTH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { AuthCaptchaReq_Type } from './types';

export default class AuthCaptchaReq extends BaseMsg {
  constructor(msg?: AuthCaptchaReq_Type) {
    super('PTP.Auth.AuthCaptchaReq', msg);
    this.setServiceId(SID.S_AUTH);
    this.setCommandId(CID_AUTH.CID_AuthCaptchaReq);
  }
  getMsg(): AuthCaptchaReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): AuthCaptchaReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new AuthCaptchaReq().decode(pdu.getPbBody());
    return msg;
  }
}
