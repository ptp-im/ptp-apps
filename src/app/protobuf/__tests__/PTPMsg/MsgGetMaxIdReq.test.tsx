import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import MsgGetMaxIdReq from '../../PTPMsg/MsgGetMaxIdReq';
import MsgGetMaxIdRes from '../../PTPMsg/MsgGetMaxIdRes';

describe('PTPMsg client test', () => {
  it('MsgGetMaxIdReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new MsgGetMaxIdReq({
        group_id: 609,
      }).pack()
    );
    console.debug(pdu);
    const msg = MsgGetMaxIdRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
