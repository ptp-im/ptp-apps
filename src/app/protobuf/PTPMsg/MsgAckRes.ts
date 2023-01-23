import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { MsgRes_Type } from './types';

export default class MsgRes extends BaseMsg {
  constructor(msg?: MsgRes_Type) {
    super('PTP.Msg.MsgRes', msg);
  }
  getMsg(): MsgRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgRes().decode(pdu.getPbBody());
    return {
      dispatch: {
        type: 'im/msgAck',
        payload: {
          group_id: msg.group_id,
          msg_id: msg.msg_id,
          sent_at: msg.sent_at,
        },
      },
    };
  }
}
