import React from 'react';
import {isEmpty} from './Utils';

String.prototype.equals = function (str, ignoreCase = true) {//比较两个字符串是否相同
    if (typeof str === 'string') {
        return ignoreCase ? str.toLowerCase() === String(this).toLowerCase() : String(this) === str;
    }
    return false;
};

String.prototype.replaceAll = function (oldStr, newStr) {
    return this.replace(new RegExp(oldStr, 'gm'), newStr);
};

String.prototype.urlFormat = function (args) {//url格式化
    if (isEmpty(args)) {
        return '';
    }
    let url = args[0];
    for (let i = 0; i < args.length; i++) {
        let regExp = new RegExp('\\{' + i + '\\}', 'gm');
        url = this.replace(regExp, args[i]);
    }
    return url;
};

Map.prototype.copy = function () {//复制Map
    if (isEmpty(this)) {
        return new Map();
    }
    let obj = Object.create(null);
    for (let [k, v] of this) {
        obj[k] = v;
    }
    obj = JSON.parse(JSON.stringify(obj));
    let copyMap = new Map();
    for (let k of Object.keys(obj)) {
        copyMap.set(k, obj[k]);
    }
    return copyMap;
};

Set.prototype.copy = function () {//复制set
    if (isEmpty(this)) {
        return new Set();
    }
    let obj = JSON.stringify([...this.values()]);
    obj = JSON.parse(obj);
    let copySet = new Set();
    obj.forEach((value, i) => copySet.add(value));
    return copySet;
};
