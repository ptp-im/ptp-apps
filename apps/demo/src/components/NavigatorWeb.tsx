import * as React from 'react';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';

import { Appbar, useTheme } from '../../../../src';
import { useIsLargeScreen } from '../../../../src/app/hooks/useIsLargeScreen';
import { useTypedSelector } from '../../../../src/app/redux/store';
import Screens, { goBack, ScreensHideHeader } from '../Screens';
import type { StackParams } from '../Screens';
import MasterTabView from './MasterTabView/MasterTabView';
const Stack = createDrawerNavigator<StackParams>();

const DrawMasterTabView: React.FC = (props) => {
  const currentTabIndex = useTypedSelector(
    (state: any) => state.app.currentTabIndex
  );
  const masterTabs = useTypedSelector((state: any) => state.app.masterTabs);
  if (masterTabs[currentTabIndex].title === 'Me') {
    return <MasterTabView {...props} />;
  }
  return <MasterTabView {...props} />;
};

export default function NavigatorWeb() {
  const isLargeScreen = useIsLargeScreen();
  const theme = useTheme();

  return (
    <Stack.Navigator
      backBehavior='history'
      defaultStatus='open'
      initialRouteName={'Profile'}
      drawerContent={(props: DrawerContentComponentProps) => {
        // @ts-ignore
        return <DrawMasterTabView {...props} />;
      }}
      screenOptions={{
        headerShown: true,
        drawerType: isLargeScreen ? 'permanent' : 'back',
        drawerStyle: isLargeScreen ? null : { width: '100%' },
        drawerContentContainerStyle: { paddingTop: 2 },
        overlayColor: 'transparent',
        header: ({ route, navigation, options }) => {
          let title = getHeaderTitle(options, route.name);
          let fromDrawer = false;
          if (route.params) {
            // @ts-ignore
            if (route.params.title) {
              // @ts-ignore
              title = route.params.title;
            }
            // @ts-ignore
            fromDrawer = route.params.fromDrawer;
          }
          if (
            route.name === 'DrawerDefault' ||
            fromDrawer ||
            navigation.getState().history.length == 1
          ) {
            return (
              <Appbar.Header
                style={{ backgroundColor: theme.colors.white }}
                elevated
              >
                <Appbar.Content
                  title={route.name === 'DrawerDefault' ? '' : title}
                />
              </Appbar.Header>
            );
          }
          return (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.white }}
              elevated
            >
              <Appbar.BackAction
                onPress={() => {
                  goBack(navigation);
                }}
              />
              <Appbar.Content title={title} />
            </Appbar.Header>
          );
        },
      }}
    >
      {(Object.keys(Screens) as Array<keyof typeof Screens>).map((id) => {
        return (
          <Stack.Screen
            key={id}
            name={id}
            options={{ headerShown: !ScreensHideHeader.includes(id) }}
            component={Screens[id]}
          />
        );
      })}
    </Stack.Navigator>
  );
}
