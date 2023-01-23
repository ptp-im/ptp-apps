import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
  View,
  useWindowDimensions,
} from 'react-native';

import { Icon, Button, ListItem } from '@rneui/themed';
import { default as AddressAvatar } from 'react-native-jazzicon';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';

import { isIOS } from '../../../utils';
import CacheImage from '../../components/CacheMedia/CacheImage';
import DialogShowNoteSelect from '../../components/Dialog/DialogShowNoteSelect';
import ScreenLarge from '../../components/ScreenLarge';
import SectionItem from '../../components/Section/SectionItem';
import SectionView from '../../components/Section/SectionView';
import AccountController from '../../helpers/AccountController';
import UserController from '../../helpers/UserController';
import { maskAddress } from '../../helpers/utils';
import useAccount from '../../hooks/useAccount';
import type { UserInfo_Type } from '../../protobuf/PTPCommon';
import type { Account } from '../../redux/modules/Auth';
import {
  GlobalState,
  useTypedDispatch,
  useTypedSelector,
} from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { goBack, jumpTo } from '../../Screens';

const AccountItem: React.FC<{
  account: Account;
  accountSize: number;
  isCurrent: boolean;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
}> = ({ account, isCurrent, accountSize, onPress }) => {
  const nicknameOrNoteShowOption = useTypedSelector(
    (state: GlobalState) => state.auth.nicknameOrNoteShowOption
  );
  const [loading, setLoading] = useState(false);

  let userInfo: UserInfo_Type | null = AccountController.getInstance(
    account.accountId
  ).getUserInfo();
  const dispatch = useTypedDispatch();
  let avatar = null;
  let title = userInfo ? userInfo.nick_name : null;
  if (userInfo && userInfo!.avatar) {
    avatar = userInfo!.avatar;
  }
  useEffect(() => {
    const init = async () => {
      const { accountId, uid } = account;
      const userInfo = await AccountController.getInstance(accountId).init(
        account
      );
      if (userInfo && uid) {
        AccountController.getInstance(accountId).setUserInfo(userInfo);
      }
      setLoading(false);
    };
    if (!userInfo && !loading) {
      setLoading(true);
      init();
    }
  }, [account, dispatch, loading, userInfo]);
  if (nicknameOrNoteShowOption === 'note') {
    title = account.note || null;
  }
  return (
    <ListItem
      style={{ height: 60 }}
      Component={TouchableHighlight}
      onPress={!isCurrent ? onPress : () => {}}
    >
      {avatar ? (
        <CacheImage
          enableCache={true}
          source={{ uri: avatar! }}
          placeholderContent={
            <ActivityIndicator
              size='small'
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            />
          }
          style={{ width: accountSize, height: accountSize, borderRadius: 8 }}
        />
      ) : (
        <AddressAvatar
          containerStyle={{
            width: accountSize,
            height: accountSize,
            borderRadius: 8,
          }}
          size={44}
          address={account.address!}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>{title ? title : '未设置'}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Content
        right
        style={{
          alignSelf: 'flex-start',
          height: '100%',
        }}
      >
        <ListItem.Title right>{maskAddress(account.address!)}</ListItem.Title>
      </ListItem.Content>
      {!isCurrent && <ListItem.Chevron />}
      {isCurrent && (
        <Icon
          color={'green'}
          backgroundColor={'white'}
          type={'material-community'}
          name={'account-check'}
        />
      )}
    </ListItem>
  );
};
const AccountsView: React.FC<MasterScreen> = ({ navigation }) => {
  const {
    nicknameOrNoteShowOption,
    currentAccountIndex,
    accounts,
    accountIds,
  } = useAccount();
  const accountIds_ = [];
  for (let i = 0; i < accountIds.length; i++) {
    accountIds_.push(Number(accountIds[i]));
  }
  accountIds_.sort((a, b) => Number(b) - Number(a));
  const dispatch = useTypedDispatch();
  const theme = useTheme();
  const layer = useWindowDimensions();
  const [dialogShowNoteSelect, setDialogShowNoteSelect] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const items = accountIds_.filter((accountId) => {
    if (!showSearch) {
      return true;
    } else {
      if (searchVal.length > 0) {
        const account = accounts[accountId]!;
        const { note, uid } = account;
        if (nicknameOrNoteShowOption === 'note') {
          return (
            note && note.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0
          );
        } else {
          return !!(
            uid &&
            UserController.getInstance(uid).getUserInfo() &&
            UserController.getInstance(uid)
              .getUserInfo()!
              .nick_name!.toLowerCase()
              .indexOf(searchVal.toLowerCase()) >= 0
          );
        }
      } else {
        return true;
      }
    }
  });
  return (
    <>
      {showSearch ? (
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
          <Appbar.BackAction
            onPress={() => {
              setShowSearch(false);
              setSearchVal('');
            }}
          />
          <Searchbar
            placeholder='Search'
            onChangeText={(query: string) => setSearchVal(query)}
            value={searchVal}
            style={styles.searchbar}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header style={{ backgroundColor: theme.colors.white }}>
          <Appbar.BackAction
            onPress={() => {
              goBack(navigation);
            }}
          />
          <Appbar.Content title={'账户管理'} />
          <Button
            color={'white'}
            icon={
              <Icon
                backgroundColor={'white'}
                type={'material'}
                name={'search'}
              />
            }
            onPress={() => {
              setShowSearch(!showSearch);
            }}
          />
          <Button
            color={'white'}
            icon={
              <Icon
                backgroundColor={'white'}
                type={'material'}
                name={'person-add'}
              />
            }
            onPress={async () => {
              jumpTo(navigation, 'MnemonicAdd', {
                title: '添加账户',
              });
            }}
          />
          <Button
            color={'white'}
            icon={
              <Icon
                backgroundColor={'white'}
                type={'material'}
                name={'more-vert'}
              />
            }
            onPress={async () => {
              setDialogShowNoteSelect(true);
            }}
          />
        </Appbar.Header>
      )}
      <View
        style={{
          height: isIOS ? layer.height - 126 : layer.height - 56,
          backgroundColor: 'red',
          overflow: 'hidden',
        }}
      >
        <ScreenLarge noScroll={false}>
          <SectionView title={''} style={styles.section}>
            {items.map((accountId, i) => {
              const account = accounts[accountId]!;
              const accountIndex = accountIds.indexOf(accountId);
              return (
                <SectionItem
                  showDivider={i < items.length - 1}
                  key={account.address}
                  isFirst={i == 0}
                >
                  <AccountItem
                    isCurrent={currentAccountIndex === accountIndex}
                    accountSize={32}
                    onPress={() => {
                      dispatch({
                        type: 'app/mergeState',
                        payload: {
                          showLoading: '正在切换',
                        },
                      });
                      dispatch({
                        type: 'auth/mergeState',
                        payload: {
                          currentAccountIndex: accountIndex,
                        },
                      });
                    }}
                    account={account}
                  />
                </SectionItem>
              );
            })}
          </SectionView>
        </ScreenLarge>
      </View>
      <DialogShowNoteSelect
        visible={dialogShowNoteSelect}
        onClose={() => {
          setDialogShowNoteSelect(false);
        }}
        nicknameOrNoteShowOption={nicknameOrNoteShowOption}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  searchbar: {
    flex: 1,
    marginRight: 4,
  },
});

export default AccountsView;
