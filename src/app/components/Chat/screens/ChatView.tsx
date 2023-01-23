import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import DateHelper from '../../../helpers/DateHelper';
import MsgConn from '../../../helpers/MsgConn';
import useAccount from '../../../hooks/useAccount';
import {
  GroupRecord_Type,
  MsgType,
  UserInfo_Type,
} from '../../../protobuf/PTPCommon';
import { MsgReq } from '../../../protobuf/PTPMsg';
import { useTypedDispatch } from '../../../redux/store';
import type { IMessage } from '../components';
import { GiftedChat } from '../components';

interface ChatProps {
  groupRecord: GroupRecord_Type;
  currentUser: UserInfo_Type;
  messages: IMessage[];
}

const ChatView: React.FC<ChatProps> = ({
  currentUser,
  groupRecord,
  messages,
}) => {
  const { account } = useAccount();
  const dispatch = useTypedDispatch();
  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      const sendMsgObj = messages[0];
      const sent_at = DateHelper.currentTimestamp();
      sendMsgObj._id = sent_at;
      sendMsgObj.groupId = groupRecord.group_id;
      const payload = {
        group_adr: groupRecord.group_adr,
        sent_at,
        msg_data: sendMsgObj.text,
        msg_type: MsgType.MSG_TYPE_TEXT,
      };
      dispatch({
        type: 'im/MsgReq',
        payload: {
          msgReq: payload,
          group_id: groupRecord.group_id,
          uid: account?.uid,
        },
      });
      MsgConn.getMsgClient()?.SendPdu(new MsgReq(payload).pack());
    },
    [account?.uid, dispatch, groupRecord.group_adr, groupRecord.group_id]
  );

  return (
    <View accessibilityLabel='main' style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser.uid,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});

export default ChatView;
