import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import type { FileImgUploadRes_Type } from './types';

export default class FileImgUploadRes extends BaseMsg {
  constructor(msg?: FileImgUploadRes_Type) {
    super('PTP.File.FileImgUploadRes', msg);
  }
  getMsg(): FileImgUploadRes_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): FileImgUploadRes_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new FileImgUploadRes().decode(pdu.getPbBody());
    return msg;
  }
}
