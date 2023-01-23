import * as React from 'react';

import { Divider } from '@rneui/themed';

import SessionsView from '../components/Group/SessionsView';
import Header from '../components/Header/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import MsgConn, { MsgClientState } from '../helpers/MsgConn';
import useAccount from '../hooks/useAccount';
import { BuddyGetALLReq } from '../protobuf/PTPBuddy';
import type { MasterScreen } from '../Screens';
import AccountController from '../helpers/AccountController';
import { useTypedDispatch } from '../redux/store';
import { useState } from 'react';

const Sessions: React.FC<MasterScreen> = ({ navigation, route }) => {
  const dispatch = useTypedDispatch();
  const [loading, setLoading] = useState(false);
  const [groupsInited, setGroupsInited] = useState(false);
  React.useEffect(() => {
    if (Object.keys(navigation).includes('setOptions')) {
      navigation.setOptions({
        title: 'Sessions',
      });
    }
  }, [navigation]);
  const { currentUserInfo, accountId, msgClientState } = useAccount();
  React.useEffect(() => {
    let isMounted = true;
    if (!loading && !groupsInited) {
      const account = AccountController.getInstance(accountId);
      setLoading(true);
      account
        .initGroups()
        .then((initGroupsNotify: any[]) => {
          if (initGroupsNotify.length > 0) {
            initGroupsNotify.forEach((item: any) => {
              dispatch(item);
            });
          }
          if (isMounted) {
            setGroupsInited(true);
            setLoading(false);
          }
          return initGroupsNotify;
        })
        .catch(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [loading, accountId, dispatch, groupsInited]);

  React.useEffect(() => {
    const initGroups = async () => {
      await MsgConn.getMsgClient()?.initGroups();
    };
    if (
      groupsInited &&
      msgClientState === MsgClientState.logged &&
      !BuddyGetALLReq.running
    ) {
      initGroups();
    }
  }, [groupsInited, loading, currentUserInfo, msgClientState]);
  return (
    <ScreenWrapper isBgWhite={true} withScrollView={false}>
      <Header title={'Sessions'} />
      <Divider />
      <SessionsView navigation={navigation} route={route} />
    </ScreenWrapper>
  );
};

export default Sessions;
