import React from 'react';
import {isEmpty, numFormat} from "./Utils";

let clickTimes = 0, lastClickTime;//连续点击事件

export function dateFormat(dateTime = (new Date()).valueOf(), format = "yyyy-MM-dd") {
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateTime)) return dateTime;
    let date = new Date(dateTime);
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return format;
}

export function createDateList() {//生成年-月-日级联数据
    let yearList = [];
    let dayArr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//每个月的天数
    for (let year = 1999; year <= 2049; year++) {
        let monthObj = {};
        let monthList = [];
        for (let month = 1; month <= 12; month++) {
            let dayObj = {};
            let dayList = [];
            let dayCount = dayArr[month - 1];
            if (month === 2) {//判断平年还是闰年
                dayCount -= (year % 4 && (year % 100 !== 0 || year % 400 === 0));
            }
            for (let day = 1; day <= dayCount; day++) {
                dayList.push(`${day}日`)
            }
            dayObj[`${month}月`] = dayList;
            monthList.push(dayObj)
        }
        monthObj[`${year}年`] = monthList;
        yearList.push(monthObj);
    }
    return yearList;
}

export function createTimeList() {//生成时-分-秒数据
    let hourList = [];
    let minuteList = [];
    let seconds = [];
    for (let hour = 0; hour < 24; hour++) {
        hourList.push(hour + '点')
    }
    for (let minute = 0; minute < 60; minute++) {
        minuteList.push(minute + '分')
    }
    for (let second = 0; second < 60; second++) {
        seconds.push(second + '秒')
    }
    return [hourList, minuteList, seconds];
}

export function formatChange(dateStr) {//时间格式转换
    if (isEmpty(dateStr)) {//默认为当天的日期
        let today = dateFormat();
        let [, year, month, day] = Regular.RegexDate.exec(today);
        return year + '年,' + Number(month) + '月,' + Number(day) + '日';
    }
    if (dateStr.includes('年')) {// 2018年,5月,7日 => 2018-05-07
        let [, year, month, day] = Regular.RegexDate2.exec(dateStr);
        return year + '-' + numFormat(month) + '-' + numFormat(day);
    } else {// 2018-05-07 => 2018年,5月,7日
        let [, year, month, day] = Regular.RegexDate.exec(dateStr);
        return year + '年,' + Number(month) + '月,' + Number(day) + '日';
    }
}

export function formatTimeChange(dateStr) {//时间格式转换
    if (dateStr.includes(':')) {//若为 2019-02-19 02:22:05 的形式，则获取后5位
        dateStr = dateStr.slice(-8);
    }
    if (isEmpty(dateStr)) {//默认为当天的日期
        let today = dateFormat(new Date().valueOf(), 'hh:mm:ss');
        let [hour, minute, second] = today.split(':');
        return Number(hour) + '点,' + Number(minute) + '分,' + Number(second) + '秒';
    }
    if (dateStr.includes('点')) {// 5点,7分,10秒 => 05:07:02
        let newStr = dateStr.replace('点', '').replace('分', '').replace('秒', '');
        let [hour, minute, second] = newStr.split(',');
        return ' ' + numFormat(hour) + ':' + numFormat(minute) + ':' + numFormat(second);
    } else {// 05:07 => 5点,7分
        let [hour, minute, second] = dateStr.split(':');
        return Number(hour) + '点,' + Number(minute) + '分,' + Number(second) + '秒';
    }
}

export function fastClickTimes(times, callback) {//指定连续点击屏幕的次数&回调
    if (new Date().valueOf() - lastClickTime < 500) {//若两次的点击时间差小于500毫秒，则次数加1
        clickTimes++;
        if (clickTimes === times - 1) callback && callback();//若累积次数达到指定次数，则回调函数（第一次的时间差肯定大于500，故减掉第一次）
    } else {//否则次数归零
        clickTimes = 0;
    }
    lastClickTime = new Date().valueOf();//记录当前时间为作上次点击时间
}
