import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupRemoveSessionReq from '../../PTPGroup/GroupRemoveSessionReq';
import GroupRemoveSessionRes from '../../PTPGroup/GroupRemoveSessionRes';

describe('PTPGroup', () => {
  it('GroupRemoveSessionReq test', async () => {
    const enMsg = new GroupRemoveSessionReq({
      group_id: 0,
    }).encode();
    const deMsg = new GroupRemoveSessionReq().decode(enMsg);
    console.debug({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPGroup client test', () => {
  it('GroupRemoveSessionReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupRemoveSessionReq({
        group_id: 0,
      }).pack()
    );
    console.debug(pdu);
    const msg = GroupRemoveSessionRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
