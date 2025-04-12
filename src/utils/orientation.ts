import {Platform} from 'react-native';
import Orientation from 'react-native-orientation-locker';

export const lockToLandscape = () => {
  if (Platform.OS === 'ios') {
    Orientation.lockToLandscapeRight();
  } else {
    Orientation.lockToLandscape();
  }
};

export const setupAppOrientation = () => {
  // 强制横屏
  lockToLandscape();
};