import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyImportContactsReq_Type } from './types';

export default class BuddyImportContactsReq extends BaseMsg {
  constructor(msg?: BuddyImportContactsReq_Type) {
    super('PTP.Buddy.BuddyImportContactsReq', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyImportContactsReq);
  }
  getMsg(): BuddyImportContactsReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyImportContactsReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new BuddyImportContactsReq().decode(pdu.getPbBody());
    return msg;
  }
}
