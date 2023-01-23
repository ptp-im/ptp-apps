import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { CaptchaRes_Type } from './types';

export default class CaptchaRes extends BaseMsg {
  constructor(msg?: CaptchaRes_Type) {
    super('PTP.Auth.CaptchaRes', msg);
  }
  getMsg(): CaptchaRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): CaptchaRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new CaptchaRes().decode(pdu.getPbBody());
    return msg;
  }
}
