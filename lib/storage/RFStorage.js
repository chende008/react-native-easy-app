import {AsyncStorage} from 'react-native'
import {isEmpty, selfOr} from '../utils/RFUtils'

const BoolSet = new Set(['true', 'false']);
const persistTag = 'persistTag'; // Persistent binding markup
const splitTag = '#'; // Version control delimiter
let keyValuesPairs = []; // Key value pairs that need to be stored

export default class RFStorage {

    static default = {
        // it can be assigned to AsyncStorage from @react-native-community/async-storage by initStorage
        Storage: AsyncStorage,
    };

    static initStorage(storageObj, initializedFunc, dataChangedFunc, version, storageImp) {
        if (isEmpty(storageObj) || isEmpty(initializedFunc)) return;
        if (!isEmpty(storageImp) && storageImp.multiGet) { //valid AsyncStorage
            this.default.Storage = storageImp
        }
        const Tag = selfOr(version, '1.0'); // Storage version control
        if ((Object.getOwnPropertyDescriptor(storageObj, persistTag))) {
            setTimeout(() => initializedFunc(), 100)
        } else {
            storageObj.persistTag = persistTag;
            generateAccessor(storageObj, Tag, dataChangedFunc); // add getter、setter

            const Keys = Object.keys(storageObj);
            const StorageKeys = Keys.map(key => newKey(Tag, key));

            // When initialized, the data in Storage is read into memory at one time
            this.default.Storage.multiGet(StorageKeys).then(keyValuePairs => {
                keyValuePairs.map(([keyStr, value]) => {
                    let [, key] = keyStr.split(splitTag);
                    if (persistTag !== key && !isEmpty(value)) {
                        storageObj[key] = convertData(value)
                    }
                });
                setTimeout(() => initializedFunc(), 100)
            }).catch(error => {
                console.log(error)
            })
        }
    }

    static multiGet(keys): Promise<any> {
        if (Array.isArray(keys)) {
            return this.default.Storage.multiGet(keys)
        }
    }

    static saveItems(keyValuePairs): Promise<any> {
        if (Array.isArray(keyValuePairs)) {
            return this.default.Storage.multiSet(keyValuePairs)
        }
    }

    static removeItems(keys): Promise<any> {
        if (Array.isArray(keys)) {
            return this.default.Storage.multiRemove(keys)
        }
    }

    static clear(): Promise<any> {
        return this.default.Storage.clear()
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
            RFStorage.default.Storage.multiSet(saveDataArray, () => {
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
    try {
        json = JSON.parse(result)
    } catch (e) {
        console.warn(e)
    }
    return json
}

export function newKey(tag, key) {
    return tag + splitTag + key;
}
