import BaseMsg from '../BaseMsg';
import { SID, CID_SWITCH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { SwitchDevicesNotify_Type } from './types';

export default class SwitchDevicesNotify extends BaseMsg {
  constructor(msg?: SwitchDevicesNotify_Type) {
    super('PTP.Switch.SwitchDevicesNotify', msg);
    this.setServiceId(SID.S_SWITCH);
    this.setCommandId(CID_SWITCH.CID_SwitchDevicesNotify);
  }
  getMsg(): SwitchDevicesNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): SwitchDevicesNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new SwitchDevicesNotify().decode(pdu.getPbBody());
    return msg;
  }
}
