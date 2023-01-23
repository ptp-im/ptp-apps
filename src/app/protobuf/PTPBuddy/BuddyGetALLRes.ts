import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { GroupUnreadMsgReq } from '../PTPGroup';
import type { BuddyGetALLRes_Type } from './types';

export default class BuddyGetALLRes extends BaseMsg {
  constructor(msg?: BuddyGetALLRes_Type) {
    super('PTP.Buddy.BuddyGetALLRes', msg);
  }
  getMsg(): BuddyGetALLRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): BuddyGetALLRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu, accountId: number) {
    const msg = new BuddyGetALLRes().decode(pdu.getPbBody());
    return {
      dispatch: {
        type: 'im/BuddyGetALLRes',
        payload: {
          accountId,
          BuddyGetALLRes: msg,
        },
      },
    };
  }
}
