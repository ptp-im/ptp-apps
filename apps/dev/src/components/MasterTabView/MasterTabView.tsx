import * as React from 'react';
import { View, Dimensions, StyleSheet, Platform, Easing } from 'react-native';

import { isADR } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabs, useTheme } from '../../../../../src';
import type { MasterTab } from '../../../../../src/app/redux/modules/App';
import {
  useTypedDispatch,
  useTypedSelector,
} from '../../../../../src/app/redux/store';
import type { GlobalState } from '../../../../../src/app/redux/store';
import Badge from '../../../../../src/components/Badge';
import { masterTabRoute } from '../../Screens';

interface RouteState {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  badge?: boolean | number;
  getAccessibilityLabel?: string;
  getTestID?: string;
}
type RoutesState = Array<RouteState>;

type PropsBadge = {
  tabKey: string;
  size: number;
};

const BadgeView: React.FC<PropsBadge> = ({ tabKey, size }) => {
  const unReadCnt = useTypedSelector(
    (state: GlobalState) => state.im.unReadCnt
  );
  let badge: number | boolean = false;
  if (tabKey === 'Sessions' && unReadCnt > 0) {
    badge = unReadCnt;
  }

  return (
    <React.Fragment>
      {typeof badge === 'boolean' ? (
        <Badge visible={badge} size={size} />
      ) : (
        <Badge visible={badge != null} size={16}>
          {badge}
        </Badge>
      )}
    </React.Fragment>
  );
};
const MasterTabView: React.FC = (props) => {
  const currentTabIndex = useTypedSelector(
    (state: GlobalState) => state.app.currentTabIndex
  );

  const masterTabs = [
    {
      title: 'Demo',
      key: 'Demo',
      focusedIcon: 'menu',
      // color: '#2962ff',
      unfocusedIcon: 'menu',
    },
    {
      title: 'Demoes',
      key: 'Demoes',
      focusedIcon: 'compass',
      // color: '#2962ff',
      unfocusedIcon: 'compass-outline',
    },
  ];
  const unReadCnt = useTypedSelector(
    (state: GlobalState) => state.im.unReadCnt
  );
  // console.debug(masterTabs, { unReadCnt });
  const masterTabsSceneAnimationType = useTypedSelector(
    (state: GlobalState) => state.app.masterTabsSceneAnimationType
  );
  const dispatch = useTypedDispatch();
  const { isV3, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [routes, setRoutes] = React.useState<RoutesState>(
    masterTabs.map(
      ({ key, title, color, badge, unfocusedIcon, focusedIcon }: MasterTab) => {
        return {
          key,
          title,
          badge,
          focusedIcon,
          ...(!isV3 ? { color } : { unfocusedIcon }),
        };
      }
    )
  );
  React.useEffect(() => {
    setRoutes(
      routes.map((route: RouteState) => {
        if (route.key === 'Sessions' && route.badge !== unReadCnt) {
          route.badge = unReadCnt > 0 ? unReadCnt : false;
        }
        return route;
      })
    );
  }, [unReadCnt]);
  //@ts-ignore
  const navigation = props.navigation;
  let styleMain = [styles.main];
  return (
    <View style={styles.screen}>
      <View style={styleMain}>
        {React.createElement(masterTabRoute[masterTabs[currentTabIndex].key], {
          navigation,
        })}
      </View>
      <BottomTabs
        renderBadge={({ route, size }) => {
          return <BadgeView size={size} tabKey={route.key} />;
        }}
        activeColor={colors.primary}
        style={{ borderTopColor: colors.border, borderTopWidth: 1 }}
        renderScene={() => {
          return null;
        }}
        safeAreaInsets={{ bottom: insets.bottom }}
        navigationState={{ index: currentTabIndex, routes }}
        onIndexChange={(currentTabIndex: number) => {
          dispatch({
            type: 'app/mergeState',
            payload: { currentTabIndex },
          });
        }}
        labelMaxFontSizeMultiplier={2}
        sceneAnimationEnabled={true}
        sceneAnimationType={masterTabsSceneAnimationType}
        sceneAnimationEasing={Easing.ease}
      />
    </View>
  );
};
//@ts-ignore
MasterTabView.title = 'MasterTabView';

export default MasterTabView;

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      main: {
        height: 'calc(100vh - 54px)',
        overflow: 'hidden',
      },
      content: {
        // there is no 'grid' type in RN :(
        display: 'grid' as 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: 8,
      },
      item: {
        width: '100%',
        height: 150,
      },
    },
    default: {
      main: {
        height: Dimensions.get('window').height - (isADR ? -20 : 90),
        overflow: 'hidden',
      },
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
        padding: 4,
      },
    },
  }),
  screen: {
    flex: 1,
    position: 'relative',
  },
});
