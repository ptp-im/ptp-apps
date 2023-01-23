import { describe, expect } from '@jest/globals';

import AccountController from '../../helpers/AccountController';
import MsgConn, { MsgClientState } from '../../helpers/MsgConn';

describe('client test', () => {
  it('test Account', async () => {
    const accountId = 1001;
    const account = AccountController.getInstance(accountId);
    expect(account.getAccountId()).toEqual(1001);
    expect(account.getAddress()).toEqual(undefined);
    const accountAddress = await account.getAccountAddress();
    const accountAddress1 = await account.getAccountAddress();
    expect(accountAddress).toEqual(accountAddress1);
    const message = 'test';
    const sign = await account.signMessage(message);
    const accountAddress2 = account.verifyRecoverAddress(sign, message);
    expect(accountAddress2).toEqual(accountAddress1);
  });

  it('test Client', async () => {
    const accountId = 1001;

    const client = MsgConn.getInstance(accountId);
    expect(accountId).toEqual(client.getAccountId());
    client.connect();

    const connectRes = await client.waitForMsgServerState(
      MsgClientState.connected
    );
    expect(connectRes).toEqual(true);

    const connectingRes_close = await client.waitForMsgServerState(
      MsgClientState.closed,
      1000
    );
    expect(connectingRes_close).toEqual(false);

    const connectingRes_connecting = await client.waitForMsgServerState(
      MsgClientState.connecting,
      1000
    );
    expect(connectingRes_connecting).toEqual(false);

    await client.waitTime(10001);
    await client.close();
    const connectingRes_close1 = await client.waitForMsgServerState(
      MsgClientState.closed
    );
    expect(connectingRes_close1).toEqual(true);
  });
});
