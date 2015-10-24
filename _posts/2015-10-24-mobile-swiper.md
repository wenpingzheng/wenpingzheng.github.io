---
layout: post
title :  "移动端滑动效果样例"
date  :   2015-10-24 16:39:30
img   : "../assets/images/1.png"
intro : "触摸滑动已经成为移动端开发的常用功能，我们这里通过自己封装，或者直接选用轻量级的移动设备触控滑块的JS框架改写出几个常用的样例，供日后的你使用。"
categories: jekyll update
---
#案例一
---

###效果图

![MacDown logo](http://wenpingzheng.github.io/assets/images/swipter-20151024.png)

###说明
上面三行分别对应三种效果，这三个效果是利用轻量级移动框架[Swipter.js](http://www.swiper.com.cn/)来实现的，支持在Android2.3以上系统及ios系统上运行。运行前需要引入三个文件`swipe.min.css`、`zepto.min.js`、`swipe.min.js`。

###代码

#####滑动样例一

	<div class="swiper-container">
	    <div class="swiper-wrapper">
	       <!-- <a href="#" class="swiper-slide on">
	            <span>新闻</span>
	            <em></em>
	        </a>-->
	    </div>
	</div>

#####滑动样例二
   
    <div class="swiper-container" style="margin-top:20px;">
        <!-- 查看所有内容 -->
        <div class="swiper-all">
            <span>全部</span>
            <em></em>
        </div>
        <div class="swiper-wrapper">
            <!-- 占位/s -->
            <div class="swiper-slide"></div>
            <!-- 点位/e -->
        </div>
    </div>  
     
#####滑动样例三

    <div class="swiper-container" style="margin-top:20px;">
        <div class="swiper-wrapper">
            <!-- 占位/s -->
            <a href="#" class="swiper-slide">
                <span>全部</span>
                <em></em>
            </a>
            <!-- 点位/e -->
        </div>
    </div>

