import React from 'react';

import {RFTouch} from './lib/widget/WidgetTouchable';
import {RFImage, RFText, RFView} from './lib/widget/WidgetBase';
import RFlattenStyle, {RFResetStyle, RFSize, RFSplitStyle, RTSize} from './lib/utils/StyleUtils';
import RFlatList from './lib/views/RFlatList';

import RFHttpConfig, {RFApiConst} from './lib/http/RFHttpConfig';
import RFStorage from './lib/storage/RFStorage'
import RFWidget from './lib/widget/RFWidget';
import {RFHttp} from './lib/http/HttpUtils';


export {

    RFHttp,
    RFApiConst,

    RFTouch,
    RFView,
    RFText,
    RFImage,
    RFlatList,

    RFSize,
    RTSize,
    RFResetStyle,
    RFSplitStyle,
    RFlattenStyle,

    RFWidget,
    RFStorage,
    RFHttpConfig
};
