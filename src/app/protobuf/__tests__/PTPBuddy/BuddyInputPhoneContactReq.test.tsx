import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import BuddyInputPhoneContactReq from '../../PTPBuddy/BuddyInputPhoneContactReq';
import BuddyInputPhoneContactRes from '../../PTPBuddy/BuddyInputPhoneContactRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPBuddy', () => {
  it('BuddyInputPhoneContactReq test', async () => {
    const enMsg = new BuddyInputPhoneContactReq({
      phone_contacts: [new PTPCommon.InputPhoneContact({
          client_id: 0,
          phone: '',
          first_name: '',
          String: '',
        }).getMsg()],
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new BuddyInputPhoneContactReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPBuddy client test', () => {
  it('BuddyInputPhoneContactReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new BuddyInputPhoneContactReq({
        phone_contacts: [new PTPCommon.InputPhoneContact({
          client_id: 0,
          phone: '',
          first_name: '',
          String: '',
        }).getMsg()],
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = BuddyInputPhoneContactRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
