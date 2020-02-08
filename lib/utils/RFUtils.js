/**
 *  常用工具类
 */
import React from 'react';
import {Platform} from 'react-native';
import RFLibrary from '../RFLibrary';

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

export function selfOr(self, another = null) {//返回自己或者另一个对象
    if (Array.isArray(self)) {
        return !isEmpty(self) ? self : [];
    } else {
        return !isEmpty(self) ? self : another;
    }
}

export function emptyTip(content, tip) {//若文本为空时，showEmptyTip
    let empty = isEmpty(content) || content === false;
    empty && console.warn(tip);
    return empty;
}

export function isFullUrl(url) {//http开头的url
    if (isEmpty(url)) {
        return false;
    }
    let newUrl = url.toLowerCase();
    return newUrl.startsWith('http');
}

export function objHasKey(obj) {//判断一个对象是否有属性
    if (isEmpty(obj)) {
        return false;
    }
    return Object.keys(obj).length > 0;
}

export function imgUrl(icon) {
    if (isEmpty(icon)) {
        return {uri: icon};
    }
    if (typeof icon !== 'string') {
        return icon;
    }
    if (icon.startsWith('data:image/png;base64')) {
        return {uri: icon};
    }
    if (isFullUrl(icon)) {
        return {uri: icon};
    }

    let newIcon = icon;
    if (!(icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg'))) {//若没有添加扩展名，则添加扩展
        newIcon = icon + '.png';
    }
    if (!isFullUrl(newIcon)) {//若不包含协议头，则添加
        if (isEmpty(RFLibrary.imageAsset)) {
            console.warn('请设置RNImage的baseUrl');
        }
        newIcon = RFLibrary.imageAsset + newIcon;
    }
    return {uri: newIcon};
}

export function isFunc(func) {//判断输入的是否是function
    return func && typeof func === 'function';
}

export function dateFormat(dateTime = (new Date()).valueOf(), format = 'yyyy-MM-dd') {
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateTime)) {
        return dateTime;
    }
    let date = new Date(dateTime);
    let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return format;
}

String.prototype.equals = function (str, ignoreCase = true) {//比较两个字符串是否相同
    if (typeof str === 'string') {
        return ignoreCase ? str.toLowerCase() === String(this).toLowerCase() : String(this) === str;
    }
    return false;
};

