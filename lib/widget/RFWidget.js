import React from 'react'
import {isFullUrl} from '../utils/RFUtils'
import {PixelRatio} from "react-native";

export default class RFWidget {

    static default = {
        imageAsset: '',
        targetWidth: 0, // reference width
        targetHeight: 0 // reference height
    };

    /**
     * @param imageBaseUrl
     */
    static initResource(imageBaseUrl) {
        if (!isFullUrl(imageBaseUrl)) {// not a valid url
            console.warn('Please set a valid BaseUrl');
        } else {
            RFWidget.default.imageAsset = imageBaseUrl;
        }
        return RFWidget;
    }

    /**
     *
     * @param targetWidth UI Adaptive reference screen width
     * @param targetHeight UI Adaptive reference screen height
     */
    static initReferenceScreen(targetWidth, targetHeight) {
        RFWidget.default.targetWidth = targetWidth;
        RFWidget.default.targetHeight = targetHeight;
        return RFWidget;
    }
}
