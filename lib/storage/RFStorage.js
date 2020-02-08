import React from 'react';
import {AsyncStorage} from 'react-native';
import {selfOr} from '../utils/RFUtils';

const BoolSet = new Set(['true', 'false']);
const persistTag = 'persistTag';// 持久化绑定标记

export default class RFStorage {

    static init(targetObj, callback, version) {//初始化数据
        let newVersion = selfOr(version, '1.0');//存储版本控制
        if ((Object.getOwnPropertyDescriptor(targetObj, persistTag))) {
            setTimeout(() => callback && callback(), 100);
        } else {
            targetObj.persistTag = persistTag;
            generateAccessor(targetObj, newVersion);//添加getter、setter
            Object.keys(targetObj).forEach((keyStr, index, array) => {// 初始化时，将AsyncStorage中的数据一次性读取到内存中
                AsyncStorage.getItem(newVersion + keyStr).then(result => {
                    targetObj[keyStr] = convertData(result);
                    if (index === array.length - 1) {// 数据初始化完成
                        setTimeout(() => callback && callback(), 300);
                    }
                });
            });
        }
    }
}

function generateAccessor(targetObj, Tag) {// 给targetObj生成getter、setter访问器属性
    const Keys = Object.keys(targetObj);
    const defaultStr = '';//所有字段默认设置为空字符串
    Keys.map(key => targetObj[key] = defaultStr);// 将存储对象的数值统一设置为默认值

    Keys.map(key => {// 给指定的存储对象定义getter setter器
        const keyStr = Tag + key;
        Object.defineProperty(targetObj, key, {
            get: () => {
                if (this[keyStr] === defaultStr) {//若变量为默认值，则重新获取一次
                    AsyncStorage.getItem(keyStr).then((result) => {
                        this[keyStr] = convertData(result);
                    });
                }
                return this[keyStr];
            },
            set: (value) => {
                if (value === undefined || value == null) {
                    return;
                }
                let result = (typeof value === 'object') ? JSON.stringify(value) : String(value);
                try {
                    this[keyStr] = value;
                    AsyncStorage.setItem(keyStr, result);
                } catch (exception) {
                    console.log(exception && exception.message);
                }
            },
            enumerable: true,
        });
    });
}

function convertData(result) {//若为jsonStr转JsonObject
    if (isJson(result)) {//存储的是Json数据
        return JSON.parse(result);
    } else {//bool或者string类型
        if (BoolSet.has(result)) {
            return result.equals('true');
        }
    }
    return result;
}

export function isJson(result) {//判断是否 json字符串
    return typeof result === 'string' && (result.startsWith('{') || result.startsWith('['));
}
