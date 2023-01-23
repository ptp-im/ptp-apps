import * as React from 'react';
import { Platform } from 'react-native';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { Appbar } from '../../../../src';

import Screens, { ScreensHideHeader } from '../Screens';
import type { StackParams } from '../Screens';
import MasterTabView from './MasterTabView/MasterTabView';
import { getHeaderTitle } from '@react-navigation/elements';

const Stack = createStackNavigator<StackParams>();

const NavigatorMobile: React.FC = () => {
  const cardStyleInterpolator =
    Platform.OS === 'android'
      ? CardStyleInterpolators.forFadeFromCenter
      : CardStyleInterpolators.forHorizontalIOS;

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => {
        return {
          detachPreviousScreen: !navigation.isFocused(),
          cardStyleInterpolator,
          headerShown: true,
          header: ({ navigation, options, route, back }) => {
            if (route.name === 'MasterTabView') {
              return null;
            }
            let title = getHeaderTitle(options, route.name);
            if (route.params) {
              // @ts-ignore
              if (route.params.title) {
                // @ts-ignore
                title = route.params.title;
              }
            }
            return (
              <Appbar.Header style={{ backgroundColor: 'white' }}>
                {back ? (
                  <Appbar.BackAction onPress={() => navigation.goBack()} />
                ) : null}
                <Appbar.Content title={title} />
              </Appbar.Header>
            );
          },
        };
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'MasterTabView'}
        component={MasterTabView}
      />
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
};

export default NavigatorMobile;
