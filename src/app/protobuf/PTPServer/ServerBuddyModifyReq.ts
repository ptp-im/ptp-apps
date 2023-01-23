import BaseMsg from '../BaseMsg';
import { SID, CID_SERVER } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { ServerBuddyModifyReq_Type } from './types';

export default class ServerBuddyModifyReq extends BaseMsg {
  constructor(msg?: ServerBuddyModifyReq_Type) {
    super('PTP.Server.ServerBuddyModifyReq', msg);
    this.setServiceId(SID.S_SERVER);
    this.setCommandId(CID_SERVER.CID_ServerBuddyModifyReq);
  }
  getMsg(): ServerBuddyModifyReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): ServerBuddyModifyReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new ServerBuddyModifyReq().decode(pdu.getPbBody());
    return msg;
  }
}
