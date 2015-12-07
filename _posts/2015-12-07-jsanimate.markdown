---
layout: post
title :  "JS的动画效果"
date  :   2015-12-07 11:35:35
img   : "../../../../../assets/images/aa20151207.jpg"
author: "WP"
intro : "从简单动画到完美运动框架的封装。对比原生JS写动画的实现和使用库实现同样效果的差异，从中可以学到：1、使用定时器实现简单动画。2、如何一步步封装库。3、培养编程的思想。"
categories: jekyll update
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
	
	
> 链式动画

> 同时运动

> 动画案例