import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Icon } from '@rneui/themed';
import { sha256 } from 'ethereum-cryptography/sha256';
import {
  List,
  TextInput,
  Appbar,
  useTheme,
  Button as Button1,
} from 'react-native-paper';
import Toast from 'react-native-root-toast';

import DialogChangeSharePassword from '../../components/Dialog/DialogChangeSharePassword';
import ScreenLarge from '../../components/ScreenLarge';
import AccountController from '../../helpers/AccountController';
import DateHelper from '../../helpers/DateHelper';
import { showToast } from '../../helpers/ui';
import Aes256Gcm from '../../helpers/wallet/Aes256Gcm';
import Mnemonic from '../../helpers/wallet/Mnemonic';
import Wallet from '../../helpers/wallet/Wallet';
import { hideLoading, showLoading } from '../../redux/modules/App';
import type { Account } from '../../redux/modules/Auth';
import { authActions } from '../../redux/modules/Auth';
import {
  GlobalState,
  useTypedDispatch,
  useTypedSelector,
} from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { goBack, jumpTo } from '../../Screens';

const MnemonicAddView: React.FC<MasterScreen> = ({ route, navigation }) => {
  // @ts-ignore
  const { timestamp } = route.params;
  const [time, setTime] = useState(timestamp);
  const [mnemonicWords, setMnemonicWords] = useState('');
  const accounts = useTypedSelector(
    (state: GlobalState) => state.auth.entities
  );
  const accountIds = useTypedSelector((state: GlobalState) => state.auth.ids);

  const QRCODE_TYPE_MNEMONIC_SHARE = useTypedSelector(
    (state: GlobalState) => state.app.QRCODE_TYPE_MNEMONIC_SHARE
  );

  const [key, setKey] = useState<string>('');

  useEffect(() => {
    if (time !== setTime) {
      setTime(timestamp);
      setKey('');
      setMnemonicWords('');
    }
  }, [time, timestamp]);

  useEffect(() => {
    if (key !== '' && QRCODE_TYPE_MNEMONIC_SHARE != '') {
      try {
        dispatch({
          type: 'app/mergeState',
          payload: {
            QRCODE_TYPE_MNEMONIC_SHARE: '',
          },
        });
        dispatch(showLoading('正在解密...'));

        const key1 = sha256(Buffer.from('SHARE_PWD@' + key)).toString('hex');

        const content = QRCODE_TYPE_MNEMONIC_SHARE!.split('/')[3].split('?')[0];
        let plainData = Aes256Gcm.decrypt(
          Buffer.from(content, 'hex'),
          Buffer.from(key1),
          Buffer.from(key1).subarray(8, 24)
        );
        setMnemonicWords(
          Mnemonic.fromEntropy(plainData.toString().split('?')[0]).getWords()
        );
      } catch (e) {
        Toast.show('解析失败');
      } finally {
        dispatch(hideLoading());
      }
      setKey('');
    }
  }, [QRCODE_TYPE_MNEMONIC_SHARE, key]);

  const dispatch = useTypedDispatch();
  const theme = useTheme();
  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.white }}>
        <Appbar.BackAction
          onPress={() => {
            dispatch({
              type: 'app/mergeState',
              payload: {
                QRCODE_TYPE_MNEMONIC_SHARE: '',
              },
            });
            goBack(navigation);
          }}
        />
        <Appbar.Content title={'添加账户'} />
        <Button
          color={'white'}
          icon={
            <Icon
              backgroundColor={'white'}
              type={'material-community'}
              name={'qrcode-scan'}
            />
          }
          onPress={async () => {
            jumpTo(navigation, 'QrCodeScanner', {});
          }}
        />
      </Appbar.Header>
      <ScreenLarge>
        <View style={styles.container}>
          <List.Section title='账户'>
            <TextInput
              style={styles.inputContainerStyle}
              label='输入助记词'
              multiline
              numberOfLines={5}
              placeholder='助记词由12个英文单词组成'
              value={mnemonicWords}
              onChangeText={(mnemonicWords: string) =>
                setMnemonicWords(mnemonicWords.trim())
              }
            />
          </List.Section>
          <List.Section>
            <Button
              buttonStyle={{ height: 44, marginTop: 24 }}
              color={'primary'}
              onPress={() => {
                if (!mnemonicWords || mnemonicWords.split(' ').length !== 12) {
                  showToast('助记词不合法！');
                } else {
                  dispatch(showLoading('正在添加...'));
                  setTimeout(async () => {
                    try {
                      const m = new Mnemonic(mnemonicWords);
                      const authKey = m.toEntropy();
                      const walletMaster = new Wallet(m);
                      const { address } = walletMaster.getEthWallet(0);

                      let account: Account | undefined = undefined;

                      for (let i = 0; i < Object.values(accounts).length; i++) {
                        const account1: Account = Object.values(accounts)[i]!;
                        if (account1.address === address) {
                          account = account1;
                          break;
                        }
                      }
                      if (account) {
                        dispatch(hideLoading());
                        showToast('账户已存在！');
                      } else {
                        const accountId = DateHelper.currentTimestamp1000();
                        await AccountController.getInstance(
                          accountId
                        ).addEntropy(authKey);
                        const account11 = {
                          accountId,
                          address,
                        };
                        const currentUserInfo =
                          await AccountController.getInstance(accountId).init(
                            account11
                          );
                        dispatch(
                          authActions.initAccount({
                            accounts: [account11],
                            currentUserInfo,
                            currentAccountIndex: accountIds.length,
                          })
                        );
                        goBack(navigation);
                      }
                    } catch (e) {
                      dispatch(hideLoading());
                      showToast('生成失败！');
                    }
                  }, 300);
                }
              }}
            >
              添加
            </Button>
          </List.Section>

          <List.Section style={{ marginTop: 24 }}>
            <Button1
              onPress={() => {
                setMnemonicWords(new Mnemonic().getWords());
              }}
            >
              生成
            </Button1>
          </List.Section>
        </View>
      </ScreenLarge>

      <DialogChangeSharePassword
        visible={!!QRCODE_TYPE_MNEMONIC_SHARE}
        title={'输入密码'}
        onClose={() => {
          dispatch({
            type: 'app/mergeState',
            payload: {
              QRCODE_TYPE_MNEMONIC_SHARE: '',
            },
          });
        }}
        onConfirm={async (pwd: string) => {
          setKey(pwd);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
  },
  inputContainerStyle: {
    fontSize: 24,
    backgroundColor: 'white',
  },
});

export default MnemonicAddView;
