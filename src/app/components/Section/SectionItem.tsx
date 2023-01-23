import * as React from 'react';
import type { ReactNode } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
  View,
} from 'react-native';

import { ListItem, Divider } from '@rneui/themed';

import { useTheme } from '../../../';
import ui from '../../config/ui';

interface Props {
  title?: string;
  height?: number;
  image?: ReactNode;
  titleRight?: string;
  isFirst?: boolean;
  isTextAlert?: boolean;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const SectionItem: React.FC<Props> = ({
  title,
  image,
  isTextAlert,
  isFirst,
  showDivider,
  height = 50,
  style,
  containerStyle,
  titleRight,
  onPress,
  children,
}) => {
  const theme = useTheme();
  const textAlert = theme.colors.textAlert;
  return (
    <>
      <View
        style={[styles.container, containerStyle, isFirst ? styles.first : {}]}
      >
        {children ? (
          children
        ) : (
          <ListItem
            Component={TouchableHighlight}
            onPress={onPress}
            containerStyle={[styles.item, style, { height }]}
          >
            {image}
            <ListItem.Content>
              <ListItem.Title
                style={[styles.title, isTextAlert ? { color: textAlert } : {}]}
              >
                {title}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
              <ListItem.Title right>{titleRight}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      </View>
      {showDivider && <Divider style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 50,
  },
  title: {
    fontWeight: '700',
  },
  container: {
    overflow: 'hidden',
  },
  divider: {
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  first: {
    borderTopLeftRadius: ui.sectionBorderRadius,
    borderTopRightRadius: ui.sectionBorderRadius,
  },
});

export default SectionItem;
