import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import ServerLoginReq from '../../PTPServer/ServerLoginReq';
import ServerLoginRes from '../../PTPServer/ServerLoginRes';

describe('PTPServer', () => {
  it('ServerLoginReq test', async () => {
    const enMsg = new ServerLoginReq({
      address: 'address',
      captcha: 'captcha',
      sign: Buffer.alloc(0),
      attach_data: Buffer.alloc(0),
    }).encode();
    const deMsg = new ServerLoginReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPServer client test', () => {
  it('ServerLoginReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new ServerLoginReq({
        address: 'address',
        captcha: 'captcha',
        sign: Buffer.alloc(0),
        attach_data: Buffer.alloc(0),
      }).pack()
    );
    console.log(pdu);
    const msg = ServerLoginRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
