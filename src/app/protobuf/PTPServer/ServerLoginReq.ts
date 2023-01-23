import BaseMsg from '../BaseMsg';
import { SID, CID_SERVER } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { ServerLoginReq_Type } from './types';

export default class ServerLoginReq extends BaseMsg {
  constructor(msg?: ServerLoginReq_Type) {
    super('PTP.Server.ServerLoginReq', msg);
    this.setServiceId(SID.S_SERVER);
    this.setCommandId(CID_SERVER.CID_ServerLoginReq);
  }
  getMsg(): ServerLoginReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): ServerLoginReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new ServerLoginReq().decode(pdu.getPbBody());
    return msg;
  }
}
