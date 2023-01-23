import * as React from 'react';

import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import Contacts from '../../../src/app/screens/Contacts';
import Device from '../../../src/app/screens/Devices/Device';
import Devices from '../../../src/app/screens/Devices/Devices';
import Discover from '../../../src/app/screens/Discover';
import Me from '../../../src/app/screens/Me';
import Message from '../../../src/app/screens/Message';
import AccountsView from '../../../src/app/screens/Profile/AccountsView';
import FieldModify from '../../../src/app/screens/Profile/FieldModify';
import MnemonicAddView from '../../../src/app/screens/Profile/MnemonicAddView';
import MnemonicNote from '../../../src/app/screens/Profile/MnemonicNote';
import MnemonicView from '../../../src/app/screens/Profile/MnemonicView';
import NameQrCodeCard from '../../../src/app/screens/Profile/NameQrCodeCard';
import Profile from '../../../src/app/screens/Profile/Profile';
import QrCodeScanner from '../../../src/app/screens/QrCodeScanner';
import Sessions from '../../../src/app/screens/Sessions';

export const ScreensHideHeader = [
  'FieldModify',
  'MnemonicAdd',
  'Accounts',
  'DrawerDefault',
  'Mnemonic',
  'QrCodeScanner',
  'NameQrCodeCard',
  'MnemonicNote',
];

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
  Discover,
  Sessions,
  Contacts,
  Me,
};

export const Screens: Record<string, React.ComponentType<any>> = {
  Profile: Profile,
  Message: Message,
  Sessions: Sessions,
  FieldModify: FieldModify,
  NameQrCodeCard,
  MnemonicNote,
  Device,
  Devices,
  QrCodeScanner,
  Mnemonic: MnemonicView,
  MnemonicAdd: MnemonicAddView,
  Accounts: AccountsView,
};

export default Screens;
