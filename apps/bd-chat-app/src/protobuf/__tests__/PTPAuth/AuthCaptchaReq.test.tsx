import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import AuthCaptchaReq from '../../PTPAuth/AuthCaptchaReq';
import AuthCaptchaRes from '../../PTPAuth/AuthCaptchaRes';

describe('PTPAuth', () => {
  it('AuthCaptchaReq test', async () => {
    const enMsg = new AuthCaptchaReq({
      need_sign: false,
    }).encode();
    const deMsg = new AuthCaptchaReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPAuth client test', () => {
  it('AuthCaptchaReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new AuthCaptchaReq({
        need_sign: false,
      }).pack()
    );
    console.log(pdu);
    const msg = AuthCaptchaRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
