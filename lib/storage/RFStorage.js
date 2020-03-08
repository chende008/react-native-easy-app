import {AsyncStorage} from 'react-native'
import {isEmpty, selfOr} from '../utils/RFUtils'

const BoolSet = new Set(['true', 'false']);
const persistTag = 'persistTag'; // Persistent binding markup
const splitTag = '#'; // Version control delimiter
let keyValuesPairs = []; // Key value pairs that need to be stored

export default class RFStorage {

    static initStorage(storageObj, initializedCallback, dataChangedCallback, version) {
        if (isEmpty(storageObj) || isEmpty(initializedCallback)) return;
        const Tag = selfOr(version, '1.0'); // Storage version control
        if ((Object.getOwnPropertyDescriptor(storageObj, persistTag))) {
            setTimeout(() => initializedCallback(), 100)
        } else {
            storageObj.persistTag = persistTag;
            generateAccessor(storageObj, Tag, dataChangedCallback); // add getter、setter

            const Keys = Object.keys(storageObj);
            const StorageKeys = Keys.map(key => newKey(Tag, key));

            // When initialized, the data in AsyncStorage is read into memory at one time
            AsyncStorage.multiGet(StorageKeys).then(keyValuePairs => {
                keyValuePairs.map(([keyStr, value]) => {
                    let [, key] = keyStr.split(splitTag);
                    if (persistTag !== key && !isEmpty(value)) {
                        storageObj[key] = convertData(value)
                    }
                });
                setTimeout(() => initializedCallback(), 100)
            }).catch(error => {
                console.log(error)
            })
        }
    }

    static multiGet(keys): Promise<any> {
        if (Array.isArray(keys)) {
            return AsyncStorage.multiGet(keys)
        }
    }

    static saveItems(keyValuePairs): Promise<any> {
        if (Array.isArray(keyValuePairs)) {
            return AsyncStorage.multiSet(keyValuePairs)
        }
    }

    static removeItems(keys): Promise<any> {
        if (Array.isArray(keys)) {
            return AsyncStorage.multiRemove(keys)
        }
    }

    static clear(): Promise<any> {
        return AsyncStorage.clear()
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
            AsyncStorage.multiSet(saveDataArray, () => {
                dataChangedCallback && dataChangedCallback(saveDataArray)
            });
        }
    }, 2500)

}

function convertData(result) {
    if (isJson(result)) {// It stores Json data
        return JSON.parse(result)
    } else {// bool or string
        if (BoolSet.has(result)) {
            return result.equals('true');
        }
    }
    return result;
}

export function isJson(result) {// Determines whether a json string is present
    return typeof result === 'string' && (result.startsWith('{') || result.startsWith('['));
}

export function newKey(tag, key) {
    return tag + splitTag + key;
}
