import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createSelectorHook, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';

import AppReducer from './modules/App';
import AuthReducer from './modules/Auth';
import DeviceReducer from './modules/Device';
import IMReducer from './modules/IM';

export const reducer = {
  app: AppReducer,
  im: IMReducer,
  auth: AuthReducer,
  Device: DeviceReducer,
};

const rootReducer = combineReducers({ ...reducer });

export type GlobalState = ReturnType<typeof rootReducer>;

// @ts-ignore
export const useTypedSelector = createSelectorHook<GlobalState>();
export const useTypedDispatch = useDispatch;

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

if (process.env.NODE_ENV !== 'production') {
  //@ts-ignore
  window.store = store;
}
