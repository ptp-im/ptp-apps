import * as React from 'react';
import { FlatList } from 'react-native';

import { Divider } from '@rneui/base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useAccount from '../../hooks/useAccount';
import { GlobalState, useTypedSelector } from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import GroupItem from './GroupItem';

type Item = { group_id: number; msg_updated_time: number };

const SessionsView: React.FC<MasterScreen> = ({ navigation }) => {
  const { account } = useAccount();
  const groupMsgUpdated = useTypedSelector(
    (state: GlobalState) => state.im.groupMsgUpdated
  );
  const selectedGroupId = useTypedSelector(
    (state: GlobalState) => state.im.selectedGroupId
  );
  const ref = React.useRef<FlatList<Item>>(null);
  const safeArea = useSafeAreaInsets();

  let sessions_list: Item[] = [];
  if (account?.uid && groupMsgUpdated[account!.uid]) {
    sessions_list = groupMsgUpdated[account!.uid].map((item: number[]) => ({
      group_id: item[0],
      msg_updated_time: item[1],
    }));
  }
  return (
    <FlatList
      contentContainerStyle={{
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={Divider}
      ref={ref}
      data={sessions_list}
      extraData={{ selectedGroupId }}
      keyExtractor={(item: Item) => String(item.group_id)}
      renderItem={({ item }: { item: Item }) => {
        return (
          <GroupItem
            navigation={navigation}
            accountId={account!.accountId}
            group_id={item.group_id}
            selectedGroupId={selectedGroupId}
          />
        );
      }}
    />
  );
};

export default SessionsView;
