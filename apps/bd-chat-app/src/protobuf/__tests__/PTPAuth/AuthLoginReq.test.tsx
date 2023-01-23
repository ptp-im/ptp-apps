import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import AuthLoginReq from '../../PTPAuth/AuthLoginReq';
import AuthLoginRes from '../../PTPAuth/AuthLoginRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPAuth', () => {
  it('AuthLoginReq test', async () => {
    const enMsg = new AuthLoginReq({
      address: 'address',
      captcha: 'captcha',
      client_type: PTPCommon.ClientType.CLIENT_TYPE_WEB,
      client_version: '',
      sign: Buffer.alloc(0),
    }).encode();
    const deMsg = new AuthLoginReq().decode(enMsg);
    console.log({ enMsg, deMsg });
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
    const pdu = await client.SendPduWithCallback(
      new AuthLoginReq({
        address: 'address',
        captcha: 'captcha',
        client_type: PTPCommon.ClientType.CLIENT_TYPE_WEB,
        client_version: '',
        sign: Buffer.alloc(0),
      }).pack()
    );
    console.log(pdu);
    const msg = AuthLoginRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
