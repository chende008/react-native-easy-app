import React, {PureComponent} from 'react';

import {Actions} from 'react-native-router-flux';
import {RFLibrary} from 'react-native-fast-app';
import {RNStorage} from '../Common/storage/AppStorage';
import {Assets} from '../Home/http/Api';

export default class LaunchController extends PureComponent {

    constructor(props) {
        super(props);
        this.init();
    }

    init = () => {
        console.disableYellowBox = true;
        RFLibrary.init(RNStorage, () => {//初始化RNLibrary
            Actions.reset('main');
        }, Assets, '1.0');
    };

    render() {
        return null;
    }

}

