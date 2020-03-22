import React, {PureComponent} from 'react'

import {ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, View} from 'react-native'

import PropTypes from 'prop-types'
import {isEmpty, selfOr} from '../utils/RFUtils'
import {RFText, RFView} from './WidgetBase'
import {Dimensions, PixelRatio} from 'react-native';

const {width, height, scale} = Dimensions.get('window');
const imageStyle = {width: width * 0.6, height: height * 0.6 * 0.72727};

export default class RFlatList extends PureComponent {

    constructor(props) {
        super(props);
        if (!isEmpty(props.refreshStatus)) {
            RFlatList.RefreshStatus = {...RFlatList.RefreshStatus, ...props.refreshStatus}
        }
        this.state = {status: RFlatList.RefreshStatus.RefreshingData}
    }

    render() {
        let {status} = this.state;
        let {onRefresh, onLoadMore, data, indicatorOffset, emptyViewHeight, ...props} = this.props;
        let canLoadMore = status === RFlatList.RefreshStatus.Idle;
        let refreshControl = <RefreshControl onRefresh={() => onRefresh()} refreshing={status === RFlatList.RefreshStatus.RefreshingData} progressViewOffset={selfOr(indicatorOffset, 50)}/>
        return <FlatList data={data}
                         refreshing={status === RFlatList.RefreshStatus.RefreshingData}
                         onEndReached={() => {//处理FlatList控件在IOS上的bug
                             if (this.loadMoreTag) {
                                 canLoadMore && onLoadMore && onLoadMore();
                                 this.loadMoreTag = false
                             }
                         }}
                         refreshControl={refreshControl}
                         keyExtractor={(item, index) => index.toString()}
                         ListEmptyComponent={() => this.renderEmptyView(status, isEmpty(data), emptyViewHeight)}
                         ListFooterComponent={() => this.renderFooter(status, isEmpty(data))}
                         onContentSizeChange={() => this.loadMoreTag = true}
                         onEndReachedThreshold={0.5}{...props} />
    }

    renderEmptyView = (status, empty, emptyViewHeight) => {
        let {noDataText, noDataImage = false} = this.props;
        let emptyView = null;
        let text = status === RFlatList.RefreshStatus.NoData ? noDataText || status.text : status.text;
        let image = status === RFlatList.RefreshStatus.NoData ? noDataImage || status.image : status.image;

        if (RFlatList.RefreshStatus.RefreshingData !== status || empty) {//(No drop-down refresh) or (The drop-down refreshes but the list is empty)
            emptyView = <RFView style={[styles.emptyContainer, {height: emptyViewHeight}]}>
                {image && <Image style={imageStyle} resizeMode='contain' source={{uri: image}}/>}
                <RFText style={{color: '#919BA5', fontSize: 14}} text={text}/>
            </RFView>
        }
        return emptyView
    };

    renderFooter = (status, isEmpty) => {// load more View
        let footerView = null;
        switch (status) {
            case RFlatList.RefreshStatus.LoadingMoreData:// Load more, in progress...
                footerView = <RFView style={styles.footerContainer}>
                    <ActivityIndicator style={{marginRight: 8}} size="small" color="#888888"/>
                    <Text style={styles.footerText}>{status.moreText}</Text>
                </RFView>;
                break;
            case RFlatList.RefreshStatus.NoMoreData:// Load more (no data)
                footerView = <RFView style={styles.footerContainer}><Text style={styles.footerText}>{status.moreText}</Text></RFView>
                break;
            case RFlatList.RefreshStatus.LoadMoreFailure:// Load more (load failed)
            case RFlatList.RefreshStatus.NetException:// network exception
                footerView = !isEmpty && <View style={styles.footerContainer}>
                    <RFView onPress={() => this.props.onLoadMore && this.props.onLoadMore()}>
                        <Text style={styles.footerText}>{status.moreText}</Text>
                    </RFView>
                </View>;
                break
        }
        return footerView
    };

    refreshPreLoad = (isPullDown) => {// PreLoaded state Settings
        this.setState({status: isPullDown ? RFlatList.RefreshStatus.RefreshingData : RFlatList.RefreshStatus.LoadingMoreData})
    };

    refreshLoaded = (success, isPullDown, noMoreData, networkException) => {// Load complete state Settings
        if (success) {
            if (noMoreData) {// No more data
                this.setState({status: isPullDown ? RFlatList.RefreshStatus.NoData : RFlatList.RefreshStatus.NoMoreData})
            } else {// Returns valid data
                this.setState({status: RFlatList.RefreshStatus.Idle})
            }
        } else {
            this.setState({status: isPullDown ? RFlatList.RefreshStatus.LoadFailure : RFlatList.RefreshStatus.LoadMoreFailure})
        }
        if (networkException) {// network exception
            this.setState({status: RFlatList.RefreshStatus.NetException})
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
