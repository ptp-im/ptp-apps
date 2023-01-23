import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import AuthCaptchaReq from '../../PTPAuth/AuthCaptchaReq';
import AuthCaptchaRes from '../../PTPAuth/AuthCaptchaRes';

describe('PTPAuth client test', () => {
  it('AuthCaptchaReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    const pdu = await client.SendPduWithCallback(new AuthCaptchaReq({}).pack());
    console.debug(pdu);
    const msg = AuthCaptchaRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
