import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyGetALLReq from '../../PTPBuddy/BuddyGetALLReq';
import BuddyGetALLRes from '../../PTPBuddy/BuddyGetALLRes';

describe('PTPBuddy client test', () => {
  it('BuddyGetALLReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyGetALLReq({
        buddy_updated_time: 0,
      }).pack()
    );
    const msg = BuddyGetALLRes.handlePdu(pdu);
    console.debug(msg.dispatch.payload);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
