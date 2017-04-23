---
layout: post
title :  Express实例分析
date  :   2017-04-21 10:11:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "express实例分析"
tag : node
---

> 在这里，阐述一个express应用的一个完整实例是怎么实现的

实例的完整代码：https://github.com/wenpingzheng/express-login.git

一个星期前，对Express框架我也是一脸懵懂，希望通过这篇文章，让自己不管是在知识的深度还是广度上都有一个小的上升。

## package.json

整个实例，需要安装`express`,三个中间件（`express-session`,`body-parser`,`cookie-parser`）,模板`ejs`。
	
	{
		"name": "hello-world",
		"description":"xxx",
		"version":"0.0.1",
		"dependencies":{
			"express":"4.x",
			"express-session":"*",
			"body-parser":"*",
			"cookie-parser":"*",
			"ejs":"*"
		}
	}

## 详细讲一下主JS

主要js(`app.js`)需要通过自定义中间实现用户登录和状态保存（浏览器的cookie、服务器的session），通过中间件的方式实现评论页面内容的渲染。
	
	var http = require("http");
	var express = require("express");
	var cooKieParser = require("cookie-parser");
	var session = require("express-session");
	var bodyParser = require("body-parser");
	var fs = require("fs");
	var comment = require("./route/comment.js");
	
	// 得到app对象并启动服务 
	var app = express();
	http.createServer(app);
	
	// 设置服务器启动的端口号
	app.set("port",8080);
	
	// 指定视图目录
	app.set("views","./public/views");
	
	// 缓存视图
	app.set("view cache", true);
	
	// 设置视图引擎
	app.set("view engine","ejs");
	
	// 指定静态文件的目录
	app.use(express.static(__dirname+"/public"));
	
	// post方式提交数据解析
	app.use(bodyParser.urlencoded({extended:true}));
	
	// 解析cookie
	app.use(cooKieParser());
	
	// 将浏览器传过来的cookie保存在服务端的session中
	// 30分钟cookie失效，session也失效 
	// 若将cookie清空 需要重新登录 
	// 浏览器访问后 服务器都会生成一个sessionid 返回到浏览器端以cookie保存connect.sid
	// 测试 清除浏览器cookie在访问 浏览器保存一个connect.sid
	// 相当于将用户信息保存在服务端
	/*
	 若浏览器传cookie 就是对应的session 
	 没有传cookie 就是新的session
	 */
	
	
	
	app.use(session({
		secret:'my_login_demo',
		cookie:{secure:false,maxAge:30*60*1000}
	}))
	
	
	// 自定义中间件，用于判断用户是否登录和能否登录
	app.use(function(req,res,next){
		// 关闭浏览器失去session而cookie在maxAge时间内保存也免登录
		if(req.session.user){
			next();
		}else{
			var name = req.body.name;    // 获取用户名值noLogin
			var pwd = req.body.password;//获取密码值
			var noLogin = req.body.noLogin;// 获取是否选择免登陆值 
			var cookies = req.cookies;// 获取所有cookie
			if((name==="wpzheng" && pwd ==="1234") || (cookies.name === "wpzheng" && cookies.pwd ==="1234")) {
				// cookie 信息保留在客户端
				// 测试
				// 服务器重启  session丢失
				// 前端访问时，将cookie带到服务器
				// 这样就实现了7天内免登录
	
				// 当用客户端勾选免登陆
				if(noLogin == 'on'){
					res.cookie('name',name,{maxAge:2*7*24*60*60*1000});
					res.cookie('pwd',pwd,{maxAge:2*7*24*60*60*1000});
				}
				req.session.user = {name:name,pwd:pwd};
				next();
			}else{
				res.set("content-type","text/html");
				res.status(200).sendFile(__dirname+"/public/html/login.html");
			}
		}
	});
	
	
	/*
	app.post("/comment",function(req,res){
		console.log("======");
		res.set("content-type","text/plain;charset=utf-8");
		res.end("登录成功");
	});
	*/
	
	app.use("/comment",comment);
	
	
	app.listen(app.get("port"),function(){
		console.log("listen on" +app.get("port"));
	})













	
	