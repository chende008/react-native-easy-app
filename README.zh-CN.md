## react-native-easy-app （RN 项目快速开发基础库）

[English version doc here](README.md)

[使用手册](https://www.jianshu.com/u/13623408c1aa)

### 安装

```bash
npm install react-native-easy-app --save
``` 
或者

```bash
yarn add react-native-easy-app
```


### 功能点

  * 支持快捷[同步]访问AsyncStorage
  * 支持可配置的Http请求框架
  * 灵活的基础控件(无感知多屏适配)


### 快速开始 

   * 数据存储XStorage
   
     * 实现一个可持久化的数据存储管理类
     
     ```jsx 
        export const RNStorage = {// RNStorage 自定义数据存储对象
            token: undefined, //  字符串类型
            isShow: undefined, // 布尔类型
            userInfo: undefined, // 对象类型
        };
     ```
     
     ```jsx 
       import { XStorage } from 'react-native-easy-app';
        
       const initCallback = () => {
       
            // 现在您可以同步访问RNStorage中的任何属性
            
            console.log(RNStorage.isShow); // 等价于 [ console.log(await AsyncStorage.getItem('isShow')) ]
            
            RNStorage.token = 'TOKEN1343DN23IDD3PJ2DBF3=='; // 等价于 [ await AsyncStorage.setItem('token',TOKEN1343DN23IDD3PJ2DBF3==') ]
            
            RNStorage.userInfo = {name: 'rufeng', age: 30}; // 等价于 [ await AsyncStorage.setItem('userInfo',JSON.stringify({ name:'rufeng', age:30})) ]
       };
       
       XStorage.initStorage(RNStorage, initCallback);
     ```
    
   * 支持可配置的Http请求框架
   
     * 一切基于配置（配置可选，自由设定）
     
      ```jsx 
      import {XHttpConfig} from 'react-native-easy-app';
      
      XHttpConfig().initHttpLogOn(true) // 是否打印Http请求日志
                    .initBaseUrl(ApiCredit.baseUrl) // 默认的BaseUrl
                    .initContentType(XHttpConst.CONTENT_TYPE_URLENCODED)
                    .initHeaderSetFunc((headers, request) => {
                       // 在这里设置公共header参数
                    })
                    .initParamSetFunc((params, request) => {
                       // 在这里设置公共params参数
                    })
                    .initParseDataFunc((result, request, callback) => {
                       let {success, json, response, message, status} = result;
                       // 指定当前app的特定数据解析方式
                });
      ```
     
     * 发送请求模板
     
     ```jsx 
        import {XHttp} from 'react-native-easy-app';
     
        let url = 'v1/account/login/';
        let param = {phone: '18600000000', authCode: '123456'};
        let header = {Authorization: "Basic Y3Rlcm1pbmF......HcVp0WGtI"};
        let callback = () => (success, json, message, status) => {//请求结果回调
             if (success) {
                showToast(JSON.stringify(json))
             } else {
                showToast(msg)
             }
        };
     
        * 可设置的参数以builder形式拼接
        XHttp().url(url)
            .param(param)
            .header(header)
            .internal()
            .rawData()
            .pureText()
            .encodeURI()
            .timeout(10000)
            .extra({tag: 'xx'})
            .contentType('text/xml')
            .resendRequest(data, callback) //重新请求（用于刷新accessToken后，重新发送已经失败的请求）
            .loadingFunc((loading)=> showLoading('请求中，请稍候...', loading))
            .[formJson|formData|formEncoded]()
            .[get|post|put|patch|delete|options](callback);
       
     ```
     
     * 发送请求
     
      ```jsx
         import {XHttp} from 'react-native-easy-app';
      
         const url = 'https://www.baidu.com';
        
         * 同步请求
         const response = await XHttp().url(url).execute('GET');
         const {success, json, message, status} = response;
         
         if(success){
            this.setState({content: JSON.stringify(json)})
         } else {
            showToast(message)
         }
         
         * 异步请求
         XHttp().url(url).get((success, json, message, status)=>{
             if (success){
                this.setState({content: JSON.stringify(json)});
             } else {
                showToast(msg);
             }
         });
                 
         * 异步请求
         XHttp().url(url).execute('GET')
         .then(({success, json, message, status}) => {
             if (success) {
                  this.setState({content: JSON.stringify(json)});
             } else {
                  showToast(message);
             }
          })
          .catch(({message}) => {
              showToast(message);
          })
        ```
     
     * 灵活的基础控件
     ```
        XImage
        XText
        XView
        XFlatList
        
        XImage 非全路径在线图片则依赖图片资源BaseUrl的设置
        
        可在使用前如下配置：
        
        XWidget
        .initResource(Assets)
        .initReferenceScreen(375, 677); // UI 整体尺寸缩放参考屏幕尺寸
     ```
    
 
  详细使用方法请参考 [示例](https://github.com/chende008/react-native-easy-app-sample)
