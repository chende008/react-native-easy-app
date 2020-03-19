import {Const} from '../const/Const';
import {Props} from '../const/RFProps';
import {isEmpty, selfOr} from './RFUtils';
import {StyleSheet} from 'react-native';
import RFWidget from "../widget/RFWidget";

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

export function RFResetStyle(style) {// Reset properties
    if (!validReferSize()) return style;
    let styles = {...RFlattenStyle(selfOr(style, {}))};
    Object.keys(styles).forEach((keyStr) => {
        if (Props.sizeProps.has(keyStr)) {// The properties of the size need to be modified
            if (keyStr === 'fontSize') {
                styles[keyStr] = RTSize(styles[keyStr]);
            } else {
                let value = styles[keyStr];// Style attribute value that resets the value if it is an integer and not an onePixel
                if (typeof value === 'number' && value !== Const.onePixel) {
                    styles[keyStr] = RFSize(value);
                }
            }
        }
    });
    return styles;
}

export function RFSplitStyle(style) {// Style segmentation
    let external = {}, internal = {}, externalPure = {}, styles = {...RFlattenStyle(selfOr(style, {}))};
    let rawStyle = {...styles};
    Object.keys(styles).forEach((keyStr) => {
        if (Props.sizeProps.has(keyStr)) {// The properties of the size need to be modified
            if (keyStr === 'fontSize') {
                styles[keyStr] = RTSize(styles[keyStr]);
            } else {
                let value = styles[keyStr];
                if (typeof value === 'number' && value !== Const.onePixel) {
                    styles[keyStr] = RFSize(value);
                }
            }
        }
        if (Props.textProps.has(keyStr)) {// If the style is a text style, the inner style collection is stored
            internal[keyStr] = styles[keyStr];
        } else {// External style set
            external[keyStr] = styles[keyStr];
            externalPure[keyStr] = rawStyle[keyStr];
        }
    });
    // External style (after adaptation), internal style (after adaptation), external style (before adaptation), original style all
    return {external, internal, externalPure, rawStyle};
}

export function RFSize(size): number {
    if (isEmpty(size)) {
        return size;
    }
    if (validReferSize()) {
        return Math.ceil(size * Const.screenWidth / RFWidget.default.targetWidth);
    } else {
        return size;
    }
}

export function RTSize(size): number {
    if (isEmpty(size)) {
        return size;
    }
    if (validReferSize()) {
        const scale = Math.min(Const.screenWidth / RFWidget.default.targetWidth, Const.screenHeight / RFWidget.default.targetHeight);
        return Math.ceil(size * scale);
    } else {
        return size;
    }
}

export function validReferSize() {
    return RFWidget.default.targetHeight > 0 && RFWidget.default.targetWidth > 0
}
