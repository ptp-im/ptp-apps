import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import * as PTPCommon from '../../PTPCommon';
import GroupCreateReq from '../../PTPGroup/GroupCreateReq';
import GroupCreateRes from '../../PTPGroup/GroupCreateRes';

describe('PTPGroup client test', () => {
  it('GroupCreateReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupCreateReq({
        group_idx: 0,
        sign: Buffer.alloc(0),
        captcha: 'captcha',
        group_type: PTPCommon.GroupType.GROUP_TYPE_PAIR,
        name: '',
        avatar: '',
        members: [],
      }).pack()
    );
    console.debug(pdu);
    const msg = GroupCreateRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
