import React from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import FlattenStyle, {
    XSize,
    ResetStyle,
    SplitStyle,
    SplitTextProps,
} from '../utils/StyleUtils';

import PropTypes from 'prop-types';
import {imgUrl, isEmpty, isFunc, selfOr} from '../utils/XUtils';

const mainAxis = new Set(['left', 'top']);// main axis orientation
const horizontalDirection = new Set(['left', 'right']);// horizontal direction

export function XView({onPress, onLongPress, raw, style, ...props}) {
    const styles = raw ? style : ResetStyle(style), uniqueId = new Date().valueOf();
    if (isFunc(onPress) || isFunc(onLongPress)) {
        return <TouchableOpacity style={styles}
                                 onLongPress={onLongPress}
                                 onPress={() => antiFastClick(onPress, uniqueId)}
                                 {...props} />;
    } else {
        return <View style={styles} {...props} />;
    }
}

XView.propTypes = {
    raw: PropTypes.bool,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
};

export function XImage({icon, iconSize, onPress, onLongPress, raw, style, ...props}) {
    const allStyle = raw ? style : ResetStyle(style);// reset style
    const {borderRadius, borderWidth, borderColor, ...otherStyles} = selfOr(allStyle, {});
    const newSize = raw ? iconSize : XSize(iconSize);
    const imgStyle = {width: (newSize || allStyle.width), height: (newSize || allStyle.height), borderColor, borderRadius, borderWidth};
    if (isFunc(onPress) || isFunc(onLongPress)) {
        const {resizeMode, ...others} = props;
        const newMode = resizeMode ? resizeMode : (borderRadius > 0 ? 'cover' : 'contain');
        return <XView onPress={onPress} style={[{justifyContent: 'center', alignItems: 'center'}, otherStyles]} onLongPress={onLongPress} {...others}>
            <Image source={imgUrl(icon)} style={imgStyle} resizeMode={newMode}/>
        </XView>;
    } else {
        return <Image source={imgUrl(icon)} style={[otherStyles, imgStyle]} resizeMode='contain' {...props} />;
    }
}

XImage.propTypes = {
    raw: PropTypes.bool,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
};

export function XText(props) {
    let {text, icon, iconSize, iconMargin = 2, iconPosition = 'top', onPress, onLongPress, textExtend = false, raw, style = {}, ...others} = props;
    let {external, internal, externalPure} = SplitStyle(style);// Style reset and split
    if (!isEmpty(text) && typeof text !== 'string') {
        text = String(text);
    }
    const {viewProps, textProps} = SplitTextProps(others);
    if (textProps && !textProps.hasOwnProperty('allowFontScaling')) {
        textProps.allowFontScaling = false;// Keep the app font from not changing with the system
    }
    if (isEmpty(icon)) {// If the Icon has no value, it is considered a plain text display
        if (isFunc(onPress) || isFunc(onLongPress)) {
            return <XView style={raw ? externalPure : external} onPress={onPress} onLongPress={onLongPress} {...viewProps}>
                <Text style={internal}{...textProps}>{text}</Text>
            </XView>;
        } else {// Returns a plain text component
            if (style.borderRadius > 0) {// Text for IOS does not support rounded corners
                return <View style={raw ? externalPure : external} {...viewProps}><Text style={internal}{...textProps}>{text}</Text></View>;
            }
            if (raw) {// Returns the original text component
                return <Text onPress={onPress} onLongPress={onLongPress} style={style}{...others}>{text}</Text>;
            } else {// An adapted component
                return <Text onPress={onPress} onLongPress={onLongPress} style={FlattenStyle([external, internal])}{...others}>{text}</Text>;
            }
        }
    } else {
        const prePos = mainAxis.has(iconPosition);// Icon front (main axis front)
        const horizontal = horizontalDirection.has(iconPosition);//图标、文本排列为水平方向
        external = {alignItems: 'center', flexDirection: horizontal ? 'row' : 'column', ...external};// The image and text are set to center on the subaxis

        const imageView = !isEmpty(icon) && <XImage key={1} style={{width: iconSize, height: iconSize}} icon={icon}/>;
        const filler = !isEmpty(icon) && <Text key={2} style={{width: XSize(iconMargin), height: XSize(iconMargin)}}/>;
        const textView = <Text key={3} style={[internal, {flex: textExtend ? 1 : 0}]} {...textProps}>{text}</Text>;

        const widgets = prePos ? [imageView, filler, textView] : [textView, filler, imageView];

        if (isFunc(onPress)) {
            return <XView style={raw ? externalPure : external} onPress={onPress} onLongPress={onLongPress} {...viewProps}>{widgets}</XView>;
        } else {
            return <View style={raw ? externalPure : external} {...others}>{widgets}</View>;
        }
    }
}

XText.propTypes = {
    raw: PropTypes.bool,
    text: PropTypes.string,
    textExtend: PropTypes.bool,
    icon: PropTypes.string,
    onPress: PropTypes.func,
    iconSize: PropTypes.number,
    iconMargin: PropTypes.number,
    iconPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};


let lastClickTime, lastUniqueId;// anti Fast Click

function antiFastClick(func, uniqueId) {
    if (lastUniqueId !== uniqueId) {//If it is a different component, it fires the event directly
        isFunc(func) && func();
    } else {// Respond to an event if it is the same component and the time between clicks is greater than 500 milliseconds
        if (new Date().valueOf() - lastClickTime > 500) {
            isFunc(func) && func();
        }
    }
    lastClickTime = new Date().valueOf();// Record the time of the last click
    lastUniqueId = uniqueId;// record the current control identity
}
