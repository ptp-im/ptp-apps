import { combineReducers, configureStore } from '@reduxjs/toolkit';

import Auth from '../Auth';

describe('Auth test', () => {
  it('Auth', async () => {
    const store = configureStore({
      reducer: combineReducers({
        auth: Auth,
      }),
    });

    expect(store.getState().auth.currentAccountIndex).toEqual(0);
  });
});
