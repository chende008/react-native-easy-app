import React from 'react';
import {Router, Scene} from 'react-native-router-flux';
import LaunchController from "./Main/Welcome/LaunchController";
import MainController from "./Main/Home/MainController";
import StorageController from "./Main/Home/storage/StorageController";
import WidgetController from "./Main/Home/view/WidgetController";
import RefreshController from "./Main/Home/view/RefreshController";
import HttpController from "./Main/Home/view/HttpController";

export const RouterList = () => (//项目页面清单
    <Router>
        <Scene key="root" hideNavBar>
            <Scene initial={true} component={LaunchController}/>
            <Scene key='main' component={MainController}/>
            <Scene key='http' component={HttpController}/>
            <Scene key='storage' component={StorageController}/>
            <Scene key='widget' component={WidgetController}/>
            <Scene key='refreshList' component={RefreshController}/>
        </Scene>
    </Router>
);
