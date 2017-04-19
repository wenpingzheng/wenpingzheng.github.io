---
layout: post
title :  "js跨域分析"
date  :   2017-04-19 07:13:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : js在不同的域之间进行数据传输或通信
tag : js
---

	// 目录
	1、jsonp跨域
	2、document.domain跨子域
	3、window.name跨域
	4、使用HTML5中新引进的window.postMessage方法来跨域传送数据
	
这里说的js跨域是指通过js在不同的域之间进行数据传输或通信。

比如用ajax向一个不同的域请求数据，或者通过js获取页面中不同域的框架中(iframe)的数据。

只要协议、域名、端口有任何一个不同，都被当作是不同的域。

下面相对于**http://store.company.com/dir/page.html**同源检测

==================================

http://news.company.com/dir/other.html         | 失败 | 主机名不同
http://store.company.com/dir2/other.html       | 成功 |
http://store.company.com/dir/inner/another.html| 成功 | 
https://store.company.com/secure.html          | 失败 | 协议不同
http://store.company.com:81/dir/etc.html       | 失败 | 端口不同

==================================

## 一、jsonp跨域

**通过JS文件引入**

> 前端得到的是一个函数执行，然后定义一个执行的返回函数，这个函数的参数就是jsonp数据。

`jsonp`为什么之所以能跨域是因为在js中，我们直接用XMLHttpRequest请求不同域上的数据时，是不可以的。但是，在页面上引入不同域上的js脚本文件却是可以的，jsonp正是利用这个特性来实现的。

>前端引入   

	
	<script>
	function dosomething(jsondata){
	    // 处理获得的JSON数据
	 }
	</script>      
	<script src="http://example.com/data.php?callback=dosomething"></script>

> 后台输出
    

	<?php
	$callback = $_GET['callback']; // 得到回调函数名
	$data = array('a','b','c'); //要返回的数据
	echo $callback.'('.json_encode($data).')'; // 输出
	?>

> 页面输出的结果
    

	dosomething(['a','b','c'])

**动态生成script标签**

知道jsonp跨域的原理后我们就可以用js动态生成script标签来进行跨域操作了，而不用特意的手动的书写那些script标签。如果你的页面使用jquery，那么通过它封装的方法就能很方便的来进行jsonp操作了。

	<script>
	$.getJSON('http://example.com/data.php?callback=?‘，function(jsondata){
	    // 处理获得的JSON数据
	 })
	</script>

或者：

	var loginScript = document.createElement ("script");
	loginScript.charset="utf-8";
	loginScript.src = “”;
	document.getElementsByTagName('head')[0].appendChild(loginScript);


$.getJSON方法会自动判断是否跨域，不跨域的话，就调用普通的ajax方法；跨域的话，则会以异步加载js文件的形式来调用jsonp的回调函数。

## 二、修改document.domain来跨子域

浏览器都有一个同源策略，其限制之一就是第一种方法中我们说的不能通过ajax的方法去请求不同源中的文档。 它的第二个限制是浏览器中不同域的框架之间是不能进行js的交互操作的。

**document.domain设置成自身或更高一级的父域**

**`document.domain`方法适用于不同子域的框架间的交互。**

不过如果你想在`http://www.example.com/a.html` 页面中通过ajax直接请求`http://example.com/b.html` 页面，即使你设置了相同的document.domain也还是不行的，所以修改document.domain的方法只适用于不同子域的框架间的交互。

**如果你想通过`ajax`的方法去与不同子域的页面交互**，除了使用jsonp的方法外，还可以用一个隐藏的iframe来做一个代理。原理就是让这个iframe载入一个与你想要通过ajax获取数据的目标页面处在相同的域的页面，所以这个iframe中的页面是可以正常使用ajax去获取你要的数据的，然后就是通过我们刚刚讲得修改document.domain的方法，让我们能通过js完全控制这个iframe，这样我们就可以让iframe去发送ajax请求，然后收到的数据我们也可以获得了。

例子：

	// http://git.qq.com/2015aymain/src/test.html
	<head>
	    <title>泰坦数据报告</title>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	    <script src="//mat1.gtimg.com/joke/tait/jquery-2.1.4.min.js"></script>
	    <script>
	        // 设置成主域
	        document.domain = 'qq.com';
	        function onLoad() {
	            var iframe = document.getElementById('iframe');
	            console.log(iframe.contentWindow);
	            console.log(iframe.contentWindow.document.getElementById('h2').innerText);
	            console.log($(iframe.contentWindow.document.body)['context']);
	        }
	    </script>
	</head>
	<body>
	<iframe src="http://joke.qq.com/zwptopic2017323.htm" onload="onLoad()" frameborder="0" id="iframe"></iframe>
	<div class="container">
	</div>
	</body>
	
	//  http://joke.qq.com/zwptopic2017323.htm 
	<h2 id="h2">这些都是测试数据</h2>
	<script>
	// 设置主域
	document.domain = 'qq.com'
	</script>


## 三、window.name跨域

window对象有个name属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name的，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。

**A页面获得B页面window.name数据**

在A.html页面中使用一个隐藏的iframe来充当一个中间人角色，由iframe去获取B.html的数据，然后A.html再去得到iframe获取到的数据。


	<script>
	function getData() {
	    var iframe = document.getElementById('proxy');
	    iframe.onload = function(){
	        var data = iframe.contentWindow.name
	        alert(data);
	    }
	    iframe.src='b.html' // 随便一个页面，只要与a.html同源就行 目录是让A能访问到iframe里的东西 /about:blank也行
	}
	</script>
	<iframe src="B.html" id="proxy" style="display:none" onload="getData()"></iframe>


## 四、使用HTML5中新引进的window.postMessage方法来跨域传送数据

window.postMessage(message,targetOrigin) 方法是html5新引进的特性，可以使用它来向其它的window对象发送消息，无论这个window对象是属于同源或不同源，目前IE8+、FireFox、Chrome、Opera等浏览器都已经支持window.postMessage方法。


	// http://test.com/a.html
	<script>
	function onLoad() {
	    var iframe = document.getElementById('iframe');
	    var win = iframe.contentWindow;
	    win.postMessage('哈哈，我是来自页面A的消息');
	}
	</script>
	<iframe id="iframe" src="http://www.test.com/b.html" onload="onLoad()"></iframe>
	
	// http://www.test.com/b.html
	window.onmessage = function(e) {
	    e = e || event;
	    alert(e.data)
	}

## 五、总结

除了以上几种方法外，还有flash、在服务器上设置代理页面等跨域方式






 





