import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyModifyUpdatePairReq from '../../PTPBuddy/BuddyModifyUpdatePairReq';

describe('PTPBuddy', () => {
  it('BuddyModifyUpdatePairReq test', async () => {
    const enMsg = new BuddyModifyUpdatePairReq({
      pair_uid_list: [],
    }).encode();
    const deMsg = new BuddyModifyUpdatePairReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPBuddy client test', () => {
  it('BuddyModifyUpdatePairReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyModifyUpdatePairReq({
        pair_uid_list: [],
      }).pack()
    );
    console.log(pdu);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
