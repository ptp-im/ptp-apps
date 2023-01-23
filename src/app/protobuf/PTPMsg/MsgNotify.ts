import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { SID, CID_MSG } from '../PTPCommon';
import type { MsgNotify_Type } from './types';

export default class MsgNotify extends BaseMsg {
  constructor(msg?: MsgNotify_Type) {
    super('PTP.Msg.MsgNotify', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgNotify);
  }
  getMsg(): MsgNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu, accountId: number) {
    const { msg_info } = new MsgNotify().decode(pdu.getPbBody());
    return {
      dispatch: {
        type: 'im/MsgNotify',
        payload: {
          MsgNotify: msg_info,
          accountId,
        },
      },
    };
  }
}
