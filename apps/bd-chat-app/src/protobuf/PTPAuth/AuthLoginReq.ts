import BaseMsg from '../BaseMsg';
import { SID, CID_AUTH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { AuthLoginReq_Type } from './types';

export default class AuthLoginReq extends BaseMsg {
  constructor(msg?: AuthLoginReq_Type) {
    super('PTP.Auth.AuthLoginReq', msg);
    this.setServiceId(SID.S_AUTH);
    this.setCommandId(CID_AUTH.CID_AuthLoginReq);
  }
  getMsg(): AuthLoginReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): AuthLoginReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new AuthLoginReq().decode(pdu.getPbBody());
    return msg;
  }
}
