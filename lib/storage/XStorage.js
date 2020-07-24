import {isEmpty, selfOr} from '../utils/XUtils'

const BoolSet = new Set(['true', 'false']);
const persistTag = 'persistTag'; // Persistent binding markup
const Error = 'Error'; // error tag
const splitTag = '#'; // Version control delimiter
const version = '1.0'; // Storage version control
let keyValuesPairs = []; // Key value pairs that need to be stored

export default class XStorage {

    static initStorage(storageObj, storageImp, initCallback, dataChangedCallback) {
        if (isEmpty(storageObj) || isEmpty(initCallback)) {
            console.warn('invalid parameter');
            return Error;
        }
        if (!isEmpty(storageImp) && storageImp.multiGet) { //valid AsyncStorage
            this.Storage = storageImp
        }

        if (Object.getOwnPropertyDescriptor(storageObj, persistTag)) {
            setTimeout(() => initCallback(), 100)
        } else {
            storageObj.persistTag = persistTag;
            generateAccessor(storageObj, version, dataChangedCallback); // add getter、setter

            const Keys = Object.keys(storageObj);
            const StorageKeys = Keys.map(key => newKey(version, key));

            // When initialized, the data in Storage is read into memory at one time
            this.Storage.multiGet(StorageKeys).then(keyValuePairs => {
                keyValuePairs.map(([keyStr, value]) => {
                    let [, key] = keyStr.split(splitTag);
                    if (persistTag !== key) {
                        storageObj[key] = convertData(value)
                    }
                });
                setTimeout(() => initCallback(), 100)
            }).catch(error => {
                console.warn(error.message);
                return Error
            })
        }
    }

    static initStorageSync(storageObj, storageImp, dataChangedCallback) {
        return new Promise((resolve, reject) => {
            let result = XStorage.initStorage(storageObj, storageImp, () => resolve(true), dataChangedCallback);
            Error.equals(result) && reject(false)
        });
    }

    static multiGet(keys) {
        if (Array.isArray(keys)) {
            return this.Storage.multiGet(keys)
        }
    }

    static saveItems(keyValuePairs) {
        if (Array.isArray(keyValuePairs)) {
            return this.Storage.multiSet(keyValuePairs)
        }
    }

    static removeItems(keys) {
        if (Array.isArray(keys)) {
            return this.Storage.multiRemove(keys)
        }
    }

    static clear() {
        return this.Storage.clear()
    }
}

function generateAccessor(targetObj, Tag, dataChangedCallback) {// Generate the getter setter accessor property for targetObj
    Object.keys(targetObj).map(key => {

        const keyStr = newKey(Tag, key);
        Object.defineProperty(targetObj, key, {

            get: () => {
                return this[keyStr]
            },

            set: (value) => {
                try {
                    this[keyStr] = value;
                    const valueStr = (typeof value === 'object') ? JSON.stringify(value) : String(value);
                    keyValuesPairs.push([keyStr, valueStr])
                } catch (exception) {
                    console.log(exception && exception.message);
                }
            },
        })
    });

    setInterval(() => {
        if (!isEmpty(keyValuesPairs)) {
            let saveDataArray = [...keyValuesPairs];
            keyValuesPairs = []; // Empty the array of original key-value pairs
            XStorage.Storage.multiSet(saveDataArray, () => {
                dataChangedCallback && dataChangedCallback(saveDataArray)
            });
        }
    }, 2500)

}

function convertData(result) {
    let jsonObj = toJson(result);
    if (jsonObj) {// is json Obj
        return jsonObj;
    } else {
        if (isNaN()) { // not a number
            if (BoolSet.has(result)) { // bool
                return result.equals('true');
            } else { // string
                return result;
            }
        } else { // number
            return JSON.parse(result)
        }
    }
}

export function toJson(result) {// Determines whether a json string is present
    let json = null;
    if (result.startsWith('{') || result.startsWith('[')) {
        try {
            json = JSON.parse(result)
        } catch (e) {
            console.warn(e)
        }
    }
    return json
}

export function newKey(tag, key) {
    return tag + splitTag + key;
}
