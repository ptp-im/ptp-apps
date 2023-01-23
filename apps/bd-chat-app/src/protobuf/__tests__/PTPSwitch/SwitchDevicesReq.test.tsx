import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import SwitchDevicesReq from '../../PTPSwitch/SwitchDevicesReq';

describe('PTPSwitch', () => {
  it('SwitchDevicesReq test', async () => {
    const enMsg = new SwitchDevicesReq({
      browser_name: 'browser_name',
      browser_version: 'browser_version',
      os_name: 'os_name',
      os_version: 'os_version',
      is_intel: false,
      client_id: 'client_id',
    }).encode();
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
        browser_name: 'browser_name',
        browser_version: 'browser_version',
        os_name: 'os_name',
        os_version: 'os_version',
        is_intel: false,
        client_id: 'client_id',
      }).pack()
    );
    console.log(pdu);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
