// DO NOT EDIT
import type * as PTPCommon from '../PTPCommon';

export interface SwitchDevicesNotify_Type {
  devices?: PTPCommon.DevicesInfo_Type[];
}
export interface SwitchDevicesReq_Type {
  browser_name: string;
  browser_version: string;
  os_name: string;
  os_version: string;
  is_intel: boolean;
  client_id: string;
}
export interface SwitchPtpNotify_Type {
  from_adr: string;
  data: string;
  switch_type: PTPCommon.SwitchType;
}
export interface SwitchPtpReq_Type {
  to_adr: string;
  data: string;
  switch_type: PTPCommon.SwitchType;
}
export interface SwitchPtpRes_Type {
  error: PTPCommon.ERR;
}
