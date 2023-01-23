import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupUnreadMsgReq from '../../PTPGroup/GroupUnreadMsgReq';
import GroupUnreadMsgRes from '../../PTPGroup/GroupUnreadMsgRes';

describe('PTPGroup', () => {
  it('GroupUnreadMsgReq test', async () => {
    const enMsg = new GroupUnreadMsgReq({}).encode();
    const deMsg = new GroupUnreadMsgReq().decode(enMsg);
    console.debug({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPGroup client test', () => {
  it('GroupUnreadMsgReq test', async () => {
    const client = new MsgConnTest(config.users[0].entropy);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupUnreadMsgReq({}).pack()
    );
    console.debug(pdu);
    const msg = GroupUnreadMsgRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
