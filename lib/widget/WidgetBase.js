import React from 'react';

import {Image, StyleSheet, Text, View} from 'react-native';

import PropTypes from 'prop-types';
import {RFTouch} from './WidgetTouchable';
import {imgUrl, isEmpty, isFunc} from '../utils/RFUtils';
import RFlattenStyle, {RFResetStyle, RFSize, RFSplitStyle} from '../utils/StyleUtils';

const mainAxis = new Set(['left', 'top']);// main axis orientation
const horizontalDirection = new Set(['left', 'right']);// horizontal direction

export function RFImage({icon, iconSize, onPress, onLongPress, raw, style, ...props}) {
    let allStyle = raw ? style : RFResetStyle(style);// reset style
    let {borderRadius, borderWidth, borderColor, ...otherStyles} = allStyle;
    let newSize = raw ? iconSize : RFSize(iconSize);
    let imgStyle = {width: (newSize || allStyle.width), height: (newSize || allStyle.height), borderColor, borderRadius, borderWidth};
    if (isFunc(onPress) || isFunc(onLongPress)) {
        return <RFTouch onPress={onPress} style={[{justifyContent: 'center', alignItems: 'center'}, otherStyles]} onLongPress={onLongPress}>
            <Image source={imgUrl(icon)} style={imgStyle} resizeMode={borderRadius > 0 ? 'cover' : 'contain'} {...props} />
        </RFTouch>;
    } else {
        return <Image source={imgUrl(icon)} style={[otherStyles, imgStyle]} resizeMode='contain' {...props} />;
    }
}

RFImage.propTypes = {icon: PropTypes.string, iconSize: PropTypes.number, onPress: PropTypes.func, raw: PropTypes.bool};

export function RFText(props) {
    let {text, icon, iconSize, iconMargin = 2, iconPosition = 'top', onPress, onLongPress, style = {}, textExtend = false, raw = false, ...others} = props;
    let {external, internal, externalPure} = RFSplitStyle(style);// Style reset and split
    if (!isEmpty(text) && typeof text !== 'string') {
        text = String(text);
    }
    others.allowFontScaling = false;// Keep the app font from changing with the system
    if (isEmpty(icon)) {// If the Icon has no value, it is considered a plain text display
        if (isFunc(onPress) || isFunc(onLongPress)) {
            return <RFTouch style={raw ? externalPure : external} onPress={onPress} onLongPress={onLongPress}>
                <Text style={internal}{...others}>{text}</Text>
            </RFTouch>;
        } else {// Returns a plain text component
            if (style.borderRadius > 0) {// Text for IOS does not support rounded corners
                return <View style={raw ? externalPure : external}><Text style={internal}{...others}>{text}</Text></View>;
            }
            if (raw) {// Returns the original text component
                return <Text onPress={onPress} onLongPress={onLongPress} style={style}{...others}>{text}</Text>;
            } else {// An adapted component
                return <Text onPress={onPress} onLongPress={onLongPress} style={RFlattenStyle([external, internal])}{...others}>{text}</Text>;
            }
        }
    } else {
        let prePos = mainAxis.has(iconPosition);// Icon front (main axis front)
        let horizontal = horizontalDirection.has(iconPosition);//图标、文本排列为水平方向
        external = {alignItems: 'center', flexDirection: horizontal ? 'row' : 'column', ...external};// The image and text are set to center on the subaxis

        let imageView = !isEmpty(icon) && <RFImage key={1} style={{width: iconSize, height: iconSize}} icon={icon}/>;
        let filler = !isEmpty(icon) && <Text key={2} style={{width: RFSize(iconMargin), height: RFSize(iconMargin)}}/>;
        let textView = <Text key={3} style={[internal, {flex: textExtend ? 1 : 0}]} {...others}>{text}</Text>;

        let widgets = prePos ? [imageView, filler, textView] : [textView, filler, imageView];

        if (isFunc(onPress)) {
            return <RFTouch style={raw ? externalPure : external} onPress={onPress} onLongPress={onLongPress}>{widgets}</RFTouch>;
        } else {
            return <View style={raw ? externalPure : external}>{widgets}</View>;
        }
    }
}

RFText.propTypes = {
    raw: PropTypes.bool,
    text: PropTypes.string,
    textExtend: PropTypes.bool,
    icon: PropTypes.string,
    onPress: PropTypes.func,
    iconSize: PropTypes.number,
    iconMargin: PropTypes.number,
    iconPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

export function RFView({onPress, style, ...props}) {
    let styles = RFResetStyle(style);
    return isFunc(onPress) ? <RFTouch onPress={onPress} style={styles} {...props} /> : <View style={styles} {...props} />;
}

RFView.propTypes = {onPress: PropTypes.func};
