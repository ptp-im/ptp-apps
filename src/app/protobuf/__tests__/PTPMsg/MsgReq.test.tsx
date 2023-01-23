import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import * as PTPCommon from '../../PTPCommon';
import { MsgRes } from '../../PTPMsg';
import MsgReq from '../../PTPMsg/MsgReq';

describe('PTPMsg client test', () => {
  it('MsgReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new MsgReq({
        group_adr: '0x91cb577426b46f89f5491cb66007d142f1d87f34',
        sent_at: +new Date() / 1000,
        msg_type: PTPCommon.MsgType.MSG_TYPE_TEXT,
        msg_data: 'Hello world!!',
      }).pack()
    );
    console.debug(pdu);
    const msg1 = MsgRes.handlePdu(pdu);
    console.debug(msg1);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
