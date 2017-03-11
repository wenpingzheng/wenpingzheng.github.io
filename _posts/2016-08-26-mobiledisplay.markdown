---
layout: post
title :  "移动布局略思考"
date  :   2016-08-26 17:15:35
img   : "../../../../../assets/images/aa20160826.jpg"
author: "WP"
intro : "好比看一本书，看一遍可能还是懵的，看第二遍你也许就会去思考，一个东西即使写了很多遍，仔细想想还是会有意想不到的收获。下面我列出的是一些移动页面布局上应该注意的问题。"
tag: mobile
---



> 好比看一本书，看一遍可能还是懵的，看第二遍你也许就会去思考，一个东西即使写了很多遍，仔细想想还是会有意想不到的收获。下面我列出的是一些移动页面布局上应该注意的问题。

# 一、移动端展示浮层。

所谓浮层，就是浮动在页面之上的DOM层，浮层上可以携带信息，当浮层装不下特多信息的时候，可以给浮层加个滚动。今天的问题是浮层滚动时如何禁止页面滑动。就像公园里买唱的小青年，为了展示他自认为埋没已久的唱功，随时放声唱各种他认为会的歌，谁又知道他这一吼打扰了在一旁小凳子上亲热的小情侣了。~~~~~~~

同样的道理，手指滑动浮层的时候，不能让整个页面主体内容跟着滑动。（免的打扰）

实现的关键点：(window.event || event).preventDefault() + iscroll。

移动页面展示浮层其实就是解决两个问题，1、当出现浮层时禁止整个页面滑动（e）。2、当浮层装载的内容超过可视区的时候能够流畅滚动（iscroll）。


![MacDown logo](../../../../../assets/results/20160826/2016082601.jpg)![MacDown logo](../../../../../assets/results/20160826/2016082601.jpg)

# 二、line-height移动显示问题

line-height经常用于文字居中，然而在不同的手机端上表现出来的效果还是不一样。这种问题，对于处女座的人的来说，可能是最郁闷的事情了。

例如下面这段代码：

	<span class="demo">仔细测试仔细看看</span>
	
	CSS:
	
	.demo{
	
	       display:inline-block;
	
	       height:26px;
	
	       line-height: 26px;
	
	       font-size:9px;
	
	       border:1px solid #ff6815;
	
	}

在两个终端上表现出来的效果是这样的：


![MacDown logo](../../../../../assets/results/20160826/2016082603.png)![MacDown logo](../../../../../assets/results/20160826/2016082604.png)

结论是IOS系列正常，Android系列不正常，Android系统手机就好像哪儿不舒服一样，显示出来就是和正常的不一样，Android机型的手机也是各种各样，通过我无敌的调试之后，最后得出一结论，将line-height的值设置成高度值加1。基本都上表现出来的效果都差不多，当然，高度越高这种差距越看不出来。

结论是以后再也不用担心因Android上的BUG耽误我拿夜宵的时间，有木有~~~~~~~~~

# 三、display:inline-block小坑

懂点前端的人都知道，这个属性是用来定义行内块级元素，下面这段代码理论和实际应该是没有什么问题的。

	.item{
	
	       width:25%;
	
	       height:60px;
	
	       display:inline-block;
	
	       text-align: center;
	
	       background-color:#ddd;
	
	       font-size:12px;
	
	}

表现出来是这样的：

![MacDown logo](../../../../../assets/results/20160826/2016082605.png)

上图看来，每一个item元素间会莫名的出现些空格，然而，这不是我们实际想象中的结果。

这又是如何产生的了？咱们来分析一下原因，首先来看一下DOM结构。

是这样的：

	<div class="item">
	<img src="http://top.oa.com/apis/imgcache.php/https://gw.ar"" onerror="if(!this.err){this.err=true;this.src='https://gw.ar"';}else{this.onerror='';this.src='https://gw.ar"';}" alt="">
	       <p>自由行</p>
	</div>【换行符】
	<div class="item">
	<img src="http://top.oa.com/apis/imgcache.php/https://gw.ar"" onerror="if(!this.err){this.err=true;this.src='https://gw.ar"';}else{this.onerror='';this.src='https://gw.ar"';}" alt="">
	       <p>自由行</p>
	</div>【换行符】
	<div class="item">
	<img src="http://top.oa.com/apis/imgcache.php/https://gw.ar"" onerror="if(!this.err){this.err=true;this.src='https://gw.ar"';}else{this.onerror='';this.src='https://gw.ar"';}" alt="">
	       <p>自由行</p>
	</div>

