import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupChangeMemberReq from '../../PTPGroup/GroupChangeMemberReq';
import GroupChangeMemberRes from '../../PTPGroup/GroupChangeMemberRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPGroup', () => {
  it('GroupChangeMemberReq test', async () => {
    const enMsg = new GroupChangeMemberReq({
      group_member_modify_action: PTPCommon.GroupMemberModifyAction.GroupMemberModifyAction_DEL,
      group_id: 0,
      members: [],
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new GroupChangeMemberReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPGroup client test', () => {
  it('GroupChangeMemberReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupChangeMemberReq({
        group_member_modify_action: PTPCommon.GroupMemberModifyAction.GroupMemberModifyAction_DEL,
        group_id: 0,
        members: [],
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = GroupChangeMemberRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
