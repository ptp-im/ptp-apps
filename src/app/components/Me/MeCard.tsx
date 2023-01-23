import * as React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ListItem, Text } from '@rneui/themed';
import { default as AddressAvatar } from 'react-native-jazzicon';
import { useTheme } from '../../../';

import { isWeb } from '../../../utils';
import { maskAddress } from '../../helpers/utils';
import useAccount from '../../hooks/useAccount';
import CacheImage from '../CacheMedia/CacheImage';

interface MeCardProps {
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const MeCard: React.FC<MeCardProps> = ({ onPress, selected }) => {
  const { currentUserInfo } = useAccount();
  const { address } = currentUserInfo;
  let avatar = '';
  let nick_name = null;
  if (currentUserInfo?.avatar) {
    avatar = currentUserInfo.avatar;
  }
  if (currentUserInfo?.nick_name) {
    nick_name = currentUserInfo.nick_name!;
  }
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ListItem
        containerStyle={[
          styles.item,
          selected && isWeb
            ? { backgroundColor: colors.backgroundSelected }
            : {},
        ]}
        Component={TouchableOpacity}
        onPress={onPress}
      >
        {avatar ? (
          <CacheImage
            enableCache={true}
            source={{ uri: avatar }}
            placeholderContent={
              <ActivityIndicator
                size='small'
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              />
            }
            style={{ width: 56, height: 56, borderRadius: 12 }}
          />
        ) : (
          <AddressAvatar
            containerStyle={{ borderRadius: 12 }}
            size={56}
            address={address}
          />
        )}

        <ListItem.Content>
          <ListItem.Title
            style={[styles.title, selected ? { color: colors.white } : {}]}
          >
            {nick_name ? nick_name : '未设置'}
          </ListItem.Title>
          <View>
            <Text
              style={[styles.subTitle, selected ? { color: colors.white } : {}]}
            >
              ADR: {maskAddress(address!)}
            </Text>
          </View>
        </ListItem.Content>
        {!selected && <ListItem.Chevron />}
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 8,
  },
  item: {
    borderRadius: 16,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  subTitle: {
    marginTop: 0,
    fontSize: 12,
  },
});

export default MeCard;
