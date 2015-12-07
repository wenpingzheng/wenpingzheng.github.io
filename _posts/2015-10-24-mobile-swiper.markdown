---
layout: post
title :  "移动端滑动效果样例"
date  :   2015-10-24 16:39:30
img   : "../../../../../assets/images/aa201510311.png"
author: "WP"
intro : "触摸滑动已经成为移动端开发的常用功能，我们这里通过自己封装，或者直接选用轻量级的移动设备触控滑块的JS框架改写出几个常用的样例，供日后的你使用。"
categories: jekyll update
---
###<a href="javascript:void(0)" class="title">案例一</a>


>效果图

![MacDown logo](../../../../../assets/results/aa20151031.png)

>说明

上面三行分别对应三种效果，这三个效果是利用轻量级移动框架[Swipter.js](http://www.swiper.com.cn/)来实现的，支持在Android2.3以上系统及ios系统上运行。运行前需要引入三个文件`swipe.min.css`、`zepto.min.js`、`swipe.min.js`。

>代码-DOM

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
    
>代码-CSS

	.swiper-container {
        width: 100%;
        height: 45px;
    }
    .swiper-slide,.swiper-all{
        text-decoration: none;
        text-align: center;
        font-size: 15px;
        background: #fff;
        position:relative;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
    }
    .swiper-all{
        position: absolute;
        left: 0;
        bottom: 0;
        height: 45px;
        width: 80px;
        z-index: 2;
        background:#4479e3;
    }

    .swiper-slide em,.swiper-all em{
        display:none;
        position:absolute;
        width:100%;
        height:3px;
        background-color:#4479e3;
        left:0;
        bottom:0;
    }
    .swiper-slide span,.swiper-all span{
        height:25px;
        line-height:25px;
        width:99.9%; /* 解决部分Androud机无法显示分隔线 */
        text-align: center;
        border-right:1px solid #000;
        color:#6b6b6b;
        display:block;
    }
    .swiper-all span{
        border-right:1px solid #4479e3;
        color:#fff;
    }
    .swiper-slide:last-child span{
        border-right:1px solid #ffffff;
    }
    .swiper-container .on span{
        color:#4479e3;
    }
    .swiper-container .on em{
        display:block;
    }
    
>代码-JS
		
	// navContent
	var getNavcon = function(obj){
	     // 滑动内容
	     var navHtml = "";
	     var _thisDom = $(".swiper-wrapper");
	     $.each(obj,function(ele,index){
	       navHtml += '<a href="javascript:;" data-id="'
		        +index[1]+'" class="swiper-slide '+index[2]+'">'
		        +'<span>'+index[0]+'</span><em></em></a>';
	     })
	     _thisDom.append(navHtml);

        // 滑动初始化
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 0,
            freeMode: true
        });

        // 根据初始化的宽度设置“全部”的宽度
        $(".swiper-all").css({"width":_thisDom.find("a").css("width")});
        // 滑动列表点击
        $.each(_thisDom.find("a"),function(){
            var _this = $(this);
            _this.on("click",function(){
                if(!_this.hasClass("on"))
                {
                    $(".loads").show();
                    getmore = false;
                    _this.addClass("on").siblings().removeClass("on");
                    channelId = _this.attr("data-id");
                   /* $.getScript('http://'+hostname
                            +'/yutu/index.php?subjectlist.list&start=0&end=20&channel='
                            +channelId+'&callback=');*/
                }
            })
        })
    }
    $(function(){
        // 展示内容
        var config = {
            "news"  : ["新闻", "1", "on"],
            "ent"   : ["娱乐", "5", ""],
            "sports": ["体育", "2", ""],
            "video" : ["视频", "7", ""],
            "edu"   : ["教育", "19",""],
            "edj"   : ["图话", "20",""],
            "kid"   : ["儿童", "29",""]
        }
        getNavcon(config);

    })


