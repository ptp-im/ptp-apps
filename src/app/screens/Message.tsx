import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { isIOS } from '../../utils';
import AvatarView from '../components/Avatar/AvatarView';
import ChatView from '../components/Chat/screens/ChatView';
import config from '../config';
import AccountController from '../helpers/AccountController';
import GroupController from '../helpers/GroupController';
import MsgConn from '../helpers/MsgConn';
import UserController from '../helpers/UserController';
import { maskAddress } from '../helpers/utils';
import useAccount from '../hooks/useAccount';
import { BuddyGetListReq } from '../protobuf/PTPBuddy';
import { GroupType, MsgInfo_Type } from '../protobuf/PTPCommon';
import { GroupGetMembersListReq } from '../protobuf/PTPGroup';
import {
  MsgGetByIdsReq,
  MsgGetByIdsRes,
  MsgReadAckReq,
} from '../protobuf/PTPMsg';
import { hideLoading } from '../redux/modules/App';
import { formatMessage, imActions } from '../redux/modules/IM';
import {
  GlobalState,
  useTypedDispatch,
  useTypedSelector,
} from '../redux/store';
import type { MasterScreen } from '../Screens';
let isMounted1 = true;

const Message: React.FC<MasterScreen> = ({ route }) => {
  const { params } = route;
  // @ts-ignore
  const { group_id, timestamp } = params;
  const { account, currentUserInfo } = useAccount();

  const userUpdatedTime = useTypedSelector(
    (state: GlobalState) => state.im.userUpdatedTime
  );

  const messageIds = useTypedSelector(
    (state: GlobalState) => state.im.messageIds
  );
  const messagesIsSending = useTypedSelector(
    (state: GlobalState) => state.im.messagesIsSending
  );
  const [time, setTime] = useState(timestamp);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [messageLoaded, setMessageLoaded] = useState(false);
  const [loadingGroupMember, setLoadingGroupMember] = useState(false);
  useEffect(() => {
    if (time !== timestamp) {
      setTime(time);
      if (!messageIds[group_id]) {
        setMessageLoaded(false);
      }
    }
  }, [group_id, messageIds, time, timestamp]);

  const groupRecord = account
    ? AccountController.getInstance(account.accountId).getGroupRecord(group_id)
    : null;

  const groupMembers = useMemo(() => {
    return account
      ? GroupController.getInstance(group_id).getGroupMembers()
      : [];
  }, [account, group_id]);

  const dispatch = useTypedDispatch();
  useEffect(() => {
    let isMounted = true;
    if (!loading && !groupRecord && account) {
      setLoading(true);
      setTimeout(() => {
        AccountController.getInstance(account.accountId).getGroupRecord(
          group_id
        );
        if (isMounted) {
          setLoading(false);
        }
      }, 500);
    }
    return () => {
      isMounted = false;
    };
  }, [account, groupRecord, group_id, loading]);

  useEffect(() => {
    setTimeout(() => {
      if (
        groupRecord &&
        account &&
        groupRecord.group_type !== GroupType.GROUP_TYPE_PAIR &&
        groupMembers.length === 0
      ) {
        GroupGetMembersListReq.run(group_id, account.accountId);
      }
    });
  }, [account, groupMembers.length, groupRecord, group_id]);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (
        groupRecord &&
        account &&
        groupRecord.group_type !== GroupType.GROUP_TYPE_PAIR &&
        groupMembers.length > 0 &&
        !loadingGroupMember
      ) {
        setLoadingGroupMember(true);
        const user_ids = [];
        for (let i = 0; i < groupMembers.length; i++) {
          const uid = groupMembers[i].uid;
          if (!UserController.getInstance(uid).getUserInfo()) {
            user_ids.push(uid);
          }
        }
        if (user_ids.length > 0) {
          BuddyGetListReq.handleGroupMembers(user_ids, account.accountId)
            .then((res: any) => {
              if (isMounted) {
                setLoadingGroupMember(false);
              }
              return res;
            })
            .catch(() => {
              if (isMounted) {
                setLoadingGroupMember(false);
              }
            });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [
    account,
    dispatch,
    groupMembers,
    groupMembers.length,
    groupRecord,
    group_id,
    loadingGroupMember,
  ]);

  useEffect(() => {
    if (groupRecord && groupRecord.unReadCnt > 0) {
      if (groupRecord.lastMsgId) {
        MsgReadAckReq.run(group_id, groupRecord.lastMsgId);
        dispatch({
          type: 'im/MsgReadAckReq',
          payload: {
            group_id,
            accountId: account?.accountId,
          },
        });
      }
    }
  }, [account?.accountId, dispatch, groupRecord, group_id]);

  useEffect(() => {
    isMounted1 = true;
    const loadMessage = async (msgId: number) => {
      const group = GroupController.getInstance(group_id);
      let msg_ids = [];
      const msgInfoList: MsgInfo_Type[] = await group.initSendingMsg();
      for (let i = 0; i < config.im.maxLoadMsgCnt; i++) {
        const msg_id = msgId - i;
        if (msg_id < 0) {
          break;
        }
        const msgInfo = await group.getMessageFromDb(msg_id);
        if (!msgInfo) {
          msg_ids.push(msg_id);
        } else {
          msgInfoList.push(msgInfo);
        }
      }
      if (msgInfoList.length > 0) {
        group.saveMsg(msgInfoList, true);
      }
      if (msg_ids.length > 0) {
        const pdu = await MsgConn.getMsgClient()?.SendPduWithCallback(
          new MsgGetByIdsReq({
            group_id,
            msg_ids,
          }).pack()
        );
        const msg = MsgGetByIdsRes.handlePdu(pdu!, account!.accountId);
        const { msg_list } = msg.dispatch.payload.MsgGetByIdsRes;
        if (msg_list && msg_list.length > 0) {
          group.saveMsg(msg_list);
        }
      }
      return group.getMessageIds();
    };
    if (messageIds[group_id]) {
      setMessageLoaded(true);
    }
    if (groupRecord && !groupRecord.lastMsgId) {
      setMessageLoaded(true);
    }
    if (
      !loadingMessage &&
      groupRecord &&
      account &&
      !messageLoaded &&
      groupRecord.lastMsgId &&
      (!messageIds[group_id] ||
        (groupRecord.lastMsgId < config.im.maxLoadMsgCnt &&
          groupRecord.lastMsgId - messageIds[group_id].length > 0) ||
        (groupRecord.lastMsgId > config.im.maxLoadMsgCnt &&
          config.im.maxLoadMsgCnt - messageIds[group_id].length > 0))
    ) {
      setLoadingMessage(true);
      loadMessage(groupRecord.lastMsgId)
        .then((messageIds) => {
          if (isMounted1) {
            setMessageLoaded(true);
            setLoadingMessage(false);
          }
          dispatch(imActions.updateMessageIds({ group_id, messageIds }));
          dispatch(hideLoading());
          return messageIds;
        })
        .catch(() => {
          if (isMounted1) {
            setMessageLoaded(true);
            setLoadingMessage(false);
          }
          dispatch(hideLoading());
        });
    }

    return () => {
      isMounted1 = false;
    };
  }, [
    dispatch,
    messageLoaded,
    group_id,
    groupRecord,
    loadingMessage,
    messageIds,
    account,
  ]);

  if (!groupRecord) {
    return null;
  }

  const messages = messageIds[group_id]
    ? messageIds[group_id].map((sentAt: number) => {
        const group = GroupController.getInstance(group_id);
        const msg = formatMessage(group.getMessage(sentAt));
        const { user } = msg;
        const uid = user._id;
        const userCtl = UserController.getInstance(uid);
        const userInfo = userCtl.getUserInfo();
        let avatarAddress = 'Avatar_' + uid;
        let name = '';
        let avatar = '';
        if (userInfo && userInfo.uid !== currentUserInfo.uid) {
          const userInfo = UserController.getInstance(uid).getUserInfo();
          if (userInfo) {
            console.debug(userInfo.uid, userUpdatedTime[userInfo.uid]);
            const { nick_name, address } = userInfo;
            name = nick_name ? nick_name : maskAddress(address);
            avatarAddress = address;
            avatar = userInfo.avatar;
          } else {
            name = 'User_' + user._id;
          }
        }
        const pending = !!messagesIsSending[sentAt];
        return {
          ...msg,
          pending,
          user: {
            ...user,
            name,
            avatar: () => {
              return (
                <AvatarView
                  size={36}
                  avatarAddress={avatarAddress}
                  avatar={avatar}
                />
              );
            },
          },
        };
      })
    : [];
  return (
    <>
      {messageLoaded ? (
        <ChatView
          currentUser={currentUserInfo}
          groupRecord={groupRecord!}
          messages={messages}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size={isIOS ? 'large' : 'small'} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Message;
