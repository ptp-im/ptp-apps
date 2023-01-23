import { Platform } from 'react-native';

import { isWeb } from '../../utils';

let dbPrefixVersion: string = 'v2.0.17';

export interface ConfigType {
  errMsg: {
    E_USERNAME_EXISTS: string;
    E_REASON_NO_DB_SERVER: string;
  };
  siteTitle: string;
  clientVersion: string;
  im: {
    maxLoadMsgCnt: number;
    msfsServer: string;
  };
  appConfig: {
    isLargeScreen?: boolean;
  };
  msgServer: {
    loginApi: string;
    wsUrl: string;
  };
  dbPrefix: {
    Sessions: string;
    Msg: string;
    MsgSending: string;
    MsgIds: string;
    User: string;
    Account: string;
    Key: string;
    Accounts: string;
    Group: string;
    GroupRecord: string;
    GroupIds: string;
    GroupSelectedId: string;
    GroupInfoUpdatedTime: string;
    GroupMembersUpdatedTime: string;
    BuddyUpdatedTime: string;
  };
}

if (isWeb) {
  if (window.localStorage.getItem('dbPrefixVersion')) {
    dbPrefixVersion = window.localStorage.getItem('dbPrefixVersion')!;
  } else {
    window.localStorage.setItem('dbPrefixVersion', dbPrefixVersion);
  }
}

const Config: ConfigType = {
  errMsg: {
    E_USERNAME_EXISTS: '用户名已存在',
    E_REASON_NO_DB_SERVER: '系统错误，请稍后再试',
  },
  clientVersion: 'ptp.v1',
  im: {
    maxLoadMsgCnt: 20,
    msfsServer: 'http://192.168.43.244:7841',
  },
  siteTitle: '柚子',
  appConfig: {
    isLargeScreen: Platform.OS === 'web',
  },
  msgServer: {
    wsUrl: 'ws://127.0.0.1:7881',
    // wsUrl: 'ws://192.168.43.244:7881',
    loginApi: 'http://192.168.43.244:7832/msg_server',
  },
  dbPrefix: {
    Msg: `M_`,
    MsgSending: `MSI_`,
    MsgIds: `MS_`,
    User: `U_`,
    Key: `K_`,
    Account: `A_`,
    Group: `G_`,
    Accounts: `${dbPrefixVersion}_AS_`,
    GroupRecord: `${dbPrefixVersion}_GR_1_`,
    GroupIds: `${dbPrefixVersion}_GIS_`,
    Sessions: `${dbPrefixVersion}_SS_`,
    GroupInfoUpdatedTime: `${dbPrefixVersion}_GIUT_1_`,
    GroupMembersUpdatedTime: `${dbPrefixVersion}_GMUT_1_`,
    BuddyUpdatedTime: `${dbPrefixVersion}_BUT_1_`,
    GroupSelectedId: `${dbPrefixVersion}_GroupSelectedId_`,
  },
};

export default Config;
