import {Dimensions, PixelRatio} from 'react-native';

const {width, height, scale} = Dimensions.get('window');

export const Const = {
    screenWidth: width,//屏幕宽
    screenHeight: height,//屏幕宽
    screenScale: scale,//屏幕分辨率
    onePixel: 1 / PixelRatio.get(),//一个像素尺寸
};
