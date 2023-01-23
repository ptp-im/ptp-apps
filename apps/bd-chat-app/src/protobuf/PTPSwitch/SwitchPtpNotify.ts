import BaseMsg from '../BaseMsg';
import { SID, CID_SWITCH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { SwitchPtpNotify_Type } from './types';

export default class SwitchPtpNotify extends BaseMsg {
  constructor(msg?: SwitchPtpNotify_Type) {
    super('PTP.Switch.SwitchPtpNotify', msg);
    this.setServiceId(SID.S_SWITCH);
    this.setCommandId(CID_SWITCH.CID_SwitchPtpNotify);
  }
  getMsg(): SwitchPtpNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): SwitchPtpNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new SwitchPtpNotify().decode(pdu.getPbBody());
    return msg;
  }
}
