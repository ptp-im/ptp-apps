import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import SwitchDevicesReq from '../../PTPSwitch/SwitchDevicesReq';
import SwitchDevicesRes from '../../PTPSwitch/SwitchDevicesRes';

describe('PTPSwitch', () => {
  it('SwitchDevicesReq test', async () => {
    const enMsg = new SwitchDevicesReq({}).encode();
    const deMsg = new SwitchDevicesReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPSwitch client test', () => {
  it('SwitchDevicesReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new SwitchDevicesReq({
        
      }).pack()
    );
    console.log(pdu);
    const msg = SwitchDevicesRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
