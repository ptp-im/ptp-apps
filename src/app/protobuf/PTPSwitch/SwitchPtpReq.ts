import BaseMsg from '../BaseMsg';
import { SID, CID_SWITCH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { SwitchPtpReq_Type } from './types';

export default class SwitchPtpReq extends BaseMsg {
  constructor(msg?: SwitchPtpReq_Type) {
    super('PTP.Switch.SwitchPtpReq', msg);
    this.setServiceId(SID.S_SWITCH);
    this.setCommandId(CID_SWITCH.CID_SwitchPtpReq);
  }
  getMsg(): SwitchPtpReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): SwitchPtpReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new SwitchPtpReq().decode(pdu.getPbBody());
    return msg;
  }
}
