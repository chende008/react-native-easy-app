import React from 'react';
import {AsyncStorage} from 'react-native';
import {isEmpty, isFullUrl} from './utils/RFUtils';
import RFStorage, {isJson} from './storage/RFStorage';

export default class RFLibrary {

    static init(storageObj, callback, imageAsset, version) {// RF库初始化
        if (!isEmpty(storageObj) && !isEmpty(callback)) {//若持久化存储库初始化参数有效，则调用RFStorage初始化方法
            RFStorage.init(storageObj, callback, version);
        }
        if (!isFullUrl(imageAsset)) {//不是有效的url
            console.warn('请设置有效的图片BaseUrl');
        }
        this.imageAsset = imageAsset;
    }

}
