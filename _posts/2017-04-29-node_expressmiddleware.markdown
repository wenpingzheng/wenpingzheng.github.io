---
layout: post
title :  Express中间件
date  :   2017-04-29 7:11:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "Express中间件理解"
tag : node
---

> Express官网有句话说：一个Express应用就是在调用各种中间件。可见中间件在web应用开发中的重要性，那中间件到底怎么理解？怎么用？这文章说的就这个，呵呵！！

Express是一个基于Node.js平台的web应用开发框架，在Node.js基础之上扩展了web应用开发所需要的基础功能，从而使得我们开发Web应用更加方便、更加快捷。

举一个例子：

**用node.js实现一个控制台打印“hello server”**


	var http = require('http');
	var server = http.createServer(function(req,res){
		console.log("hello server");
	});
	server.listen(3000);


这样子的话，当我们需要处理各种请求（主要指GET、POST）时，我们需要将所有请求类型处理的代码写在createServer包裹的函数里。

**用Express实现一个控制台打印“hello server”**

	var express = require('express');
	var app = express();
	http.createServer(app);
	
	// 处理用户请求（路由）
	app.get("/",function(){
		console.log("hello server");
	})

Express处理各种请求是通过Express执行函数去调用对应的方法，这样是不是更加方便和快捷了。

Express的API文档完整易懂，2010-01-03陆续发布了几个版本，其中第三版和第四版差异比较大， 主要体现在第三版的中间件基本上都是继承了connect框架的，而第四版将中间件独立出来了，不在依赖connect框架。

说到中间件，官网对它的阐述是这样的：

![MacDown logo](../../../assets/results/20170429/1.png)

由此可见，中间件在Express开发中的重要性，因此这里我们就专门来总结一下中间件。

## 一、中间件结构

###1、app.use（[path]，function）

**path：**是路由的url，默认参数‘/’，意义是路由到这个路径时使用这个中间件

**function：**中间件函数

这个中间件函数可以理解为就是function(request,response,next)

### 2、安装

这里安装是指涉及到第三方中间件的使用时，需要先安装好，然后在使用。

## 二、中间件分类

### 1、内置中间件

![MacDown logo](../../../assets/results/20170429/2.png)

上面这句话是Express官网所描述的原话，没错，`express.static`是Express目前唯一内置的一个中间件。用来处理静态资源文件。

什么意思了？ 来run一下代码看看

	// index.js
	var express = require('express');
	var app = express();
	
	app.use(express.static(__dirname + '/public'));

启动服务： node index.js

浏览器中访问：http://localhost:1234/  展示的/public/index.html内容

浏览器中访问：http://localhost:1234/hello.html  展示的/public/hello.html
内容

### 2、自定义中间件

在上面中间件结构中，我们知道了，中间件使用时的第二个参数是一个Function，然而，要自定义一个中间件，就是倒腾一番这个Function。

这个function总共有三个参数（req，res，next）；

当每个请求到达服务器时，nodejs会为请求创建一个请求对象（request），该请求对象包含客户端提交上来的数据。同时也会创建一个响应对象（response），响应对象主要负责将服务器的数据响应到客户端。而最后一个参数next是一个方法，因为一个应用中可以使用多个中间件，而要想运行下一个中间件，那么上一个中间件必须运行next()。

好了，有了一个大概的了解，下面我定义一些中间件来实现一个路由功能。


	var express = require('express');
	var app = express();
	
	app.use(function(request,response,next){
		if(request.url === '/'){
			response.writeHead(200,{"Content-Type":"text/plain"});
			response.end("This is home\n");
		} else {
			next();
		}
	})
	app.use(function(request,response,next){
		if(request.url === '/about'){
			response.writeHead(200,{"Content-Type":"text/plain"});
			response.end("This is about\n");
		} else {
			next();
		}
	})
	app.use(function(request,response,next){
		response.writeHead(404,{"Content-Type":"text/plain"});
		response.end("404 not found!\n");
	})
	app.listen(1234,'localhost');

浏览器中访问：http://localhost:1234/  展示This is home

浏览器中访问：http://localhost:1234/about  展示This is about

这样看是不是使用中间件很轻松就实现了路由的功能，当然，有关Express的路由可以专门拿出来写写，哈哈。

### 3、第三方中间件

有关第三方中间件，这里我们分析几个比较重要和常用的，知道这几个的使用，其它的也就会了。

**body-parser ：**解析body中的数据，并将其保存为Request对象的body属性。

**cookie-parser ：**解析客户端cookie中的数据，并将其保存为Request对象的
cookie属性

**express-session ： **解析服务端生成的sessionid对应的session数据，并将其保存为Request对象的session属性

**query：**这个中间件将一个查询字符串从URL转换为JS对象，并将其保存为Request对象的query属性。这个中间件在第四个版本中已经内置了无需安装。

下面来一个例子，功能是：用户可否登录和在服务端保存登录态。

	var express = require('express');
	// 引入模板引擎
	var hbs = require('express-handlebars');
	var bodyParser = require('body-parser');
	var session = require('express-session');
	
	var app = express();
	
	// hbs是一个模板引擎
	app.engine('hbs',hbs());
	app.set('view engine','hbs');
	app.set('views','templates');
	
	// 数据库读出来的数据
	var userArr = ['wpzheng'];
	
	app.use(session({secret:'maizidu'}));
	app.use(bodyParser.urlencoded({extended:true}));
	
	app.get('/', function(request,response,next){
		var username = request.session.username;
		if(username){
			response.send("hello" + username);
		}else{
			response.render('form');
		}
	});
	
	app.post('/', function(request,response){
			if(userArr.indexOf(request.body.username)>=0){
				request.session.username = request.body.username;
			}else{
				request.session.destroy();
			}
	                // response对象的一个方法 重定向作用
			response.redirect('/');
	});
	app.listen(1234,'localhost');

如果session没有保存数据（测试时可以将服务关闭，session就没有值了，每次向服务器发送请求时，服务会创建一个新的session），就会自动跳到登录页面。当已登录过（也就是说有session值），就直接显示username。

这个例子涉及到模板（hbs）和response的方法（redirect）可以先不管。

## 三、中间件理解

写到最后了，回到最开始的问题，你是否理解了什么是Express中间件？

结合上面讲解时给出的例子，我们先来分析一下从浏览器地址栏输入url到客户端显示数据之间这个过程到底发生了什么。

![MacDown logo](../../../assets/results/20170429/3.png)

浏览器向服务器发送一个请求后，服务器直接通过request.定位属性的方式得到通过request携带过去的数据（有用户输入的数据和浏览器本身的数据信息）。这中间就一定有一个函数将这些数据分类做了处理，已经处理好了，最后让request对象调用使用，对的，这个处理数据处理函数就是我们要说的`中间件`。由此可见，中间件可以总结以下几点：

1、封装了一些处理一个完整事件的功能函数。

2、非内置的中间件需要通过安装后，require到文件就可以运行。

3、封装了一些或许复杂但肯定是通用的功能。

以上所有代码下载：https://github.com/wenpingzheng/express-js.git

参考文献：

http://www.expressjs.com.cn/

http://www.zhengwenping.com/2017/04/15/node_express.html
 






