import BaseMsg from '../BaseMsg';
import { SID, CID_SWITCH } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { SwitchDevicesReq_Type } from './types';

export default class SwitchDevicesReq extends BaseMsg {
  constructor(msg?: SwitchDevicesReq_Type) {
    super('PTP.Switch.SwitchDevicesReq', msg);
    this.setServiceId(SID.S_SWITCH);
    this.setCommandId(CID_SWITCH.CID_SwitchDevicesReq);
  }
  getMsg(): SwitchDevicesReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): SwitchDevicesReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new SwitchDevicesReq().decode(pdu.getPbBody());
    return msg;
  }
}
