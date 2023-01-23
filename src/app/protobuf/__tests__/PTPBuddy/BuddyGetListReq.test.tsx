import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyGetListReq from '../../PTPBuddy/BuddyGetListReq';
import BuddyGetListRes from '../../PTPBuddy/BuddyGetListRes';

describe('PTPBuddy client test', () => {
  it('BuddyGetListReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyGetListReq({
        user_ids: [100000, 100001],
      }).pack()
    );
    const msg = BuddyGetListRes.handlePdu(pdu);
    console.debug(msg.dispatch.type);
    console.debug(msg.dispatch.payload);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
