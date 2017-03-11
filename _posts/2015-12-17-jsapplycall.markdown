---
layout: post
title :  "JS中this/applay/call用法"
date  :   2015-12-17 10:51:35
img   : "../../../../../assets/images/aa20151217.jpg"
author: "WP"
intro : "this指的是调用当前函数的对象，如果你想改变这个调用当前函数的对象，就用call，apply。而call，apply区别在于两者调用参数不一样。这篇文章会列举一些例子详细说明具体什么意思..."
tag: js
---

> 关于this

this是指调用当前函数的对象。

	var test = “tony”
	function doSomething(){
		alert(this.test);    // “Tony”
		alert(window.test); // “Tony”
	} 

`闭包`

`例子一`

	var name = “the window”;
	var object = {
		name:”My object”,
		doSomething:function(){
			return function(){
				return this.name
			}
		}
	}
	Alert(object.doSomething()());  // the window
	
`例子二`

	var name = “the window”;
	var object = {
		name:”My object”,
		doSomething:function(){
			var abc = this;
			return function(){
				return abc.name;
			}
		}
	}
	Alert(object.doSomething()())  // My object;
	
> Call

改变this所指的对象

`例子一`

	var test = “Tony”;
	var myobj = {
		test:”TOM”
	}
	function doSomething(){
		alert(this.test);
	}
	doSomething.call();   		// “Tony”
	doSomething.call(myobj);   // myobj.test 即”TOM”

`例子二`
	
	function doSomething(name, age){
		alert(this.test + “:” + name +age);
	}
	doSomething(“Tony”,23);     // Tony:Tony23
	doSomething.call(myobj,”Tony”,23);  // Tom:Tony23
	
> Apply

与Call相比它的调用参数的形式不一样。

	doSomething.apply(myobj,[“Tony”,23]);

	



	