import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import AuthLogoutReq from '../../PTPAuth/AuthLogoutReq';

describe('PTPAuth', () => {
  it('AuthLogoutReq test', async () => {
    const enMsg = new AuthLogoutReq({}).encode();
    const deMsg = new AuthLogoutReq().decode(enMsg);
    console.debug({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPAuth client test', () => {
  it('AuthLogoutReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
