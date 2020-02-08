import React from 'react';

import {toStr} from "./Utils";
import {RNData} from "../storage/AppStorage";

export default class RFLog {

    static log(...args) {
        args.map((item, index) => args[index] = toStr(item));
        RNData.LogOn && console.log(...args);
    }

    static warn(...args) {
        args.map((item, index) => args[index] = toStr(item));
        RNData.LogOn && console.warn(...args);
    }

    static error(...args) {
        args.map((item, index) => args[index] = toStr(item));
        RNData.LogOn && console.error(...args);
    }
}
