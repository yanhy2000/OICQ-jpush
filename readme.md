# OICQ-JPush

>使用oicq机器人框架，通过极光推送平台，将qq接收到的群聊、私聊信息在无需qq客户端的情况下推送到设备上,只需将机器人框架挂在服务器、挂机宝等设备上，手机设备即可通过极光推送app接收到消息，可有效减少系统资源占用与耗电
>>注：需手动注册极光推送平台，目前仅测试了安卓，ios未测试

## 更新内容(v1.0)：
 - 初次更新，可能存在部分bug，欢迎反馈

## 运行环境：

 - node js 版本16以上
 - x86、32、arm、arm64等架构(node支持的架构均可运行本框架)
 - 空闲运行内存50mb以上(一般占用20-30mb)

## 安装方法：

 - clone项目并解压到本地
 - 安装node js环境
 - 终端/cmd输入`npm i`安装依赖
 - 使用编辑器打开`index.js`，根据下面配置文件修改方法自行修改文件并保存   
 - 输入`npm run bot`即可运行
 - 第一次运行需要手机扫码，后续会保存登陆信息
 - 运行结束请输入`stop`来结束进程

## 配置文件详解

#### bot推送配置

 - account = 114514;   bot默认扫码登陆，输入要登陆的qq号码即可;
 - base64_auth_string = "";    生成规则：appKey 加上英文冒号，加上 masterSecret 拼装起来的字符串，再做 base64 转换 (appkey:masterSecret) base64转换工具(https://1024tools.com/base64) 
 - alias = ["yanhy"];    设备别名，需要去app设置

#### 群推送规则(仅适用于群聊，私聊全部推送)

 - whitelist = [123456];    群白名单，白名单内的群聊消息才转发推送,白名单为空默认为全部推送
 - blacklist = [123456];    如果使用小号挂机器人，此处填写大号，防止自己的发言推送刷屏；同时也可以当屏蔽其他人用；为空则全部推送

#### 机器人内部配置

 - log_level: "debug",    日志等级，默认info，太多日志会卡顿（"trace" | "debug" | "info" | "warn" | "error" | "fatal" | "mark" | "off"）
 - platform: 2,    2：使用安卓pad协议 (1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad)
 - ignore_self: true,    忽略机器人自己的信息
 - resend: true,    忘了，反正开着就对了，和风控有关
 - brief: true    被风控时尝试分片发送

## 极光推送对接方法

- 1、前往极光官网(https://www.jiguang.cn/) 注册账号
- 2、注册后登陆，点右上角账号中的“服务中心”，跳转后点击“开发者平台”进入
- 3、进入平台后，创建一个应用，填写名字选择分类
- 4、勾选“消息推送”服务，点击下一步
- 5、填写应用包名（详情可网上查询），推送通道无需修改，点击下一步
- 6、点击中间的“下载推送demo，免集成体验移动端接收消息”，将生成好的app下载到安卓手机上，并使用底部的测试框看看是否可以接收到信息（需要授权app通知权限）
- 7、重新进入“开发者平台”，点击“应用管理”，找到刚刚创建的应用，选择“应用设置”，找到应用信息内的“AppKey”与“Master Secret”的值
- 8、打开base64加密工具网站，复制“AppKey”与“Master Secret”的值到工具编辑框，中间用英文冒号连接，填写格式：AppKey:Master Secret ，点击编码(utf8)
- 9、将生成的编码复制到上述的机器人框架配置文件内的`base64_auth_string`即可
- 10、打开app，点高级功能，设置“设备别名”为自己想要的，然后填充到上述配置文件内设备别名处
- 11、给予app自启动、后台运行、全部通知的权限，并在最近任务内锁住，设置好并打开机器人框架，即可接收来自服务器的信息

*该项目全开源*
