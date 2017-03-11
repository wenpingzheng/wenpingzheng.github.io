---
layout: post
title :  "判断浏览器是否支持某个CSS3属性"
date  :   2016-01-07 08:15:35
img   : "../../../../../assets/images/aa20160428.png"
author: "WP"
intro : "主要应用PC业务，兼容判断IE是否支持CSS3属性，从而做好平稳退化方案。"
tag: css3
---




# 下面是代码

	<script type="text/javascript">
	/**
	    * 判断浏览器是否支持某一个CSS3属性
	    * @param {String} 属性名称
	    * @return {Boolean} true/false
	    * 
	*/   
	function supportCss3(style) {
	    var prefix = ['webkit', 'Moz', 'ms', 'o'],
	    i,
	    humpString = [],
	    htmlStyle = document.documentElement.style;
	    console.log(htmlStyle);
	    var _toHumb = function (string) {
		    return string.replace(/-(\w)/g, function ($0, $1) {
		    	// $0 -a
		    	// $1 a
		    	return $1.toUpperCase();
		    });
	    };
	    for (i in prefix)
	    humpString.push(_toHumb(prefix[i] + '-' + style));
	    humpString.push(_toHumb(style));
	    for (i in humpString)
	    if (humpString[i] in htmlStyle) return true;
	    return false;
	}
	// eg
	console.log(supportCss3('animation')); // true;

	</script>