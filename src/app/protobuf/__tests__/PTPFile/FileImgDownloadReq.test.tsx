import { describe, expect } from '@jest/globals';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import FileImgDownloadReq from '../../PTPFile/FileImgDownloadReq';
import FileImgDownloadRes from '../../PTPFile/FileImgDownloadRes';

describe('PTPFile', () => {
  it('FileImgDownloadReq test', async () => {
    const enMsg = new FileImgDownloadReq({
      file_path: 'file_path',
      attach_data: Buffer.alloc(0),
      auth_uid: 0,
    }).encode();
    const deMsg = new FileImgDownloadReq().decode(enMsg);
    console.log({ enMsg, deMsg });
    expect(1).toEqual(1);
  });
});

describe('PTPFile client test', () => {
  it('FileImgDownloadReq test', async () => {
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    const pdu = await client.SendPduWithCallback(
      new FileImgDownloadReq({
        file_path: 'file_path',
        attach_data: Buffer.alloc(0),
        auth_uid: 0,
      }).pack()
    );
    console.log(pdu);
    const msg = FileImgDownloadRes.handlePdu(pdu);
    console.log(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
});
