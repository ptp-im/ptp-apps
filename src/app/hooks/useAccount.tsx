import { authSelectors } from '../redux/modules/Auth';
import { GlobalState, useTypedSelector } from '../redux/store';

export default function useAccount() {
  const msgClientState = useTypedSelector(
    (state: GlobalState) => state.app.msgClientState
  );
  const currentMsgConnClientId = useTypedSelector(
    (state: GlobalState) => state.auth.currentMsgConnClientId
  );
  const currentUserInfo = useTypedSelector(
    (state: GlobalState) => state.auth.currentUserInfo!
  );

  const nicknameOrNoteShowOption = useTypedSelector(
    (state: GlobalState) => state.auth.nicknameOrNoteShowOption!
  );

  const accounts = useTypedSelector((state: GlobalState) =>
    authSelectors.selectEntities(state.auth)
  );
  const currentAccountIndex = useTypedSelector(
    (state: GlobalState) => state.auth.currentAccountIndex!
  );
  const accountIds = useTypedSelector((state: GlobalState) =>
    authSelectors.selectIds(state.auth)
  );
  const accountId = Number(accountIds[currentAccountIndex]);
  return {
    msgClientState,
    currentMsgConnClientId,
    nicknameOrNoteShowOption,
    currentUserInfo,
    accountIds,
    accounts,
    accountId,
    currentAccountIndex,
    account: accounts[accountId],
  };
}
