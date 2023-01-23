import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import * as PTPCommon from '../../PTPCommon';
import GroupModifyReq from '../../PTPGroup/GroupModifyReq';
import GroupModifyRes from '../../PTPGroup/GroupModifyRes';
import { randAvatar, randFirstName } from '@ngneat/falso';
import GroupGetListReq from '../../PTPGroup/GroupGetListReq';
import GroupGetListRes from '../../PTPGroup/GroupGetListRes';

describe('PTPGroup client test', () => {
  it('GroupModifyReq test', async () => {
    const client111 = new MsgConnTest(config.AuthKey);
    client111.setAutoReconnect(false);
    client111.connect();
    await client111.waitForMsgServerState(MsgConnTestState.connected);
    await client111.login();
    const pdu1111 = await client111.SendPduWithCallback(
      new GroupGetListReq({
        group_info_updated_time: 0,
      }).pack()
    );
    console.debug(pdu1111);
    const { dispatch } = GroupGetListRes.handlePdu(pdu1111);

    await client111.logout();
    await client111.waitForMsgServerState(MsgConnTestState.closed);

    for (let i = 0; i < dispatch.payload.groups!.length; i++) {
      const group = dispatch.payload.groups![i];
      if (group.pair_uid) {
        continue;
      }
      const client = new MsgConnTest(config.AuthKey);
      client.setAutoReconnect(false);
      client.connect();
      await client.waitForMsgServerState(MsgConnTestState.connected);
      await client.login();
      const pdu = await client.SendPduWithCallback(
        new GroupModifyReq({
          group_modify_action:
            PTPCommon.GroupModifyAction.GroupModifyAction_name,
          group_id: group.group_id,
          value: 'G_' + randFirstName(),
        }).pack()
      );
      console.debug(pdu);
      const msg = GroupModifyRes.handlePdu(pdu);
      console.debug(msg);

      const pdu1 = await client.SendPduWithCallback(
        new GroupModifyReq({
          group_modify_action:
            PTPCommon.GroupModifyAction.GroupModifyAction_avatar,
          group_id: group.group_id,
          value: randAvatar(),
        }).pack()
      );
      console.debug(pdu1);
      const msg1 = GroupModifyRes.handlePdu(pdu1);
      console.debug(msg1);
      await client.logout();
      await client.waitForMsgServerState(MsgConnTestState.closed);
    }

    expect(1).toEqual(1);
  });
});
