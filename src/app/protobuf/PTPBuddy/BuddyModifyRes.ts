import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { BuddyModifyRes_Type } from './types';

export default class BuddyModifyRes extends BaseMsg {
  constructor(msg?: BuddyModifyRes_Type) {
    super('PTP.Buddy.BuddyModifyRes', msg);
  }
  getMsg(): BuddyModifyRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyModifyRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu, accountId: number) {
    const msg = new BuddyModifyRes().decode(pdu.getPbBody());
    return {
      error: msg.error,
      dispatch: [
        {
          type: 'auth/BuddyModifyRes',
          payload: {
            BuddyModifyRes: msg,
            accountId,
          },
        },
      ],
    };
  }
}
