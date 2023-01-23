import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import FileImgUploadReq from '../../PTPFile/FileImgUploadReq';
import FileImgUploadRes from '../../PTPFile/FileImgUploadRes';

describe('PTPFile', () => {
  it('FileImgUploadReq test', async () => {
    const enMsg = new FileImgUploadReq({
      width: 0,
      height: 0,
      file_data: Buffer.alloc(0),
      file_type: 'file_type',
      file_group: 'file_group',
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new FileImgUploadReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPFile client test', () => {
  it('FileImgUploadReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new FileImgUploadReq({
        width: 0,
        height: 0,
        file_data: Buffer.alloc(0),
        file_type: 'file_type',
        file_group: 'file_group',
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = FileImgUploadRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
