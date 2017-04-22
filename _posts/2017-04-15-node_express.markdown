---
layout: post
title :  Express的基础语法
date  :   2017-04-15 10:11:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "express的基础语法"
tag : node
---


	// 目录
	一、中间件
	二、路由
	三、request
	四、response
	五、templates
	六、stylus、sass、less
	七、session、form

## 介绍

> express特点

**性能好：**（express不对nodejs已有的特性进行二次抽象，只是在它基础之上扩展了web应用所需的基础功能）nodejs对文件、字符串、流等操作都封装了一套API，express不是在这些API基础之上进一步封装。它只是对nodejs的http模块进行了一个扩展，使得nodejs开发web应用更加方便，更加快捷。所以说它不会影响nodejs性能，只是方便我们开发web应用而已。
	**功能多：**（丰富的HTTP快捷方法（方便处理各种请求）和好多任意排列组合的connect中间件）
**简单易学习：**（API文档完整易懂，网上案例也比较多）

> 历史

2010-01-03陆续发布了四个版本，3和4版变化比较大，3版的中间件基本上都有connect框架的，第4版不在依赖connect。

> 学习网站

http://www.expressjs.com.cn> helloworld例子

	var express = require('express');	var app = express();	http.createServer(app);	// 处理用户请求（路由）	app.get("/demo",function(){		console.log("hello world");		res.send("hello browser");		res.end();	})
	 	// 监听3000端口	app.listen(3000);	/*	var server = http.createServer(function(req,res){		console.log("hello server");	});	server.listen(3000);	*/

## 一、中间件

> app.use([path],function)

**说明：**

	1、path 默认参数 ‘/’
	2、function 中间件函数
	== function(request,response,next)
	可以有无数多个(若想让下一个中间件运行，上一个中间件必须使用next())
		
**运行(安装express)：**

先定义好package.json

npm install

<span class="error">中间件分为默认、自定义、第三方</span>

**代码：**
	
	// 默认 自定义
	var express = require('express');
	var app = express();
	
	// 中间件 分两部分来讲path function
	// app.use(express.static(__dirname + '/public'));
	// app.use('/static',express.static(__dirname + '/public'))
	
	// 默认路径情况下 倒腾FUN
	app.use(function(request,response,next){
		console.log("Incoming Request" + request.method + 'to' + request.url);
		if(request.url === '/'){
			response.writeHead(200,{"Content-Type":"text/plain"});
			response.end("This is home!\n");
		} else {
			next();
		}
	})
	app.use(function(request,response,next){
		if(request.url === '/about'){
			response.writeHead(200,{"Content-Type":"text/plain"});
			response.end("This is maizi.edu!\n");
		} else {
			next();
		}
	})
	app.use(function(request,response,next){
		response.writeHead(404,{"Content-Type":"text/plain"});
		response.end("404 not found!\n");
	})
	app.listen(1234,'localhost');

> 第三方提供的中间件
	http://blog.fens.me/nodejs-connect/	// 控制台打印日志处理中间件	app.use(express.logger());	// post方式提交时请求数据解析	app.use(express.bodyParser());	console.log(req.body); // {name:'xiaoming',pwd:'1234'}	// 解析get方式提交的数据	app.use(express.query());	// cookie解析	app.use(express.cookieParser());	// 启用session管理用户状态 用户数据一般保存在服务器端 每个用户有一个session	// 不同的cookie对应不同的session，所以一般先解析cookie	app.use(express.session({		secret:'keyboard cat',		key:'sid', // cookie的名称		cookie:{secure:true}	}))	// 网站图标处理中间件	app.use(express.favicon('图标地址'))	注意：	第4版中间件使用	var bodyParser = require('body-parser');	app.use(bodyParser.urlencoded({extended:true}));	app.use(bodyParser.json());
	
static是express自带的唯一一个中间件；解析所有静态文件。

比如 访问 

`http://localhost:1234/index.html`

`http://localhost:1234/hello.html`

index.html和hello.html都放在public目录下

## 二、路由

> app.verb(path,[callback...],callback)

**说明**

	verb:*get,*post,put,delete
	path:String or Regex
	callback:*next() *next('router')
	
> app.param([name],callback)

