import {
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
} from '@reduxjs/toolkit';

import { isWeb } from '../../../utils';
import DbStorage from '../../helpers/DbStorage';
import type { DevicesInfo_Type } from '../../protobuf/PTPCommon';
import type { SwitchDevicesNotify_Type } from '../../protobuf/PTPSwitch/types';
import { DevicesInfo } from '../../protobuf/PTPCommon';
import { diff } from 'deep-object-diff';

const entityAdapter = createEntityAdapter<DevicesInfo_Type>({
  selectId: (entity) => entity.client_id,
  sortComparer: (a: DevicesInfo_Type, b: DevicesInfo_Type) => {
    return b.login_time - a.login_time;
  },
});

interface DeviceState {
  onlineDevices: EntityId[];
  ids: EntityId[];
  entities: Dictionary<DevicesInfo_Type>;
}

const initialState: DeviceState = {
  onlineDevices: [],
  ...entityAdapter.getInitialState(),
};

const DeviceSlice = createSlice({
  name: 'Device',
  initialState,
  reducers: {
    SwitchDevicesNotify: (
      state: DeviceState,
      { payload }: { payload: SwitchDevicesNotify_Type }
    ) => {
      // console.log(payload);
      const onlineDevices: EntityId[] = [];
      const updatedDevices: DevicesInfo_Type[] = [];
      payload.devices?.forEach((device: DevicesInfo_Type) => {
        if (
          !state.entities[device.client_id] ||
          diff(state.entities[device.client_id]!, device)
        ) {
          updatedDevices.push(device);
        }
        onlineDevices.push(device.client_id);
      });
      state.onlineDevices = onlineDevices;

      if (payload.devices && payload.devices.length > 0) {
        entityAdapter.upsertMany(state, payload.devices);
      }

      updatedDevices.forEach((device: DevicesInfo_Type) => {
        const deviceHex = new DevicesInfo(device).toHex();
        DbStorage.setItem('Device:' + String(device.client_id), deviceHex);
      });

      if (isWeb) {
        let client_ids: any = window.localStorage.getItem('client_ids');
        if (client_ids) {
          client_ids = client_ids.split('|');
        } else {
          client_ids = [];
        }
        state.ids.forEach((client_id) => {
          if (!client_ids.includes(client_id)) {
            client_ids.push(client_id);
          }
        });
        window.localStorage.setItem('client_ids', client_ids.join('|'));
      } else {
        DbStorage.setItem('client_ids', state.ids.join('|'));
      }
    },
    mergeState: (state: DeviceState, { payload }) => {
      Object.assign(state, payload);
    },
  },
});

export const actions = DeviceSlice.actions;
export const deviceSelectors = entityAdapter.getSelectors();

export default DeviceSlice.reducer;
