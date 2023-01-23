import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import type { DrawerHeaderProps } from '@react-navigation/drawer';
import type { ParamListBase } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Badge, ListItem, Text } from '@rneui/themed';

import { useTheme } from '../../../../src';
import AccountController from '../../helpers/AccountController';
import DateHelper from '../../helpers/DateHelper';
import GroupController from '../../helpers/GroupController';
import UserController from '../../helpers/UserController';
import { maskAddress } from '../../helpers/utils';
import type { MsgInfo_Type } from '../../protobuf/PTPCommon';
import { GroupType } from '../../protobuf/PTPCommon';
import {
  GlobalState,
  useTypedDispatch,
  useTypedSelector,
} from '../../redux/store';
import { jumpTo } from '../../Screens';
import { BuddyGetListReq } from '../../protobuf/PTPBuddy';
import CacheImage from '../CacheMedia/CacheImage';
import AvatarView from '../Avatar/AvatarView';
import { imActions } from '../../redux/modules/IM';

interface GroupItemProps {
  navigation: DrawerHeaderProps & StackNavigationProp<ParamListBase>;
  group_id: number;
  accountId: number;
  selectedGroupId: null | number;
}

const getMsgData = (latestMsg: MsgInfo_Type | undefined) => {
  if (!latestMsg) {
    return null;
  } else {
    return latestMsg.msg_data;
  }
};

