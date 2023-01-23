import { describe, expect } from '@jest/globals';
import { sha256 } from 'ethereum-cryptography/sha256';

describe('utils test', () => {
  it('test', async () => {
    expect(1).toEqual(1);
  });
  it('client version', async () => {
    const key_sha256 = sha256(Buffer.from('test'));
    const k1 = key_sha256.subarray(0, 16);
    const k2 = key_sha256.subarray(16, 32);
    console.log(key_sha256.toString('hex'));
    console.log(k1.toString('hex'));
    console.log(k2.toString('hex'));
    expect(key_sha256.length).toEqual(32);
    expect(k1.length).toEqual(16);
    expect(k2.length).toEqual(16);
  });
});
