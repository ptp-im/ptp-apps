import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import MsgReq from '../../PTPMsg/MsgReq';
import MsgRes from '../../PTPMsg/MsgRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPMsg', () => {
  it('MsgReq test', async () => {
    const enMsg = new MsgReq({
      group_adr: 'group_adr',
      sent_at: 0,
      msg_type: PTPCommon.MsgType.MSG_TYPE_TEXT,
      msg_data: '',
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new MsgReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPMsg client test', () => {
  it('MsgReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new MsgReq({
        group_adr: 'group_adr',
        sent_at: 0,
        msg_type: PTPCommon.MsgType.MSG_TYPE_TEXT,
        msg_data: '',
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = MsgRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
