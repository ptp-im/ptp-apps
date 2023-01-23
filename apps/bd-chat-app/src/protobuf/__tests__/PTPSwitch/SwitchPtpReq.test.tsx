import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import SwitchPtpReq from '../../PTPSwitch/SwitchPtpReq';
import SwitchPtpRes from '../../PTPSwitch/SwitchPtpRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPSwitch', () => {
  it('SwitchPtpReq test', async () => {
    const enMsg = new SwitchPtpReq({
      to_adr: 'to_adr',
      data: 'data',
      switch_type: PTPCommon.SwitchType.SwitchType_Apply,
    }).encode();
    const deMsg = new SwitchPtpReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPSwitch client test', () => {
  it('SwitchPtpReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new SwitchPtpReq({
        to_adr: 'to_adr',
        data: 'data',
        switch_type: PTPCommon.SwitchType.SwitchType_Apply,
      }).pack()
    );
    console.log(pdu);
    const msg = SwitchPtpRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
