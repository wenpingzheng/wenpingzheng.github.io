---
layout: post
title :  "JS的动画效果"
date  :   2015-12-07 11:35:35
img   : "../../../../../assets/images/aa20151207.jpg"
author: "WP"
intro : "从简单动画到完美运动框架的封装。对比原生JS写动画的实现和使用库实现同样效果的差异，从中可以学到：1、使用定时器实现简单动画。2、如何一步步封装库。3、培养编程的思想。"
tag: js
---

> 简单动画

简单动画讲的就是匀速运动。

`速度`

	<div id="div1">
		<span id="share">分享</span>
	</div>
	body{
		margin:0;
		padding:0;
	}
	#div1{
		width:200px;
		height:200px;
		background:red;
		position:relative;
		left:-200px;
		top:0;
	}
	#div1 span{
		width:20px;
		height:50px;
		background:blue;
		position:absolute;
		left:200px;
		top:75px;
		color:#fff;
	}
	window.onload = function(){
		var oDiv = document.getElementById('div1');
		oDiv.onmouseover = function(){
			startMove(0);
		}
		oDiv.onmouseout = function(){
			startMove(-200);
		}
	}
	var timer = null;
	function startMove(iTarget){
		clearInterval(timer);
		var oDiv = document.getElementById('div1');
		timer = setInterval(function(){
			var speed = 0;
			if(oDiv.offsetLeft > iTarget){
				speed = -10;
			}else{
				speed = 10;
			}
			if(oDiv.offsetLeft == iTarget){
				clearInterval(timer);
			}else{
				oDiv.style.left = oDiv.offsetLeft + speed + 'px';
			}
		},30);
	}
	
`透明度`

	<div id="div1"></div>
	body,div{
		margin:0;
		padding:0;
	}
	#div1{
		width:200px;
		height:200px;
		background:red;
		filter:alpha(opacity:30);
		opacity:0.3;
	}
	window.onload = function(){
		var oDiv = document.getElementById('div1');
		oDiv.onmouseover  = function(){
			startMove(100);
		}
		oDiv.onmouseout = function(){
			startMove(30);
		}
	}
	var timer = null;
	var alpha = 30;
	function startMove(iTarget){
		var oDiv = document.getElementById('div1');
		clearInterval(timer);
		timer = setInterval(function(){
			var speed = 0;
			if(alpha > iTarget){
				speed = -10;
			}else{
				speed = 10;
			}
			if(alpha == iTarget){
				clearInterval(timer);
			}else{
				alpha += speed;
				oDiv.style.filter = 'alpha(opacity:'+alpha+')';
				oDiv.style.opacity = alpha/100;
			}
		},30)
	}

> 缓冲动画

`由快到慢`

	body{
		margin:0;
		padding:0;
	}
	#div1{
		width:200px;
		height:200px;
		background:red;
		position:relative;
		left:-200px;
		top:0;
	}
	#div1 span{
		width:20px;
		height:50px;
		background:blue;
		position:absolute;
		left:200px;
		top:75px;
		color:#fff;
	}
	<div id="div1">
		<span id="share">分享</span>
	</div>
	window.onload = function(){
		var oDiv = document.getElementById('div1');
		oDiv.onmouseover = function(){
			startMove(0);
		}
		oDiv.onmouseout = function(){
			startMove(-200);
		}
	}
	var timer = null;
	function startMove(iTarget){
		clearInterval(timer);
		var oDiv = document.getElementById('div1');
		timer = setInterval(function(){
			var speed = (iTarget-oDiv.offsetLeft)/10;
			speed = speed>0?Math.ceil(speed):Math.floor(speed);
			if(oDiv.offsetLeft == iTarget){
				clearInterval(timer);
			}else{
				oDiv.style.left = oDiv.offsetLeft + speed + 'px';
			}
		},30);
	}

> 多物体动画

