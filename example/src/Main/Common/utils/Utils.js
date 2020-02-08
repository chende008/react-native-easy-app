/**
 *  常用工具类
 */
import React from 'react';
import {DeviceEventEmitter, Keyboard, Platform} from 'react-native';
import {showToast} from '../widgets/Loading';


export function emptyTip(content, tip) {//若文本为空时，showEmptyTip
    let empty = isEmpty(content) || content === false;
    empty && showToast(tip);
    return empty;
}

export function selfOr(self, another = null) {//返回自己或者另一个对象
    if (Array.isArray(self)) {
        return !isEmpty(self) ? self : [];
    } else {
        return !isEmpty(self) ? self : another;
    }
}

export function toStr(target) {//返回字符串
    return typeof target === 'object' ? JSON.stringify(target) : target;
}

export function isEmpty(obj): Boolean {
    if (obj === undefined || obj == null) {
        return true;
    }
    if (Array.isArray(obj) && obj.length === 0) {//数组
        return true;
    } else {
        if (typeof obj === 'string' && obj.trim() === '') {
            return true;
        }//字符串
    }
    return false;
}


export function isIos() {//判断平台为IOS
    return Platform.OS === 'ios';
}


export function objHasKey(obj) {//判断一个对象是否有属性
    if (isEmpty(obj)) {
        return false;
    }
    return Object.keys(obj).length > 0;
}

export function numFormat(numStr) {//若数字小于0，则拼接0
    return (Number(numStr) < 10 ? ('0' + numStr) : numStr);
}

export function oneOfKeys(obj, ...keys) {//从对象中轮次取一组key直到取到的value为非空
    let result = null;
    for (let keyStr of keys) {
        if (obj[keyStr]) {
            result = obj[keyStr];
            break;
        }
    }
    return result;
}

export function objToArray(obj) {//对象转数组
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
}

export function rnAddListeners(events) {//键盘多事件及回调
    let eventsFunc = [];
    Object.keys(events).forEach(key => {//添加事件监听
        eventsFunc.push(Keyboard.addListener(key, (event) => events[key](event)));
    });
    return eventsFunc;
}

export function rnAddListener(eventName, callback) {//事件及回调
    return DeviceEventEmitter.addListener(eventName, (event) => callback && callback(event));
}

export function rnCleanListener(...listeners) {//移除监听器
    return listeners && listeners.map(listener => listener && listener.remove());
}

export function isFunc(func) {//判断输入的是否是function
    return func && typeof func === 'function';
}

export function fileName(uri) {
    if (isEmpty(uri)) {
        return uri;
    }
    return uri.replace(/^(.+\/)(\w+\.\w+)$/, '$2');
}

