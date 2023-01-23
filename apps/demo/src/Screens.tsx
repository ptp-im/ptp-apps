import * as React from 'react';
import { FlatList } from 'react-native';

import type { DrawerHeaderProps } from '@react-navigation/drawer';
import {
  CommonActions,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { List, useTheme } from '../../../src';
import { isWeb } from '../../../src';
import ScreenLarge from '../../../src/app/components/ScreenLarge';
import Config from '../../../src/app/config';
import IconsList from '../../../src/app/screens/Dev/IconsList';
import ProtobufMessageDetail from '../../../src/app/screens/Protobuf/ProtobufMessageDetail';
import ProtobufMessages from '../../../src/app/screens/Protobuf/ProtobufMessages';
import QrCodeScanner from '../../../src/app/screens/QrCodeScanner';
import Demo from './screens/Demo';
import Demoes from './screens/Demoes';
import ActivityIndicatorExample from './screens/Examples/ActivityIndicatorExample';
// import AnimatedFABExample from './screens/Examples/AnimatedFABExample';
import AppbarExample from './screens/Examples/AppbarExample';
import AvatarExample from './screens/Examples/AvatarExample';
import BadgeExample from './screens/Examples/BadgeExample';
import BannerExample from './screens/Examples/BannerExample';
import BottomNavigationExample from './screens/Examples/BottomNavigationExample';
import ButtonExample from './screens/Examples/ButtonExample';
// import CardExample from './screens/Examples/CardExample';
import CheckboxExample from './screens/Examples/CheckboxExample';
import CheckboxItemExample from './screens/Examples/CheckboxItemExample';
import ChipExample from './screens/Examples/ChipExample';
import DataTableExample from './screens/Examples/DataTableExample';
import DialogExample from './screens/Examples/DialogExample';
import DividerExample from './screens/Examples/DividerExample';
import LoginExample from './screens/Examples/Elements/Login';
import PricingExample from './screens/Examples/Elements/Pricing';
import ProfileExample from './screens/Examples/Elements/Profile';
import SettingExample from './screens/Examples/Elements/Settings';
import SkeletonExample from './screens/Examples/Elements/Skeleton';
import WhatsappClone from './screens/Examples/Elements/WhatsappClone';
import FABExample from './screens/Examples/FABExample';
import IconButtonExample from './screens/Examples/IconButtonExample';
import ListAccordionExample from './screens/Examples/ListAccordionExample';
import ListAccordionExampleGroup from './screens/Examples/ListAccordionGroupExample';
import ListSectionExample from './screens/Examples/ListSectionExample';
import MenuExample from './screens/Examples/MenuExample';
import ProgressBarExample from './screens/Examples/ProgressBarExample';
import RadioButtonExample from './screens/Examples/RadioButtonExample';
import RadioButtonGroupExample from './screens/Examples/RadioButtonGroupExample';
import RadioButtonItemExample from './screens/Examples/RadioButtonItemExample';
import SearchbarExample from './screens/Examples/SearchbarExample';
import SegmentedButtonExample from './screens/Examples/SegmentedButtonsExample';
import SnackbarExample from './screens/Examples/SnackbarExample';
import SurfaceExample from './screens/Examples/SurfaceExample';
import SwitchExample from './screens/Examples/SwitchExample';
import TextExample from './screens/Examples/TextExample';
import TextInputExample from './screens/Examples/TextInputExample';
import ThemeExample from './screens/Examples/ThemeExample';
import ToggleButtonExample from './screens/Examples/ToggleButtonExample';
import TouchableRippleExample from './screens/Examples/TouchableRippleExample';

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

const exampleIgnore = [
  'ProtobufMessages',
  'ProtobufMessageDetail',
  'QrCodeScanner',
  'IconsList',
];

export const ScreensExample: Record<string, React.ComponentType<any>> = {
  ProtobufMessages: ProtobufMessages,
  ProtobufMessageDetail: ProtobufMessageDetail,
  QrCodeScanner,
  IconsList: IconsList,
  SettingExample: SettingExample,
  WhatsappClone: WhatsappClone,
  PricingExample: PricingExample,
  ProfileExample: ProfileExample,
  LoginExample: LoginExample,
  SkeletonExample: SkeletonExample,
  // animatedFab: AnimatedFABExample,
  activityIndicator: ActivityIndicatorExample,
  appbar: AppbarExample,
  avatar: AvatarExample,
  badge: BadgeExample,
  banner: BannerExample,
  bottomNavigation: BottomNavigationExample,
  button: ButtonExample,
  // card: CardExample,
  checkbox: CheckboxExample,
  checkboxItem: CheckboxItemExample,
  chip: ChipExample,
  dataTable: DataTableExample,
  dialog: DialogExample,
  divider: DividerExample,
  fab: FABExample,
  iconButton: IconButtonExample,
  listAccordion: ListAccordionExample,
  listAccordionGroup: ListAccordionExampleGroup,
  listSection: ListSectionExample,
  menu: MenuExample,
  progressbar: ProgressBarExample,
  radio: RadioButtonExample,
  radioGroup: RadioButtonGroupExample,
  radioItem: RadioButtonItemExample,
  searchbar: SearchbarExample,
  segmentedButton: SegmentedButtonExample,
  snackbar: SnackbarExample,
  surface: SurfaceExample,
  switch: SwitchExample,
  text: TextExample,
  textInput: TextInputExample,
  toggleButton: ToggleButtonExample,
  touchableRipple: TouchableRippleExample,
  theme: ThemeExample,
};

export const Screens: Record<string, React.ComponentType<any>> = {
  ...ScreensExample,
  ScreensExample: ScreensExampleView,
};

type Props = {
  navigation: StackNavigationProp<{ [key: string]: undefined }> | any;
};

type Item = {
  id: string;
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

export function ScreensExampleView({ navigation }: Props | any) {
  const nav = useNavigation();
  React.useEffect(() => {
    if (!isWeb) {
      navigation.setOptions({
        title: 'Example',
      });
    }
  }, [navigation]);

  const renderItem = ({ item }: { item: Item }) => (
    <List.Item
      title={item.id}
      onPress={() => {
        jumpTo(nav, item.id, { title: item.id });
      }}
    />
  );

  const keyExtractor = (item: { id: string }) => item.id;

  const { colors } = useTheme();
  const safeArea = useSafeAreaInsets();

  return (
    <ScreenLarge>
      <FlatList
        contentContainerStyle={{
          backgroundColor: colors.white,
          paddingBottom: safeArea.bottom,
          paddingLeft: safeArea.left,
          paddingRight: safeArea.right,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={Object.keys(ScreensExample)
          .filter((id) => !exampleIgnore.includes(id))
          .map((id): Item => ({ id }))}
      />
    </ScreenLarge>
  );
}

ScreensExampleView.title = 'Example';

export default Screens;
