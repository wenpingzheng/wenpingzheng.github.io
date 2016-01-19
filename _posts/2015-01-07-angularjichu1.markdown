---
layout: post
title :  "Angular基础用法一"
date  :   2016-01-07 08:15:35
img   : "../../../../../assets/images/aa20160107.png"
author: "WP"
intro : "对于刚接触Angular的人来说，可能好多功能还不熟悉，例如，其中的表单控件的使用，控制器是什么，它能实现哪些功能，以及Angular开发中的模板是如何使用的等等。"
categories: angular
---

这篇文章通过实例的方式讲四个问题。

**一、表达式**

**二、控制器**

**三、模板**

**四、表单控件**

=========================================================

# 一、表达式

> Angular表达式与JavaScript表达式的区别

Angular中的表达式的值可以是使用管道符“|”进行格式化显示的数值，这也是不同于传统的JavaScript中表达式的一个很明显的特征。
如果在Angular中的表达式要调用传统的JavaScript代码，需要在控制器中定义一个方法，然后由表达式调用该方法即可；而如果在传统的JavaScript代码中执行Angular中的表达式，则需要借助`$eval()`方法。

**【实例】Angular表达式与JavaScript表达式之间的相互调用**

`注意：ng-app一定要写，可以为不命名`

	<html ng-app>
	<head>
		<meta charset="utf8">
		<title>表达式之间相互调用</title>
		<script type="text/javascript" src="../js/angular-1.3.0.js"></script>
	</head>
	<body>
		<div ng-controller="c2_1">
			执行JavaScript表达式：<br />
			<input type='text' ng-model="expr1" />
			<button ng-click="testExp1(expr1)">计算</button>
			<br /><br />
			执行Angular表达式：<br />
			<input type='text' ng-model="expr2">
			<span ng-bind="$eval(expr2)"></span>
		</div>
		<script type="text/javascript">
			function c2_1($scope) {
				$scope.expr1 = 20;
				$scope.expr2 = '20+1|number:0';
				$scope.testExp1 = function(expr){
					var newv = parseInt(expr) + 1;
					console.log(newv);
				}
			}
		</script>
	</body>
	</html>

**【实例】$window窗口对象在表达式中的使用**

	<div ng-controller="c2_2">
		<input type='text' ng-model="text" />
		<button ng-click="show()">显示</button>
	</div>
	<script type="text/javascript">
		function c2_2($window,$scope) {
			$scope.text = " ";
			$scope.show = function(){
				$window.alert("您输入的内容是：" + $scope.text);
			}
		}
	</script>

说明：添加一个$window对象，用于取代全局性的window对象。在使用时，可以像访问window对象一样，调用$window对象中各类方法或属性，如alert、confirm等。

# 二、控制器

**【实例】添加带参数的$scope方法**

	<div ng-controller="c2_7">
		<span class="show">{{ text }}</span>
		<input id="btnshow" type="button" ng-click="click_show();" value="显示" />
		<input id="btnPara" type="button" ng-click="click_para('单击了带参数按钮！');" value="带参数显示" />
	</div>
	<script type="text/javascript">
		var a2_7 = angular.module('a2_7',[]);
		a2_7.controller('c2_7',['$scope',function($scope){
			$scope.text = 'Hello! Angular';
			$scope.click_show = function(){
				$scope.text = "单击后显示的内容";
			};
			$scope.click_para = function(ptext){
				$scope.text = ptext;
			};
		}])
	</script>

**【实例】$scope对象属性和方法的继承**

> 处于子层控制器中的$scope对象将会自动继承父层控制器中$scope对象的属性和方法。继承是一种由内向外的顺序关系。

	<div ng-controller="c2_8">
		<div ng-controller="c2_8_1">
			<span class="show">{{text}}</span><br />
			<span class="show">{{child_text}}</span>
			<input id="btnShow" type="button"
				ng-click="click_show();" value="继承" />
		</div>
	</div>
	<script type="text/javascript">
		var a2_8 = angular.module('a2_8',[]);
		a2_8.controller('c2_8',['$scope',function($scope){
			$scope.text = 'Hello! Angular';
			$scope.click_show = function(){
				$scope.text = "单击按钮后显示的内容";
			}
		}]);
		a2_8.controller('c2_8_1',['$scope',function($scope){
			$scope.child_text = '欢迎来到 Angular 的精彩世界！';
		}])
	</script>


# 三、模板

Angular自身提供了一个整套完整的模板系统，配合$scope对象和数据双向绑定机制，将页面纯静态元素经过行为、属性的添加和格式转换，最终变成在浏览器中显示的动态页。

> [] 代表双花括号

在模板系统中，可以包括Angular的指令、数据绑定、表单控件和过滤器，同时，在处理复杂程序时，可以构建多个模板页面作用于视图层。在主页面中，再通过包含（include）的方式加载这些零散的模板页。这样做的好处在于，一次定义可多处调用，增加代码的重复使用，减少维护成本。

