import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const useIsLargeScreen = () => {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    const onDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };
    const listener = Dimensions.addEventListener('change', onDimensionsChange);
    return () => listener.remove();
  }, []);

  return dimensions.width > 414;
};
