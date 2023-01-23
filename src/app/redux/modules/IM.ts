import { createSlice } from '@reduxjs/toolkit';
import { diff } from 'deep-object-diff';

import config from '../../config';
import AccountController from '../../helpers/AccountController';
import DateHelper from '../../helpers/DateHelper';
import DbStorage from '../../helpers/DbStorage';
import GroupController from '../../helpers/GroupController';
import UserController from '../../helpers/UserController';
import type { BuddyGetALLRes_Type } from '../../protobuf/PTPBuddy/types';
import type { BuddyModifyNotify_Type } from '../../protobuf/PTPBuddy/types';
import type {
  MsgInfo_Type,
  MsgType,
  UserInfo_Type,
} from '../../protobuf/PTPCommon';
import type {
  GroupGetListRes_Type,
  GroupGetMembersListRes_Type,
  GroupUnreadMsgRes_Type,
} from '../../protobuf/PTPGroup/types';
import { handleBuddyModify } from './Auth';

const { dbPrefix } = config;

export const storageSetItem = (
  key: string,
  value: any,
  isAccount: boolean = false,
  isJson: boolean = true
) => {
  const accountAddress = AccountController.getCurrentAccount()?.getAddress();
  DbStorage.setItem(
    !isAccount ? key : key + accountAddress,
    isJson ? JSON.stringify(value) : String(value)
  );
};

export interface GroupSession {
  group_id: number;
  msgUpTime: number;
}

export interface SendingMsg {
  sent_at: number;
  uid: number;
  msg_data: string;
  group_id: number;
  msg_type: MsgType;
}

export interface ImState {
  groupMsgUpdated: Record<number, Array<number>[]>; //uid<[group_id,updatedTime][]>
  buddyUpdatedTime: number;
  groupInfoUpdatedTime: number;
  groupMembersUpdatedTime: Record<number, number>;
  userUpdatedTime: Record<number, number>;
  unRead: MsgInfo_Type[];
  messagesIsSending: Record<number, SendingMsg>;
  unReadCnt: number;
  messageIds: Record<number, number[]>;
  selectedGroupId: null | number;
}

const initialState: ImState = {
  userUpdatedTime: {},
  groupInfoUpdatedTime: 0,
  buddyUpdatedTime: 0,
  groupMembersUpdatedTime: {},
  groupMsgUpdated: {},
  messageIds: [],
  selectedGroupId: null,
  messagesIsSending: {},
  unRead: [],
  unReadCnt: 0,
};

export const getMsgLocalKey = ({
  group_id,
  msg_id,
}: {
  group_id: number;
  msg_id: number;
}) => {
  return `${dbPrefix.Msg}${group_id}_${msg_id}`;
};

export const getUserLocalKey = ({ uid }: { uid: number }) => {
  return `${dbPrefix.User}${uid}`;
};

export const getGroupLocalKey = ({ group_id }: { group_id: number }) => {
  return `${dbPrefix.Group}${group_id}`;
};

export const getGroupIdsKey = () => {
  return `${dbPrefix.GroupIds}`;
};

export const getGroupRecordLocalKey = ({ group_id }: { group_id: number }) => {
  return `${dbPrefix.GroupRecord}${group_id}`;
};

export const formatMessage = (message: {
  msg_data: string;
  group_id: number;
  sent_at: number;
  msg_id: number;
  from_uid: number;
}) => {
  const { msg_data, group_id, sent_at, msg_id, from_uid } = message;
  return {
    _id: sent_at,
    text: msg_data,
    msgId: msg_id,
    pending: false,
    groupId: group_id,
    user: {
      _id: from_uid,
    },
    createdAt: new Date(sent_at * 1000),
  };
};

