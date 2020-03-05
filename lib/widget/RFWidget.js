import React from 'react'
import {isFullUrl} from '../utils/RFUtils'

export default class RFWidget {

    static default = {
        imageAsset: '', // 网络图片的baseUrl
        targetWidth: 0, // UI尺寸缩放的参考屏幕宽度
        targetHeight: 0 // UI尺寸缩放的参考屏幕高度
    };

    /**
     * @param imageBaseUrl 的图片资源baseUrl
     */
    static initResource(imageBaseUrl) {
        if (!isFullUrl(imageBaseUrl)) {//不是有效的url
            console.warn('请设置有效的图片BaseUrl');
        } else {
            RFWidget.default.imageAsset = imageBaseUrl;
        }
        return RFWidget;
    }

    /**
     *
     * @param targetWidth UI适配参考屏幕宽
     * @param targetHeight UI适配参考屏高
     */
    static initReferenceScreen(targetWidth, targetHeight) {
        RFWidget.default.targetWidth = targetWidth;
        RFWidget.default.targetHeight = targetHeight;
        return RFWidget;
    }
}
