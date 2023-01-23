import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import GroupModifyReq from '../../PTPGroup/GroupModifyReq';
import GroupModifyRes from '../../PTPGroup/GroupModifyRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPGroup', () => {
  it('GroupModifyReq test', async () => {
    const enMsg = new GroupModifyReq({
      group_modify_action: PTPCommon.GroupModifyAction.GroupModifyAction_name,
      group_id: 0,
      value: 'value',
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new GroupModifyReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPGroup client test', () => {
  it('GroupModifyReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new GroupModifyReq({
        group_modify_action: PTPCommon.GroupModifyAction.GroupModifyAction_name,
        group_id: 0,
        value: 'value',
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = GroupModifyRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
