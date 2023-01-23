import BaseMsg from '../BaseMsg';
import { SID, CID_FILE } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { FileImgDownloadReq_Type } from './types';

export default class FileImgDownloadReq extends BaseMsg {
  constructor(msg?: FileImgDownloadReq_Type) {
    super('PTP.File.FileImgDownloadReq', msg);
    this.setServiceId(SID.S_FILE);
    this.setCommandId(CID_FILE.CID_FileImgDownloadReq);
  }
  getMsg(): FileImgDownloadReq_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): FileImgDownloadReq_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new FileImgDownloadReq().decode(pdu.getPbBody());
    return msg;
  }
}
