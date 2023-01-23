import BaseMsg from '../BaseMsg';
import { SID, CID_AUTH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { AuthLogoutReq_Type } from './types';

export default class AuthLogoutReq extends BaseMsg {
  constructor(msg?: AuthLogoutReq_Type) {
    super('PTP.Auth.AuthLogoutReq', msg);
    this.setServiceId(SID.S_AUTH);
    this.setCommandId(CID_AUTH.CID_AuthLogoutReq);
  }
  getMsg(): AuthLogoutReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): AuthLogoutReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new AuthLogoutReq().decode(pdu.getPbBody());
    return msg;
  }
}
