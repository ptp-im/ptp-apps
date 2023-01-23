import * as React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ListItem } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { default as AddressAvatar } from 'react-native-jazzicon';

import { isWeb } from '../../../utils';
import CacheImage from '../../components/CacheMedia/CacheImage';
import CacheMediaManager from '../../components/CacheMedia/CacheMediaManager';
import ScreenLarge from '../../components/ScreenLarge';
import SectionItem from '../../components/Section/SectionItem';
import SectionView from '../../components/Section/SectionView';
import config from '../../config';
import AccountController from '../../helpers/AccountController';
import DateHelper from '../../helpers/DateHelper';
import MsgConn, { handleError, MsgClientState } from '../../helpers/MsgConn';
import { showToast } from '../../helpers/ui';
import { maskAddress } from '../../helpers/utils';
import useAccount from '../../hooks/useAccount';
import { BuddyModifyReq, BuddyModifyRes } from '../../protobuf/PTPBuddy';
import { BuddyModifyAction, ERR } from '../../protobuf/PTPCommon';
import { FileImgUploadReq } from '../../protobuf/PTPFile';
import { hideLoading, showConfirm, showLoading } from '../../redux/modules/App';
import { authActions } from '../../redux/modules/Auth';
import { useTypedDispatch } from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { jumpTo } from '../../Screens';

