import {Props} from './XProps';
import {isEmpty, selfOr} from './XUtils';
import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
import XWidget from "../widget/XWidget";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const onePixel = 1 / PixelRatio.get();

export default function FlattenStyle(style) {
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

export function ResetStyle(style) {// Reset properties
    if (!validReferSize()) return style;
    let styles = {...FlattenStyle(selfOr(style, {}))};
    Object.keys(styles).forEach((keyStr) => {
        if (Props.sizeProps.has(keyStr)) {// The properties of the size need to be modified
            if (keyStr === 'fontSize') {
                styles[keyStr] = XTSize(styles[keyStr]);
            } else {
                let value = styles[keyStr];// Style attribute value that resets the value if it is an integer and not an onePixel
                if (typeof value === 'number' && value !== onePixel) {
                    styles[keyStr] = XSize(value);
                }
            }
        }
    });
    return styles;
}

export function SplitStyle(style) {// Style segmentation
    let external = {}, internal = {}, externalPure = {}, styles = {...FlattenStyle(selfOr(style, {}))};
    let rawStyle = {...styles};
    Object.keys(styles).forEach((keyStr) => {
        if (Props.sizeProps.has(keyStr)) {// The properties of the size need to be modified
            if (keyStr === 'fontSize') {
                styles[keyStr] = XTSize(styles[keyStr]);
            } else {
                let value = styles[keyStr];
                if (typeof value === 'number' && value !== onePixel) {
                    styles[keyStr] = XSize(value);
                }
            }
        }
        if (Props.textStyleProps.has(keyStr)) {// If the style is a text style, the inner style collection is stored
            internal[keyStr] = styles[keyStr];
        } else {// External style set
            external[keyStr] = styles[keyStr];
            externalPure[keyStr] = rawStyle[keyStr];
        }
    });
    // External style (after adaptation), internal style (after adaptation), external style (before adaptation), original style all
    return {external, internal, externalPure, rawStyle};
}

export function SplitTextProps(props) {// props segmentation
    let viewProps = {}, textProps = {};
    for (let key in props) {
        if (props.hasOwnProperty(key) && Props.textProps.has(key)) {
            textProps[key] = props[key];
        } else {
            viewProps[key] = props[key];
        }
    }
    return {viewProps, textProps};
}

export function XSize(size) {
    if (isEmpty(size)) {
        return size;
    }
    if (validReferSize()) {
        return Math.ceil(size * screenWidth / XWidget.targetWidth);
    } else {
        return size;
    }
}

export function XTSize(size) {
    if (isEmpty(size)) {
        return size;
    }
    if (validReferSize()) {
        const scale = Math.min(screenWidth / XWidget.targetWidth, screenHeight / XWidget.targetHeight);
        return Math.ceil(size * scale);
    } else {
        return size;
    }
}

export function validReferSize() {
    let {targetHeight, targetWidth, pixelRatio} = XWidget;
    return targetHeight > 0 && targetWidth > 0 && pixelRatio > 0
}
