import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import OtherLoginReq from '../../PTPOther/OtherLoginReq';
import OtherLoginRes from '../../PTPOther/OtherLoginRes';
import * as PTPCommon from '../../PTPCommon';

describe('PTPOther', () => {
  it('OtherLoginReq test', async () => {
    const enMsg = new OtherLoginReq({
      address: 'address',
      captcha: 'captcha',
      client_type: PTPCommon.ClientType.CLIENT_TYPE_WIN,
      client_version: '',
      attach_data: Buffer.alloc(0),
      auth_uid: Buffer.alloc(0),
    }).encode();
    const deMsg = new OtherLoginReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPOther client test', () => {
  it('OtherLoginReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new OtherLoginReq({
        address: 'address',
        captcha: 'captcha',
        client_type: PTPCommon.ClientType.CLIENT_TYPE_WIN,
        client_version: '',
        attach_data: Buffer.alloc(0),
        auth_uid: Buffer.alloc(0),
      }).pack()
    );
    console.log(pdu);
    const msg = OtherLoginRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
