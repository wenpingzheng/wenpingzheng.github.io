---
layout: post
title :  "css角标细腻化处理"
date  :   2016-08-29 14:15:35
img   : "../../../../../assets/images/201608295.png"
author: "WP"
intro : "三角形所解决的问题是能够让文字区域显示的更美观，主要针对移动端，平时有一种处理办法就是直接在后面拼一个三角图案，这种效果在IPHONE上测试没有问题，但在Android上看就会有1像素的差距，面对这种问题，如何理解另一种解决方案。"
tg: mobile
---



> 三角形所解决的问题是能够让文字区域显示的更美观，主要针对移动端，平时有一种处理办法就是直接在后面拼一个三角图案，这种效果在IPHONE上测试没有问题，但在Android上看就会有1像素的差距，面对这种问题，如何理解另一种解决方案。

# 一、原理详解。

首先给出一段CSS代码，运行一下，看看能显示什么。

	.demo{
		width:0;
		height:0;
		border-right:60px solid #ddd;
		border-top:70px solid red;
	}

没错，这是一段由边框实现的方形
这样的，

![MacDown logo](../../../../../assets/results/20160829/201608291.jpg)

有四个边框，这只是其中四分之一，下面看一下它的全貌长什么样

假如我们的样式是这样子的

	border-right:60px solid transparent;
	border-top:70px solid red;
	border-left:60px solid #ddd;
	border-bottom:70px solid #999;
	
![MacDown logo](../../../../../assets/results/20160829/201608292.jpg)

上面这张结果图分成了四个区域，其实分别对应了四个组合，top left 、top right 、bottom left 、bottom right。

也就是说从功能上看，假如你设置是的top right, 表现出来结果就是第一张图一样，方形，如果这时你想得到任意一个你想要的三角形，就可以将另一个设置为透明。比如

	border-right:60px solid transparent;
	border-top:70px solid red;
	
估计这会大家都已经知道了，这些功能可以帮助我们解决一些类似的需求。 下面看一下需求

# 二、需求的分析

先上一个图吧

![MacDown logo](../../../../../assets/results/20160829/201608293.jpg)

这种需求大家一定碰到过，即使现在没碰到，总有一天也会遇到。

然而，最右边的三角如果用一张图的话，在Android上必然就会出现一个小问题，不是很完美，如果用上面写的边框，在往左边缩进一点，是不是就显示很完美了? 

	margin-left:-12px;
	
颜色变过来看看最终的效果

![MacDown logo](../../../../../assets/results/20160829/201608294.jpg)

这时在终端上显示出来的效果都没有问题了



# 五、结语

完美




