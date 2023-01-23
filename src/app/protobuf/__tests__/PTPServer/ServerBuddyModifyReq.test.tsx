import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import ServerBuddyModifyReq from '../../PTPServer/ServerBuddyModifyReq';

describe('PTPServer', () => {
  it('ServerBuddyModifyReq test', async () => {
    const enMsg = new ServerBuddyModifyReq({
      auth_uid: 'auth_uid',
      pair_uid_list: [],
    }).encode();
    const deMsg = new ServerBuddyModifyReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPServer client test', () => {
  it('ServerBuddyModifyReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new ServerBuddyModifyReq({
        auth_uid: 'auth_uid',
        pair_uid_list: [],
      }).pack()
    );
    console.log(pdu);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
