## react-native-fast-app （RN 项目快速开发基础库）

### Installation

npm install react-native-fast-app --save 

or yarn add react-native-fast-app


### 功能点

  * 支持快捷访问AsyncStorage
  * 支持可配置的Http请求框架
  * 灵活的基础控件(无感知多屏蔽适配)


### 用法 

   * 数据存储RFStorage
   
     * 实现一个可持久化的数据存储管理类
     
     ```jsx 
        export const RNStorage = {// RNStorage 自定义数据存储对象
            token: undefined, // 自定义属性
        };
     ```
     
     ```jsx 
        RFLibrary.init(RNStorage, () => {//初始化RNLibrary->Storage
            //从此以后就可以随意访问RNStorage中的变量了
        }, Assets, '1.0');
     ```
    
   * 支持可配置的Http请求框架
   
     * 一切基于配置（默认配置可选，自由设定）
     
      ```jsx 
        RFApi.default = {
           baseUrl: '', // 默认的BaseUrl
           timeout: false, // 设置支持的超时时长(ms)
           httpLogOn: true, // 是否打印Http请求日志
           contentType: ApiConst.CONTENT_TYPE_JSON,
           isConnected: MDCNative.networkConnected,
           headerSetFunc: (headers, request) => {
               //在这里设置公共header参数
           },
           paramSetFunc: (params, request) => {
               //在这里设置公共params参数
           },
           parseDataFunc: (result, request, callback) => {
               //指定当前app的特定数据解析方式
           }
        };
      ```
     
     * 发送请求模板
     
     ```jsx 
        let url = 'v1/account/login/';
        let param = {phone: '18600000000', authCode: '123456'};
        let header = {Authorization: "Basic Y3Rlcm1pbmF......HcVp0WGtI"};
        let callback = () => (success, jData, msg) => {//请求结果回调
             if (success) {
                showToast(JSON.stringify(jData))
             } else {
                showToast(msg)
             }
        };
     
        // 示例只为是为了展示有哪些参数可以设置，真正的请求通常不用设置这么多参数
        RFHttp().url(url)
            .param(param)
            .header(header)
            .internal()
            .rawData()
            .pureText()
            .timeout(10000)
            .extra({tag: 'xx'})
            .contentType('text/xml')
            .cacheEnable([true|false])
            .execute(method,callback)
            .resendRequest(data, callback)
            .loadingFunc((loading)=> showLoading('请求中，请稍候...', loading))
            .[formJson|formData|formEncoded]()
            .[get|post|put|patch|delete|options](callback);
     ```
     
     * 灵活的基础控件
     ```
        RFImage
        RFText
        RFView
        RFTouch
        RFlatList
        
        RFImage 非全路径在线图片则依赖图片资源BaseUrl的设置
        可在使用前如下配置：
        RFLibrary.init(null, null, baseImageUrl);
     ```
    
 
  详细使用方法请参考example中的示例
