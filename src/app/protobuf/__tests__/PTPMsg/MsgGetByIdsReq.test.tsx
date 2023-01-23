import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import MsgGetByIdsReq from '../../PTPMsg/MsgGetByIdsReq';
import MsgGetByIdsRes from '../../PTPMsg/MsgGetByIdsRes';

describe('PTPMsg client test', () => {
  it('MsgGetByIdsReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new MsgGetByIdsReq({
        group_id: 609,
        msg_ids: [1, 2, 3, 4, 5, 6, 7],
      }).pack()
    );
    console.debug(pdu);
    const msg = MsgGetByIdsRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
