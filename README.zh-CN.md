## react-native-fast-app （RN 项目快速开发基础库）

[English version doc here](README.md)

[使用手册](https://www.jianshu.com/u/13623408c1aa)

### 安装

npm install react-native-fast-app --save 

or yarn add react-native-fast-app


### 功能点

  * 支持快捷[同步]访问AsyncStorage
  * 支持可配置的Http请求框架
  * 灵活的基础控件(无感知多屏适配)


### 用法 

   * 数据存储RFStorage
   
     * 实现一个可持久化的数据存储管理类
     
     ```jsx 
        export const RNStorage = {// RNStorage 自定义数据存储对象
            token: undefined, //  字符串类型
            isShow: undefined, // 布尔类型
            userInfo: undefined, // 对象类型
        };
     ```
     
     ```jsx 
        import {RFStorage} from 'react-native-fast-app';
     
        RFStorage.initStorage(RNStorage, () => { // 初始化完成回调
           //从此以后就可以同步访问RNStorage中的变量了
           RNStorage.token = 'TOKEN1343DN23IDD3PJ2DBF3==';
           RNStorage.isShow = true;
           RNStorage.userInfo = { name:'rufeng', age:30};
        },
        (data)=>{//持久化数据变更回调
            console.log(JSON.stringify(data));
        });
     ```
    
   * 支持可配置的Http请求框架
   
     * 一切基于配置（配置可选，自由设定）
     
      ```jsx 
      import {RFHttpConfig} from 'react-native-fast-app';
      
      RFHttpConfig.initHttpLogOn(true) // 是否打印Http请求日志
                  .initBaseUrl(ApiCredit.baseUrl) // 默认的BaseUrl
                  .initContentType(RFApiConst.CONTENT_TYPE_URLENCODED)
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
        import {RFHttp} from 'react-native-fast-app';
     
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
        RFHttp().url(url)
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
         import {RFHttp} from 'react-native-fast-app';
      
         const url = 'https://www.baidu.com';
        
         * 同步请求
         const response = await RFHttp().url(url).execute('GET');
         const {success, json, message, status} = response;
         
         if(success){
            this.setState({content: JSON.stringify(json)})
         } else {
            showToast(message)
         }
         
         * 异步请求
         RFHttp().url(url).get((success, json, message, status)=>{
             if (success){
                this.setState({content: JSON.stringify(json)});
             } else {
                showToast(msg);
             }
         });
                 
         * 异步请求
         RFHttp().url(url).execute('GET')
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
        RFImage
        RFText
        RFView
        RFlatList
        
        RFImage 非全路径在线图片则依赖图片资源BaseUrl的设置
        
        可在使用前如下配置：
        
        RFWidget
        .initResource(Assets)
        .initReferenceScreen(375, 677); // UI 整体尺寸缩放参考屏幕尺寸
     ```
    
 
  详细使用方法请参考 [示例](https://github.com/chende008/react-native-fast-app-sample)
