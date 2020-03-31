import {Props} from './RFProps';
import {isEmpty, selfOr} from './RFUtils';
import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
import RFWidget from "../widget/RFWidget";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const onePixel = 1 / PixelRatio.get();

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
                if (typeof value === 'number' && value !== onePixel) {
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
                if (typeof value === 'number' && value !== onePixel) {
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

export function RFSize(size) {
    if (isEmpty(size)) {
        return size;
    }
    if (validReferSize()) {
        return Math.ceil(size * screenWidth / RFWidget.targetWidth);
    } else {
        return size;
    }
}

export function RTSize(size) {
    if (isEmpty(size)) {
        return size;
    }
    if (validReferSize()) {
        const scale = Math.min(screenWidth / RFWidget.targetWidth, screenHeight / RFWidget.targetHeight);
        return Math.ceil(size * scale);
    } else {
        return size;
    }
}

export function validReferSize() {
    let {targetHeight, targetWidth, pixelRatio} = RFWidget;
    return targetHeight > 0 && targetWidth > 0 && pixelRatio > 0
}
