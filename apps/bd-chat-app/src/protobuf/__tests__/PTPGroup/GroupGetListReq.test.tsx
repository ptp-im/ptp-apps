import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupGetListReq from '../../PTPGroup/GroupGetListReq';
import GroupGetListRes from '../../PTPGroup/GroupGetListRes';

describe('PTPGroup', () => {
  it('GroupGetListReq test', async () => {
    const enMsg = new GroupGetListReq({
      group_info_updated_time: 0,
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new GroupGetListReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPGroup client test', () => {
  it('GroupGetListReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupGetListReq({
        group_info_updated_time: 0,
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = GroupGetListRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