**代码**

	var express = require('express');
	var app = express();
	
	// 有关next('route')
	app.get('/',function(request,response,next){
		console.log(1);
		next(); // 1 2 3 4
		// next('route'); // 1 3 4 跳出这个路由执行下一个路由
	}, function(request,response,next){
		console.log(2);
		next('route');
	});
	
	app.get('/',function(request,response,next){
		console.log(3);
		next();
	}, function(request,response,next){
		console.log(4);
		response.send('hello world\n');
	});
	
	// 正则匹配
	app.get(/^\/mobile\/1\d{10}$/,function(request,response,next){
		console.log(5);
		response.send('This is a mobile phone number');
	})
	// /mobile/18803043332
	
	
	
	function checkValidation() {
		// checking
		return [];
	}
	
	
	app.param('listname',function(request,response,next,listname){
		console.log('params');
		console.log(listname); 
		// do some checking
		request.list = ['item0','item1','item2'];
		next();
	});
	
	app.get('/list/:listname',function(request,response,next){
		console.log(6);
		/*
		var listname = request.params.listname;
		response.send('This is' + listname);
		*/
		response.send('list:\n' + request.list.join(''));
		// list: item0item1item2
	})
	
	app.get('/list/:listname/:id',function(request,response,next){
		console.log(7);
		var listname = request.params.listname,
		id = request.params.id;
	
		response.send(request.list[id]); // item2
	})
	
	app.listen(1234,'localhost');
	
**其它**
	
1、app.all('')：能处理任意任意请求类型 
2、一个路径处理多个请求方式
	app.route("/parma")      .get(function(req,res,next){      		req.user = req.query;          next();       })      .post(function(req,res,next){      		req.user = req.query;          next();       })       .all(function(req,res,next){      		req.send(req.user);          res.end();       }) 

## 三、request

> 当每个请求到达服务器时，nodejs会为请求创建一个请求对象（request）,该对象包含客户端提交上来的数据，包括请求头（请求主机地址，请求方式，客户浏览器的一些信息），消息体（主要是用户提交上来的数据）

	1、req.params
	2、req.query
	3、req.body
	4、req.files
	5、req.param()
		params - body - query
	6、req.cookies
	7、req.header === req.get获取当中的值
	
> package.json加入两个中间件body-parser，cookie-parser 运行`npm i`
	
**req.query**

url?后面带的参数获取（GET）

**req.body**

需要引入中间件来解析所有数据（POST）

**req.cookie**

需要引入中间件来解析所有数据	

	var express = require('express');
	var app = express();
	
	
	// req.query
	// 访问http://localhost:1234/?time=10:1&date=10/1&id=123456
	app.get('/',function(request,response,next){
		// {"time":"10:1","date":"10/1","id":"123456"}
		console.log(JSON.stringify(request.query));
		// 123456
		console.log(request.query.id);
	});
	
	
	// req.body
	
	var bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({extended:true}));
	// json
	// urlencoded
	app.post('/test',function(request,response,next){
		console.log(request.body);
	})
	
	
	
	// req.cookie
	
	var cookieParser = require('cookie-parser');
	app.use(cookieParser());
	app.get('/test',function(request,response,next){
		console.log(request.cookies);
	})
	
	
	
	app.listen(1234,'localhost');


## 四、response

> 客户在每次请求到达服务器的时候，都会创建一个请求对象（request）和一个响应对象（response）,而响应对象主要负责将服务器的数据响应客户端（浏览器），这些数据包含（响应头，消息体），响应头里面主要包含浏览器解析数据需要的一些参数用户不可见，而消息体包含用户数据。

	1、res.render
	2、res.locals
	3、res.set
	4、res.send([body|status],[body])
	5、res.json([status|body],[body]);
	6、res.redirect
	
**res.render**

这里介绍一个模板系统叫handlebars，这个较简单容易学，相对来说，Jade语法不太直观。

	var express = require('express');
	// 引入模板引擎
	var hbs = require('express-handlebars');
	var app = express();
	
	// 告诉app引入的hbs是一个模板引擎
	app.engine('hbs',hbs());
	app.set('view engine','hbs');
	
	
	
	app.get('/test',function(request,response,next){
		response.render('render');
	});
	
	app.listen(1234,'localhost');

**res.locals**

`response.locals`的值会默认会传入到render中去。

	app.get('/test', function(request,response,next){
		response.locals = {
			name:'maizi'
		};
		next();
	},function(request,response,next){
		response.render('render'); // 在模板里面就可以使用{{name}}
		// 也可以这样传数据
		// response.render('render',{name:'maizi'}); 
	})
	
**res.set**

response.header参数设置

	app.get('/test', function(request,response,next){
		response.locals = {
			name:'maizi'
		};
		next();
	},function(request,response,next){
		response.set('Content-type','text/html');
		response.render('render'); // 在模板里面就可以使用{{name}}
	})

**res.send**

	app.get('/send',function(request,response,next){
		response.send(200,'Found')
		// response.status(200).send('<p>hello world</p>');
	})
	
