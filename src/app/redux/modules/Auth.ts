import {
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
} from '@reduxjs/toolkit';
import { diff } from 'deep-object-diff';

import { isWeb } from '../../../utils';
import config from '../../config';
import AccountController from '../../helpers/AccountController';
import DbStorage from '../../helpers/DbStorage';
import { getUserIndexFromLocationUrl } from '../../helpers/utils';
import type { BuddyModifyRes_Type } from '../../protobuf/PTPBuddy/types';
import type { UserInfo_Type } from '../../protobuf/PTPCommon';
import { BuddyModifyAction } from '../../protobuf/PTPCommon';

export interface Account {
  accountId: number;
  address: string;
  note?: string;
  uid?: number;
}
export type NicknameOrNoteShowOption = 'note' | 'nickname';

export interface AuthState {
  accounts: Account[];
  currentUserInfo: UserInfo_Type | null;
  currentAccountIndex: number;
  currentMsgConnClientId: string;
  currentAccountIndexLoaded: boolean;
  nicknameOrNoteShowOption?: NicknameOrNoteShowOption;
  ids: EntityId[];
  entities: Dictionary<Account>;
}

const entityAdapter = createEntityAdapter<Account>({
  selectId: (entity) => entity.accountId,
  sortComparer: (a: Account, b: Account) => {
    return a.accountId - b.accountId;
  },
});

const initialState: AuthState = {
  currentAccountIndex: isWeb ? getUserIndexFromLocationUrl() : 0,
  currentAccountIndexLoaded: false,
  accounts: [],
  currentMsgConnClientId: '',
  currentUserInfo: null,
  nicknameOrNoteShowOption: undefined,
  ...entityAdapter.getInitialState(),
};

function saveCurrentAccountIndex(
  state: AuthState,
  payload: { currentAccountIndex?: number }
) {
  if (payload.currentAccountIndex !== undefined && !isWeb) {
    DbStorage.setItem(
      'currentAccountIndex',
      String(payload.currentAccountIndex)
    );
  }
  if (payload.currentAccountIndex !== undefined) {
    state.currentAccountIndex = payload.currentAccountIndex!;
  }
}

function upsertOne(state: AuthState, account: Account, accounts: Account[]) {
  if (
    !state.entities[account.accountId] ||
    diff(state.entities[account.accountId]!, account)
  ) {
    const newAccount = !state.entities[account.accountId]
      ? { ...account }
      : { ...state.entities[account.accountId], ...account };
    accounts.push(newAccount);
    DbStorage.setItem(
      `${config.dbPrefix.Account}` + account.accountId,
      JSON.stringify(newAccount)
    );
  }
}
const handleIds = (ids: number[], removeAccountId?: number) => {
  DbStorage.getItem(`${config.dbPrefix.Accounts}`)
    .then((accountIdsStr: string) => {
      let accountIds: number[] = [];
      if (accountIdsStr) {
        accountIds = JSON.parse(accountIdsStr);
      }
      let items = [...new Set([...accountIds, ...ids])];
      if (removeAccountId) {
        items = items.filter((accountId) => accountId !== removeAccountId);
      }
      items.sort((a, b) => a - b);
      // console.log('save accountIds', items);
      DbStorage.setItem(`${config.dbPrefix.Accounts}`, JSON.stringify(items));
      return items;
    })
    .catch(() => {
      console.error('accountIds save error');
    });
};

export const handleBuddyModify = (
  buddy_modify_action: BuddyModifyAction,
  value: string,
  userInfo: UserInfo_Type
) => {
  switch (buddy_modify_action) {
    case BuddyModifyAction.BuddyModifyAction_avatar:
      userInfo.avatar = value;
      break;
    case BuddyModifyAction.BuddyModifyAction_user_name:
      userInfo.user_name = value;
      break;
    case BuddyModifyAction.BuddyModifyAction_nickname:
      userInfo.nick_name = value;
      break;
    case BuddyModifyAction.BuddyModifyAction_sign_info:
      userInfo.sign_info = value;
      break;
    default:
      break;
  }
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    upsertAccount: (
      state: AuthState,
      { payload }: { payload: { account: Account } }
    ) => {
      let accounts: Account[] = [];
      upsertOne(state, payload.account, accounts);
      if (accounts.length > 0) {
        entityAdapter.upsertMany(state, accounts);
      }
    },
    initAccount: (
      state: AuthState,
      {
        payload,
      }: {
        payload: {
          currentMsgConnClientId?: string;
          nicknameOrNoteShowOption?: NicknameOrNoteShowOption;
          currentUserInfo: UserInfo_Type;
          accounts: Account[];
          currentAccountIndex?: number;
        };
      }
    ) => {
      if (payload.currentMsgConnClientId !== undefined) {
        state.currentMsgConnClientId = payload.currentMsgConnClientId;
      }

      if (payload.nicknameOrNoteShowOption !== undefined) {
        state.nicknameOrNoteShowOption = payload.nicknameOrNoteShowOption;
      }

      state.currentAccountIndexLoaded = true;
      state.currentUserInfo = payload.currentUserInfo;
      let accounts: Account[] = [];
      for (let i = 0; i < payload.accounts.length; i++) {
        const account = payload.accounts[i];
        upsertOne(state, account, accounts);
      }
      if (accounts.length > 0) {
        entityAdapter.upsertMany(state, accounts);
        const ids = JSON.parse(JSON.stringify(state.ids));
        handleIds(ids);
      }

      if (payload.currentAccountIndex !== undefined) {
        saveCurrentAccountIndex(state, payload);
      }
    },
    removeAccount: (
      state: AuthState,
      {
        payload,
      }: {
        payload: number;
      }
    ) => {
      const accountId = Number(state.ids[payload]);
      AccountController.getInstance(accountId).removeAccount();
      entityAdapter.removeOne(state, accountId);
      state.currentAccountIndex = payload - 1 < 0 ? 0 : payload - 1;
      const ids = JSON.parse(JSON.stringify(state.ids));
      handleIds(ids, accountId);
    },
    BuddyModifyRes: (
      state: AuthState,
      {
        payload,
      }: {
        payload: {
          BuddyModifyRes: BuddyModifyRes_Type;
          accountId: number;
        };
      }
    ) => {
      const { buddy_modify_action, value } = payload.BuddyModifyRes;
      const account = AccountController.getInstance(payload.accountId);
      let userInfo = {
        ...account.getUserInfo(),
      };
      handleBuddyModify(buddy_modify_action, value, userInfo);
      state.currentUserInfo = userInfo;
      account.setUserInfo(userInfo);
    },
    mergeState: (state: AuthState, { payload }) => {
      Object.assign(state, payload);
      saveCurrentAccountIndex(state, payload);
      if (payload.nicknameOrNoteShowOption !== undefined) {
        state.nicknameOrNoteShowOption = payload.nicknameOrNoteShowOption;
        DbStorage.setItem(
          'nicknameOrNoteShowOption',
          payload.nicknameOrNoteShowOption
        );
      }
    },
  },
});

export default AuthSlice.reducer;

export const authActions = AuthSlice.actions;
export const authSelectors = entityAdapter.getSelectors();
