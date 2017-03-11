---
layout: post
title :  "jQuery常用代码段"
date  :   2015-11-16 15:54:30
img   : "../assets/images/aa20151116.png"
author: "WP"
intro : "总结几个使用jQuery实现的常用功能，在日常的项目中或许你会经常遇到，比如：导航菜单背景切换效果，访问IFrame里的元素，管理搜索框的值，部分页面加载更新...。"
tag: js
---

> 导航菜单背景切换效果

在项目的前端页面里，相对于其它的导航菜单，激活的导航菜单需要设置不同的背景。这种效果实现的方式有很多种，下面是JQuery实现的种方式：

	<ul id='nav'>
	  <li>导航一</li>
	  <li>导航二</li>
	  <li>导航三</li>
	</ul>
	
	$('#nav').click(function(e) {
		$(e.target).addClass('tclass').siblings('.tclass').removeClass('tclass');
	});
	
> 访问IFrame里的元素

在大多数情况下，IFrame并不是好的解决方案，但由于各种原因，项目中确实用到了IFrame，所以你需要知道怎么去访问IFrame里的元素。

	var iFrameDOM = $("iframe#someID").contents();
	iFrameDOM.find(".message").slideUp();
	
> 管理搜索框的值

现在在各大网站都有搜索框，而搜索框通常都有默认值，当输入框获取焦点时，默认值消失。而一旦输入框失去焦点，而输入框里又没有输入新的值，输入框里的值又会恢复成默认值，如果往输入框里输入了新值，则输入框的值为新输入的值。这种特效用 JQuery 很容易实现：

	$("#searchbox")
	   .focus(function(){$(this).val('')})
	   .blur(function(){
	     var $this = $(this);
	    ($this.val() === '')? $this.val('请搜索...') : null;
	 });
	 
> 部分页面加载更新
 
为了提高web性能，有更新时我们通常不会加载整个页面，而只是仅仅更新部分页面内容，如图片的延迟加载等。页面部分刷新的特效在JQuery中也很容易实现：

	setInterval(function() {
		$("#content").load(url);
	}, 5000);
	
> 采用data方法来缓存数据

在项目中，为了避免多次重复的向服务器请求数据，通常会将获取的数据缓存起来以便后续使用。通过JQuery可以很优雅的实现该功能：

	var cache = {};
	$.data(cache,'key','value');
	$.data(cache,'key');
	
> 采配置JQuery与其它库的兼容性

如果在项目中使用 JQuery，$是最常用的变量名，但JQuery并不是唯一一个使用$作为变量名的库，为了避免命名冲突，你可以按照下面方式来组织你的代码：

	// 方法一： 为JQuery重新命名为 $j
	var $j = jQuery.noConflict();
	$j('#id')....
	
	// 方法二： 推荐使用的方式
	(function($){
	  $(document).ready(function(){
	    // 这儿，你可以正常的使用JQuery语法
	  });
	})(jQuery);
	
> 使用JQuery重绘图片的大小

关于图片大小的重绘，你可以在服务端来实现，也可以通过JQuery在客户端实现。

	$(window).bind("load", function() {
	   $('#product_cat_list img').each(function() {
	      var maxWidth = 120;
	      var maxHeight = 120;
	      var ratio = 0;
	      var width = $(this).width();
	      var height = $(this).height();
	      if(width > maxWidth){
	         ratio = maxWidth / width;
	         $(this).css("width", maxWidth);
	         $(this).css("height", height * ratio);
	            height = height * ratio;
	      }
	      var width = $(this).width();
	      var height = $(this).height();
	      if(height > maxHeight){
	         ratio = maxHeight / height;
	         $(this).css("height", maxHeight);
	         $(this).css("width", width * ratio);
	         width = width * ratio;
	      }
	   });
	});
	
> 滚动时动态加载页面内容

有些网站的网页内容不是一次性加载完毕的，而是在鼠标向下滚动时动态加载的，这是怎么做到的呢？看下面代码：

	var loading = false;
	$(window).scroll(function(){
	 if((($(window).scrollTop()+$(window).height())+250)>=$(document).height()){
	   if(loading == false){
	      loading = true;
	      $('#loadingbar').css("display","block");
	      $.get("load.php?start="+$('#loaded_max').val(), function(loaded){
	         $('body').append(loaded);
	         $('#loaded_max').val(parseInt($('#loaded_max').val())+50);
	         $('#loadingbar').css("display","none");
	         loading = false;
	      });
	    }
	  }
	});
	
	$(document).ready(function() {
	  $('#loaded_max').val(50);
	});