`多物体运动-宽度`

	<ul>
		<li></li>
		<li></li>
		<li></li>
	</ul>
	body,ul{
		padding:0;
		margin:0;
	}
	ul,li{
		list-style: none;
	}
	ul li{
		width:200px;
		height:100px;
		background:#000;
		margin-bottom:20px;
	}
	window.onload = function(){
		var aLi = document.getElementsByTagName('li');
		for(var i = 0;i < aLi.length;i++){
			aLi[i].timer = null;
			aLi[i].onmouseover = function(){
				startMove(this,400);
			}
			aLi[i].onmouseout = function(){
				startMove(this,200);
			}
		}
	}
	function startMove(obj,iTarget){
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var speed = (iTarget-obj.offsetWidth)/8;
			speed = speed>0?Math.ceil(speed):Math.floor(speed);
			if(obj.offsetWidth == iTarget){
				clearInterval(obj.timer);
			}else{
				obj.style.width = obj.offsetWidth + speed +'px';
			}
		},30)
	}
	
`多物体运动-透明度`

	<div id="div1"></div>
	<div id="div2"></div>
	<div id="div3"></div>
	<div id="div4"></div>
	<div id="div5"></div>
	body,div{
		margin:0;
		padding:0;
	}
	div{
		width:200px;
		height:200px;
		margin:10px;
		float:left;
		background:red;
		filter:alpha(opacity:30);
		opacity:0.3;
	}
	window.onload = function(){
		var oDiv = document.getElementsByTagName('div');
		for(var i=0;i<oDiv.length;i++){
			oDiv[i].alpha = 30;
			oDiv[i].onmouseover = function(){
				startMove(this,100)
			}
			oDiv[i].onmouseout = function(){
				startMove(this,30)
			}
		}
	}
	function startMove(obj,iTarget){
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var speed = 0;
			if(obj.alpha > iTarget){
				speed = -10;
			}else{
				speed = 10;
			}
			if(obj.alpha == iTarget){
				clearInterval(obj.timer);
			}else{
				obj.alpha += speed;
				obj.style.filter = 'alpha(opacity:'+obj.alpha+')';
				obj.style.opacity = obj.alpha/100;
			}
		},30)
	}
	
`获取样式`

注意：`oDiv.style.width`只能获取内联样式值。

	<div id="div1" style="width:200">我要这样子</div>
	#div1{
		width:200px;
		height:200px;
		background:#f00;
		font-size:12px;
		border:4px solid #000;
		color:#000;
	}
	window.onload = function(){
		startMove();
	}
	function startMove(){
		setInterval(function(){
			var oDiv = document.getElementById('div1');
			console.log(oDiv.style.width);
			//console.log(oDiv.style.height);
			//console.log(oDiv.offsetWidth);
			//oDiv.style.width = oDiv.offsetWidth -3 + 'px';
			//oDiv.style.width = parseInt(oDiv.style.width) -1 +'px';
			//oDiv.style.width = parseInt(getStyle(oDiv,'width')) - 1 + 'px';
			//oDiv.style.fontSize = parseInt(getStyle(oDiv,'fontSize')) +1 + 'px';
			oDiv.style.height = parseInt(getStyle(oDiv,'height')) +1 +'px';
		},30)
	}
	function getStyle(obj,attr){
		// IE
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj,false)[attr];
		}
	}

`任意属性值`

	<ul><li id="li1"></li></ul>
	ul{
		margin:0;
		padding:0;
	}
	#li1{
		list-style:none;
		width:200px;
		height:100px;
		background:yellow;
		margin-bottom:20px;
		border:4px solid #000;
		filter:alpha(opacity:30);
		opacity:0.3;
	}
	window.onload = function(){
		var Li1 = document.getElementById('li1');
		Li1.onmouseover = function(){
			startMove(this,'width',30);
		}
		Li1.onmouseout = function(){
			startMove(this,'width',200);
		}
	}
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj,false)[attr];
		}
	}

	var alpha = 30;
	function startMove(obj,attr,iTarget){
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var icur = 0;
			if(attr == 'opacity'){
				icur = Math.round(parseFloat(getStyle(obj,attr))*100);
			}else{
				icur = parseInt(getStyle(obj,attr));
			}
			var speed = (iTarget-icur)/8;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			if(icur == iTarget){
				clearInterval(obj.timer);
			}else{
				if(attr == 'opacity'){
					obj.style.filter = 'alpha(opacity):'+(icur+speed)+')';
					obj.style.opacity = (icur + speed)/100;
				}else{
					obj.style[attr] = icur + speed +'px';
				}
			}
		},30)
	}
	
	
