import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import * as PTPCommon from '../../PTPCommon';
import { ERR } from '../../PTPCommon';
import { GroupCreateReq, GroupCreateRes } from '../../PTPGroup';
import GroupPreCreateReq from '../../PTPGroup/GroupPreCreateReq';
import GroupPreCreateRes from '../../PTPGroup/GroupPreCreateRes';

describe('PTPGroup client test', () => {
  it('GroupPreCreateReq test GROUP_TYPE_PAIR', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    // const paris = [[100000], [100001], [100002], [100003], [100004]];
    const paris = [[100005]];
    for (let i = 0; i < paris.length; i++) {
      const m = {
        group_type: PTPCommon.GroupType.GROUP_TYPE_PAIR,
        members: paris[i],
      };
      const pdu = await client.SendPduWithCallback(
        new GroupPreCreateReq(m).pack()
      );
      console.debug(pdu);
      const { group_adr, group_idx } = GroupPreCreateRes.handlePdu(pdu);
      console.debug({ group_adr, group_idx });
      if (group_adr === '') {
        const captcha = await client.random();
        console.debug('SendPduWithCallback...');
        const pdu1 = await client.SendPduWithCallback(
          new GroupCreateReq({
            avatar: '',
            name: '',
            captcha: captcha,
            group_idx: group_idx,
            sign: client.signGroupMessage(`${group_idx}${captcha}`, group_idx),
            ...m,
          }).pack()
        );
        console.debug(pdu1);
        const { error, group, group_members } = GroupCreateRes.handlePdu(pdu1);
        console.debug(ERR[error]);
        console.debug({ error, group, group_members });
      } else {
        console.debug('group_adr is not null');
      }
    }

    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
  it('GroupPreCreateReq test GROUP_TYPE_MULTI', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    for (let i = 0; i < 2; i++) {
      const m = {
        group_type: PTPCommon.GroupType.GROUP_TYPE_MULTI,
        members: [100000, 100001, 100002, 100003, 100004],
      };
      const pdu = await client.SendPduWithCallback(
        new GroupPreCreateReq(m).pack()
      );
      const { group_adr, group_idx } = GroupPreCreateRes.handlePdu(pdu);
      console.debug({ group_adr, group_idx });
      if (group_adr === '') {
        const captcha = await client.random();
        console.debug('SendPduWithCallback...');
        const pdu1 = await client.SendPduWithCallback(
          new GroupCreateReq({
            avatar: 'avatar1',
            name: 'GroupName_' + i,
            captcha: captcha,
            group_idx: group_idx,
            sign: client.signGroupMessage(`${group_idx}${captcha}`, group_idx),
            ...m,
          }).pack()
        );
        console.debug(pdu1);
        const { error, group, group_members } = GroupCreateRes.handlePdu(pdu1);
        console.debug(ERR[error]);
        console.debug({ error, group, group_members });
      } else {
        console.debug('group_adr is not null');
      }
    }

    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
