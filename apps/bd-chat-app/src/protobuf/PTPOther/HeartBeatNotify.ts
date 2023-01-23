import BaseMsg from '../BaseMsg';
import { SID, CID_OTHER } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { HeartBeatNotify_Type } from './types';

export default class HeartBeatNotify extends BaseMsg {
  constructor(msg?: HeartBeatNotify_Type) {
    super('PTP.Other.HeartBeatNotify', msg);
    this.setServiceId(SID.S_OTHER);
    this.setCommandId(CID_OTHER.CID_HeartBeatNotify);
  }
  getMsg(): HeartBeatNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): HeartBeatNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new HeartBeatNotify().decode(pdu.getPbBody());
    return msg;
  }
}
