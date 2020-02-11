import {Const} from '../const/Const';
import {Props} from '../const/RFProps';
import {isEmpty, selfOr} from './RFUtils';
import {PixelRatio, StyleSheet} from 'react-native';

const baseWidth = 375;//参考宽度
const baseHeight = 667;//参考高度

export default function RFlattenStyle(style) {
    const flatStyle = Object.assign({}, StyleSheet.flatten(style));
    if (flatStyle.transform) {
        flatStyle.transform.forEach((transform) => {
            const key = Object.keys(transform)[0];
            flatStyle[key] = transform[key];
        });
        delete flatStyle.transform;
    }
    return flatStyle;
}

export function RFResetStyle(style) {//重设属性(忽略外层尺寸)
    let styles = {...RFlattenStyle(selfOr(style, {}))};
    Object.keys(styles).forEach((keyStr) => {
        if (Props.sizeProps.has(keyStr)) {// 需要修改尺寸的属性
            if (keyStr === 'fontSize') {//字体属性
                styles[keyStr] = RTSize(styles[keyStr]);
            } else {
                let value = styles[keyStr];//样式属性值,若为整型数据且不为onePixel则重置数值
                if (typeof value === 'number' && value !== Const.onePixel) {
                    styles[keyStr] = RFSize(value);
                }
            }
        }
    });
    return styles;
}

export function RFSplitStyle(style) {//样式分割
    let external = {}, internal = {}, externalPure = {}, styles = {...RFlattenStyle(selfOr(style, {}))};
    let rawStyle = {...styles};// 保留副本用于返回原始外部样式（由于样式只有一层数据，故如此浅拷贝即可）
    Object.keys(styles).forEach((keyStr) => {
        if (Props.sizeProps.has(keyStr)) {// 需要修改尺寸的属性
            if (keyStr === 'fontSize') {//字体属性
                styles[keyStr] = RTSize(styles[keyStr]);
            } else {
                let value = styles[keyStr];//样式属性值,若为整型数据且不为onePixel则不重置数值
                if (typeof value === 'number' && value !== Const.onePixel) {
                    styles[keyStr] = RFSize(value);
                }
            }
        }
        if (Props.textProps.has(keyStr)) {//若为样式为文本型样式，则存入内部样式集合
            internal[keyStr] = styles[keyStr];
        } else {//外部样式集合
            external[keyStr] = styles[keyStr];
            externalPure[keyStr] = rawStyle[keyStr];
        }
    });
    //外部样式（适配后），内部样式（适配后），外部样式(适配前),原始样式all
    return [external, internal, externalPure, rawStyle];
}

export function RFSize(size): number {//普通尺寸
    if (isEmpty(size)) {
        return size;
    }
    return Math.ceil(size * Const.screenWidth / baseWidth);
}

export function RTSize(size): number {//文本尺寸
    if (isEmpty(size)) {
        return size;
    }
    const scale = Math.min(Const.screenWidth / baseWidth, Const.screenHeight / baseHeight);
    return Math.ceil(size * scale);
}
