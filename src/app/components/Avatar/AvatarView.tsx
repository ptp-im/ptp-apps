import * as React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import { default as AddressAvatar } from 'react-native-jazzicon';

import CacheImage from '../CacheMedia/CacheImage';
import { GlobalState, useTypedSelector } from '../../redux/store';

interface AvatarViewProps {
  size: number;
  avatar: string;
  avatarAddress: string;
}

const AvatarView: React.FC<AvatarViewProps> = ({
  size,
  avatar,
  avatarAddress,
}) => {
  if (avatar) {
    return (
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
        style={[styles.border, { width: size, height: size }]}
      />
    );
  } else {
    return (
      <AddressAvatar
        containerStyle={[styles.border]}
        size={size}
        address={avatarAddress}
      />
    );
  }
};

const styles = StyleSheet.create({
  border: {
    borderRadius: 8,
  },
});

export default AvatarView;
