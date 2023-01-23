import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import AuthLoginReq from '../../PTPAuth/AuthLoginReq';
import * as PTPCommon from '../../PTPCommon';

describe('PTPAuth', () => {
  it('AuthLoginReq test', async () => {
    const enMsg = new AuthLoginReq({
      address: 'address',
      captcha: 'captcha',
      client_type: PTPCommon.ClientType.CLIENT_TYPE_WIN,
      client_version: '',
      sign: Buffer.alloc(0),
    }).encode();
    const deMsg = new AuthLoginReq().decode(enMsg);
    console.debug({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPAuth client test', () => {
  it('AuthLoginReq test', async () => {
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

describe('PTPAuth users login test', () => {
  it('users  login test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);

    for (let i = 0; i < config.users.length; i++) {
      const { entropy } = config.users[i];
      const client = new MsgConnTest(entropy);
      client.setAutoReconnect(false);
      client.connect();
      await client.waitForMsgServerState(MsgConnTestState.connected);
      await client.login();
      await client.logout();
      await client.waitForMsgServerState(MsgConnTestState.closed);
    }
    expect(1).toEqual(1);
  });
});
