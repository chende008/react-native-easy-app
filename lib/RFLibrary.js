import React from 'react'
import {isFullUrl} from './utils/RFUtils'

export default class RFLibrary {

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
