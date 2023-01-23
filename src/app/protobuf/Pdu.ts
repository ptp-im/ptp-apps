import {
  wrapByteBuffer,
  readInt32,
  readInt16,
  popByteBuffer,
  writeInt32,
  writeInt16,
  writeBytes,
  toUint8Array,
} from './helpers';
import type {
  SID,
  CID_MSG,
  CID_BUDDY,
  CID_OTHER,
  CID_GROUP,
  CID_FILE,
  CID_AUTH,
  CID_SERVER,
  CID_SWITCH,
} from './PTPCommon';

export const HEADER_LEN: number = 16;

export type Service_Id_Enums = SID;

export type Command_Id_Enums =
  | CID_MSG
  | CID_BUDDY
  | CID_AUTH
  | CID_GROUP
  | CID_FILE
  | CID_OTHER
  | CID_SERVER
  | CID_SWITCH;

export interface Header {
  length: number;
  version: number;
  flag: number;
  service_id: SID;
  command_id:
    | CID_MSG
    | CID_BUDDY
    | CID_AUTH
    | CID_GROUP
    | CID_OTHER
    | CID_FILE
    | CID_SERVER
    | CID_SWITCH;
  seq_num: number;
  reversed: number;
}

export class Pdu {
  private _pbData: Uint8Array;
  private _pbHeader: Header;
  private _pbBody: Uint8Array;

  constructor(data?: Uint8Array) {
    this._pbData = new Uint8Array();
    this._pbBody = new Uint8Array();
    this._pbHeader = {
      length: 0,
      version: 0,
      flag: 0,
      service_id: 0,
      command_id: 0,
      seq_num: 0,
      reversed: 0,
    };
    if (data) {
      this.setPbData(data);
      this.readPbData();
    }
  }

  getPbData(): Uint8Array {
    return this._pbData;
  }

  setPbData(data: Uint8Array) {
    this._pbData = data;
  }

  getPbDataLength(): number {
    return this._pbData.length;
  }

  getPbBody(): Uint8Array {
    return this._pbBody;
  }

  getPbBodyLength(): number {
    return this._pbBody.length;
  }

  setPbBody(body: Uint8Array) {
    this._pbBody = body;
  }

  writeData(
    body: Uint8Array,
    service_id: Service_Id_Enums,
    command_id: Command_Id_Enums,
    seq_num: number = 0,
    reversed: number = 0
  ) {
    this.setPbBody(body);
    let bb = popByteBuffer();
    this._pbHeader = {
      length: body.length + HEADER_LEN,
      version: 0,
      flag: 0,
      service_id,
      command_id,
      seq_num: seq_num,
      reversed,
    };
    writeInt32(bb, this._pbHeader.length);
    writeInt16(bb, this._pbHeader.version);
    writeInt16(bb, this._pbHeader.flag);
    writeInt16(bb, this._pbHeader.service_id);
    writeInt16(bb, this._pbHeader.command_id);
    writeInt16(bb, this._pbHeader.seq_num);
    writeInt16(bb, this._pbHeader.reversed);
    writeBytes(bb, Buffer.from(body));
    this.setPbData(toUint8Array(bb));
  }

  readPbData() {
    const headerBb = wrapByteBuffer(this._pbData.slice(0, HEADER_LEN));
    this._pbHeader.length = readInt32(headerBb);
    this._pbHeader.version = readInt16(headerBb);
    this._pbHeader.flag = readInt16(headerBb);
    this._pbHeader.service_id = readInt16(headerBb);
    this._pbHeader.command_id = readInt16(headerBb);
    this._pbHeader.seq_num = readInt16(headerBb);
    this._pbHeader.reversed = readInt16(headerBb);
    this.setPbBody(this._pbData.slice(HEADER_LEN, this._pbHeader.length));
  }

  getCommandId(): Command_Id_Enums {
    return this._pbHeader.command_id;
  }

  getReversed(): number {
    return this._pbHeader.reversed;
  }
  getSeqNum(): Command_Id_Enums {
    return this._pbHeader.seq_num;
  }
  getServiceId(): Service_Id_Enums {
    return this._pbHeader.service_id;
  }
}
