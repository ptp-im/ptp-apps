import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { FileImgDownloadRes_Type } from './types';

export default class FileImgDownloadRes extends BaseMsg {
  constructor(msg?: FileImgDownloadRes_Type) {
    super('PTP.File.FileImgDownloadRes', msg);
  }
  getMsg(): FileImgDownloadRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): FileImgDownloadRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new FileImgDownloadRes().decode(pdu.getPbBody());
    return msg;
  }
}
