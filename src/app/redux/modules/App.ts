import type * as React from 'react';

import { createSlice } from '@reduxjs/toolkit';

import type BottomTabs from '../../../components/BottomTabs/BottomTabs';
import { isWeb } from '../../../utils';
import DbStorage from '../../helpers/DbStorage';
import { MsgClientState } from '../../helpers/MsgConn';

export interface MasterTab {
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  key: string;
  showLoading?: string;
  badge?: boolean | number;
}

export type ActionItem = {
  title: string;
  icon: string;
  action: string;
};

interface ShowConfirm {
  title?: string;
  content?: string;
  onClose?: Function;
  onConfirm?: Function;
}

interface AppState {
  msgClientState: MsgClientState;
  QRCODE_TYPE_MNEMONIC_SHARE?: string;
  showLoading?: null | string;
  showConfirm?: null | ShowConfirm;
  currentTabIndex: number;
  masterTabs: MasterTab[];
  meActionItems: ActionItem[][];
  masterTabsSceneAnimationType: React.ComponentProps<
    typeof BottomTabs
  >['sceneAnimationType'];
}

let currentTabIndex = 0;
if (isWeb && window.sessionStorage.getItem('currentTabIndex')) {
  currentTabIndex = parseInt(
    <string>window.sessionStorage.getItem('currentTabIndex')
  );
}
const initialState: AppState = {
  msgClientState: MsgClientState.connect_none,
  showLoading: null,
  QRCODE_TYPE_MNEMONIC_SHARE: '',
  currentTabIndex: currentTabIndex,
  masterTabsSceneAnimationType: 'opacity',
  meActionItems: [
    [
      {
        title: 'Profile',
        icon: 'account',
        action: 'Profile',
      },
    ],
  ],
  masterTabs: [
    {
      title: 'Me',
      key: 'Me',
      focusedIcon: 'account',
      // color: '#00796b',
      unfocusedIcon: 'account-outline',
    },
    {
      title: 'Discover',
      key: 'Discover',
      focusedIcon: 'compass',
      // color: '#2962ff',
      unfocusedIcon: 'compass-outline',
    },
    {
      title: 'Sessions',
      key: 'Sessions',
      badge: 122,
      focusedIcon: 'message',
      // color: '#00796b',
      unfocusedIcon: 'message-outline',
    },
    {
      title: 'Contacts',
      key: 'Contacts',
      focusedIcon: 'card-account-phone',
      // color: '#00796b',
      unfocusedIcon: 'card-account-phone-outline',
    },
  ],
};

const AppSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    hideConfirm: (state: AppState) => {
      state.showConfirm = null;
    },
    showConfirm: (state: AppState, { payload }: { payload: ShowConfirm }) => {
      state.showConfirm = payload;
    },
    hideLoading: (state: AppState) => {
      state.showLoading = null;
    },
    showLoading: (state: AppState, { payload }) => {
      state.showLoading = payload;
    },
    mergeState: (state: AppState, { payload }) => {
      if (payload.currentTabIndex !== undefined) {
        if (isWeb) {
          window.sessionStorage.setItem(
            'currentTabIndex',
            payload.currentTabIndex
          );
        } else {
          DbStorage.setItem('currentTabIndex', String(payload.currentTabIndex));
        }
      }

      Object.assign(state, payload);
    },
  },
});
export const {
  hideLoading,
  showLoading,
  showConfirm,
  hideConfirm,
  ...appActions
} = AppSlice.actions;
export default AppSlice.reducer;
