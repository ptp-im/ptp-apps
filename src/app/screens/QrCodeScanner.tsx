import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Button, Icon } from '@rneui/themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { PermissionStatus } from 'expo-modules-core/src/PermissionsInterface';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';

import { Appbar } from '../../../src';
import { isWeb } from '../../utils';
import DateHelper from '../helpers/DateHelper';
import { useIsLargeScreen } from '../hooks/useIsLargeScreen';
import { QRCODE_TYPE } from '../protobuf/PTPCommon';
import { useTypedDispatch } from '../redux/store';
import type { MasterScreen } from '../Screens';
import { goBack, jumpTo } from '../Screens';

let hasGto = false;
const QrCodeScanner: React.FC<MasterScreen> = ({ navigation, route }) => {
  // @ts-ignore
  const { needReplace, timestamp } = route.params;
  const [time, setTime] = useState(timestamp);
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedText, setScannedText] = useState('');
  let width, height;
  const isLargeScreen = useIsLargeScreen();
  const layout = useWindowDimensions();
  if (isWeb) {
    width = isLargeScreen ? layout.width - 320 : layout.width;
    height = layout.height + 56;
  }

  useEffect(() => {
    if (time != timestamp) {
      setTime(timestamp);
      setScannedText('');
      hasGto = false;
    }
  }, [scannedText, time, timestamp]);

  const goTo = (navigation: any, target: string, params?: any) => {
    if (needReplace) {
      jumpTo(navigation, target, params, true);
    } else {
      goBack(navigation);
    }
  };
  const dispatch = useTypedDispatch();
  const onHandleResult = (text: string) => {
    if (text.indexOf('ptp://') >= 0) {
      let type = Number(text.split('/')[2]);
      switch (type) {
        case QRCODE_TYPE.QRCODE_TYPE_MNEMONIC_SHARE:
          dispatch({
            type: 'app/mergeState',
            payload: {
              QRCODE_TYPE_MNEMONIC_SHARE:
                text + `&t1=${DateHelper.currentTimestamp()}`,
            },
          });
          goTo(navigation, 'MnemonicAdd');
          break;
        default:
          break;
      }
      setHasPermission(false);
    } else {
      Toast.show(text);
    }
    setTimeout(() => {
      hasGto = false;
    }, 1000);
  };
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
      if (status === PermissionStatus.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    };
    if (!hasPermission) {
      setTimeout(() => getBarCodeScannerPermissions(), 300);
    }
  }, [hasPermission]);
  useEffect(() => {
    if (scannedText && !hasGto) {
      hasGto = true;
      onHandleResult(scannedText);
      setScannedText('');
    }
  }, [onHandleResult, scannedText]);
  console.log({ scannedText, hasGto, time, timestamp });

  if (hasPermission === null || !hasPermission) {
    return (
      <SafeAreaView style={styles.hasNoPermission}>
        <Appbar.Header
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Appbar.BackAction
            onPress={() => {
              goBack(navigation);
              setTimeout(() => {
                setScannedText('');
                hasGto = false;
              }, 1000);
            }}
          />
        </Appbar.Header>
        <View style={styles.loading}>
          <ActivityIndicator color={'white'} size={48} />
        </View>
      </SafeAreaView>
    );
  }
  const RectItem = ({
    left,
    right,
    top,
    bottom,
  }: {
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
  }) => {
    const style: any = {};
    const borderWidth = 10;
    const borderRadius = 24;
    if (left) {
      style.borderLeftWidth = borderWidth;
    }
    if (top) {
      style.borderTopWidth = borderWidth;
    }
    if (right) {
      style.borderRightWidth = borderWidth;
    }
    if (bottom) {
      style.borderBottomWidth = borderWidth;
    }
    if (left && top) {
      style.borderTopLeftRadius = borderRadius;
    }

    if (left && bottom) {
      style.borderBottomLeftRadius = borderRadius;
    }

    if (right && top) {
      style.borderTopRightRadius = borderRadius;
    }

    if (right && bottom) {
      style.borderBottomRightRadius = borderRadius;
    }
    return (
      <View
        style={[
          {
            width: 100,
            height: 100,
            borderColor: 'white',
          },
          style,
        ]}
      ></View>
    );
  };
  const Rect = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <View
          style={{
            width: 240,
            height: 240,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between',
            flexWrap: 'wrap',
            backgroundColor: 'transparent',
          }}
        >
          <RectItem left top />
          <RectItem right top />
          <RectItem left bottom />
          <RectItem right bottom />
        </View>
      </View>
    );
  };
  const BackBtn = ({ top }: { top: number }) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: top,
          left: 16,
        }}
      >
        <Button
          color={'transparent'}
          icon={<Icon type={'material'} name={'arrow-back-ios'} />}
          onPress={async () => {
            goBack(navigation);
          }}
        />
      </View>
    );
  };
  if (!isWeb) {
    return (
      <>
        <BarCodeScanner
          onBarCodeScanned={({ data }) => {
            if (!scannedText && !hasGto && data) {
              setScannedText(data);
            }
          }}
          style={[StyleSheet.absoluteFillObject]}
        />
        <Rect />
        <BackBtn top={36} />
      </>
    );
  } else {
    return (
      <SafeAreaView>
        <div className={'qrcode-scanner'}>
          <BarcodeScannerComponent
            width={Number(width)}
            height={Number(height)}
            onUpdate={(_, result) => {
              if (!scannedText && !hasGto && result) {
                setScannedText(result.getText());
              }
            }}
          />
        </div>
        <Rect />
        <BackBtn top={16} />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hasNoPermission: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default QrCodeScanner;
