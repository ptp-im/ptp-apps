import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupPreCreateReq from '../../PTPGroup/GroupPreCreateReq';
import GroupPreCreateRes from '../../PTPGroup/GroupPreCreateRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPGroup', () => {
  it('GroupPreCreateReq test', async () => {
    const enMsg = new GroupPreCreateReq({
      group_type: PTPCommon.GroupType.GROUP_TYPE_PAIR,
      members: [],
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new GroupPreCreateReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPGroup client test', () => {
  it('GroupPreCreateReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupPreCreateReq({
        group_type: PTPCommon.GroupType.GROUP_TYPE_PAIR,
        members: [],
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = GroupPreCreateRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
