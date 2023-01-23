import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { sha256 } from 'ethereum-cryptography/sha256';
import { Appbar, Button, Card, useTheme } from 'react-native-paper';
import SvgQRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-root-toast';

import DialogChangeSharePassword from '../../components/Dialog/DialogChangeSharePassword';
import ScreenLarge from '../../components/ScreenLarge';
import AccountController from '../../helpers/AccountController';
import DateHelper from '../../helpers/DateHelper';
import DbStorage from '../../helpers/DbStorage';
import Aes256Gcm from '../../helpers/wallet/Aes256Gcm';
import Mnemonic from '../../helpers/wallet/Mnemonic';
import useAccount from '../../hooks/useAccount';
import { QRCODE_TYPE } from '../../protobuf/PTPCommon';
import type { MasterScreen } from '../../Screens';
import { goBack } from '../../Screens';

const MnemonicView: React.FC<MasterScreen> = ({ navigation, route }) => {
  const { accountId } = useAccount();

  const [time, setTime] = useState(DateHelper.currentTimestamp);
  const [words, setWords] = useState<string | null>(null);
  const [wordsQr, setWordsQr] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      if (accountId) {
        const authKey = await AccountController.getInstance(
          Number(accountId!)
        ).getEntropy();
        const words = Mnemonic.fromEntropy(authKey).getWords();
        setWords(words);
      }
    };
    if (accountId) {
      init();
    }
  }, [accountId]);

  useEffect(() => {
    const init = async () => {
      if (words) {
        const authKey = await AccountController.getInstance(
          Number(accountId!)
        ).getEntropy();
        if (!key) {
          let key1 = await DbStorage.getItem('shared_key');
          if (!key1) {
            key1 = sha256(Buffer.from(String(time) + authKey)).toString('hex');
          }
          setKey(key1);
        }
        if (key) {
          const sFix = `?t=${time}`;
          let cipher = Aes256Gcm.encrypt(
            Buffer.from(authKey + sFix),
            Buffer.from(key),
            Buffer.from(key).subarray(4, 24)
          );
          const content = cipher.toString('hex') + sFix;
          setWordsQr(
            `ptp://${QRCODE_TYPE.QRCODE_TYPE_MNEMONIC_SHARE}/${content}}`
          );
        }
      }
    };
    if (words) {
      init();
    }
  }, [accountId, time, words, key]);
  const theme = useTheme();
  if (!words) {
    return null;
  }
  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.white }}>
        <Appbar.BackAction
          onPress={() => {
            goBack(navigation);
          }}
        />
        <Appbar.Content title={'助记词'} />
        <Button onPress={async () => setShowDialog(true)}>修改密码</Button>
      </Appbar.Header>
      <ScreenLarge>
        <View style={styles.main}>
          <Card style={styles.card}>
            <Text>{words}</Text>
          </Card>
          <Card
            style={styles.qrcode}
            onPress={() => {
              setTime(DateHelper.currentTimestamp());
            }}
          >
            {wordsQr && <SvgQRCode size={200} value={wordsQr} />}
          </Card>
          <Card style={[styles.card, styles.cardInfo]}>
            <Text>
              二维码已经加密,如在其他设备扫描需使用密码解密,更改密码请点击右上角修改密码
            </Text>
          </Card>
        </View>
      </ScreenLarge>
      <DialogChangeSharePassword
        visible={showDialog}
        title={'修改密码'}
        onClose={() => setShowDialog(false)}
        onConfirm={async (pwd: string) => {
          const key = sha256(Buffer.from('SHARE_PWD@' + pwd)).toString('hex');
          await DbStorage.setItem('shared_key', key);
          setKey(key);
          setShowDialog(false);
          Toast.show('修改成功');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 12,
  },
  card: {
    padding: 12,
  },
  cardInfo: {
    marginTop: 24,
  },
  qrcode: {
    marginTop: 12,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MnemonicView;
