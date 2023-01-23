import * as React from 'react';
import { useState } from 'react';

import type { EntityId } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { isWeb } from '../../../utils';
import config from '../../config';
import AccountController from '../../helpers/AccountController';
import DbStorage from '../../helpers/DbStorage';
import MsgConn, { MsgClientState } from '../../helpers/MsgConn';
import type { UserInfo_Type } from '../../protobuf/PTPCommon';
import { appActions, hideLoading } from '../../redux/modules/App';
import type { Account, AuthState } from '../../redux/modules/Auth';
import { authActions, authSelectors } from '../../redux/modules/Auth';
import { useTypedDispatch } from '../../redux/store';

export function changeUrlQueryParam(currentAccountIndex: number) {
  const url = new URL(window.location.href);
  if (String(currentAccountIndex) !== url.searchParams.get('u')) {
    url.searchParams.set('u', String(currentAccountIndex));
    //@ts-ignore
    window.history.pushState(
      null,
      '',
      `${url.pathname}?${url.searchParams.toString()}`
    );
  }
}

const MsgConnManager: React.FC = () => {
  debugger;
  let accountIds = useSelector(({ auth }: { auth: AuthState }) =>
    authSelectors.selectIds(auth)
  );
  let accountEntities = useSelector(
    ({ auth }: { auth: AuthState }) => auth.entities
  );
  let nicknameOrNoteShowOption = useSelector(
    ({ auth }: { auth: AuthState }) => auth.nicknameOrNoteShowOption
  );
  // console.debug(accounts);
  const currentAccountIndex = useSelector(
    ({ auth }: { auth: AuthState }) => auth.currentAccountIndex
  );
  const [accountIndex, setAccountIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const dispatch = useTypedDispatch();
  React.useEffect(() => {
    const initAccount = async () => {
      debugger;
      if (!loading && currentAccountIndex !== accountIndex) {
        setLoading(true);
        let account: Account;
        let accountId: EntityId;
        let currentUserInfo: UserInfo_Type;
        let accounts: Account[] = [];
        let accountIds_ = accountIds;

        if (nicknameOrNoteShowOption === undefined) {
          let nicknameOrNoteShowOptionStr = await DbStorage.getItem(
            'nicknameOrNoteShowOption'
          );
          if (nicknameOrNoteShowOptionStr) {
            nicknameOrNoteShowOption = nicknameOrNoteShowOptionStr;
          } else {
            nicknameOrNoteShowOption = 'nickname';
          }
        }
        if (accountIds_.length === 0) {
          let accountIdsStr = await DbStorage.getItem(
            `${config.dbPrefix.Accounts}`
          );
          if (accountIdsStr) {
            accountIds_ = JSON.parse(accountIdsStr);
          }
        }
        if (accountIds_.length === 0) {
          const { accountId, address } =
            await AccountController.initAccountId();
          accounts.push({
            accountId,
            address: address!,
          });
        } else {
          for (let i = 0; i < accountIds_.length; i++) {
            const accountId = Number(accountIds_[i]);
            let account = AccountController.getInstance(accountId).getAccount();
            if (!account) {
              const accountStr = await DbStorage.getItem(
                `${config.dbPrefix.Account}` + accountId
              );
              if (accountStr) {
                account = JSON.parse(accountStr);
              }
            }
            if (account) {
              accounts.push({ ...account, accountId });
            }
          }
        }
        let accountIndex_: number = currentAccountIndex;
        if (!isWeb) {
          const accountIndexStr = await DbStorage.getItem(
            'currentAccountIndex'
          );
          if (accountIndexStr) {
            accountIndex_ = Number(accountIndexStr);
          }
        }
        if (accounts.length <= accountIndex_) {
          accountIndex_ = accounts.length;
          const { accountId, address } =
            await AccountController.initAccountId();
          accounts.push({
            accountId,
            address: address!,
          });
        }
        accountId = accounts[accountIndex_].accountId;

        account = accounts[accountIndex_];
        currentUserInfo = await AccountController.getInstance(accountId).init(
          account
        );
        AccountController.setCurrentAccountId(accountId);
        dispatch(
          authActions.initAccount({
            nicknameOrNoteShowOption,
            currentAccountIndex: accountIndex_,
            accounts,
            currentUserInfo,
          })
        );

        if (!isWeb) {
          const currentTabIndexStr = await DbStorage.getItem('currentTabIndex');
          dispatch(
            appActions.mergeState({
              currentTabIndex: currentTabIndexStr
                ? Number(currentTabIndexStr)
                : 0,
            })
          );
        } else {
          changeUrlQueryParam(accountIndex_);
        }
        AccountController.setCurrentAccountId(accountId);

        try {
          const client = MsgConn.getInstance(Number(accountId));
          client.setMsgHandler((res: any) => {
            if (res.dispatch) {
              let dispatches: any[] = [];
              if (Object.keys(res.dispatch).includes('type')) {
                dispatches.push(res.dispatch);
              } else {
                dispatches = res.dispatch;
              }
              for (let i = 0; i < dispatches.length; i++) {
                const dispatchObj = dispatches[i];
                dispatch(dispatchObj);
                if (dispatchObj.type == 'auth/initAccount') {
                  dispatch(hideLoading());
                  setAccountIndex(accountIndex_);
                  setLoading(false);
                }
              }
            }
          });
          client.setAutoConnect(true);
          client.connect();
          const res = await client.waitForMsgServerState(MsgClientState.logged);
          if (!res) {
            dispatch(hideLoading());
            setAccountIndex(accountIndex_);
            setLoading(false);
            console.error('connect error', res);
          }
        } catch (e) {
          dispatch(hideLoading());
          setAccountIndex(accountIndex_);
          setLoading(false);
          console.error('init msg conn error', e);
        }
      }
    };
    initAccount();
  }, [
    loading,
    nicknameOrNoteShowOption,
    accountEntities,
    accountIds,
    accountIndex,
    currentAccountIndex,
    dispatch,
  ]);

  return null;
};

export default MsgConnManager;