看到了吧，确认是由于item之间的换行符引起的。好了，既然知道了原因，就想办法解决吧，

1、将DOM连接在一块处理，这可能不是一个好的办法，这种问题依靠样式来处理可能显得更专业点。

2、使用浮动的办法，给每个item加一个float属性，似乎看起来很完美，细想一下浮动需要每个元素高度一样，不然就会错乱，加上还需要清除浮动。似乎也不像是最好的方式。

3、最后一招，一般都是最厉害的，高手总是最后出来救场，给item的父元素加个font-size:0;所有子元素莫名的空格都消失了。赞！！！！！！！！！！今天不用加班了。

顺便提一下，有关于display:inline-block在ie6/7上的兼容性问题，这里不说了，因为我们主要说的是移动端的页面。一篇文章说太多，会严重影响睡眠，影响明天早起上班~~~~~~~~~~

# 四、单行/多行省略

单选/多行文字超出时自动打上省略号。

我们的需求可能是这样的（下图）：在一行中，当文字超出给定宽度时，自动显示…。


![MacDown logo](../../../../../assets/results/20160826/2016082606.png)

需求也有可能是这样的（下图）：移动页面中，指定行显示文字，超出行数，自动显示…。

![MacDown logo](../../../../../assets/results/20160826/2016082607.png)

不管是在PC还是在移动上，很常见的一种需求可能就是在一行中自动处理超出宽度的情况。设置不折行超出打点就行。代码大概如下：

display: block;

width: 290px;

white-space: nowrap;

text-overflow: ellipsis;

overflow: hidden;

然而是移动移动上经常会出现定多选的情况，这里为什么要强调在移动端上，原因有两个，一个是确实在移动需求上常见。二是，PC端设置多行超出打点功能有兼容性，这个一般是找替代方案。呵呵。~~~~替代方案有很多，但不一定完美。自行解决，随意发挥。

回到超出多行打省略号的情况，代码一般如下：主要用的是box属性。不清楚它的使用的同学可以上网查一查。

display: -webkit-box;

font-size:14px;

margin:0;

line-height: 18px;

overflow: hidden;

height:35px;

text-overflow:ellipsis;

-webkit-line-clamp:2;

-webkit-box-orient: vertical;

顺便说一个细节，多行显示的情况，根据实际情况可调整line-height/height达到适配各大机型的完美效果。因为这里line-height同样是有坑的，在上面已经说过了。如果还不清楚，只能说刚刚你可能在打瞌睡。原因可能是加班太晚了~~~~~~工作效率要提高。

说到box这个c3属性，下面我举个例子来展示它的强大用处。

![MacDown logo](../../../../../assets/results/20160826/2016082608.png)

左边是文字，右边是数字。有一些极端的情况，就是左右两边的内容都有可能到达很长的位置。这个时候显示不下呀，PM有可能就会告诉你数字比文字更重要。数字一般体现的是一种结果性，着重展示的完整性，而文字一般体现是的说明。说明文字超出可以省略。

右边自动适应除数字占掉的剩下的空间，代码是这样的（下面）

	.ent-li {
	
	    height: 44px;
	
	    display: -webkit-box;
	
	    display: box;
	
	    position: relative;
	
	}
	
	.ent-li .left {
	
	    -webkit-box-flex: 1;
	
	    box-flex: 1;
	
	    text-align: left;
	
	    line-height: 45px;
	
	    font-size: 16px;
	
	    color: #333;
	
	    overflow: hidden;
	
	    text-overflow: ellipsis;
	
	    white-space: nowrap;
	
	}
	
	.ent-li .right {
	
	    text-align: right;
	
	    line-height: 45px;
	
	    font-size: 12px;
	
	    color: #999;
	
	    padding-left: 10px;
	
	}

自已复制运行不解释。

运行结果已经在上面展示了。

# 五、结语

最后总结一下，一个好产品的形成，应该是做对，做好，做细、做精。而这些都需要每个环节的认真思考，开发自然也是重要环节之一。本文内容纯属随性文笔。欢迎指正。




