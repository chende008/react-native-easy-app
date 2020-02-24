import React, {PureComponent} from 'react';

import {Actions} from 'react-native-router-flux';
import {RFLibrary, RFStorage} from 'react-native-fast-app';
import {RNStorage} from '../Common/storage/AppStorage';
import {Assets} from '../Home/http/Api';

export default class LaunchController extends PureComponent {

    constructor(props) {
        super(props);
        this.init();
    }

    init = () => {
        console.disableYellowBox = true;
        RFStorage.initStorage(RNStorage,
            () => {
                Actions.reset('main');
            }, (data) => {
                data.map(([keyStr, value]) => {
                    let [, key] = keyStr.split('#');
                    console.log('持久化数据变更:', key, '<###>', value);
                })
            }, '1.0');
        RFLibrary.initResource(Assets)
    };

    render() {
        return null;
    }

}

