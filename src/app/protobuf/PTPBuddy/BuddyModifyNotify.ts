import BaseMsg from '../BaseMsg';
import { SID, CID_BUDDY } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { BuddyModifyNotify_Type } from './types';

export default class BuddyModifyNotify extends BaseMsg {
  constructor(msg?: BuddyModifyNotify_Type) {
    super('PTP.Buddy.BuddyModifyNotify', msg);
    this.setServiceId(SID.S_BUDDY);
    this.setCommandId(CID_BUDDY.CID_BuddyModifyNotify);
  }
  getMsg(): BuddyModifyNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyModifyNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu, accountId: number) {
    const msg = new BuddyModifyNotify().decode(pdu.getPbBody());
    return {
      dispatch: {
        type: 'im/BuddyModifyNotify',
        payload: {
          BuddyModifyNotify: msg,
          accountId,
        },
      },
    };
  }
}
