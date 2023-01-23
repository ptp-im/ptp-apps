import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import MsgGetMaxIdReq from '../../PTPMsg/MsgGetMaxIdReq';
import MsgGetMaxIdRes from '../../PTPMsg/MsgGetMaxIdRes';

describe('PTPMsg', () => {
  it('MsgGetMaxIdReq test', async () => {
    const enMsg = new MsgGetMaxIdReq({
      group_id: 0,
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new MsgGetMaxIdReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPMsg client test', () => {
  it('MsgGetMaxIdReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new MsgGetMaxIdReq({
        group_id: 0,
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = MsgGetMaxIdRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