const Profile: React.FC<MasterScreen> = ({ navigation }) => {
  const {
    msgClientState,
    currentUserInfo,
    accountIds,
    currentAccountIndex,
    account,
    accountId,
  } = useAccount();

  const { note, address } = account!;

  React.useLayoutEffect(() => {
    const title = '个人资料';
    navigation.setOptions({ title });
  });

  const dispatch = useTypedDispatch();

  const pickImage = async () => {
    if (!isWeb) {
      dispatch(showLoading('正在上传'));
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (isWeb) {
      dispatch(showLoading('正在上传'));
    }
    if (!result.cancelled) {
      const { height, width, uri, base64 } = result;
      let file_type: string;
      if (!isWeb) {
        const t = uri.split('.');
        file_type = `image/${t[t.length - 1]}`;
      } else {
        file_type = uri.split(';base64')[0].split(':')[1];
      }
      const file_data = Buffer.from(base64!, 'base64');
      console.log(
        'file_data.length',
        file_data.length / 1000 / 1000,
        height,
        width
      );
      const file_group = 'avatar';
      const m = {
        height,
        width,
        file_data,
        file_type,
        file_group,
      };
      const pdu = new FileImgUploadReq(m).encode();
      const res = await fetch(config.im.msfsServer, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: pdu,
      });
      const { file_path, error } = await res.json();
      if (error !== ERR.NO_ERROR) {
        showToast('上传失败');
      } else {
        if (isWeb) {
          await CacheMediaManager.saveMediaToCacheInWeb({
            path: file_path,
            value: file_data,
            media_type: file_type,
          });
        }
        const res = await MsgConn.getMsgClient()?.SendPduWithCallback(
          new BuddyModifyReq({
            value: file_path,
            buddy_modify_action: BuddyModifyAction.BuddyModifyAction_avatar,
          }).pack()
        );
        if (res) {
          const msg = BuddyModifyRes.handlePdu(res!, accountId);
          if (msg.error) {
            handleError(msg.error);
          } else {
            msg.dispatch.forEach((msg) => dispatch(msg));
            showToast('修改成功');
          }
        } else {
          showToast('修改失败');
        }
      }
    } else {
      showToast('修改失败');
    }
    dispatch(hideLoading());
  };
  return (
    <>
      <ScreenLarge>
        <SectionView style={styles.section}>
          <SectionItem
            isFirst={true}
            image={
              currentUserInfo.avatar ? (
                <CacheImage
                  enableCache={true}
                  source={{ uri: currentUserInfo.avatar }}
                  placeholderContent={
                    <ActivityIndicator
                      size='small'
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    />
                  }
                  style={{ width: 44, height: 44, borderRadius: 8 }}
                />
              ) : (
                <AddressAvatar
                  containerStyle={{ width: 44, height: 44, borderRadius: 8 }}
                  size={44}
                  address={address}
                />
              )
            }
            height={88}
            title={''}
            titleRight={'上传'}
            onPress={() => {
              if (
                MsgConn.getMsgClient() &&
                MsgConn.getMsgClient()?.isConnect()
              ) {
                pickImage();
              } else {
                showToast('未连接无法修改');
              }
            }}
          />
        </SectionView>
        <SectionView style={styles.section}>
          <SectionItem
            isFirst={true}
            title={'呢称'}
            showDivider
            titleRight={
              currentUserInfo.nick_name!.length === 0
                ? '请设置'
                : currentUserInfo.nick_name!
            }
            onPress={() => {
              if (
                MsgConn.getMsgClient() &&
                MsgConn.getMsgClient()?.isConnect()
              ) {
                jumpTo(navigation, 'FieldModify', {
                  title: '呢称',
                  label: '请输入呢称',
                  helper: '好的呢称，可以让好友对你印象深刻',
                  initValue: currentUserInfo.nick_name || '',
                  placeholder: '',
                  timestamp: DateHelper.currentTimestamp1000(),
                  buddy_modify_action:
                    BuddyModifyAction.BuddyModifyAction_nickname,
                });
              } else {
                showToast('未连接无法修改');
              }
            }}
          />
          <SectionItem
            title={'用户名'}
            showDivider
            titleRight={
              currentUserInfo.user_name!.length === 0
                ? '请设置'
                : `@${currentUserInfo.user_name!}`
            }
            onPress={() => {
              if (
                MsgConn.getMsgClient() &&
                MsgConn.getMsgClient()?.isConnect()
              ) {
                jumpTo(navigation, 'FieldModify', {
                  title: '用户名',
                  label: '请输入用户名',
                  initValue: currentUserInfo.user_name || '',
                  helper:
                    '您可以设置一个用户名。设置后，别人将能够通过此用户名找到您并与您联系。您可以使用 a–z、0–9 及下划线。最小长度为 5 个字符。',
                  placeholder: '',
                  buddy_modify_action:
                    BuddyModifyAction.BuddyModifyAction_user_name,
                });
              } else {
                showToast('未连接无法修改');
              }
            }}
          />
          <SectionItem
            title={'二维码名片'}
            titleRight={maskAddress(address!)}
            onPress={() => {
              jumpTo(navigation, 'NameQrCodeCard', {});
            }}
          />
        </SectionView>

        <SectionView style={styles.section}>
          <SectionItem
            title={'简介'}
            isFirst={true}
            showDivider={!!currentUserInfo?.sign_info}
            titleRight={currentUserInfo.sign_info!.length === 0 ? '请设置' : ''}
            onPress={() => {
              if (
                MsgConn.getMsgClient() &&
                MsgConn.getMsgClient()?.isConnect()
              ) {
                jumpTo(navigation, 'FieldModify', {
                  title: '简介',
                  label: '请输入简介',
                  multi: true,
                  initValue: currentUserInfo.sign_info || '',
                  lines: 3,
                  helper:
                    '请输入您的自我介绍..., 例如年龄、工作或城市，示例:24岁,来自北海道。。。',
                  placeholder: '',
                  buddy_modify_action:
                    BuddyModifyAction.BuddyModifyAction_sign_info,
                });
              } else {
                showToast('未连接无法修改');
              }
            }}
          />
          {currentUserInfo.sign_info ? (
            <SectionItem>
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>{currentUserInfo.sign_info}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </SectionItem>
          ) : null}
        </SectionView>

        <SectionView style={styles.section}>
          <SectionItem
            isFirst={true}
            title={'助记词'}
            showDivider={true}
            titleRight={''}
            onPress={() => {
              jumpTo(navigation, 'Mnemonic', {
                title: '助记词',
                accountIndex: currentAccountIndex,
              });
            }}
          />
          <SectionItem
            title={'备注'}
            titleRight={note}
            onPress={() => {
              jumpTo(navigation, 'MnemonicNote', {
                title: '备注',
              });
            }}
          />
        </SectionView>

        <SectionView style={styles.section}>
          <SectionItem
            isFirst={true}
            title={'账户管理'}
            titleRight={''}
            onPress={() => {
              jumpTo(navigation, 'Accounts', {
                title: '账户管理',
              });
            }}
          />
        </SectionView>

        <SectionView style={styles.section}>
          <SectionItem
            isTextAlert={msgClientState >= MsgClientState.connecting}
            title={
              msgClientState === MsgClientState.logged ? '退出登录' : '登录'
            }
            titleRight={''}
            isFirst={true}
            onPress={async () => {
              if (MsgConn.getMsgClient()?.isConnect()) {
                dispatch(
                  showConfirm({
                    content: '确定要退出登录？',
                    onConfirm: async () => {
                      dispatch(showLoading('退出中...'));
                      MsgConn.getMsgClient()?.setAutoConnect(false);
                      await MsgConn.getMsgClient()?.close();
                      dispatch(hideLoading());
                      showToast('退出成功');
                    },
                  })
                );
              } else {
                dispatch(showLoading('登录中...'));
                const client = MsgConn.getInstance(account!.accountId);
                client.setAutoConnect(true);
                client.connect();
                await client.waitForMsgServerState(MsgClientState.logged);
                dispatch(hideLoading());
                showToast('登录成功');
              }
            }}
          />
        </SectionView>

        <SectionView style={styles.section}>
          <SectionItem
            isTextAlert={true}
            title={'删除账户'}
            titleRight={''}
            isFirst={true}
            onPress={() => {
              dispatch(
                showConfirm({
                  content: '删除之后不能恢复，除非备份过助记词？',
                  onConfirm: async () => {
                    dispatch(showLoading('删除中...'));
                    if (accountIds.length === 1) {
                      dispatch(hideLoading());
                      showToast('删除失败');
                    } else {
                      setTimeout(async () => {
                        dispatch(
                          authActions.removeAccount(currentAccountIndex)
                        );
                      }, 700);
                    }
                  },
                })
              );
            }}
          />
        </SectionView>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginHorizontal: 8,
  },
});

export default Profile;
