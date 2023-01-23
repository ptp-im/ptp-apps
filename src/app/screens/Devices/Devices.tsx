import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import { Icon, ListItem, Text } from '@rneui/themed';
import { useTheme } from 'react-native-paper';

import ScreenLarge from '../../components/ScreenLarge';
import SectionItem from '../../components/Section/SectionItem';
import SectionView from '../../components/Section/SectionView';
import colors from '../../config/colors';
import DateHelper from '../../helpers/DateHelper';
import MsgConn, { getClientInfo } from '../../helpers/MsgConn';
import type { DevicesInfo_Type } from '../../protobuf/PTPCommon';
import { ClientInfo, ClientType } from '../../protobuf/PTPCommon';
import { deviceSelectors } from '../../redux/modules/Device';
import { GlobalState, useTypedSelector } from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { jumpTo } from '../../Screens';
import type { IconType } from '../../types';
import { SwitchDevicesReq } from '../../protobuf/PTPSwitch';
import useAccount from '../../hooks/useAccount';

function getClientTitle(device: DevicesInfo_Type) {
  return `${device.os_name} (${
    device.client_type === ClientType.CLIENT_TYPE_WEB
      ? device.browser_name
      : device.os_version
  })`;
}

const DeviceItem: React.FC<{
  device: DevicesInfo_Type;
  isOnline?: boolean;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
}> = ({ device, isOnline, onPress }) => {
  let icon: null | { iconType: IconType; name: string; iconBgColor: string } =
    null;
  switch (device.client_type) {
    case ClientType.CLIENT_TYPE_WEB:
      icon = {
        iconType: 'entypo',
        name: 'browser',
        iconBgColor: colors.BLUE,
      };
      break;
    case ClientType.CLIENT_TYPE_ANDROID:
      icon = {
        iconType: 'material',
        name: 'android',
        iconBgColor: colors.GREEN,
      };
      break;
    case ClientType.CLIENT_TYPE_IOS:
      icon = {
        iconType: 'material',
        name: 'phone-iphone',
        iconBgColor: colors.ORANGE,
      };
      break;
    case ClientType.CLIENT_TYPE_MAC:
      icon = {
        iconType: 'material',
        name: 'desktop-mac',
        iconBgColor: colors.PURPLE,
      };
      break;
    case ClientType.CLIENT_TYPE_PC:
      icon = {
        iconType: 'material',
        name: 'computer',
        iconBgColor: colors.GREY,
      };
      break;
    default:
      break;
  }
  const theme = useTheme();

  return (
    <ListItem Component={TouchableHighlight} onPress={onPress}>
      {icon && (
        <Icon
          type={icon.iconType}
          name={icon.name}
          size={20}
          color='white'
          containerStyle={{
            backgroundColor: icon.iconBgColor || colors.GREY,
            width: 28,
            height: 28,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
          }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>{getClientTitle(device)}</ListItem.Title>
        <ListItem.Title style={styles.subText}>
          {device.client_version}
        </ListItem.Title>
        <ListItem.Title style={styles.subText}>
          登录时间: {DateHelper.formatTime(device.login_time)}
        </ListItem.Title>
        <ListItem.Title style={styles.subText}>
          ID: {device.client_id}
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Content
        right
        style={{
          alignSelf: 'flex-start',
        }}
      >
        <ListItem.Title right>
          <Text
            style={{
              fontSize: 12,
              color: isOnline ? theme.colors.textPrimary : theme.colors.text,
            }}
          >
            {isOnline ? '在线' : '离线'}
          </Text>
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron
        containerStyle={{
          alignSelf: 'flex-start',
        }}
      />
    </ListItem>
  );
};

const Devices: React.FC<MasterScreen> = ({ navigation, route }) => {
  //@ts-ignore
  const { timestamp } = route.params;

  const [time, setTime] = useState(timestamp);
  const devices = useTypedSelector((state: GlobalState) =>
    deviceSelectors.selectAll(state.Device)
  );
  const onlineDevices = useTypedSelector(
    (state: GlobalState) => state.Device.onlineDevices
  );
  const { currentMsgConnClientId, currentUserInfo } = useAccount();

  useEffect(() => {
    const init = async () => {
      MsgConn.SendMessage(
        new SwitchDevicesReq({
          ...(await getClientInfo()),
        }).pack()
      );
    };
    if (time != timestamp) {
      init();
      setTime(timestamp);
    }
  }, [time, timestamp]);
  const items = devices.filter((device: DevicesInfo_Type) => {
    return !(
      !currentUserInfo ||
      currentUserInfo.uid !== device.uid ||
      currentMsgConnClientId === device.client_id
    );
  });
  const currentDevice = devices.find(
    (device) => device.client_id === currentMsgConnClientId
  );

  const onPress = (device: DevicesInfo_Type) => {
    jumpTo(navigation, 'Device', {
      ...device,
      title: getClientTitle(device),
    });
  };
  return (
    <>
      <ScreenLarge>
        {currentDevice && (
          <SectionView title={'当前设备'} style={styles.section}>
            <SectionItem isFirst={true}>
              <DeviceItem
                onPress={() => {
                  onPress(currentDevice);
                }}
                isOnline={!!MsgConn.getMsgClient()?.isConnect()}
                device={currentDevice}
              />
            </SectionItem>
          </SectionView>
        )}

        <SectionView title={'其他设备'} style={styles.section}>
          {items.map((device, i) => {
            return (
              <SectionItem
                showDivider={i < items.length - 1}
                key={device.client_id}
                isFirst={i == 0}
              >
                <DeviceItem
                  isOnline={onlineDevices.includes(device.client_id)}
                  onPress={() => {
                    console.log(device);
                    onPress(device);
                  }}
                  device={device}
                />
              </SectionItem>
            );
          })}
        </SectionView>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  subText: {
    marginTop: 8,
    fontSize: 12,
  },
});

export default Devices;
