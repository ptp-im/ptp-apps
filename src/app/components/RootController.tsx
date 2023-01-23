import * as React from 'react';

// import DevView from './Components/DevView/DevView';
import { useTypedDispatch, useTypedSelector } from '../redux/store';
import Loading from '../screens/Loading';
import DialogLoading from './Dialog/DialogLoading';
import DialogConfirm from './Dialog/DialogConfirm';
import config from '../config';
import {
  hideConfirm,
  hideLoading,
  showLoading as showLoadingAction,
  showConfirm as showConfirmAction,
} from '../redux/modules/App';

let showLoading_ = '';
const RootController: React.FC = ({ children }) => {
  const currentAccountIndexLoaded = useTypedSelector(
    (state: any) => state.auth.currentAccountIndexLoaded
  );
  const dispatch = useTypedDispatch();
  const showLoading = useTypedSelector((state: any) => state.app.showLoading);
  const showConfirm = useTypedSelector((state: any) => state.app.showConfirm);
  const { siteTitle } = config;
  return (
    <React.Fragment>
      {currentAccountIndexLoaded ? <>{children}</> : <Loading />}
      {/*<DevView />*/}
      <DialogConfirm
        title={showConfirm?.title ? showConfirm.title : siteTitle}
        content={showConfirm?.content}
        visible={!!showConfirm}
        onConfirm={() => {
          if (showConfirm?.onConfirm) {
            showConfirm.onConfirm();
          }
          dispatch(hideConfirm());
        }}
        onClose={() => {
          if (showConfirm?.onClose) {
            showConfirm.onClose();
          }
          dispatch(hideConfirm());
        }}
      />
      <DialogLoading
        visible={currentAccountIndexLoaded && !!showLoading}
        title={showLoading}
        onDismiss={() => {
          showLoading_ = showLoading;
          dispatch(
            showConfirmAction({
              content: '停止运行的任务？',
              onClose: () => {
                dispatch(showLoadingAction(showLoading_));
              },
            })
          );
          dispatch(hideLoading());
        }}
      />
    </React.Fragment>
  );
};
export default RootController;
