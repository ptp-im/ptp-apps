import AsyncStorage from '@react-native-async-storage/async-storage';

import { isWeb } from '../../utils';

let DbStorage: {
  getItem(key: string, ...args: Array<any>): any;
  setItem(key: string, value: any, ...args: Array<any>): any;
  removeItem(key: string, ...args: Array<any>): any;
};
let __db: any = null;

export class DbStorageLocal {
  static async getItem(key: string) {
    return window.localStorage.getItem(`async_db_${key}`);
  }

  static async setItem(key: string, value: string) {
    window.localStorage.setItem(`async_db_${key}`, String(value));
  }

  static async removeItem(key: string) {
    window.localStorage.removeItem(`async_db_${key}`);
  }
}

export class DbStoragePb {
  static async getItem(key: string) {
    try {
      const doc = await __db.get(`async_db_${key}`);
      return doc.value;
    } catch (e) {
      return null;
    }
  }

  static async setItem(key: string, value: string) {
    try {
      const doc = await __db.get(`async_db_${key}`);
      await __db.put({
        _id: doc._id,
        _rev: doc._rev,
        value,
      });
    } catch (e) {
      // @ts-ignore
      if (e.status == 404) {
        try {
          await __db.put({
            _id: `async_db_${key}`,
            value,
          });
        } catch (e) {
          console.error('setItem error', key, e);
        }
      }
    }
  }

  static async removeItem(key: string) {
    try {
      const doc = await __db.get(`async_db_${key}`);
      await __db.remove(doc);
    } catch (e) {
      console.error(e);
    }
  }
}

if (isWeb) {
  //@ts-ignore
  if (window.PouchDB) {
    //@ts-ignore
    __db = new window.PouchDB('AsyncStorage');
    DbStorage = DbStoragePb;
  } else {
    DbStorage = DbStorageLocal;
  }
}

if (!isWeb) {
  DbStorage = AsyncStorage;
}

// @ts-ignore
export default DbStorage;
