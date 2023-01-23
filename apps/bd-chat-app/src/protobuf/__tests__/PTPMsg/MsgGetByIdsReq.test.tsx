import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import MsgGetByIdsReq from '../../PTPMsg/MsgGetByIdsReq';
import MsgGetByIdsRes from '../../PTPMsg/MsgGetByIdsRes';

describe('PTPMsg', () => {
  it('MsgGetByIdsReq test', async () => {
    const enMsg = new MsgGetByIdsReq({
      group_id: 0,
      msg_ids: [],
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new MsgGetByIdsReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPMsg client test', () => {
  it('MsgGetByIdsReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new MsgGetByIdsReq({
        group_id: 0,
        msg_ids: [],
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = MsgGetByIdsRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
