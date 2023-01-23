import BaseMsg from '../BaseMsg';
import { SID, CID_MSG } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { MsgGetByIdsReq_Type } from './types';

export default class MsgGetByIdsReq extends BaseMsg {
  constructor(msg?: MsgGetByIdsReq_Type) {
    super('PTP.Msg.MsgGetByIdsReq', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgGetByIdsReq);
  }
  getMsg(): MsgGetByIdsReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgGetByIdsReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgGetByIdsReq().decode(pdu.getPbBody());
    return msg;
  }
}
