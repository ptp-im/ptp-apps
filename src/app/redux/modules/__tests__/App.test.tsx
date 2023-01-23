import { combineReducers, configureStore } from '@reduxjs/toolkit';

import App from '../App';

describe('App test', () => {
  it('App', async () => {
    const store = configureStore({
      reducer: combineReducers({
        app: App,
      }),
    });

    expect(store.getState().app.currentTabIndex).toEqual(0);
  });
});
