import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { diff } from 'deep-object-diff';
import {
  Appbar,
  Button,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import ScreenLarge from '../../components/ScreenLarge';
import MsgConn, { handleError } from '../../helpers/MsgConn';
import { showToast } from '../../helpers/ui';
import { BuddyModifyReq, BuddyModifyRes } from '../../protobuf/PTPBuddy';
import type { UserInfo_Type } from '../../protobuf/PTPCommon';
import {
  GlobalState,
  useTypedDispatch,
  useTypedSelector,
} from '../../redux/store';
import type { MasterScreen } from '../../Screens';
import { goBack } from '../../Screens';
import AccountController from '../../helpers/AccountController';
import useAccount from '../../hooks/useAccount';

const FieldModify: React.FC<MasterScreen> = ({ navigation, route }) => {
  //@ts-ignore
  const { title, label, multi, lines, helper } = route.params;
  //@ts-ignore
  const { buddy_modify_action, timestamp, placeholder, initValue } =
    route.params;
  const theme = useTheme();
  const [title1, setTitle1] = useState(title);

  const [value, setValue] = useState(initValue || '');
  const [timestamp1, setTimestamp1] = useState(timestamp);
  // console.log(label, buddy_modify_action, initValue, value);
  const { currentUserInfo, accountId } = useAccount();
  const [disabled, setDisabled] = useState(true);

  const [userInfo, setUserInfo] = React.useState<UserInfo_Type | null>(
    AccountController.getCurrentAccount()?.getUserInfo()!
  );
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (userInfo && diff(userInfo, currentUserInfo!)) {
      setUserInfo(currentUserInfo);
    }
  }, [currentUserInfo, dispatch, userInfo]);

  useEffect(() => {
    if (title1 !== title) {
      setTitle1(title);
      setDisabled(true);
      setValue(initValue);
    }
  }, [title1, title, initValue]);

  useEffect(() => {
    if (timestamp1 !== timestamp) {
      setTimestamp1(timestamp);
      setValue(initValue);
    }
  }, [initValue, timestamp1, timestamp]);
  useEffect(() => {
    if (value.length > 0 && initValue !== value && title1 === title) {
      setDisabled(false);
    }
  }, [initValue, title, title1, value]);

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.white }}>
        <Appbar.BackAction
          onPress={() => {
            goBack(navigation);
          }}
        />
        <Appbar.Content title={title} />
        <Button
          disabled={disabled}
          onPress={async () => {
            if (value !== initValue && value.length > 0) {
              setDisabled(true);
              const res = await MsgConn.getMsgClient()?.SendPduWithCallback(
                new BuddyModifyReq({
                  value,
                  buddy_modify_action,
                }).pack()
              );
              if (res) {
                try {
                  const msg = BuddyModifyRes.handlePdu(res!, Number(accountId));
                  if (msg.error) {
                    const error = handleError(msg.error);
                    if (error) {
                      showToast(error);
                    }
                  } else {
                    showToast('保存成功');
                    msg.dispatch.forEach((msg) => dispatch(msg));
                  }
                } catch (e) {
                  console.error(e);
                  showToast('保存失败');
                }
                setDisabled(false);
              }
            } else {
              setDisabled(true);
            }
          }}
        >
          保存
        </Button>
      </Appbar.Header>
      <ScreenLarge>
        <View style={styles.main}>
          <List.Section>
            <TextInput
              multiline={!!multi}
              numberOfLines={lines || 1}
              style={[{ backgroundColor: theme.colors.white }]}
              placeholder={placeholder}
              label={label}
              value={value}
              onChangeText={(value: string) => {
                setValue(value.trim());
              }}
            />
            <Text style={styles.helper}>{helper}</Text>
          </List.Section>
        </View>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  helper: {
    marginTop: 16,
    marginHorizontal: 8,
    fontSize: 12,
  },
  main: {
    marginHorizontal: 8,
    marginTop: 24,
  },
});

export default FieldModify;
