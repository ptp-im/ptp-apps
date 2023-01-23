import BaseMsg from '../BaseMsg';
import { SID, CID_FILE } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { FileImgUploadReq_Type } from './types';

export default class FileImgUploadReq extends BaseMsg {
  constructor(msg?: FileImgUploadReq_Type) {
    super('PTP.File.FileImgUploadReq', msg);
    this.setServiceId(SID.S_FILE);
    this.setCommandId(CID_FILE.CID_FileImgUploadReq);
  }
  getMsg(): FileImgUploadReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): FileImgUploadReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new FileImgUploadReq().decode(pdu.getPbBody());
    return msg;
  }
}
