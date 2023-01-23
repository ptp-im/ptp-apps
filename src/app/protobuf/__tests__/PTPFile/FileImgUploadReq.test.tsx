import { describe, expect } from '@jest/globals';
import fs from 'fs';
// @ts-ignore
import fetch from 'node-fetch';

import config from '../../__config';
import { MsgConnTest, MsgConnTestState } from '../../ClientTest';
import FileImgUploadReq from '../../PTPFile/FileImgUploadReq';
import FileImgUploadRes from '../../PTPFile/FileImgUploadRes';

describe('PTPFile client test', () => {
  it('FileImgUploadReq test', async () => {
    jest.setTimeout(100000);
    const client = new MsgConnTest(config.AuthKey);
    client.setAutoReconnect(false);
    client.connect();
    await client.waitForMsgServerState(MsgConnTestState.connected);
    await client.login();
    let file_data = fs.readFileSync('/Users/jack/data/test.jpg');
    // file_data = Buffer.from('xx');
    console.debug('file_data.length:', file_data.length, file_data);
    const pdu = await client.SendPduWithCallback(
      new FileImgUploadReq({
        width: 10,
        height: 10,
        file_group: 'avatar',
        file_data,
        file_type: 'jpg',
      }).pack()
    );
    console.debug(pdu);
    const msg = FileImgUploadRes.handlePdu(pdu);
    console.debug(msg);
    await client.logout();
    await client.waitForMsgServerState(MsgConnTestState.closed);
    expect(1).toEqual(1);
  });
  it('FileImgUploadReq test1', async () => {
    jest.setTimeout(100000);
    let file_data = fs.readFileSync('/Users/jack/data/temp/test.jpg');
    console.debug('file_data.length:', file_data.length, file_data);
    const pdu = new FileImgUploadReq({
      width: 10,
      height: 10,
      file_data,
      file_group: 'avatar',
      file_type: 'image/jpg',
    }).encode();
    console.debug('getPbBody.length:', pdu.length);

    const res = await fetch(config.msfsServer, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: pdu,
    });
    const t = await res.json();

    // const data = await res.buffer();
    // const t = new FileImgUploadRes().decode(data);
    console.log(`${config.msfsServer}/${t.file_path}`);
    expect(1).toEqual(1);
  });
});
