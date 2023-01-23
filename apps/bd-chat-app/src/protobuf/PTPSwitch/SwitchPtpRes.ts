import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { SwitchPtpRes_Type } from './types';

export default class SwitchPtpRes extends BaseMsg {
  constructor(msg?: SwitchPtpRes_Type) {
    super('PTP.Switch.SwitchPtpRes', msg);
  }
  getMsg(): SwitchPtpRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): SwitchPtpRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new SwitchPtpRes().decode(pdu.getPbBody());
    return msg;
  }
}
