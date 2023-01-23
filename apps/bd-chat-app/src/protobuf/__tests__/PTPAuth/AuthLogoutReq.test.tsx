import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import AuthLogoutReq from '../../PTPAuth/AuthLogoutReq';
import AuthLogoutRes from '../../PTPAuth/AuthLogoutRes';

describe('PTPAuth', () => {
  it('AuthLogoutReq test', async () => {
    const enMsg = new AuthLogoutReq({}).encode();
    const deMsg = new AuthLogoutReq().decode(enMsg);
    console.log({ enMsg, deMsg });
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
    const pdu = await client.SendPduWithCallback(
      new AuthLogoutReq({
        
      }).pack()
    );
    console.log(pdu);
    const msg = AuthLogoutRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
