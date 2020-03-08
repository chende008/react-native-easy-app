import React from 'react';

import {TouchableOpacity} from 'react-native';
import {isFunc} from '../utils/RFUtils';

let lastClickTime, lastUniqueId;// anti Fast Click

export function RFTouch({style, onPress, ...props}) {
    let uniqueId = new Date().valueOf();
    return <TouchableOpacity style={style} activeOpacity={0.7} onPress={() => antiFastClick(onPress, uniqueId)}{...props} />;
}

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
