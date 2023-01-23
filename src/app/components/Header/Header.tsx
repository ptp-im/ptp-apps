import * as React from 'react';

import { Button, Icon } from '@rneui/themed';
import { Appbar } from '../../../';

import { jumpTo } from '../../Screens';

const Header = ({
  title,
  name,
  navigation,
}: {
  title: string;
  name?: string;
  navigation?: any;
}) => {
  return (
    <Appbar.Header style={{ backgroundColor: 'white' }}>
      <Appbar.Content title={title} />
      {name === 'Discover' && (
        <Button
          color={'white'}
          icon={
            <Icon
              backgroundColor={'white'}
              type={'material-community'}
              name={'qrcode-scan'}
            />
          }
          onPress={async () => {
            jumpTo(navigation, 'QrCodeScanner', {
              needReplace: true,
            });
          }}
        />
      )}
    </Appbar.Header>
  );
};

export default Header;