然而构建模板的内容是使用模板功能的前提，一般有几下几种方式。

一、直接在页面中添加元素和Angular指令，依赖控制器中构建的属性和方式绑定模板中的元素内容和事件，实现应用需求。

二、通过`type`类型`text/ng-template`的<script>元素来构建一个用于绑定数据的模板，在模板的内部添加数据绑定和元素的事件。

三、通过添加元素的`src`属性，导入一个外部文件作为绑定数据的模板，在导入数据模板时，除添加`src`属性外，还需要使用`ng-include`指令。	

**【实例】构建模板内容**

	<script type="text/ng-template" id="tplbase">
		姓名：[name ],<br /> 邮箱：[email]
	</script>
	<div ng-include src="'tplbase'" ng-controller="c2_9"></div>
	<script type="text/javascript">
		var a2_9 = angular.module('a2_9',[]);
		a2_9.controller('c2_9',['$scope',function($scope){
			$scope.name  = '陶国荣';
			$scope.email = 'tao_guo_rong@163.com'; 
		}]);
	</script>
	
**【实例】使用指令复制元素**

在使用`ng-repeat`指令复制元素的过程中，还提供了几个非常实用的专有变量，可以通过这些变量来处理显示的数据时的各种状态。这些变量的功能是：

`$first` 该变量表示记录是否首条，如果是则返回true，否则返回false。
`$last`  该变量表示记录是否尾条，如果是则返回true，否则返回false。
`$middle`该变量表示记录是否是中间条，如果是则返回true，否则返回false。
`$index` 该变量表示记录的索引号，其对应的值从0开始。

	<div ng-controller="c2_10">
		<ul>
			<li>
				<span>序号</span>
				<span>姓名</span>
				<span>性别</span>
				<span>是否首条</span>
				<span>是否尾条</span>
			</li>
			<li ng-repeat=" stu in data ">
				<span> [$index + 1] </span>
				<span> [stu.name ]</span>
				<span> [stu.sex ]</span>
				<span>[$first ? "是" : "否"]</span>
				<span>[ $last ? "是" : "否"]</span>
			</li>
		</ul>
	</div>
	<script type="text/javascript">
		var a2_10 = angular.module('a2_10',[]);
		a2_10.controller('c2_10',['$scope',function($scope){
			$scope.data  = [
				{ name:"张明明",sex:"女"},
				{ name:"李清思",sex:"女"},
				{ name:"刘小华",sex:"男"},
				{ name:"陈忠忠",sex:"男"}
			];
		}]);
	</script>

**【实例】添加元素样式**

在Angular中，还有另外两个用于添加样式的页面指令，分别为`ng-class-odd`和`ng-class-even`;这两个样式指令是专用于以列表方式显示数据，对应奇数行与偶数行的样式。

	<div ng-controller="c2_11">
		<ul>
			<li ng-class="[ bold ]">
				<span>序号</span>
				<span>姓名</span>
				<span>性别</span>
				<span>是否首条</span>
				<span>是否尾条</span>
			</li>
			<li ng-class-odd="'odd'" 
			    ng-class-even="'even'" 
			    ng-repeat=" stu in data "
				ng-click='li_click($index)'
				ng-class='{focus: $index==focus}'>
				<span>[ $index + 1 ]</span>
				<span>[ stu.name ]</span>
				<span>[ stu.sex ]</span>
				<span>[ $first ? "是" : "否"]</span>
				<span>[ $last ? "是" : "否"]</span>
			</li>
		</ul>
	</div>
	<script type="text/javascript">
		var a2_11 = angular.module('a2_11',[]);
		a2_11.controller('c2_11',['$scope',function($scope){
			$scope.bold = "bold";
			$scope.li_click = function(i){
				$scope.focus = i;
			};
			$scope.data  = [
				{ name:"张明明",sex:"女"},
				{ name:"李清思",sex:"女"},
				{ name:"刘小华",sex:"男"},
				{ name:"陈忠忠",sex:"男"}
			];
		}]);
	</script>

**【实例】控制元素的隐藏与显示状态**

