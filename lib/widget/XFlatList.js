import React, {PureComponent} from 'react'

import {ActivityIndicator, FlatList, SectionList, Dimensions, Image, RefreshControl, StyleSheet, Text, View} from 'react-native'

import PropTypes from 'prop-types'
import {isEmpty, selfOr} from '../utils/XUtils'
import {XText, XView} from './WidgetBase'

const {width, height, scale} = Dimensions.get('window');
const imageStyle = {width: width * 0.6, height: height * 0.6 * 0.72727};

export default class XFlatList extends PureComponent {

    constructor(props) {
        super(props);
        if (!isEmpty(props.refreshStatus)) {
            XFlatList.RefreshStatus = {...XFlatList.RefreshStatus, ...props.refreshStatus}
        }
        this.state = {status: XFlatList.RefreshStatus.Idle}
    }

    render() {
        let {status} = this.state;
        let {onRefresh, onLoadMore, indicatorOffset, emptyViewHeight, ...props} = this.props;
        let canLoadMore = status === XFlatList.RefreshStatus.Idle;
        let forFlatList = isEmpty(props.sections);
        let ViewTag = forFlatList ? FlatList : SectionList;
        return <ViewTag refreshing={status === XFlatList.RefreshStatus.RefreshingData}
                        ref={ref => (this.flatList = ref)}
                        onEndReached={() => {//处理FlatList控件在IOS上的bug
                            if (this.loadMoreTag) {
                                canLoadMore && onLoadMore && onLoadMore();
                                this.loadMoreTag = false
                            }
                        }}
                        refreshControl={<RefreshControl onRefresh={() => onRefresh()} refreshing={status === XFlatList.RefreshStatus.RefreshingData} progressViewOffset={selfOr(indicatorOffset, 50)}/>}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() => this.renderEmptyView(status, isEmpty(forFlatList ? props.data : props.sections), emptyViewHeight)}
                        ListFooterComponent={() => this.renderFooter(status, isEmpty(forFlatList ? props.data : props.sections))}
                        onContentSizeChange={() => this.loadMoreTag = true}
                        onEndReachedThreshold={0.5}{...props} />
    }

    renderEmptyView = (status, empty, emptyViewHeight) => {
        let {noDataText, noDataImage = false} = this.props;
        let emptyView = null;
        let text = status === XFlatList.RefreshStatus.NoData ? noDataText || status.text : status.text;
        let image = status === XFlatList.RefreshStatus.NoData ? noDataImage || status.image : status.image;

        if (XFlatList.RefreshStatus.RefreshingData !== status || empty) {//(No drop-down refresh) or (The drop-down refreshes but the list is empty)
            emptyView = <XView style={[styles.emptyContainer, {height: emptyViewHeight}]}>
                {image && <Image style={imageStyle} resizeMode='contain' source={{uri: image}}/>}
                <XText style={{color: '#919BA5', fontSize: 14}} text={text}/>
            </XView>
        }
        return emptyView
    };

    renderFooter = (status, isEmpty) => {// load more View
        let footerView = null;
        switch (status) {
            case XFlatList.RefreshStatus.LoadingMoreData:// Load more, in progress...
                footerView = <XView style={styles.footerContainer}>
                    <ActivityIndicator style={{marginRight: 8}} size="small" color="#888888"/>
                    <Text style={styles.footerText}>{status.moreText}</Text>
                </XView>;
                break;
            case XFlatList.RefreshStatus.NoMoreData:// Load more (no data)
                footerView = <XView style={styles.footerContainer}><Text style={styles.footerText}>{status.moreText}</Text></XView>;
                break;
            case XFlatList.RefreshStatus.LoadMoreFailure:// Load more (load failed)
            case XFlatList.RefreshStatus.NetException:// network exception
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
        this.setState({status: isPullDown ? XFlatList.RefreshStatus.RefreshingData : XFlatList.RefreshStatus.LoadingMoreData})
    };

    refreshLoaded = (success, isPullDown, noMoreData, networkException) => {// Load complete state Settings
        if (success) {
            if (noMoreData) {// No more data
                this.setState({status: isPullDown ? XFlatList.RefreshStatus.NoData : XFlatList.RefreshStatus.NoMoreData})
            } else {// Returns valid data
                this.setState({status: XFlatList.RefreshStatus.Idle})
            }
        } else {
            this.setState({status: isPullDown ? XFlatList.RefreshStatus.LoadFailure : XFlatList.RefreshStatus.LoadMoreFailure})
        }
        if (networkException) {// network exception
            this.setState({status: XFlatList.RefreshStatus.NetException})
        }
    };

    static propTypes = {
        onLoadMore: PropTypes.func,
        data: PropTypes.array,
        noDataText: PropTypes.string,
        noDataImage: PropTypes.bool,
        indicatorOffset: PropTypes.number,
        refreshStatus: PropTypes.object,
        emptyViewHeight: PropTypes.number,
    };

    static RefreshStatus = {
        Idle: {},//idle status

        RefreshingData: {text: 'loading…'},// Pull-down refresh..
        NoData: {text: 'load complete'},// To drop down to refresh (no data).
        LoadFailure: {text: 'failed to load'},// Drop-down refresh (load failed)

        LoadingMoreData: {moreText: 'loading…'},// Load more, in progress...
        NoMoreData: {moreText: 'All data has been loaded'},// Load more (no data)
        LoadMoreFailure: {moreText: 'Click reload'},// Load more (load failed)

        NetException: {text: 'network exception', moreText: 'Network exception, click reload'}, // network exception
    }
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
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
