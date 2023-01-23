import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { AuthLoginRes_Type } from './types';

export default class AuthLoginRes extends BaseMsg {
  constructor(msg?: AuthLoginRes_Type) {
    super('PTP.Auth.AuthLoginRes', msg);
  }
  getMsg(): AuthLoginRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): AuthLoginRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new AuthLoginRes().decode(pdu.getPbBody());
    return msg;
  }
}
