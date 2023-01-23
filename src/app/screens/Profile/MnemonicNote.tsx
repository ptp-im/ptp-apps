import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Appbar, List, TextInput, useTheme } from '../../../';
import ScreenLarge from '../../components/ScreenLarge';
import useAccount from '../../hooks/useAccount';
import { authActions } from '../../redux/modules/Auth';
import { useTypedDispatch } from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { goBack } from '../../Screens';

const MnemonicNote: React.FC<MasterScreen> = ({ navigation }) => {
  const { account } = useAccount();
  console.log(account);
  const dispatch = useTypedDispatch();
  const theme = useTheme();
  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.white }}>
        <Appbar.BackAction
          onPress={() => {
            goBack(navigation);
          }}
        />
        <Appbar.Content title={'备注'} />
      </Appbar.Header>
      <ScreenLarge>
        <View style={styles.container}>
          <List.Section title=''>
            <TextInput
              style={styles.inputContainerStyle}
              label='输入备注'
              multiline
              numberOfLines={5}
              placeholder='备注只会存储于本地，不会同步服务器'
              value={account!.note || ''}
              onChangeText={(value: string) => {
                dispatch(
                  authActions.upsertAccount({
                    account: {
                      ...account,
                      note: value,
                      accountId: account?.accountId!,
                      address: account?.address!,
                    },
                  })
                );
              }}
            />
          </List.Section>
        </View>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
  },
  inputContainerStyle: {
    fontSize: 24,
    backgroundColor: 'white',
  },
});

export default MnemonicNote;
