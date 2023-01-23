import { Pdu } from './Pdu';

const PB = require('./protobuf');

let seq_num = 0;

export default class BaseMsg {
  private __sid?: any;
  private __cid?: any;
  private __msg?: any;
  private __pb: any;
  constructor(namespace: string, msg?: any) {
    const t = namespace.split('.');
    let pb = PB.default;
    do {
      const k = t.shift();
      // @ts-ignore
      pb = pb[k];
    } while (t.length > 0);
    this.__pb = pb;
    this.__setMsg(msg);
  }
  protected setServiceId(sid: any) {
    this.__sid = sid;
  }
  protected setCommandId(cid: any) {
    this.__cid = cid;
  }
  protected __setMsg(msg: any) {
    this.__msg = msg;
  }
  protected __getMsg() {
    return this.__msg;
  }
  encode(): Uint8Array {
    return this.__E();
  }
  toHex(): string {
    return Buffer.from(this.__E()).toString('hex');
  }
  fromHex(hexStr: string): any {
    if (hexStr.indexOf('0x') === 0) {
      hexStr = hexStr.substring(2);
    }
    return this.__D(Buffer.from(hexStr, 'hex'));
  }
  protected __E(): Uint8Array {
    const obj = this.__pb.create(this.__getMsg());
    return this.__pb.encode(obj).finish();
  }
  protected __D(data: Uint8Array): any {
    const obj = this.__pb.decode(data);
    return this.__pb.toObject(obj);
  }
  protected __pack(): Pdu {
    const pdu = new Pdu();
    if (seq_num > 10000) {
      seq_num = 0;
    }
    pdu.writeData(this.__E(), this.__sid, this.__cid, ++seq_num);
    return pdu;
  }
}
