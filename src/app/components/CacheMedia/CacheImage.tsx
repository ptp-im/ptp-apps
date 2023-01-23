import * as React from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  View,
} from 'react-native';

import * as FileSystem from 'expo-file-system';

import { isWeb } from '../../../utils';
import config from '../../config';
import CacheMediaManager, { MEDIA_PREFIX, mediaDb } from './CacheMediaManager';

export const IMAGE_CACHE_FOLDER = `${FileSystem.cacheDirectory}`;

interface Props {
  source: ImageURISource;
  style: StyleProp<ImageStyle> | undefined;
  resizeMode?: string;
  enableCache?: boolean;
  placeholderContent?: React.ReactNode;
}
const cachedImages: Record<string, string> = {};
const cachedImagesLoading: Record<string, boolean> = {};
const CacheImage = (props: Props) => {
  const { source, resizeMode, enableCache, style, placeholderContent } = props;
  const { uri } = source;
  const docId = CacheMediaManager.formatCacheKey(uri!);
  let localFileURI = `${IMAGE_CACHE_FOLDER}${docId}`;
  const [imgUri1, setImgUri1] = React.useState<string | undefined>(uri);

  const [imgUri, setImgUri] = React.useState<string | undefined>(
    cachedImages[docId] || undefined
  );
  const [loading, setLoading] = React.useState<boolean>(
    !!enableCache && !imgUri
  );
  const waitImageLoaded = (docId: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        if (cachedImages[docId]) {
          resolve(cachedImages[docId]);
        } else {
          // eslint-disable-next-line promise/catch-or-return
          waitImageLoaded(docId).then(resolve);
        }
      }, 100);
    });
  };
  const loadImage = async (path: string) => {
    try {
      if (isWeb) {
        try {
          const docId = CacheMediaManager.formatCacheKey(path);
          let url: string;
          if (!cachedImagesLoading[docId]) {
            cachedImagesLoading[docId] = true;
            if (!cachedImages[docId]) {
              try {
                const blob = await mediaDb.getAttachment(docId, 'media');
                // console.debug('loadImage', docId, cachedImages);
                url = URL.createObjectURL(blob as Blob);
                cachedImages[docId] = url;
                delete cachedImagesLoading[docId];
                return url;
              } catch (e) {
                // console.debug('loadImage not found cache', docId);
                const res = await fetch(
                  config.im.msfsServer + '/' + docId.replace(/-/g, '/')
                );
                const ab = await res.arrayBuffer();
                const buf = Buffer.from(ab);
                const media_type = 'image' + docId.split('.')[1];
                await CacheMediaManager.saveMediaToCacheInWeb({
                  path: docId,
                  value: buf,
                  media_type,
                });
                const blob = new Blob([buf], { type: media_type });
                url = URL.createObjectURL(blob as Blob);
                cachedImages[docId] = url;
                delete cachedImagesLoading[docId];
                return url;
              }
            } else {
              url = cachedImages[docId];
              delete cachedImagesLoading[docId];
              return url;
            }
          } else {
            // console.debug('loadImage isLoading...', docId);
            url = await waitImageLoaded(docId);
            delete cachedImagesLoading[docId];
            return url;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const docId = CacheMediaManager.formatCacheKey(path);
          let url: string;
          // console.debug(cachedImagesLoading);
          if (!cachedImagesLoading[docId]) {
            cachedImagesLoading[docId] = true;
            if (!cachedImages[docId]) {
              // console.debug('loadImg cachedImages not exists');
              const metadata = await FileSystem.getInfoAsync(localFileURI);
              // console.debug('loadImg', { metadata }, localFileURI);
              if (!metadata.exists) {
                // console.debug('loadImg start down');
                const response = await FileSystem.downloadAsync(
                  `${config.im.msfsServer}/${uri!.replace(MEDIA_PREFIX, '')}`,
                  localFileURI
                );
                if (response!.status === 200) {
                  const url = await CacheMediaManager.getCachedUriInMobile({
                    path: docId,
                  });
                  cachedImages[docId] = url;
                  delete cachedImagesLoading[docId];
                  return url;
                }
              } else {
                // console.debug('loadImg load from local');
                const url = await CacheMediaManager.getCachedUriInMobile({
                  path: docId,
                });
                cachedImages[docId] = url;
                delete cachedImagesLoading[docId];
                return url;
              }
            } else {
              // console.debug('loadImg cachedImages exists');
              url = cachedImages[docId];
              delete cachedImagesLoading[docId];
              return url;
            }
          } else {
            // console.debug('loadImage isLoading...', docId);
            url = await waitImageLoaded(docId);
            delete cachedImagesLoading[docId];
            return url;
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err) {
      console.debug({ err });
    }
  };
  React.useEffect(() => {
    if (enableCache && loading)
      loadImage(uri!)
        .then((url: string) => {
          setImgUri(url);
          setLoading(false);
          return url;
        })
        .catch(() => {});
  }, [enableCache, loadImage, loading, uri]);

  React.useEffect(() => {
    if (!loading && imgUri1 !== uri) {
      setLoading(true);
      // eslint-disable-next-line promise/catch-or-return
      loadImage(uri!)
        .then((url: string) => {
          setImgUri(url);
          setLoading(false);
          return url;
        })
        .catch(() => {})
        .finally(() => {
          setImgUri1(uri);
        });
    }
  }, [loading, imgUri1, uri, loadImage]);

  if (loading) {
    return <View style={style}>{placeholderContent || ''}</View>;
  } else {
    const props_ = {
      style,
      resizeMode,
      source: {
        ...source,
        uri: imgUri,
      },
    };
    // @ts-ignore
    // eslint-disable-next-line react-native-a11y/has-valid-accessibility-ignores-invert-colors
    return <Image {...props_} />;
  }
};

export default CacheImage;
