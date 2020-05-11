import React from 'react'
import {isFullUrl} from '../utils/XUtils'
import {PixelRatio} from "react-native";

export default class XWidget {

    /**
     * @param imageBaseUrl
     */
    static initResource(imageBaseUrl) {
        if (!isFullUrl(imageBaseUrl)) {// not a valid url
            console.warn('Please set a valid BaseUrl');
        } else {
            XWidget.imageAsset = imageBaseUrl;
        }
        return XWidget;
    }

    /**
     *
     * @param targetWidth UI Adaptive reference screen width
     * @param targetHeight UI Adaptive reference screen height
     */
    static initReferenceScreen(targetWidth, targetHeight) {
        XWidget.targetWidth = targetWidth;
        XWidget.targetHeight = targetHeight;
        return XWidget;
    }
}
