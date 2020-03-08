import {Dimensions, PixelRatio} from 'react-native';

const {width, height, scale} = Dimensions.get('window');

export const Const = {
    screenWidth: width,
    screenHeight: height,
    screenScale: scale,
    onePixel: 1 / PixelRatio.get(),
};
