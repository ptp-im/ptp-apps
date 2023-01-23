import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import CaptchaReq from '../../PTPOther/CaptchaReq';
import CaptchaRes from '../../PTPOther/CaptchaRes';

describe('PTPOther', () => {
  it('CaptchaReq test', async () => {
    const enMsg = new CaptchaReq({}).encode();
    const deMsg = new CaptchaReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPOther client test', () => {
  it('CaptchaReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new CaptchaReq({
        
      }).pack()
    );
    console.log(pdu);
    const msg = CaptchaRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
