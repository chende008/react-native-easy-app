import React from 'react'
import {AsyncStorage} from 'react-native'
import {selfOr} from '../utils/RFUtils'

const BoolSet = new Set(['true', 'false']);
const persistTag = 'persistTag';// 持久化绑定标记

export default class RFStorage {

    static init(targetObj, initializedCallback, dataChangedCallback, version) {//初始化数据
        const Tag = selfOr(version, '1.0');//存储版本控制
        if ((Object.getOwnPropertyDescriptor(targetObj, persistTag))) {
            setTimeout(() => initializedCallback(), 100)
        } else {
            targetObj.persistTag = persistTag;
            generateAccessor(targetObj, Tag, dataChangedCallback);//添加getter、setter

            const Keys = Object.keys(targetObj);
            Keys.map(async (key, index) => {// 初始化时，将AsyncStorage中的数据一次性读取到内存中
                const keyStr = Tag + key;
                const result = await AsyncStorage.getItem(keyStr);
                targetObj[keyStr] = convertData(result);

                if (index === Keys.length - 1) {// 数据初始化完成
                    setTimeout(() => initializedCallback(), 100)
                }
            })
        }
    }
}

function generateAccessor(targetObj, Tag, dataChangedCallback) {// 给targetObj生成getter、setter访问器属性
    Object.keys(targetObj).map(key => {// 给指定的存储对象定义getter setter器

        const keyStr = Tag + key;
        Object.defineProperty(targetObj, key, {

            get: () => {
                return this[keyStr];
            },

            set: (value) => {
                try {
                    this[keyStr] = value;
                    const result = (typeof value === 'object') ? JSON.stringify(value) : String(value);
                    AsyncStorage.setItem(keyStr, result);

                    dataChangedCallback && dataChangedCallback({key, value: result})
                } catch (exception) {
                    console.log(exception && exception.message)
                }
            },
        })
    })
}

function convertData(result) {//若为jsonStr转JsonObject
    if (isJson(result)) {//存储的是Json数据
        return JSON.parse(result)
    } else {//bool或者string类型
        if (BoolSet.has(result)) {
            return result.equals('true')
        }
    }
    return result
}

export function isJson(result) {//判断是否 json字符串
    return typeof result === 'string' && (result.startsWith('{') || result.startsWith('['))
}
