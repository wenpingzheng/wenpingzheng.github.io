---
layout: post
title :  "使用AngularJS开发一个抽奖应用"
date  :   2016-01-05 08:25:35
img   : "../../../../../assets/images/aa20160105.png"
author: "WP"
intro : "在日常应用的开发中，经常有抽奖应用开发的需求，利用Angular框架可以十分高效地开发出一个很实用的抽奖应用，这个应用不仅代码简洁，而且执行效率高、扩展性强。"
categories: angular
---

这篇文章分三部分,一、功能介绍:主要介绍这个实例是要实现个什么样的功能。二、效果图展示：展示这个单页web应用在浏览器中的模样。三、源码分析：这里会列出来整个实例实现的源代码。

# 一、功能介绍

1、在单击“开始”按钮后，所有奖品将以块状方式不断闪烁5次。

2、在闪烁结束后，自动显示所抽中的奖品名称。

3、自定义奖品的内容，包括删除原有奖品奖品和增加新奖品。

# 二、界面效果

![MacDown logo](../../../../../assets/results/20150105/a1.png)  ![MacDown logo](../../../../../assets/results/20150105/a2.png)![MacDown logo](../../../../../assets/results/20150105/a3.png)  ![MacDown logo](../../../../../assets/results/20150105/a4.png)

# 三、功能开发

从效果图中可以得知，这个应用总共分为四个功能模块。所以在代码中我们直接放四个ID值为step1、step2、step3、step4的DOM结构分别对应四个不同的场景。页面的HTML代码如下所示:
	
	<div ng-controller="ctrl_lottery" id="lottery">
		<!-- 功能模块一 -->
		<div id="step1">
			<button ng-click="start()">开始</button>
		</div>
	
		<!-- 功能模块二 -->
		<div id="step2">
			<div ng-repeat="item in items" id="{{item.id}}" class="item" ng-class="{'active':item.status}">
			{ {item.name} }
			</div>
		</div>
	
		<!-- 功能模块三 -->
		<div id="step3" class="hide top">
			<a href="javascript:void(0)" ng-click="reset()" class="reset">
				<img src="">重新开始
			</a>
			<a href="javascript:void(0)" ng-click="edit()" class="edit">
				<img src="">修改奖品
			</a>
			<button class="active">{ {result} }</button>
		</div>
	
		<!-- 功能模块四 -->
		<div id="step4" class="hide top">
			<a href="javascript:void(0)" ng-click="return()" class="reset">
				<img src="">返回
			</a>
			<form ng-submit="add()">
				<input type="text" ng-model="name" required placeholder="名称">
				<input class="btn" type="submit" value="添加">
			</form>
			<ul>
				<li ng-repeat="item in items">
					<span>{ {item.id} }</span>
					<span class="span">{ {item.name} }</span>
					<a href="javascript:void(0)" ng-click="del(item.id)">删除</a>
				</li>
			</ul>
		</div>
	</div>

将所有的奖品信息放在一个数组items中。然后定义一个可以控制隐藏和显示元素的方法`showhide`。然后写了一个点击开始函数`start`。然而，这个函数的执行逻辑是，隐藏step1显示step2元素，定义一个闪烁循环次数，和随机抽中的奖品索引值，最后定了一个可以闪烁循环的函数`next`。从next(0)开始执行。代码的最后定义了四个功能函数方法。`reset`:重新开始函数。`edit`:进入奖品编辑页面函数。`add`:添加奖品函数。`del`:删除奖品函数。
具体JavaScript代码如下所示:

	angular.module("lottery",[]).
	controller('ctrl_lottery',['$scope','$timeout',
	function($scope,$timeout){
	
		// 初始化奖品数据
		$scope.items = [
			{ id: 1, name: "欧洲豪华游", status: 0},
			{ id: 2, name: "Mac台式电脑", status: 0},
			{ id: 3, name: "iphone6手机", status: 0},
			{ id: 4, name: "时尚山地车", status: 0},
			{ id: 5, name: "高清数字电视", status: 0},
			{ id: 6, name: "500元充值卡", status: 0}
		];
		$scope.result = "奖品为空";
		$scope.$$ = function(id){
			return document.getElementById(id);
		};
		$scope.showhide = function(pre, nex){
			pre = "step" + pre;
			nex = "step" + nex;
			$scope.$$(pre).style.display = "none";
			$scope.$$(nex).style.display = "block";
		};
		$scope.start = function(){
			$scope.showhide(1, 2);
			var circle = 5;
			var selkey = Math.floor(Math.random()*$scope.items.length);
			var next = function(key){
				$scope.items[key].status = true;
				if((key-1) >= 0)
					$scope.items[key-1].status = false;
				if(key == 0)
					$scope.items[$scope.items.length -1].status = false;
				var timer = $timeout(function(){
					if(circle <= 0 && selkey == key){
						$scope.showhide(2, 3);
						$scope.result = $scope.items[key].name;
						return;
					}
					if($scope.items.length == key + 1){
						circle--;
					}
					if($scope.items[key + 1]){
						next(key + 1);
					}else{
						next(0)
					}
				}, 100);
			};
			next(0);
		}
		// 显示奖品时绑定的方法
		$scope.reset = function(){
			$scope.showhide(3, 1);
		}
		$scope.edit = function(){
			$scope.showhide(3, 4);
		}
		// 修改奖品绑定的方法
		$scope.add = function(){
			var last_id = lastid();
			$scope.items.push({id:last_id, name:$scope.name, status: 0})
		}
		$scope.del = function(id){
			angular.forEach($scope.items,function(value, key){
				if(id == value.id){
					console.log(key);
					$scope.items.splice(key, 1);
				};
			})
		}
		$scope.return = function(){
			$scope.showhide(4, 3);
		}
		// 内部函数，用于获取最后一项数据的ID号值
		function lastid() {
			var id = 0;
			angular.forEach($scope.items, function(value, key){
				if(id < value.id)
					id = value.id
			})
			return ++id;
		}
		
	}]);
	
样式文件代码如下：

	body{
	font-size:13px;
	}
	a:link{
	text-decoration: none;
	}
	a:visited{
	text-decoration: none;
	}
	#lottery{
	margin:0 auto;
	border:solid 1px #ccc;
	width:306px;
	text-align:center;
	}
	#lottery ul{
	list-style-type:none;
	padding:0px;
	margin:20px 0px;
	text-align: left;
	}
	#lottery ul li{
	border-bottom:dashed 1px #ccc;
	padding:5px 0px;
	}
	#lottery ul li span{
	float:left;
	padding-left:10px;
	}
	#lottery ul li .span{
	width:230px;
	}
	#lottery button{
	margin:50px 0px;
	width:100px;
	height:100px;
	}
	#lottery .item{
	width:100px;
	height:100px;
	border:solid 1px #ccc;
	text-align: center;
	line-height: 100px;
	float:left;
	}
	#lottery .active{
	background-color:#666;
	border:1px solid #ccc;
	color:#fff;
	}
	#lottery .reset{
	float:left;
	padding-left:10px;
	}
	#lottery .edit{
	float:right;
	padding-right:10px;
	}
	#lottery img{
	vertical-align: bottom;
	}
	#lottery .top{
	margin-top:10px;
	}
	#lottery .show{
	display:block;
	}
	#lottery .hide{
	display:none;
	}

# 四、总结

通过Angular抽奖实例的分析和使用，我觉得有两点可以肯定。一是多页面展示效果在单页面应用中的实现方法。二是熟悉了angular中$timeout的使用。