const GroupItem: React.FC<GroupItemProps> = ({
  selectedGroupId,
  group_id,
  accountId,
  navigation,
}) => {
  const userUpdatedTime = useTypedSelector(
    (state: GlobalState) => state.im.userUpdatedTime
  );

  const account = AccountController.getInstance(accountId);

  const groupRecord = account.getGroupRecord(group_id);
  const theme = useTheme();
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [loadingLastMsgData, setLoadingLastMsgData] = useState(false);
  let containerStyle: any = {};
  let textColor: any = {};
  if (selectedGroupId === group_id) {
    containerStyle = { backgroundColor: theme.colors.backgroundSelected };
    textColor = { color: 'white' };
  }
  const dispatch = useTypedDispatch();
  let title = groupRecord.name || maskAddress(groupRecord.group_adr);
  let lastMsg: undefined | MsgInfo_Type = undefined;
  const group = GroupController.getInstance(group_id);
  if (group.getMessage(groupRecord.msgUpTime)) {
    lastMsg = group.getMessage(groupRecord.msgUpTime);
  }
  const uid = account.getUid();
  useEffect(() => {
    const getMsgData = async (msgId: number) => {
      const group = GroupController.getInstance(group_id);
      const lastMsg = await group.getMessageFromDb(msgId);
      if (lastMsg) {
        group.saveMsg([lastMsg], true);
        setLoadingLastMsgData(false);
      } else {
        setLoadingLastMsgData(false);
      }
      setLoadingLastMsgData(false);
    };
    if (!loadingLastMsgData && groupRecord.lastMsgId && !lastMsg) {
      setLoadingLastMsgData(true);
      getMsgData(groupRecord.lastMsgId);
    }
  }, [
    groupRecord.msgUpTime,
    groupRecord.lastMsgId,
    loadingLastMsgData,
    lastMsg,
    group_id,
  ]);
  useEffect(() => {
    const loadUserInfo = async (uid: number, accountId: number) => {
      try {
        await BuddyGetListReq.handleGroupMembers([uid], accountId);
      } finally {
        setLoadingUserInfo(false);
      }
    };
    if (groupRecord.group_type === GroupType.GROUP_TYPE_PAIR) {
      if (uid == groupRecord.owner_uid) {
        if (uid != groupRecord.pair_uid) {
          const pairUser = UserController.getInstance(
            groupRecord.pair_uid!
          ).getUserInfo();
          if (!pairUser && !loadingUserInfo) {
            setLoadingUserInfo(true);
            loadUserInfo(groupRecord.pair_uid!, accountId);
          }
        }
      } else {
        if (uid == groupRecord.pair_uid) {
          const ownerUser = UserController.getInstance(
            groupRecord.owner_uid!
          ).getUserInfo();
          if (!ownerUser && !loadingUserInfo) {
            setLoadingUserInfo(true);
            loadUserInfo(groupRecord.owner_uid!, accountId);
          }
        }
      }
    }
  }, [
    accountId,
    groupRecord.group_type,
    groupRecord.owner_uid,
    groupRecord.pair_uid,
    loadingUserInfo,
    uid,
  ]);
  let avatar = groupRecord.avatar;
  let avatarAddress = groupRecord.group_adr;
  if (groupRecord.group_type === GroupType.GROUP_TYPE_PAIR) {
    if (uid == groupRecord.owner_uid) {
      if (uid === groupRecord.pair_uid) {
        title = '收藏夹';
        AccountController.getInstance(accountId).saveGroupRecordName(group_id, {
          name: title,
        });
      } else {
        const pairUser = UserController.getInstance(
          groupRecord.pair_uid!
        ).getUserInfo();

        if (pairUser) {
          console.debug(pairUser.uid, userUpdatedTime[pairUser.uid]);
          if (pairUser.avatar) {
            avatar = pairUser.avatar;
          }
          title = pairUser?.nick_name || maskAddress(pairUser?.address);
          AccountController.getInstance(accountId).saveGroupRecordName(
            group_id,
            { name: title, avatar }
          );
        }
      }
    } else {
      if (uid == groupRecord.pair_uid) {
        const ownerUser = UserController.getInstance(
          groupRecord.owner_uid!
        ).getUserInfo();
        if (ownerUser) {
          console.debug(ownerUser.uid, userUpdatedTime[ownerUser.uid]);
          if (ownerUser.avatar) {
            avatar = ownerUser.avatar;
          }
          title = ownerUser?.nick_name || maskAddress(ownerUser?.address);
          AccountController.getInstance(accountId).saveGroupRecordName(
            group_id,
            { name: title, avatar }
          );
        }
      }
    }
  }
  return (
    <ListItem
      containerStyle={containerStyle}
      Component={TouchableHighlight}
      onPress={() => {
        dispatch({
          type: 'im/setSelectedGroupId',
          payload: {
            accountId,
            selectedGroupId: group_id,
          },
        });

        jumpTo(navigation, 'Message', {
          title,
          fromDrawer: true,
          group_id,
        });
      }}
    >
      <View style={styles.itemLeft}>
        <AvatarView size={44} avatar={avatar} avatarAddress={avatarAddress} />

        {groupRecord.unReadCnt > 0 && (
          <Badge
            containerStyle={styles.unreadBadge}
            value={groupRecord.unReadCnt}
            badgeStyle={{
              backgroundColor: theme.colors.msgUnreadBadge,
            }}
          />
        )}
      </View>
      <ListItem.Content>
        <ListItem.Title>
          <Text style={[styles.name, textColor]}>{title}</Text>
        </ListItem.Title>
        <View>
          <Text style={[styles.lastMsg, textColor]}>{getMsgData(lastMsg)}</Text>
        </View>
      </ListItem.Content>
      <View style={styles.itemRight}>
        <Text style={[styles.updatedAt, textColor]}>
          {DateHelper.formatGroupUpdatedTime(groupRecord.msgUpTime)}
        </Text>
      </View>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: '500',
    overflow: 'hidden',
    height: 18,
    display: 'flex',
  },
  lastMsg: {
    marginTop: 4,
    fontSize: 12,
    color: '#999999',
    overflow: 'hidden',
    height: 14,
  },
  itemLeft: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  itemRight: {
    display: 'flex',
    alignItems: 'flex-start',
    height: '100%',
  },
  updatedAt: {
    color: '#999999',
    fontSize: 12,
  },
});

export default GroupItem;
