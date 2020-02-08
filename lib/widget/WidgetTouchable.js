import React from 'react';

import {TouchableOpacity} from 'react-native';
import {isFunc} from '../utils/RFUtils';

let lastClickTime, lastUniqueId;//防止快速点击

export function RFTouch({style, onPress, ...props}) {//点击事件组件
    let uniqueId = new Date().valueOf();
    return <TouchableOpacity style={style} activeOpacity={0.7} onPress={() => antiFastClick(onPress, uniqueId)}{...props} />;
}

function antiFastClick(func, uniqueId) {//防止快速点击函数
    if (lastUniqueId !== uniqueId) {//若为不同组件，则直接触发事件
        isFunc(func) && func();
    } else {//若为同一个组件并且点击的时间意隔大于500毫秒，才响应其事件
        if (new Date().valueOf() - lastClickTime > 500) {
            isFunc(func) && func();
        }
    }
    lastClickTime = new Date().valueOf();//记录上次点击事件
    lastUniqueId = uniqueId;//记录当前控件标识
}