> 链式运动和同时运动

两种动都使用一套JS代码`	move.js`。

	function toFix(obj,json){
		for(var attr in json){
			// 1.取当前的值
			var jCur = 0;
			if(attr == 'opacity'){
				jCur = Math.round(parseFloat(getStyle(obj,attr))*100);
			}else{
				jCur = parseInt(getStyle(obj,attr));
			}	
			if(jCur != json[attr]) return false;
		
		}
		return true;
	}
	function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
	}
	
		
	var alpha = 30;
	
	// startMove(obj,{attr1:itarget1,attr2:itarget2},fn);
	function startMove(obj,json,fn){
	var flag = true;
	clearInterval(obj.timer);
	// 30ms运行一次 for 运行三次
	obj.timer = setInterval(function(){
		for(var attr in json){
	
			// 1.取当前的值
			var iCur = 0;
			if(attr == 'opacity'){
				iCur = Math.round(parseFloat(getStyle(obj,attr))*100);
			}else{
				iCur = parseInt(getStyle(obj,attr));
			}
			
			// 2.算速度
			var speed = (json[attr]-iCur)/8;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			
			
			
			// 3.等待for循环执行完停止
			if(iCur != json[attr]){
				flag = false;
				//4.设置当前值
				if(attr == 'opacity'){
					obj.style.filter = 'alpha(opacity):'+(iCur+speed)+')';
					obj.style.opacity = (iCur + speed)/100;
				}else{
					obj.style[attr] = iCur + speed +'px';
				}	
			}else{
				// 判断是否所有的属性都达到终点
				flag = toFix(obj,json);		
			}
			
		
		}
	
		//5.检测停止
		if(flag)
		{
			clearInterval(obj.timer);
			if(fn){
				fn();
			}
		}
		
	},30)
	
`链式运动`
	
	ul{
		margin:0;
		padding:0;
	}
	#li1{
		list-style:none;
		width:200px;
		height:100px;
		background:yellow;
		margin-bottom:20px;
		border:4px solid #000;
		filter:alpha(opacity:30);
		opacity:0.3;
	}
	<ul><li id="li1"></li></ul>
	window.onload = function(){
		var Li = document.getElementById("li1");
		Li.onmouseover = function(){
			startMove(Li,{width:400},function(){
				startMove(Li,{height:200},function(){
					startMove(Li,{opacity:100});
				});
			});
		}
		Li.onmouseout = function(){
			startMove(Li,{opacity:30},function(){
				startMove(Li,{height:100},function(){
					startMove(Li,{width:200});
				})
			})
		}
	}

`同时运动`

	ul{
		margin:0;
		padding:0;
	}
	#li1{
		list-style:none;
		width:200px;
		height:100px;
		background:yellow;
		margin-bottom:20px;
		border:4px solid #000;
		filter:alpha(opacity:30);
		opacity:0.3;
	}
	<ul><li id="li1"></li></ul>
	window.onload = function(){
		var oLi = document.getElementById("li1");
		oLi.onmouseover = function(){
			startMove(oLi,{width:400,height:200,opacity:100},function(){});
		}
		oLi.onmouseout = function(){
			startMove(oLi,{width:200,height:100,opacity:30},function(){});
		}
	}
	
> 动画案例

`使用库JQuery`

	$(function(){
		$(“#move a”).mouseenter(function(){
			$(this).find(“i”).animate({top:”-25px”,opacity:”0”},300,function(){
				$(this).css({top:”30px”});
				$(this).animate({top:”20px”,opacity:”1”},200);
			})
		})
	})