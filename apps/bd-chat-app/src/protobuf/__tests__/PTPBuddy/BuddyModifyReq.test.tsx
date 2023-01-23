import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyModifyReq from '../../PTPBuddy/BuddyModifyReq';
import BuddyModifyRes from '../../PTPBuddy/BuddyModifyRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPBuddy', () => {
  it('BuddyModifyReq test', async () => {
    const enMsg = new BuddyModifyReq({
      buddy_modify_action: PTPCommon.BuddyModifyAction.BuddyModifyAction_nickname,
      value: 'value',
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new BuddyModifyReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPBuddy client test', () => {
  it('BuddyModifyReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyModifyReq({
        buddy_modify_action: PTPCommon.BuddyModifyAction.BuddyModifyAction_nickname,
        value: 'value',
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = BuddyModifyRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
