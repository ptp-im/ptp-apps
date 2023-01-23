import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupGetMembersListReq from '../../PTPGroup/GroupGetMembersListReq';
import GroupGetMembersListRes from '../../PTPGroup/GroupGetMembersListRes';

describe('PTPGroup client test', () => {
  it('GroupGetMembersListReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupGetMembersListReq({
        group_members_updated_time: 0,
        group_id: 609,
      }).pack()
    );
    console.debug(pdu);
    const msg = GroupGetMembersListRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
