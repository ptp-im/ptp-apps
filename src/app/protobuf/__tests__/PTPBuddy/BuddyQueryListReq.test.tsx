import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyQueryListReq from '../../PTPBuddy/BuddyQueryListReq';
import BuddyQueryListRes from '../../PTPBuddy/BuddyQueryListRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPBuddy', () => {
  it('BuddyQueryListReq test', async () => {
    const enMsg = new BuddyQueryListReq({
      params: new PTPCommon.BuddyQueryParam({
          addressList: [],
          usernameList: [],
        }).getMsg(),
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new BuddyQueryListReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPBuddy client test', () => {
  it('BuddyQueryListReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyQueryListReq({
        params: new PTPCommon.BuddyQueryParam({
          addressList: [],
          usernameList: [],
        }).getMsg(),
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = BuddyQueryListRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
