import React from 'react'
import {isEmpty, isFullUrl} from './utils/RFUtils'
import RFStorage from './storage/RFStorage'

export default class RFLibrary {

    /**
     * @param storageObj 需要持久化绑定的自定义对象
     * @param initializedCallback 持久化绑定完成回调
     * @param dataChangedCallback 持久化数据对象数据变更回调(可选)
     * @param  version 持久化对象版本（可选）
     */
    static initStorage(storageObj, initializedCallback, dataChangedCallback, version) {
        if (!isEmpty(storageObj) && !isEmpty(initializedCallback)) {
            RFStorage.init(storageObj, initializedCallback, dataChangedCallback, version);
        }
    }

    /**
     * @param imageBaseUrl 的图片资源baseUrl
     */
    static initResource(imageBaseUrl) {
        if (!isFullUrl(imageBaseUrl)) {//不是有效的url
            console.warn('请设置有效的图片BaseUrl');
        } else {
            this.imageAsset = imageBaseUrl;
        }
    }

}
