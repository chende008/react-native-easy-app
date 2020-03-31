import React from 'react'
import {isFullUrl} from '../utils/RFUtils'
import {PixelRatio} from "react-native";

export default class RFWidget {

    /**
     * @param imageBaseUrl
     */
    static initResource(imageBaseUrl) {
        if (!isFullUrl(imageBaseUrl)) {// not a valid url
            console.warn('Please set a valid BaseUrl');
        } else {
            RFWidget.imageAsset = imageBaseUrl;
        }
        return RFWidget;
    }

    /**
     *
     * @param targetWidth UI Adaptive reference screen width
     * @param targetHeight UI Adaptive reference screen height
     */
    static initReferenceScreen(targetWidth, targetHeight) {
        RFWidget.targetWidth = targetWidth;
        RFWidget.targetHeight = targetHeight;
        return RFWidget;
    }
}
