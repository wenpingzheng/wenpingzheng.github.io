---
layout: post
title :  "node语法-事件"
date  :   2017-03-21 11:37:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "事件使用细节"
tag : node
---


## 原理分析
	
	class EventEmitter {
	    // 构造函数
		constructor() {
			this._events = {
				/*
				'click':[
					function(){},
					function(){},
					function(){}
				]*/
			}
			/*
			for(var i=0;i<this._events.click.length;i++){
				this._events.click[i]();
			}*/
		}
		// 发出事件
		emit(type) {
			var funs = this._events[type];
			for(var i=0;funs && i<funs.length;i++) {
				// { '0': 'userAdded', '1': 'colin', '2': 'password' } length 3
				console.log(arguments);
				// 将一个有length属性的对象转成一个数组
				var arg = Array.prototype.slice.call(arguments);
				// [ 'userAdded', 'colin', 'password' ]
				console.log(arg); 
				funs[i].apply(this,(arg.slice(1)));
			}
		}
		// 移除监听
		removeListener(type) {
			delete this._events[type];
		}	
		// 添加监听
		addListener(type, fun) {
			this._events = this._events || {};
			if(!this._events[type]) {
				this._events[type] = [];
			}
			this._events[type].push(fun);
		}
		// 一次监听
		once(type, fun) {
			this.addListener(type, _onceWrap(this, type, fun));
		}
	}

	
	function _onceWrap(target, type, listener) {
		var fired = false;
		function g() {
			target.removeListener(type, g); // 绑定的函数去除
			if(!fired) {
				fired = true;
				listener.apply(target,arguments);
			}
		}
		return g;
	}

	// 完全一样on 可能是为了兼容老版本
	EventEmitter.prototype.on = EventEmitter.prototype.addListener; 
	EventEmitter.EventEmitter = EventEmitter;
	module.exports = exports = EventEmitter;


## 1、监听事件

	var events = require('./customEvent');
	var emitter = new events.EventEmitter();
	var username = "colin";
	var password = "password";
	emitter.addListener('userAdded', function(user, pwd) {
		console.log(user, pwd);
	})
	emitter.emit("userAdded", username, password);

## 2、一次监听事件

	emitter.once("foo", function(){
		console.log("in foo handerler");
	});
	emitter.emit("foo");
	emitter.emit("foo");
	emitter.emit("foo");

## 3、检测事件

	var events = require("events");
	var emitter = new events.EventEmitter();
	
	var f = function(){}
	emitter.on("newListener", function(eventName,listener) {
		console.log("" + eventName + "",listener === f);
	})
	emitter.on("foo",f); // foo true
	
	// 下面是第二个检测实例
	var events = require("events");
	var emitter = new events.EventEmitter();
	emitter.on("newListener", function(date) {
		console.log(date); 
	});
	// 时间
	emitter.emit("newListener", new Date); 
	// foo 
	emitter.on("foo", function(){});
	

## 4、继承事件

	var EventEmitter = require("./customEvent").EventEmitter;
	// 引入util来实现继承
	var util = require("util");
	function UserEventEmitter() {
		this.addUser = function(username, password) {
			this.emit("userAdded", username, password);
		};
	};
	
	// 继承 第一参数是子类 第二参数是父类
	util.inherits(UserEventEmitter, EventEmitter);
	
	// 使用
	var user = new UserEventEmitter();
	var username = "colin1";
	var password = "password";
	user.on("userAdded", function(username,password){
		console.log("Added user " + username);
	});
	//user.addUser(username,password);
	//user.emit("userAdded", username, password);
	
	// true; user是不是EventEmitter的实例
	console.log(user instanceof EventEmitter)
	
## 5、设置最大监听数

	emitter.setMaxListeners(2);
	emitter.on("aa", function(date){
		console.log("a");
	});
	emitter.on("aa", function(date){
		console.log("a");
	});
	emitter.on("aa",function(date){
	 	console.log("a");
	})

## 6、往前监听事件

	emitter.prependListener("aa", function(date){
		console.log('a');
	});
	emitter.prependListener("aa", function(date){
		console.log('b');
	});
	// 输出  b a
	emitter.emit('aa');











 





