import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SvgQRCode from 'react-native-qrcode-svg';

import { Appbar, Card, useTheme } from '../../../';
import ScreenLarge from '../../components/ScreenLarge';
import DateHelper from '../../helpers/DateHelper';
import { maskAddress } from '../../helpers/utils';
import { QRCODE_TYPE } from '../../protobuf/PTPCommon';
import { GlobalState, useTypedSelector } from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { goBack } from '../../Screens';

const NameQrCodeCard: React.FC<MasterScreen> = ({ navigation }) => {
  const { address } = useTypedSelector(
    (state: GlobalState) => state.auth.currentUserInfo!
  );

  const [content, setContent] = useState(
    `ptp://${
      QRCODE_TYPE.QRCODE_TYPE_NAME_CARD
    }/${address}?t=${DateHelper.currentTimestamp()}`
  );
  const theme = useTheme();
  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.white }}>
        <Appbar.BackAction
          onPress={() => {
            goBack(navigation);
          }}
        />
        <Appbar.Content title={'二维码名片'} />
      </Appbar.Header>
      <ScreenLarge>
        <View style={styles.main}>
          <Card
            style={styles.card}
            onPress={() => {
              setContent(
                `ptp://${
                  QRCODE_TYPE.QRCODE_TYPE_NAME_CARD
                }/${address}?t=${DateHelper.currentTimestamp()}`
              );
            }}
          >
            <View style={styles.cardInner}>
              <SvgQRCode size={200} value={content} />
              <View style={styles.info}>
                <Text>{maskAddress(address)}</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  card: {
    marginHorizontal: 24,
    marginTop: 60,
    height: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInner: {
    paddingTop: 48,
    paddingBottom: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginTop: 12,
  },
});

export default NameQrCodeCard;
