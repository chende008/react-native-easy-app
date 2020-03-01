## react-native-fast-app （RN 项目快速开发基础库）

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
            token: undefined, // 自定义属性
        };
     ```
     
     ```jsx 
        RFStorage.initStorage(RNStorage, 
        () => {// 初始化完成回调
           //从此以后就可以同步访问RNStorage中的变量了
        },
        (data)=>{//持久化数据变更回调
            console.log(JSON.stringify(data));
        }, '1.0');
     ```
    
   * 支持可配置的Http请求框架
   
     * 一切基于配置（配置可选，自由设定）
     
      ```jsx 
      
      RFHttpConfig.initHttpLogOn(true) // 是否打印Http请求日志
                  .initBaseUrl(ApiCredit.baseUrl) // 默认的BaseUrl
                  .initContentType(RFApiConst.CONTENT_TYPE_URLENCODED)
                  .initHeaderSetFunc((headers, request) => {
                     // 在这里设置公共header参数
                  })
                  .initParamSetFunc((params, request) => {
                     // 在这里设置公共params参数
                  }).initParseDataFunc((result, request, callback) => {
                     // 指定当前app的特定数据解析方式
              });
      ```
     
     * 发送请求模板
     
     ```jsx 
        let url = 'v1/account/login/';
        let param = {phone: '18600000000', authCode: '123456'};
        let header = {Authorization: "Basic Y3Rlcm1pbmF......HcVp0WGtI"};
        let callback = () => (success, jData, message, status) => {//请求结果回调
             if (success) {
                showToast(JSON.stringify(jData))
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
        * 同步请求
        const response = await RFHttp().url('http://www.baidu.com').execute('GET');
        const {success, jData, message, status} = response;
        
        if (success){
           this.setState({content: JSON.stringify(jData)})
        } else {
           showToast(message)
        }
        
        * 异步请求
        RFHttp().url('http://www.baidu.com').get((success, jData, message, status)=>{
            if(success){
               this.setState({content: JSON.stringify(jData)});
            } else {
               showToast(msg);
            }
        });
                
        * 异步请求
        RFHttp().url('http://www.baidu.com').execute('GET')
        .then(({success, jData, message, status}) => {
            if (success) {
                 this.setState({content: JSON.stringify(jData)});
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
        RFTouch
        RFlatList
        
        RFImage 非全路径在线图片则依赖图片资源BaseUrl的设置
        
        可在使用前如下配置：
        RFLibrary.initResource(baseImageUrl);
     ```
    
 
  详细使用方法请参考 [example](https://github.com/chende008/react-native-fast-app/tree/master/example)
