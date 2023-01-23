import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { AuthLogoutRes_Type } from './types';

export default class AuthLogoutRes extends BaseMsg {
  constructor(msg?: AuthLogoutRes_Type) {
    super('PTP.Auth.AuthLogoutRes', msg);
  }
  getMsg(): AuthLogoutRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): AuthLogoutRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new AuthLogoutRes().decode(pdu.getPbBody());
    return msg;
  }
}
