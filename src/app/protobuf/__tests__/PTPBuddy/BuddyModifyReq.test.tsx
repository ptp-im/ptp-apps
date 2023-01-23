import { describe, expect } from '@jest/globals';
import { randAvatar, randTextRange, randFirstName } from '@ngneat/falso';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyModifyReq from '../../PTPBuddy/BuddyModifyReq';
import BuddyModifyRes from '../../PTPBuddy/BuddyModifyRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPBuddy client test', () => {
  it('BuddyModifyReq test', async () => {
    const users = [config.AuthKey, ...config.users.map((u) => u.AuthKey)];
    for (let i = 0; i < users.length; i++) {
      const client = new MsgConnTest(users[i]);
      client.setAutoReconnect(false);
      client.connect();
      await client.waitForMsgServerState(MsgConnTestState.connected);
      await client.login();
      const pdu = await client.SendPduWithCallback(
        new BuddyModifyReq({
          buddy_modify_action:
            PTPCommon.BuddyModifyAction.BuddyModifyAction_nickname,
          value: randFirstName(),
        }).pack()
      );
      const msg = BuddyModifyRes.handlePdu(pdu);
      console.debug(msg);

      const pdu1 = await client.SendPduWithCallback(
        new BuddyModifyReq({
          buddy_modify_action:
            PTPCommon.BuddyModifyAction.BuddyModifyAction_avatar,
          value: randAvatar(),
        }).pack()
      );
      console.debug(pdu1);
      const msg1 = BuddyModifyRes.handlePdu(pdu1);
      console.debug(msg1);
      const pdu2 = await client.SendPduWithCallback(
        new BuddyModifyReq({
          buddy_modify_action:
            PTPCommon.BuddyModifyAction.BuddyModifyAction_sign_info,
          value: randTextRange({ min: 20, max: 50 }),
        }).pack()
      );
      const msg2 = BuddyModifyRes.handlePdu(pdu2);
      console.debug(msg2);
      const pdu3 = await client.SendPduWithCallback(
        new BuddyModifyReq({
          buddy_modify_action:
            PTPCommon.BuddyModifyAction.BuddyModifyAction_user_name,
          value: randFirstName(),
        }).pack()
      );
      const msg3 = BuddyModifyRes.handlePdu(pdu3);
      console.debug(msg3);
      await client.logout();
      await client.waitForMsgServerState(MsgConnTestState.closed);
    }

    expect(1).toEqual(1);
  });
});

describe('PTPBuddy client test 1', () => {
  it('BuddyModifyReq test', async () => {
    const users = [config.AuthKey, ...config.users.map((u) => u.AuthKey)];
    const client = new MsgConnTest(users[0]);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyModifyReq({
        buddy_modify_action:
          PTPCommon.BuddyModifyAction.BuddyModifyAction_nickname,
        value: 'w'.repeat(100),
      }).pack()
    );
    const msg = BuddyModifyRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