在Angular中，可以通过`ng-show`、`ng-hide`、`ng-switch`指令控制元素隐藏与显示的状态。

	<div ng-controller="c2_12">
		<div ng-show={{isShow}}>zhengwenping</div>
		<div ng-hide={{isHide}}>ttt_@163.com</div>
		<ul ng-switch on={{switch}}>
			<li ng-switch-when="1">zhengwenping</li>
			<li ng-switch-when="2">ttt_@163.com</li>
			<li ng-switch-when="3">更多...</li>
		</ul>
	</div>
	<script type="text/javascript">
		var a2_12 = angular.module('a2_12',[]);
		a2_12.controller('c2_12',['$scope',function(){
			$scope.isShow = true;
			$scope.isHide = false;
			$scope.switch = 3;
		})
	</script>
	
# 四、表单控件

表单是各类控件（如input、select、textarea）的集合体。而Angular也对表单中的控件做了专门的包装，其中最重要的一项就是控件的自我验证功能。

**【实例】表单基本验证功能**

$pristine 表示单或控件内容是否未输入过。

$dirty 表示单或控件内容是否已输入过。

$valid 表示表单或控件内容是否已验证通过。

$invalid表示表单或控件内容是否未验证通过。

$error表示表单控件内容验证时的错误提示信息。
	
	<form name="temp_form"
		ng-submit="save()"
		ng-controller="c2_13">
		<div>
			<input name="t_name" ng-model="name"
				type="text" required>
			<span ng-show="temp_form.t_name.$error.required">
				姓名不能为空！
			</span>
		</div>
		<div>
			<input name="t_email" ng-model="email"
				type="email" required>
			<span ng-show="temp_form.t_email.$error.required">
				邮件不能为空！
			</span>
			<span ng-show="temp_form.t_email.$error.email">
				邮件格式不对！
			</span>
		</div>
		<input type="submit"
			ng-disabled="temp_form.$invaild"
			value="提交" />
	</form>
	<script type="text/javascript">
		var a2_13 = angular.module('a2_13',[]);
		a2_13.controller('c2_13',['$scope',function($scope){
			$scope.name = "wpzheng";
			$scope.email="wpzheng@126.com";
			$scope.save = function(){
				console.log("提交成功！");
			}
		}]);
	</script>

**【实例】表单中的checkbox和radio控件**

在表单控件中，checkbox控件和radio控件与input元素的其他类型控件不同，这两个控件不具有Angular的控件验证功能，而且checkbox有选中和非选中两种状态，而radio只有一种选中状态。

	<form name="temp_form"
		ng-submit="save()"
		ng-controller="c2_14">
		<div>
			<input type="checkbox"
				ng-model="a" ng-true-value="同意"
				ng-false-value="不同意">
			同意
		</div>
		<div>
			性别：
			<input type="radio" ng-model="b" value="男" />男
			<input type="radio" ng-model="b" value="女" />女
		</div>
	
		<input type="submit" value="提交" />
		<div>[c]</div>
	</form>
	<script type="text/javascript">
		var a2_14 = angular.module('a2_14',[]);
		a2_14.controller('c2_14',['$scope',function($scope){
			$scope.a = "同意";
			$scope.b ="男";
			$scope.save = function(){
				$scope.c = "您选择的是："+$scope.a + "和" + $scope.b;
			}
		}]);
	</script>

**【实例】表单中的select控件**

在Angular中，与其他表单中的控件元素相比，select控件的功能要强大很多，它可以借助`ng-options`指令属性，将数组、对象类型的数据添加到<option>元素中，同时还能在添加数据时进行分组显示。

> select控件绑定数据的形式有下面几种

1、绑定简单的数组数据

2、绑定简单的对象数据

3、以分组的形式绑定对象数据

	<form name="temp_form"
	ng-submit="save()"
	ng-controller="c2_15">
	<div>学制：
		<select ng-model="a"
				ng-options="v.id as v.name for v in a_data"
				ng-change="a_change(a)">
			<option value="">--请选择--</option>
		</select>
		<span>[a_show]</span>
	</div>
	<div>班级：
		<select ng-model="b"
				ng-options="v.id as v.name group by v.grade for v in b_data"
				ng-change="b_change(b)">
			<option value="">--请选择--</option>
		</select>
		<span>[b_show]</span>
	</div>
	</form>
	
	<script type="text/javascript">
	var a2_15 = angular.module('a2_15',[]);
	a2_15.controller('c2_15',['$scope',function($scope){
		$scope.a_data = [
			{id:"1001", name:"小学"},
			{id:"1002", name:"初中"},
			{id:"1003", name:"高中"}
		]
		$scope.b_data = [
			{id:"1001", name:"(1)班", grade:"一年级"},
			{id:"1002", name:"(2)班", grade:"一年级"},
			{id:"2001", name:"(1)班", grade:"二年级"},
			{id:"2002", name:"(2)班", grade:"二年级"},
			{id:"3001", name:"(1)班", grade:"三年级"},
			{id:"3002", name:"(2)班", grade:"三年级"}
		];
		$scope.a = "";
		$scope.b = "";
		$scope.a_change = function(a){
			$scope.a_show = "您选择的是:"+ a;
		}
		$scope.b_change = function(b){
			$scope.b_show = "您选择的是:" + b;
		}
	}]);
	</script>
	
# 总结

作为Angular使用的基础知识章节。一开始从Angular表达式讲起。然后过渡到了控制器的构建。接着引入了Angular模板的概念。最后介绍了表单控件的使用方法。
	

