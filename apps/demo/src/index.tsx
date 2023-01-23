import '../global';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';

import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import type { NavigatorScreenParams } from '@react-navigation/native';
import {
  InitialState,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { Provider as PaperProvider } from '../../../src';
import MsgConnManager from '../../../src/app/components/MsgConnManager/MsgConnManager';
import RootController from '../../../src/app/components/RootController';
import Config from '../../../src/app/config';
import {
  V2LightTheme,
  V2NavLightColors,
  V2NavDarkColors,
  V2DarkTheme,
} from '../../../src/app/config/theme';
import DbStorage from '../../../src/app/helpers/DbStorage';
import { useIsLargeScreen } from '../../../src/app/hooks/useIsLargeScreen';
import { store } from '../../../src/app/redux/store';
import { isWeb } from '../../../src/utils';
import NavigatorMobile from './components/NavigatorMobile';
import NavigatorWeb from './components/NavigatorWeb';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

export const PreferencesContext = React.createContext<any>(null);

export type LinkComponentDemoParamList = {
  Article: { author: string };
  Albums: undefined;
};

type ParamListTypes = {
  Home: undefined;
  NotFound: undefined;
  LinkComponent: NavigatorScreenParams<LinkComponentDemoParamList> | undefined;
};

export const SCREENS = {
  MasterDetail: {
    title: 'MasterDetail',
    component: NavigatorWeb,
  },
};

export type RootStackParamList = {
  [P in Exclude<keyof typeof SCREENS, keyof ParamListTypes>]: undefined;
} & ParamListTypes;

export default function App() {
  useKeepAwake();
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [rtl, setRtl] = React.useState<boolean>(
    I18nManager.getConstants().isRTL
  );
  const [collapsed, setCollapsed] = React.useState(false);

  const themeMode = isDarkMode ? 'dark' : 'light';

  let theme: any;
  theme = {
    light: V2LightTheme,
    dark: V2DarkTheme,
  }[themeMode];

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        let savedStateString = await DbStorage.getItem(PERSISTENCE_KEY);
        if (isWeb) {
          savedStateString = window.sessionStorage.getItem(PERSISTENCE_KEY);
        }
        const state = JSON.parse(savedStateString || '');
        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await DbStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');

          if (typeof preferences.rtl === 'boolean') {
            setRtl(preferences.rtl);
          }
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await DbStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: themeMode,
            rtl,
          })
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.getConstants().isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        if (!isWeb) {
          Updates.reloadAsync();
        }
      }
    };

    savePrefs();
  }, [rtl, themeMode]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleRtl: () => setRtl((rtl) => !rtl),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleThemeVersion: () => {},
      collapsed,
      rtl,
      theme,
    }),
    [rtl, theme, collapsed]
  );
  const isLargeScreen = useIsLargeScreen();
  Config.appConfig.isLargeScreen = isLargeScreen;
  const [isLargeScreen_] = useState(isLargeScreen);
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    if (isLargeScreen_ !== isLargeScreen && isWeb) {
      window.location.reload();
    }
  }, [isLargeScreen, isLargeScreen_]);
  useReduxDevToolsExtension(navigationRef);
  if (!isReady) {
    return null;
  }
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <PreferencesContext.Provider value={preferences}>
              <React.Fragment>
                <MsgConnManager />
                <NavigationContainer
                  theme={{
                    dark: theme.dark,
                    colors: {
                      light: V2NavLightColors,
                      dark: V2NavDarkColors,
                    }[themeMode],
                  }}
                  documentTitle={{
                    enabled: isWeb,
                    formatter: (_, route) => {
                      const siteTitle = 'DemoMasterTabView.tsx';
                      // @ts-ignore
                      if (route?.params && route.params.title) {
                        // @ts-ignore
                        return `${route.params.title} - ${siteTitle}`;
                      }
                      return siteTitle;
                    },
                  }}
                  onReady={() => {
                    // console.debug(navigationRef);
                  }}
                  initialState={initialState}
                  onStateChange={(state) => {
                    if (isWeb) {
                      if (isLargeScreen && state?.history?.length == 1) {
                        // jumpTo(navigationRef, 'Profile', {});
                      }
                      window.sessionStorage.setItem(
                        PERSISTENCE_KEY,
                        JSON.stringify(state)
                      );
                    } else {
                      if (state) {
                        DbStorage.setItem(
                          PERSISTENCE_KEY,
                          JSON.stringify(state)
                        );
                      }
                    }
                  }}
                >
                  <RootController>
                    {!isWeb || !isLargeScreen ? (
                      <NavigatorMobile />
                    ) : (
                      <NavigatorWeb />
                    )}
                  </RootController>
                  <StatusBar style={theme.dark ? 'light' : 'dark'} />
                </NavigationContainer>
              </React.Fragment>
            </PreferencesContext.Provider>
          </SafeAreaProvider>
        </PaperProvider>
      </RootSiblingParent>
    </Provider>
  );
}
