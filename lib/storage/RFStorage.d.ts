export default class RFStorage {

    /**
     *
     * @param targetObj
     * @param initializedCallback
     * @param dataChangedCallback
     * @param version
     */
    initStorage(targetObj: object, initializedCallback: () => void, dataChangedCallback: (dataSet) => void, version: string)

    /**
     *
     * @param targetObj
     * @param initializedCallback
     * @param dataChangedCallback
     * @param version
     */
    init(targetObj: object, initializedCallback: () => void, dataChangedCallback: (dataSet) => void, version: string)

    /**
     *
     * @param keys
     */
    multiGet(keys: any): Promise<any>;

    /**
     *
     * @param keyValuePairs
     */
    saveItems(keyValuePairs: any): Promise<any>;

    /**
     *
     * @param keys
     */
    removeItems(keys: any): Promise<any>;

    /**
     *
     */
    clear: Promise<any>;

}
