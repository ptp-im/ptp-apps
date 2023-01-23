import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import MsgReadAckReq from '../../PTPMsg/MsgReadAckReq';

describe('PTPMsg client test', () => {
  it('MsgReadAckReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPdu(
      new MsgReadAckReq({
        group_id: 609,
        msg_id: 9,
      }).pack()
    );
    console.debug(pdu);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
