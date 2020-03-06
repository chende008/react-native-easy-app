import React from 'react';

import {Image, StyleSheet, Text, View} from 'react-native';

import PropTypes from 'prop-types';
import {RFTouch} from './WidgetTouchable';
import {imgUrl, isEmpty, isFunc} from '../utils/RFUtils';
import RFlattenStyle, {RFResetStyle, RFSize, RFSplitStyle} from '../utils/StyleUtils';

const mainAxis = new Set(['left', 'top']);//主轴方向
const horizontalDirection = new Set(['left', 'right']);//水平方向

export function RFImage({icon, iconSize, onPress, onLongPress, raw, style, ...props}) {//通用Image
    let allStyle = raw ? style : RFResetStyle(style);//重设样式
    let {borderRadius, borderWidth, borderColor, ...otherStyles} = allStyle;
    let newSize = raw ? iconSize : RFSize(iconSize);
    let imgStyle = {width: (newSize || allStyle.width), height: (newSize || allStyle.height), borderColor, borderRadius, borderWidth};
    if (isFunc(onPress) || isFunc(onLongPress)) {//有点击事件
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
    let {external, internal, externalPure} = RFSplitStyle(style);//样式重置并拆分
    if (!isEmpty(text) && typeof text !== 'string') {//若传入的text不是String类型，则转String
        text = String(text);
    }
    others.allowFontScaling = false;//保持app字体不跟随系统变化
    if (isEmpty(icon)) {// 若Icon没有值，则认为是纯文本展示
        if (isFunc(onPress) || isFunc(onLongPress)) {//若有点击事件
            return <RFTouch style={raw ? externalPure : external} onPress={onPress} onLongPress={onLongPress}>
                <Text style={internal}{...others}>{text}</Text>
            </RFTouch>;
        } else {//返回纯文本组件
            if (style.borderRadius > 0) {//处理IOS的Text不支持圆角问题
                return <View style={raw ? externalPure : external}><Text style={internal}{...others}>{text}</Text></View>;
            }
            if (raw) {// 返回原始文本组件
                return <Text onPress={onPress} onLongPress={onLongPress} style={style}{...others}>{text}</Text>;
            } else {// 适配过的组件
                return <Text onPress={onPress} onLongPress={onLongPress} style={RFlattenStyle([external, internal])}{...others}>{text}</Text>;
            }
        }
    } else {
        let prePos = mainAxis.has(iconPosition);//图标前置(主轴方向前置)
        let horizontal = horizontalDirection.has(iconPosition);//图标、文本排列为水平方向
        external = {alignItems: 'center', flexDirection: horizontal ? 'row' : 'column', ...external};//图片与文本设置为次轴方向居中

        let imageView = !isEmpty(icon) && <RFImage key={1} style={{width: iconSize, height: iconSize}} icon={icon}/>;
        let filler = !isEmpty(icon) && <Text key={2} style={{width: RFSize(iconMargin), height: RFSize(iconMargin)}}/>;//填充用的View
        let textView = <Text key={3} style={[internal, {flex: textExtend ? 1 : 0}]} {...others}>{text}</Text>;

        let widgets = prePos ? [imageView, filler, textView] : [textView, filler, imageView];

        if (isFunc(onPress)) {//有点击事件
            return <RFTouch style={raw ? externalPure : external} onPress={onPress} onLongPress={onLongPress}>{widgets}</RFTouch>;
        } else {
            return <View style={raw ? externalPure : external}>{widgets}</View>;
        }
    }
}

RFText.propTypes = {//包含图标的Text属性描述
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
    let styles = RFResetStyle(style);//样式重置
    return isFunc(onPress) ? <RFTouch onPress={onPress} style={styles} {...props} /> : <View style={styles} {...props} />;
}

RFView.propTypes = {onPress: PropTypes.func};
