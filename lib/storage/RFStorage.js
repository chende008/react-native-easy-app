import {AsyncStorage} from 'react-native'
import {selfOr, isEmpty} from '../utils/RFUtils'

const BoolSet = new Set(['true', 'false']);
const persistTag = 'persistTag';// 持久化绑定标记
const splitTag = '#';// 版本控制分隔符

export default class RFStorage {

    static init(targetObj, initializedCallback, dataChangedCallback, version) {//初始化数据
        const Tag = selfOr(version, '1.0');//存储版本控制
        if ((Object.getOwnPropertyDescriptor(targetObj, persistTag))) {
            setTimeout(() => initializedCallback(), 100)
        } else {
            targetObj.persistTag = persistTag;
            generateAccessor(targetObj, Tag, dataChangedCallback);// 添加getter、setter

            const Keys = Object.keys(targetObj);
            const StorageKeys = Keys.map(key => newKey(Tag, key));

            // 初始化时，将AsyncStorage中的数据一次性读取到内存中
            AsyncStorage.multiGet(StorageKeys).then(keyValuePairs => {
                keyValuePairs.map(([keyStr, value]) => {
                    let [, key] = keyStr.split(splitTag);
                    if (persistTag !== key && !isEmpty(value)) {
                        targetObj[key] = convertData(value)
                    }
                });
                setTimeout(() => initializedCallback(), 100)
            }).catch(error => {
                console.log(error)
            })
        }
    }

    static multiGet(keys) {
        if (Array.isArray(keys)) {
            return AsyncStorage.multiGet(keys)
        }
    }

    static removeItems(keys) {
        if (Array.isArray(keys)) {
            return AsyncStorage.multiRemove(keys)
        }
    }

    static saveItems(keyValuePairs) {
        if (Array.isArray(keyValuePairs)) {
            return AsyncStorage.multiSet(keyValuePairs)
        }
    }

    static clear() {
        AsyncStorage.clear()
    }
}

function generateAccessor(targetObj, Tag, dataChangedCallback) {// 给targetObj生成getter、setter访问器属性
    Object.keys(targetObj).map(key => {

        const keyStr = newKey(Tag, key);
        Object.defineProperty(targetObj, key, {

            get: () => {
                return this[keyStr]
            },

            set: (value) => {
                try {
                    this[keyStr] = value;
                    const result = (typeof value === 'object') ? JSON.stringify(value) : String(value);
                    AsyncStorage.setItem(keyStr, result, () => {
                        dataChangedCallback && dataChangedCallback({key, value: result})
                    })
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

export function newKey(tag, key) {
    return tag + splitTag + key
}