**res.json**
	
	app.get('/json',function(request,response,next){
		response.status(200).send({
			name: 'maizi',
			domin:'maizi.edu',
			username:'changeran',
			password:'xxxx'
		})
	})

**res.redirect**

	app.get('/redirect',function(request,response,next){
		//response.redirect('/json');
		response.redirect('https://www.google.com');
	})

## 五、templates

	1、app.set('view engine', xxx); // 指定模板后缀名
	2、app.engine('',xxx);     // 注册引擎
	3、app.set('views',path); // 视图模板位置
	4、response.render();
	
**express默认支持`ejs`,`jade`,也就是说使用这两个模板不需要注册引擎，只需要在package.json安装好了就行（nodepackage）**

**同时，express文件中可以使用多个模板引擎**

	var express = require('express');
	// 引入模板引擎
	var hbs = require('express-handlebars');
	
	var app = express();
	
	// 告诉app引入的hbs是一个模板引擎（注册）
	app.engine('hbs',hbs());
	app.set('view engine','hbs');
	
	// 指定模板文件目录
	app.set("views",'template');
	
	app.get('/test', function(request,response,next){
		response.render('render');
	})
	
	// 如果没有指定 express 会默认到当前目录下views目录下找index文件名
	app.get('/jade',function(request,response,next){
		response.render('index.jade');
	})
	
	app.listen(1234,'localhost');

## 六、stylus、sass、less

**package.json**
	
	{
		"name": "hello-world",
		"description":"xxx",
		"version":"0.0.1",
		"dependencies":{
			"express":"4.x",
			"stylus":"*",
			"less-middleware":"*",
			"node-sass-middleware":"*"
		}
	}

**index.js代码**

	var express = require('express');
	// 引入模板引擎
	var app = express();
	
	// css 中间件引入
	//var stylus = require('stylus');
	//var less = require('less-middleware');
	var sass = require('node-sass-middleware');
	
	
	app.use(express.static(__dirname + '/public'));
	
	// stylus 中间件的使用
	// app.use(stylus.middleware(__dirname + '/public'));
	
	// less 中间件的使用
	// app.use(less(__dirname + '/public'));
	
	// sass 中间件的使用
	app.use(sass(__dirname + '/public'));
	
	app.listen(1234,'localhost');
	
## 七、session、form

	**session**
	
	
	// package.json
	{
		"name": "hello-world",
		"description":"xxx",
		"version":"0.0.1",
		"dependencies":{
			"express":"4.x",
			"express-handlebars":"*",
			"express-session":"*"
		}
	}

> http://localhost:1234/list/1233

> http://localhost:1234/  ->输出1233	

	var express = require('express');
	// 引入模板引擎
	// var hbs = require('express-handlebars');
	var session = require('express-session');
	
	var app = express();
	
	// 告诉app引入的hbs是一个模板引擎
	// app.engine('hbs',hbs());
	// app.set('view engine','hbs');
	
	app.use(session({secret:'maizidu'}));
	
	
	app.get('/', function(request,response,next){
		console.log(request.session);
		/*
			Session {
			  cookie: 
			    { path: '/',
			     _expires: null,
			     originalMaxAge: null,
			     httpOnly: true 
			    },
			    userId: 'favicon.ico' 
			}
		*/
		var id = request.session.userId;
		// user id is 222222
		response.send('user id is '+ id);
	});
	
	
	app.get('/list/:id', function(request,response,next){
		var id = request.params.id;
		request.session.userId = id;
		console.log(request.session);
		response.send('hello world\n');
	});
	
	app.listen(1234,'localhost');

> 当从新启动服务后，在访问，数据就会丢失，这个时候我们就需要一个数据库或者sessionstory来保存这个数据（redis）

**form**

	// package.json
	{
		"name": "hello-world",
		"description":"xxx",
		"version":"0.0.1",
		"dependencies":{
			"express":"4.x",
			"express-handlebars":"*",
			"express-session":"*",
			"body-parser":"*"
		}
	}
	
	// form.js
	var express = require('express');
	// 引入模板引擎
	var hbs = require('express-handlebars');
	var bodyParser = require('body-parser');
	var session = require('express-session');
	
	var app = express();
	
	// 告诉app引入的hbs是一个模板引擎
	app.engine('hbs',hbs());
	app.set('view engine','hbs');
	app.set('views','templates');
	
	// 数据库读出来的数据
	var userArr = ['changran','maizidu','wpzheng'];
	
	
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
			response.redirect('/');
	});
	
	app.listen(1234,'localhost');

**代码下载**

[expressjs](https://github.com/wenpingzheng/express-js)

[https://github.com/wenpingzheng/express-js]




	

	



