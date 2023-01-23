import * as FileSystem from 'expo-file-system';

import { isWeb } from '../../../utils';
import { IMAGE_CACHE_FOLDER } from './CacheImage';

export type MediaImageType =
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/gif'
  | 'image/png';

export const MEDIA_PREFIX = 'm://';

//@ts-ignore
export const mediaDb = isWeb ? new window.PouchDB('media_v1') : null;

export default class CacheMediaManager {
  static async saveMediaToCacheInMobile({
    path,
    value,
  }: {
    path: string;
    value: string;
  }) {
    const docId = CacheMediaManager.formatCacheKey(path);
    // console.log(docId);
    await FileSystem.writeAsStringAsync(`${IMAGE_CACHE_FOLDER}${docId}`, value);
  }
  static async saveMediaToCacheInWeb({
    path,
    value,
    media_type,
  }: {
    media_type: string;
    path: string;
    value: Buffer | string;
  }) {
    const docId = CacheMediaManager.formatCacheKey(path);
    const attachment = new Blob([value], { type: media_type });
    try {
      await mediaDb.getAttachment(docId, 'media');
    } catch (e) {
      await mediaDb.putAttachment(docId, 'media', attachment, media_type);
    }
  }
  static formatCacheKey(path: string) {
    if (path.indexOf(MEDIA_PREFIX) === 0) {
      path = path.substring(MEDIA_PREFIX.length);
    }
    return path.replace(/\//g, '-');
  }
  static async addToCacheInMobile({
    localFileUri,
    path,
  }: {
    localFileUri: string;
    path: string;
  }) {
    await FileSystem.copyAsync({
      from: localFileUri,
      to: `${IMAGE_CACHE_FOLDER}${path}`,
    });
    const uri = await CacheMediaManager.getCachedUriInMobile({ path: path });
    return uri;
  }
  static async getCachedUriInMobile({ path }: { path: string }) {
    const docId = CacheMediaManager.formatCacheKey(path);
    return await FileSystem.getContentUriAsync(`${IMAGE_CACHE_FOLDER}${docId}`);
  }
}
