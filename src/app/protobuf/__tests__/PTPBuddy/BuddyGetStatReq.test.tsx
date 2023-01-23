import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyGetStatReq from '../../PTPBuddy/BuddyGetStatReq';
import BuddyGetStatRes from '../../PTPBuddy/BuddyGetStatRes';

describe('PTPBuddy', () => {
  it('BuddyGetStatReq test', async () => {
    const enMsg = new BuddyGetStatReq({
      user_ids: [],
    }).encode();
    const deMsg = new BuddyGetStatReq().decode(enMsg);
    console.debug({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPBuddy client test', () => {
  it('BuddyGetStatReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyGetStatReq({
        user_ids: [],
      }).pack()
    );
    console.debug(pdu);
    const msg = BuddyGetStatRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
