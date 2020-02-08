import React from 'react';

import {StyleSheet, View} from 'react-native';

import PropTypes from 'prop-types';
import {isEmpty} from '../utils/Utils';
import {Actions} from 'react-native-router-flux';
import {Colors, CommonStyles, Const, ImageRes} from '../storage/Const';
import {RFImage, RFText, RFView} from 'react-native-fast-app';

export function NavigationBar({onBack, clickRText, clickRImage, ...props}) {
    let {title, hideBack = false, rightImage, rightText, noLine = false} = props;
    let lineStyle = noLine ? {} : CommonStyles.bottomLine;
    return <RFView style={[styles.titleBarParent, lineStyle]}>
        {!isEmpty(title) && <RFText style={styles.titleText} numberOfLines={1} text={title}/>}
        {!hideBack && <RFImage style={styles.leftImage} icon={ImageRes.img_back} iconSize={22} onPress={() => onBack && onBack()}/>}
        {rightText && <RFText style={[styles.rightText]} text={rightText} onPress={() => clickRText && clickRText()}/>}
        {rightImage && <RFImage style={styles.rightImage} icon={rightImage} iconSize={22} onPress={() => clickRImage && clickRImage()}/>}
    </RFView>;
}

NavigationBar.propTypes = {// 标题栏属性
    onBack: PropTypes.func,
    title: PropTypes.string,
    hideBack: PropTypes.bool,
    rightText: PropTypes.string,
    clickRText: PropTypes.func,
};

NavigationBar.defaultProps = {onBack: () => Actions.pop()};// 标题栏属性默认值

const styles = StyleSheet.create({
    titleBarParent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Const.isIos ? 44 : 50,
        backgroundColor: Colors.white,
    },
    leftImage: {
        left: 0,
        width: 45,
        height: '100%',
        paddingLeft: 12,
        position: 'absolute',
    },
    rightImage: {
        right: 0,
        width: 45,
        height: '100%',
        paddingLeft: 8,
        position: 'absolute',
    },
    titleText: {
        flex: 1,
        fontSize: 17,
        textAlign: 'center',
        color: Colors.text,
        paddingHorizontal: 50,
    },
    rightText: {
        right: 0,
        padding: 10,
        fontSize: 13,
        color: Colors.text,
        position: 'absolute',
    },
});

