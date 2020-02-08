import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import {isEmpty} from '../utils/Utils';
import {RFText, RFView} from 'react-native-fast-app';
import {Const} from '../storage/Const';

let rfSibling = undefined;
let toast = null;

export const Loading = {

    show: (text, showIndicator = true) => {
        rfSibling = new RootSiblings(
            <View style={[styles.maskStyle, {backgroundColor: showIndicator ? 'rgba(0, 0, 0, 0.6)' : 'transparent'}]}>
                <RFView style={[styles.backViewStyle, {paddingVertical: showIndicator ? 16 : 0}]}>
                    {showIndicator && <ActivityIndicator style={{marginBottom: 5}} size="large" color="white"/>}
                    {text && <RFText style={styles.textStyle} allowFontScaling={false} text={text} numberOfLines={1}/>}
                </RFView>
            </View>,
        );
        rfSibling.id = 134343;
        return rfSibling;
    },

    hidden: () => {
        if (rfSibling instanceof RootSiblings) {
            rfSibling.destroy();
        }
    },

};

export function showLoading(text, isShow, showIndicator = true) {
    isShow ? Loading.show(text, showIndicator) : Loading.hidden();
}

export function showToast(content) {
    if (isEmpty(content)) {
        return;
    }
    if (toast) {//隐藏已经存在的toast
        setTimeout(() => Toast.hide(toast), 0);
    }
    setTimeout(() => toast = Toast.show(content, {animation: true, position: Toast.positions.CENTER}), 0);
}

const styles = StyleSheet.create({
        maskStyle: {
            position: 'absolute',
            width: Const.screenWidth,
            height: Const.screenHeight,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backViewStyle: {
            minWidth: 100,
            minHeight: 40,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111',
            maxWidth: Const.screenWidth * 0.7,
        },
        textStyle: {
            fontSize: 14,
            color: 'white',
            paddingHorizontal: 15,
        },
    },
);
