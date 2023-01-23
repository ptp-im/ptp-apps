import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { ServerLoginRes_Type } from './types';

export default class ServerLoginRes extends BaseMsg {
  constructor(msg?: ServerLoginRes_Type) {
    super('PTP.Server.ServerLoginRes', msg);
  }
  getMsg(): ServerLoginRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): ServerLoginRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new ServerLoginRes().decode(pdu.getPbBody());
    return msg;
  }
}
