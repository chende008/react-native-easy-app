import React, {PureComponent} from 'react'

import {ActivityIndicator, Dimensions, FlatList, Image, RefreshControl, SectionList, StyleSheet, Text, View} from 'react-native'
import PropTypes from 'prop-types'
import {isEmpty, selfOr} from '../utils/XUtils'
import {XText, XView} from './WidgetBase'

const {width, height} = Dimensions.get('window');

export let RefreshStatus = {

    Idle: {text: 'loading…'},//idle status

    PreLoading: {text: 'first loading…'}, // before first loading status
    RefreshingData: {text: 'loading…'},// Pull-down refresh..
    NoData: {text: 'no data'},// To drop down to refresh (no data).
    LoadFailure: {text: 'failed to load'},// Drop-down refresh (load failed)

    LoadingMoreData: {moreText: 'loading…'},// Load more, in progress...
    NoMoreData: {moreText: 'All data has been loaded'},// Load more (no data)
    LoadMoreFailure: {moreText: 'Click reload'},// Load more (load failed)

    NetException: {text: 'network exception', moreText: 'Network exception, click reload'}, // network exception
};

export default class XFlatList extends PureComponent {

    constructor(props) {
        super(props);
        if (!isEmpty(props.refreshStatus)) {
            RefreshStatus = {...RefreshStatus, ...props.refreshStatus}
        }
        this.state = {status: RefreshStatus.Idle};
        this.hasLaunch = false
    }

    render() {
        const {status} = this.state;
        const {onRefresh, onLoadMore, indicatorOffset, renderEmptyViewFunc, renderRooterViewFunc, indicatorProps, refreshStatus, ...props} = this.props;

        const canLoadMore = status === RefreshStatus.Idle;
        const ViewTag = isEmpty(props.sections) ? FlatList : SectionList;

        const RefreshView = <RefreshControl
            onRefresh={() => onRefresh()}
            refreshing={status === RefreshStatus.RefreshingData}
            progressViewOffset={selfOr(indicatorOffset, 50)} {...indicatorProps}/>;

        const isEmptyList = isEmpty(this.props.data || this.props.sections);

        return <ViewTag refreshing={status === RefreshStatus.RefreshingData}
                        ref={ref => (this.flatList = ref)}
                        onEndReached={() => {//处理FlatList控件在IOS上的bug
                            if (this.loadMoreTag) {
                                canLoadMore && onLoadMore && onLoadMore();
                                this.loadMoreTag = false
                            }
                        }}
                        refreshControl={RefreshView}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() => this.renderEmptyView(status, isEmptyList, renderEmptyViewFunc)}
                        ListFooterComponent={() => this.renderFooter(status, isEmptyList, renderRooterViewFunc)}
                        onContentSizeChange={() => this.loadMoreTag = true}
                        onEndReachedThreshold={0.5}{...props} />
    }


    renderEmptyView = (status, isEmpty, renderEmptyViewFunc) => {
        if (!this.hasLaunch) {
            if (renderEmptyViewFunc) return renderEmptyViewFunc(RefreshStatus.PreLoading, isEmpty);
            return <View style={{width: width, height: height * 0.7, justifyContent: 'center'}}>
                <XText style={{color: '#919BA5', fontSize: 14, alignSelf: 'center'}} text={RefreshStatus.PreLoading.text}/>
            </View>
        }
        if (renderEmptyViewFunc) return renderEmptyViewFunc(status, isEmpty);
        return <View style={{width: width, height: height * 0.7, justifyContent: 'center'}}>
            <XText style={{color: '#919BA5', fontSize: 14, alignSelf: 'center'}} text={status.text}/>
        </View>
    };

    renderFooter = (status, isEmpty, renderRooterViewFunc) => {// load more View
        if (!this.hasLaunch) return null;
        if (renderRooterViewFunc) renderRooterViewFunc(status, isEmpty);
        let footerView = null;
        switch (status) {
            case RefreshStatus.Idle:
            case RefreshStatus.LoadingMoreData:// Load more, in progress...
                footerView = <XView style={styles.footerContainer}>
                    <ActivityIndicator style={{marginRight: 8}} size="small" color="#888888"/>
                    <Text style={styles.footerText}>{RefreshStatus.LoadingMoreData.moreText}</Text>
                </XView>;
                break;
            case RefreshStatus.NoMoreData:// Load more (no data)
                footerView = <XView style={styles.footerContainer}>
                    <Text style={styles.footerText}>{status.moreText}</Text>
                </XView>;
                break;
            case RefreshStatus.LoadMoreFailure:// Load more (load failed)
            case RefreshStatus.NetException:// network exception
                footerView = !isEmpty && <View style={styles.footerContainer}>
                    <XView onPress={() => this.props.onLoadMore && this.props.onLoadMore()}>
                        <Text style={styles.footerText}>{status.moreText}</Text>
                    </XView>
                </View>;
                break
        }
        return footerView
    };

    refreshPreLoad = (isPullDown) => {// PreLoaded state Settings
        this.hasLaunch = true;
        this.setState({status: isPullDown ? RefreshStatus.RefreshingData : RefreshStatus.LoadingMoreData})
    };

    refreshLoaded = (success, isPullDown, noMoreData, networkException) => {// Load complete state Settings
        if (success) {
            setTimeout(() => {
                if (noMoreData) {// No more data
                    this.setState({status: isPullDown ? RefreshStatus.NoData : RefreshStatus.NoMoreData})
                } else {// Returns valid data
                    const isEmptyList = isEmpty(this.props.data || this.props.sections);
                    if (isEmptyList) {
                        this.setState({status: RefreshStatus.NoData})
                    } else {
                        this.setState({status: RefreshStatus.Idle})
                    }
                }
            }, 500)
        } else {
            this.setState({status: isPullDown ? RefreshStatus.LoadFailure : RefreshStatus.LoadMoreFailure})
        }
        if (networkException) {// network exception
            this.setState({status: RefreshStatus.NetException})
        }
    };

    static propTypes = {
        onRefresh: PropTypes.func,
        onLoadMore: PropTypes.func,
        refreshStatus: PropTypes.object,
        indicatorProps: PropTypes.object,
        renderEmptyViewFunc: PropTypes.func,
        renderRooterViewFunc: PropTypes.func,
    };
}

const styles = StyleSheet.create({
    footerContainer: {
        height: 44,
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#919BA5',
    }
});
