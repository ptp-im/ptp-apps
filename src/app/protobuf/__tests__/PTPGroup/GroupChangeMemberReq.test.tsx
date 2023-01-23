import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import * as PTPCommon from '../../PTPCommon';
import GroupChangeMemberReq from '../../PTPGroup/GroupChangeMemberReq';
import GroupChangeMemberRes from '../../PTPGroup/GroupChangeMemberRes';

describe('PTPGroup', () => {
  it('GroupChangeMemberReq test', async () => {
    const enMsg = new GroupChangeMemberReq({
      group_member_modify_action:
        PTPCommon.GroupMemberModifyAction.GroupMemberModifyAction_DEL,
      group_id: 0,
      members: [],
    }).encode();
    const deMsg = new GroupChangeMemberReq().decode(enMsg);
    console.debug({ enMsg, deMsg });
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
        group_member_modify_action:
          PTPCommon.GroupMemberModifyAction.GroupMemberModifyAction_DEL,
        group_id: 0,
        members: [],
      }).pack()
    );
    console.debug(pdu);
    const msg = GroupChangeMemberRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
