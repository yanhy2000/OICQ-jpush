"use strict"
var readline = require('readline')
var https = require("https");



//————————————————————————————bot推送配置————————————————————————————
const account = 114514;
const base64_auth_string = "";
const alias = ["yanhy"];
//群推送规则(仅适用于群聊，私聊则全部推送)
const whitelist = [123456];
const blacklist = [123456];

//机器人内部配置
const conf = {
	log_level: "info",
	platform: 2,
	ignore_self: true,
	resend: true,
	brief: true
}







const bot = require("oicq").createClient(account,conf)
//————————————————————————————机器人登陆—————————————————————————
bot.on("system.login.qrcode", function (e) {
//登陆部分，使用扫码登陆（可自动保存登陆信息供多次登陆）
	this.logger.mark("扫码后按Enter完成登录") 
	process.stdin.once("data", () => {
		this.login()
	})
})
.on("system.login.error", function (e) {
	if (e.code < 0)
		this.login()
})
.login()
//密码登陆，password替换成密码即可，有需要请手动处理callback
// bot.login(password);

//————————————————————————————功能项————————————————————————————
function httppost(str,callback)
{
    let data = JSON.stringify(str)
    // console.log(data)
	const options = {
		hostname: "api.jpush.cn",
        path: "/v3/push",
        port: 443,
		method: 'POST',
		headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic "+base64_auth_string
		}
	}
	const req = https.request(options, res => {
		let html = "";
		res.on('data', d => {
			html+=d;
		});
		res.on("end",()=>{
			if(callback){
				callback(html);
			}
		})
	})
	req.on('error', error => {
		callback(error)
	});
	req.write(data);
	req.end();
}

function push(title,content,image,callback){
	let str = {
    "platform": "android",
    "audience": {
      "alias": alias
    },
    "notification": {
        "alert": content,
        "android": {
            "priority":2,//通知栏展示优先级
            "alert_type":7,//通知提醒方式
            "title":title,
            "intent":{//点击通知打开安卓qq客户端
                "url":"intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;launchFlags=0x10000000;component=com.tencent.mobileqq/.activity.SplashActivity;end"
            },
			"large_icon": image
        }
      }
	};
	httppost(str,(e)=>{
		callback(e);
	});
}

//————————————————————————————事件接收——————————————————————————
//群聊
bot.on("message.group", function (e) {
    // console.log(e)
	let title = e.group_name;
	let content = "";
	if(e.sender.card!="")//判断有没有群名片
	{
		content = e.sender.card+":"+e.raw_message;
	}else{
		content = e.sender.nickname+":"+e.raw_message;
	}
	let t = e.group.getAvatarUrl(100)+".jpg";
	let image = t.toString();
	bot.logger.debug(image)
	if(blacklist.indexOf(e.sender.user_id) != -1)//筛选屏蔽名单
	{
		bot.logger.debug("账号 "+e.sender.user_id+" 已屏蔽转发");
	}else{
		if(whitelist.indexOf(e.group_id) != -1)//筛选白名单群聊
		{
			push(title,content,image,e=>{
				bot.logger.debug(e);//debug输出
			});
		}else if(whitelist.length == 0){
			push(title,content,image,e=>{
				bot.logger.debug(e);//debug输出
			});
		}
	}
    // if(e.raw_message == "test"){
    //     e.reply("reply测试!");
    // }  
})
//私聊
bot.on("message.private",e=>{
	// console.log(e)
	let title = e.sender.nickname;
	let content = e.raw_message;
	let t = e.friend.getAvatarUrl(100)+".jpg";
	let image = t.toString();
	bot.logger.debug(image)
	push(title,content,image,e=>{
		bot.logger.debug(e);//debug输出
	});
    // if(e.raw_message == "test"){
    //     e.reply("reply测试!");
    // } 
})

//————————————————————————————控制台指令————————————————————————————
//已完成 ： stop
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.on('line', (str) => {
    if (str === 'stop') {
		bot.logger.mark("Bot即将退出...");
		bot.logout();//下线
		setTimeout(function(){process.exit(0)},1000);//退出进程
    }
})
