import type { DrawerHeaderProps } from '@react-navigation/drawer';
import {
  CommonActions,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import Config from '../../../src/app/config';
import Demo from './screens/Demo';
import ProtobufMessageDetail from '../../../src/app/screens/Protobuf/ProtobufMessageDetail';
import ProtobufMessages from '../../../src/app/screens/Protobuf/ProtobufMessages';
import { isWeb } from '../../../src/utils';
import Demoes from './screens/Demoes';

export const ScreensHideHeader = ['QrCodeScanner'];

type ParamListTypes = {
  Sessions: undefined;
  Message: undefined;
};

export type StackParams = {
  [P in Exclude<keyof typeof Screens, keyof ParamListTypes>]:
    | undefined
    | React.FC<MasterScreen>;
};

export interface MasterScreen {
  route: RouteProp<any, any>;
  navigation: DrawerHeaderProps & StackNavigationProp<ParamListBase>;
}

export const masterTabRoute: Record<string, React.ComponentType<any>> = {
  Demoes,
  Demo,
};

export const Screens: Record<string, React.ComponentType<any>> = {
  ProtobufMessages,
  ProtobufMessageDetail,
};

export const goBack = (navigation: any) => {
  const { history } = navigation.getState();
  if (
    isWeb &&
    Config.appConfig.isLargeScreen &&
    history.length > 1 &&
    history[history.length - 1].type === 'drawer' &&
    history[history.length - 1].status === 'closed'
  ) {
    navigation.goBack();
    navigation.goBack();
  } else {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('MasterTabView', {});
    }
  }
};
export const jumpTo = (
  navigation: any,
  target: string,
  params?: object,
  isReplace?: boolean
) => {
  if (!params) {
    params = {};
  }
  // @ts-ignore
  params.timestamp = +new Date();

  if (isWeb && Config.appConfig.isLargeScreen && navigation.emit) {
    const event = navigation.emit({
      type: 'drawerItemPress',
      target,
      canPreventDefault: true,
    });
    const state = navigation.getState();
    const focused = state.routeNames.indexOf(target) === state.index;
    if (!event.defaultPrevented) {
      let action;
      if (focused) {
        action = CommonActions.setParams({ ...params });
      } else {
        action = CommonActions.navigate({
          name: target,
          params: { ...params },
          merge: isReplace,
        });
      }
      navigation.dispatch({
        ...action,
        target: state.key,
      });
    }
  } else {
    navigation.navigate(target, { ...params });
  }
};

export default Screens;