const slice = createSlice({
  name: 'im',
  initialState,
  reducers: {
    setSelectedGroupId: (state: ImState, { payload }) => {
      state.selectedGroupId = payload.selectedGroupId;
      AccountController.getInstance(payload.accountId).setSelectedGroupId(
        payload.selectedGroupId
      );
    },
    BuddyModifyNotify: (
      state: ImState,
      {
        payload,
      }: {
        payload: {
          BuddyModifyNotify: BuddyModifyNotify_Type;
          accountId: number;
        };
      }
    ) => {
      const { BuddyModifyNotify } = payload;

      const { buddy_modify_action, value, uid } = BuddyModifyNotify;
      const user = UserController.getInstance(uid);
      if (user.getUserInfo()) {
        let userInfo = {
          ...user.getUserInfo(),
        };
        handleBuddyModify(buddy_modify_action, value, userInfo);
        state.userUpdatedTime[uid] = DateHelper.currentTimestamp();
        user.setUserInfo(userInfo);
        user.saveUserInfoToDb();
      }
    },
    GroupGetMembersListRes: (
      state: ImState,
      {
        payload,
      }: {
        payload: {
          GroupGetMembersListRes: GroupGetMembersListRes_Type;
          accountId: number;
        };
      }
    ) => {
      const { group_id, group_members_updated_time, members, group_members } =
        payload.GroupGetMembersListRes;
      if (members && members.length > 0) {
        members.forEach((buddy: UserInfo_Type) => {
          const user = UserController.getInstance(buddy.uid);
          if (user.getUserInfo() || diff(user.getUserInfo(), buddy)) {
            state.userUpdatedTime[buddy.uid] = DateHelper.currentTimestamp();
            user.setUserInfo(buddy);
            user.saveUserInfoToDb();
          }
        });
      }
      GroupController.getInstance(group_id).setGroupMembers(group_members!);
      const account = AccountController.getInstance(payload.accountId);
      const groupRecord = account.getGroupRecord(group_id);
      account.setGroupRecord(group_id, {
        ...groupRecord,
        memberUpTime: group_members_updated_time,
      });
      state.groupMembersUpdatedTime[group_id] = group_members_updated_time;
    },
    MsgReq: (state: ImState, { payload }) => {
      const { sent_at, msg_data, msg_type } = payload.msgReq;
      const group_id = payload.group_id;
      state.messagesIsSending[sent_at] = {
        msg_data,
        uid: payload.uid,
        group_id,
        msg_type,
        sent_at,
      };
      GroupController.getInstance(group_id).saveMsg([
        {
          from_uid: payload.uid,
          msg_type,
          group_id,
          msg_data,
          msg_id: 0,
          sent_at,
        },
      ]);
      state.messageIds[group_id] =
        GroupController.getInstance(group_id).getMessageIds();
    },
    MsgRes: (state: ImState, { payload }) => {
      const { msg_id, sent_at, group_id } = payload.MsgRes;
      const { msg_data, uid, msg_type } = state.messagesIsSending[sent_at];
      const msgInfo = {
        group_id,
        from_uid: uid,
        msg_id,
        sent_at,
        msg_data,
        msg_type,
      };
      state.groupMsgUpdated[uid] = AccountController.getInstance(
        payload.accountId
      ).saveGroupRecord(group_id, msgInfo, false);
      delete state.messagesIsSending[sent_at];
      state.messageIds[group_id] =
        GroupController.getInstance(group_id).getMessageIds();
    },
    MsgReadAckReq: (state: ImState, { payload }) => {
      const { group_id } = payload;
      const account = AccountController.getInstance(payload.accountId);
      const groupRecords = account.getGroupRecord(group_id);
      state.unReadCnt = state.unReadCnt - groupRecords.unReadCnt;
      account.saveGroupRecordAfterReadMsg(group_id);
    },
    MsgNotify: (state: ImState, { payload }) => {
      const msg_info = payload.MsgNotify;
      const { group_id } = msg_info;
      if (state.selectedGroupId !== group_id) {
        state.unReadCnt += 1;
      }
      const account = AccountController.getInstance(payload.accountId);
      state.groupMsgUpdated[account.getUserInfo().uid] =
        account.saveGroupRecord(
          group_id,
          msg_info,
          state.selectedGroupId !== group_id
        );
      state.messageIds[group_id] =
        GroupController.getInstance(group_id).getMessageIds();
    },
    initGroups: (state: ImState, action) => {
      const {
        unReadCnt,
        accountId,
        groupMsgUpdated,
        buddyUpdatedTime,
        selectedGroupId,
        groupInfoUpdatedTime,
      } = action.payload;
      state.unReadCnt = unReadCnt;
      state.selectedGroupId = selectedGroupId;
      state.groupMsgUpdated[
        AccountController.getInstance(accountId).getUid()!
      ] = groupMsgUpdated;
      state.buddyUpdatedTime = buddyUpdatedTime;
      state.groupInfoUpdatedTime = groupInfoUpdatedTime;
    },

    BuddyGetALLRes: (
      state: ImState,
      {
        payload,
      }: {
        payload: {
          BuddyGetALLRes: BuddyGetALLRes_Type;
          accountId: number;
        };
      }
    ) => {
      const { buddy_updated_time } = payload.BuddyGetALLRes;
      AccountController.getInstance(payload.accountId).BuddyGetALLRes(
        payload.BuddyGetALLRes
      );
      state.buddyUpdatedTime = buddy_updated_time;
    },

    GroupUnreadMsgRes: (
      state: ImState,
      {
        payload,
      }: {
        payload: {
          GroupUnreadMsgRes: GroupUnreadMsgRes_Type;
          accountId: number;
        };
      }
    ) => {
      const { GroupUnreadMsgRes, accountId } = payload;
      const { unread_cnt, unread_list } = GroupUnreadMsgRes;
      if (unread_cnt === undefined) {
        state.unReadCnt = unread_cnt;
      }
      if (unread_list && unread_list.length > 0) {
        const accountUid = AccountController.getInstance(accountId)?.getUid()!;

        for (let i = 0; i < unread_list.length; i++) {
          const msgInfo = unread_list[i];
          GroupController.getInstance(msgInfo.group_id).saveMsg([msgInfo]);
          state.messageIds[msgInfo.group_id] = GroupController.getInstance(
            msgInfo.group_id
          ).getMessageIds();
        }

        state.groupMsgUpdated[accountUid] =
          AccountController.getInstance(accountId).GroupUnreadMsgRes(
            GroupUnreadMsgRes
          );
      }
    },
    GroupGetListRes: (
      state: ImState,
      {
        payload,
      }: {
        payload: {
          GroupGetListRes: GroupGetListRes_Type;
          accountId: number;
        };
      }
    ) => {
      const { GroupGetListRes, accountId } = payload;
      const { groups, group_info_updated_time } = GroupGetListRes;
      state.buddyUpdatedTime = group_info_updated_time;

      if (groups && groups.length > 0) {
        const accountUid = AccountController.getInstance(
          payload.accountId
        )?.getUid();
        if (accountUid) {
          state.groupMsgUpdated[accountUid] =
            AccountController.getInstance(accountId).GroupGetListRes(
              GroupGetListRes
            );
        }
      }
    },
    updateMessageIds: (state: ImState, { payload }) => {
      for (let i = 0; i < payload.messageIds.length; i++) {
        const sent_at = payload.messageIds[i];
        const msgInfo = GroupController.getInstance(
          payload.group_id
        ).getMessage(sent_at);
        if (msgInfo && msgInfo.msg_id === 0) {
          const { msg_data, group_id, msg_type, from_uid } = msgInfo;
          state.messagesIsSending[msgInfo.sent_at] = {
            msg_data,
            uid: from_uid,
            group_id,
            msg_type,
            sent_at,
          };
        }
      }
      state.messageIds[payload.group_id] = payload.messageIds;
    },
    mergeState: (state: ImState, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const imActions = slice.actions;

export default slice.reducer;
