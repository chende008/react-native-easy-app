/**
 *  Utils
 */
import React from 'react';
import {Platform} from 'react-native';
import RFWidget from '../widget/RFWidget';

export function isEmpty(obj) {
    if (obj === undefined || obj == null) {
        return true;
    }
    if (Array.isArray(obj) && obj.length === 0) {//array
        return true;
    } else {
        if (typeof obj === 'string' && obj.trim() === '') {
            return true;
        }
    }
    return false;
}

export function selfOr(self, another = null) {// Returns itself or another object
    if (Array.isArray(self)) {
        return !isEmpty(self) ? self : [];
    } else {
        return !isEmpty(self) ? self : another;
    }
}

export function emptyTip(content, tip) {
    let empty = isEmpty(content) || content === false;
    empty && console.warn(tip);
    return empty;
}

export function isFullUrl(url) {
    if (isEmpty(url)) {
        return false;
    }
    let newUrl = url.toLowerCase();
    return newUrl.startsWith('http');
}

export function objHasKey(obj) {// Determines whether an object has properties
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
    if (!(icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg'))) {// If no extension is added, the extension is added
        newIcon = icon + '.png';
    }
    if (!isFullUrl(newIcon)) {// If the protocol header is not included, add
        if (isEmpty(RFWidget.default.imageAsset)) {
            console.warn('请设置RNImage的baseUrl');
        }
        newIcon = RFWidget.default.imageAsset + newIcon;
    }
    return {uri: newIcon};
}

export function isFunc(func) {
    return func && typeof func === 'function';
}

export function dateFormat(dateTime = (new Date()).valueOf(), format = 'yyyy-MM-dd') {
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateTime)) {
        return dateTime;
    }
    let date = new Date(dateTime);
    let o = {
        'M+': date.getMonth() + 1, //month
        'd+': date.getDate(), // day
        'h+': date.getHours(), //hour
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'q+': Math.floor((date.getMonth() + 3) / 3), //Season
        'S': date.getMilliseconds(), //ms
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

String.prototype.equals = function (str, ignoreCase = true) {// Compare two strings to see if they are the same
    if (typeof str === 'string') {
        return ignoreCase ? str.toLowerCase() === String(this).toLowerCase() : String(this) === str;
    }
    return false;
};

