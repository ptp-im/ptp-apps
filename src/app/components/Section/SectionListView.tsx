import * as React from 'react';
import { useState } from 'react';
import {
  GestureResponderEvent,
  SectionList,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import { Divider, Icon, ListItem, Switch } from '@rneui/themed';

import { useTheme } from '../../../';
import colors from '../../config/colors';
import type { SectionListItem } from '../../types';

interface SectionListViewProps {
  separatorMarginLeft?: number;
  selectedItem?: string | null;
  onItemPress?:
    | null
    | ((event: GestureResponderEvent, item: SectionListItem) => void)
    | undefined;
  sections: {
    data: SectionListItem[];
  }[];
}

const SectionListView: React.FC<SectionListViewProps> = ({
  separatorMarginLeft,
  onItemPress,
  selectedItem,
  sections,
}) => {
  const renderItem = ({
    item: {
      title,
      id,
      iconBgColor,
      icon,
      rightTitle,
      hideChevron,
      checkbox,
      iconType,
    },
  }: {
    item: SectionListItem;
  }) => (
    <ListItem
      Component={TouchableHighlight}
      onPress={(e) => {
        if (title != null && onItemPress) {
          onItemPress(e, { id, title });
        }
      }}
      containerStyle={[
        { paddingVertical: 8, height: 54 },
        selectedItem === title
          ? { backgroundColor: theme.colors.backgroundSelected }
          : {},
      ]}
      key={title}
    >
      {icon && (
        <Icon
          type={iconType}
          name={icon}
          size={20}
          color='white'
          containerStyle={{
            backgroundColor: iconBgColor || colors.GREY,
            width: 28,
            height: 28,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title
          style={[selectedItem === title ? { color: theme.colors.white } : {}]}
        >
          {title}
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Content right>
        <ListItem.Title
          style={[selectedItem === title ? { color: theme.colors.white } : {}]}
          right
        >
          {rightTitle}
        </ListItem.Title>
      </ListItem.Content>
      {!hideChevron && selectedItem !== title && <ListItem.Chevron />}
      {checkbox && (
        <Switch value={switched} onValueChange={onSwitchEventHandler} />
      )}
    </ListItem>
  );
  const [switched, setSwitched] = useState(false);

  const onSwitchEventHandler = (value: boolean) => {
    setSwitched(value);
  };

  const renderSectionHeader = () => <View style={styles.headerSection} />;
  const theme = useTheme();
  const ItemSeparatorComponent = () => (
    <View
      style={[
        theme.dark
          ? styles.separatorComponentDark
          : styles.separatorComponentLight,
      ]}
    >
      <Divider
        style={[styles.separator, { marginLeft: separatorMarginLeft }]}
      />
    </View>
  );

  const keyExtractor: (item: SectionListItem, index: number) => string = (
    _item: SectionListItem,
    index: React.Key
  ) => {
    return index.toString();
  };
  return (
    <SectionList
      keyExtractor={keyExtractor}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={ItemSeparatorComponent}
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  separatorComponentLight: {
    backgroundColor: 'white',
  },
  separatorComponentDark: {
    backgroundColor: 'black',
  },
  separator: {
    marginLeft: 58,
  },
  headerSection: {
    height: 30,
  },
});

export default SectionListView;
