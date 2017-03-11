---
layout: post
title :  "如何提升Angular开发效率"
date  :   2015-12-30 11:35:35
img   : "../../../../../assets/images/aa20151230.png"
author: "WP"
intro : "看过React与Angular比渲染速度的话题讨论吗？这篇文章从运行效率的角度把Angular的使用细节重新总结了一下，读完它也许你会对这个话题有了自己的见解，至少又更深入的理解了Angular是如何高效开发的。"
tag: angular

---

与其他前端框架不同，Angular是一款全新的前端MVC框架，对于刚接触它的人来说，需要理清很多新概念，因此，非常容易出现各种类型的错误，导致代码的效率和质量都不高。为这规避这种情况，这篇文章我会从以下五个方面介绍Angular开发中常见的效率的问题。每个问题都会列举实例来说明清楚。

# 一、页面元素的控制

客观地说，使用了Angular框架，建议就不要再调用jQuery框架，以避免两都之间在调用方法时发生冲突。另外，Angular内含jQLite(它是jQuery的一个子集)，许多简单功能、方法以及页面元素操作、事件绑定功能都可以直接通过该框架来实现，而Angular中的$http服务完全可以取代jQuery框架中的$.ajax的相关函数。

因此，当初次使用Angular开发应用时，应该尽量避免调用jQuery框架来定位元素，包括增加或删除节点元素，而应该尽量调用Angular中的方法或编写自己的指令（directives）来实现。

另外，在Angular中，许多原有的JavaScript方法在绑定元素属性时，并不能实现相应的功能，而必须调用Angular中的内部方法，如setTimeout方法。同时，使用双大括号的方式绑定页面元素时，在首次加载中，会出现闪烁的效果。接下来我会针以上列出来的问题通过例子做详细说明以及碰到这些问题应该怎么处理。


**1、调用element方法控制DOM元素**

在使用Angular框架开发应用时，尽量不要直接通过JavaScript代码直接操作DOM元素，也不要引入jQuery框架来操作DOM元素，而是通过Angular内部的jQLite来操作，代码如下：

`angular.element(element)`

上述这行代码中，形参element的类型为字符型，它的值是一个字符串或DOM元素，它的功能是调用Angular内部的jQLite库，返回一个jQuery对象。

**[功能描述]**

在页面中，添加两个按钮，单击第一个“添加元素”按钮后，将在页面中显示新添加的<div>元素；单击第二个“删除元素”按钮后，将移除新添加的<div>元素。

**[实现代码]**

	<div ng-controller="c10" class="frame" id="control">
		<button ng-click="add()">添加元素</button>
		<button ng-click="del()">删除元素</button>
	</div>
	============================================上html
	angular.module('a10',[])
	.controller('c10',function($scope,$compile){
		$scope.hello = 'hello,angular';
		$scope.log = function(){
			console.log('这是动态添加的方法');
		}
		var html = "<div ng-click='log()'>{{hello}}</div>";
		var template = angular.element(html);
		var newHtml = $compile(template)($scope);
		$scope.add =function({angular.element(document.getElementById("control")).append(newHtml);
		}
		$scope.del = function(){
			if(newHtml){
				newHtml.remove();
			}
		}
	})
	===========================================上JavaScript
	
**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g1.png)

**[源码分析]**

在这个例子的JavaScript代码中，在构建控制器时，除注入$scope服务外，还注入了$compile服务，注入后者的目的是初始化相关的依赖，并对生成的jQuery对象template进行编译，以便于调用append方法，将编译后的内容追加到指定ID号的<div>元素中，实现动态添加元素的功能。

在进行编译之前，先定义了一个名为html的字符串变量，用于保存需要添加的元素字符，在字符中，可以直接使用ng-click指定需要绑定的函数名；然后，调用Angular内部的element方法将字符串转换成一个jQuery对象；最后，该对象调用$compile服务进行编译。

需要说明的是：调用element方法可以非常方便地动态创建元素，并且在创建过程中还可以为元素绑定事件，而这些功能的实现都是基于Angular内部自带的jQLite库，而无需再导入jQuery库。因此，这种创建DOM元素的方法非常实用和高效。推荐使用。

**2、解决setTimeout改变属性的无效**

在JavaScript中，setTimeout是window对象中的一个方法，它的功能是在指定的时间之后，执行对应的函数或表达式。但在Angular中，如果想使用setTimeout方法来同步属性值时，则不能达到相应的效果，这是由于在Angular中，大部分操作之后的效果都由$apply方法自动在页面中完成。如果你调用了非Angular中的方法或函数，如setTimeout方法，那么系统就不会调用$apply方法在页面中同步操作结果，导致该方法执行后，并没有改变页面中对对应的属性值。

因此，要解决调用setTimeout方法不能同步属性值的情况，只需要在setTimeout方法中，将执行的函数或表达式包含在$apply方法中或者直接调用与setTimeout方法对应的$timeout服务，这样就可以直接在页面中同步函数或表达式操作后的效果。

**[功能描述]**

在页面中，通过双大括号绑定的方式，将控制器代码中的“tip”属性与一个<p>元素绑定，“tip”属性的初始值”hello“，5秒后，自动显示为“欢迎来到angular世界”。

**[实现代码]**

	<div ng-controller="c10" class="frame" id="control">
		<p>{{ tip }}</p>
	</div>
	===========================================上html
	// 错误写法
		setTimeout(function(){
			$scope.tip = '欢迎来到angular世界'
		},5*1000)
	// 正确写法一
		setTimeout(function(){
			$scope.$apply(function(){
				$scope.tip = '欢迎来到angular世界';
			});
		},5*1000)
	// 正确写法二
		$timeout(function(){
			$scope.tip = '欢迎来到angular世界';
		},5*1000)
	===========================================上JavaScript

**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g2.png)

**[源码分析]**

在这个例子的JavaScript代码中，如果使用错误代码的写法在控制器中调用setTimeout方法，5秒后重置“tip”属性值，但并不能同步到页面中绑定的<p>元素中，这主要是由于setTimeout方法并不属于Angular中的内部方法，导致执行时并不触发$apply方法，所以并不同步至页面。

因此，只要在setTimeout方法中调用$apply方法，如代码中的“正确写法一”所示，或者直接调用Angular内部与setTimeout方法同功能的—$timeout方法，如代码中的“正确写法二”所示。当然，$timeout方法是Angular内部一个定时器方法，在调用它之前，必须先注入$timeout服务，才能进行调用。通过调用该方法，可以实现控制器与页面绑定时同步数据的效果。

**3、解决双大括号绑定元素时的闪烁问题**

当我们在使用chrome浏览器加载Angular开发的应用时，如果应用的页面中使用双大括号绑定数据，那么，页面在首次加载时，会出现“闪烁”现象。所谓的“闪烁”现象指的是页面先出现双大括号字符和括号中绑定的变量名，几秒后，再显示绑定的数据内容，中间的这段过程，称为“闪烁”现象。虽然它非常快，但对于用户的UI体验来说， 是非常不友好的。

出现这种现象，是因为在通常情况下，只有当页面中的DOM元素全部加载完成后，JavaScript代码才会开始去操作它。同样道理，在Angular中，也要等到DOM元素加载完成后，Angular才会对页面进行解析与渲染。因此，在操作之前，应先对双大括号绑定的元素进行隐藏。

在Angular内部，可以向元素中添加“ng-cloak”属性来实现元素隐藏的效果。如果是绑定纯文字内容，建议使用“ng-bind”方式，而非双又括号方式来实现数据的绑定。

**[功能描述]**

在页面中，通过<div>元素以双大括号的方式绑定控制器中的一个名为“message”属性，当页面加载完成时，在<div>元素中显示绑定的“message”属性值。

**[实现代码]**

	<div ng-controller="c10" class="frame" id="control">
		<div id="template" ng-cloak>{{message}}</div>
	</div>
	========================================上html
	angular.module('a10',[])
	.controller('c10',function($scope){
		$scope.message = 'hello';
	})
	========================================上JavaScript

**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g3.png)

**[源码分析]**

在上在这个例子中，由于<p>元素通过双大括号的方式绑定了控制器中的“message”属性，为了防止页面在加载过程中出现“闪烁”现象，向p元素添加了“ng-cloak”属性。严格来说，“ng-cloak”是Angular的一个指令，添加后，页面会在<head>部分插入一段css样式，通过这段样式，Angular会将带“ng-cloak”属性的元素进行隐藏，即将它的“display”值设置为“none”。

通过这样设置，<p>元素在正式被Angular解析和渲染之前是隐藏的，直到Angular解析带有“ng-cloak”属性的<p>元素时，将它的“ng-cloak”属性和样式全部移除。

# 二、使用ng-repeat时的注意事项

在Angular中，ng-repeat是一个非常重要的内部指令，它的功能是在遍历数组过程中生成DOM元素，实现在页面中展示列表数据中的功能，功能强大、使用简单，但如果使用不当也容易出现一些问题。

在使用过程中，如果有过滤器时，调用$index并不能准确定位到对应的记录。另外，在调用ng-repeat指令重新请求数据，并不是在原来DOM元素中更新数据，而是再次新建DOM元素。此外，在通过父的scope对象更新数据时，不能直接更新遍历的数据组源，而必须逐个更新。

**1、注意ng-repeat中的索引号**

当需要删除使用ng-repeat指令遍历后生成的某一个DOM元素时，我们经常会调用index索引号来定位需要删除元素的内部元素编号。如果遍历数据的过程中，没有调用过滤，那么，这种方法是有效的，但一旦添加了过滤器，这个索引号则无效，而必须调用实际的item对象。

**[功能描述]**

在页面中，通过ng-repeat指令以列表的形式显示分数大于60的学生人员信息，并在列表中添加一个“删除”按钮，当单击该按钮时，则将在浏览器控制台中输出item列表对象和索引号$index对应对象的值，观察这两个对象值之间的区别。

**[实现代码]**

	<div class="frame">
		<ul ng-controller="c10">
			<li>
				<span>序号</span>
				<span>姓名</span>
				<span>分数</span>
				<span>操作</span>
			</li>
			<li ng-repeat="item in items | filter : fscore">
				<span>{{item.id}}</span>
				<span>{{item.name}}</span>
				<span>{{item.score}}</span>
				<span ng-click="remove(item,$index)">删除</span>
			</li>
		</ul>
	</div>
	=====================================================上html
	angular.module('a10',[])
	.controller('c10',function($scope){
		$scope.items = getStu();
		$scope.fscore = function(e){
			return e.score > 60;
		}
		$scope.remove = function(item,index){
			console.log(item);
			console.log(index);
			var item2 = $scope.items[index];
			console.log(item2);
		}
	})
	function getStu(){
		return [
		{id:1010,name:"张立秋",score:10},
		{id:1020,name:"李山浃",score:70},
		{id:1030,name:"胡正清",score:90},
		{id:1040,name:"刘三夫",score:60},
		{id:1050,name:"闻钟华",scroe:50}
		]
	}
	===================================================上JavaScript
	
**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g4.png)

![MacDown logo](../../../../../assets/results/20151230/g11.png)

**[源码分析]**

在本示例的源码中，首先，通过ng-repeat指令显示分数值大于60的学员信息。因为有过滤的条件，因此，在绑定数据源时，添加了一个名为“fscore”的过滤器，它的功能就是过滤“分数”值大于60的学员信息。

然后，当单击列表数据中某一行的“删除”按钮时，将调用绑定的remove方法，并向该方法传递两个实参，一个是该行的item对象，另一个是对应的$index索引号。在控制器定义的remove方法中，将传入的索引号放入$scope.items数组中，获取对应的元素对象item2。

然而，从输出的结果中可以看到，当单击“删除”链接时，获取的并不是通过$index索引号定位item2对象，而是直接传递的item对象，因此，在使用ng-repeat指令显示列表数据时，如果有过滤器，那么不能直接通过$index索引号来定位对象。

**2、使用track by排序ng-repeat中的数据**

在使用ng-repeat指令显示列表数据时，如果需要更新数据，那么页面中原来的DOM元素在更新过程中并不会被重用，而是会被删除，再重新生成与上次结构一样的元素。反复生成DOM元素对页面的加载来说，并不是一件好事，它仅会延迟数据加载的速度，而且非常浪费页面资源。为了解决这种现象，我们在使用ng-repeat指令更新数据时，需要使用track by对数据源进行排序。

**[功能描述]**

在页面中，通过ng-repeat指令显示3条初始化数据，单击“更新”按钮后，使用新获取的3条数据替换原有初始化的内容。在绑定数据时，添加track by表达式并按ID排序，同时，在浏览器的控制台中输出每次绑定的数据源，观察排序与不排序时数据的内容变化。

**[实现代码]**

	<div ng-controller="c10" class="frame">
		<button ng-click="update()">更新</button>
		<ul ng-repeat="user in users track by user.id">
			<li>
				<span>{{user.id}}</span>
				<span>{{user.name}}</span>
			</li>
		</ul>
	</div>
	==========================================上html
	angular.module('a10',[])
	.controller('c10',function($scope){
		var users = [
			{id:1010,name:"张立秋",score:10},
			{id:1020,name:"李山浃",score:70},
			{id:1030,name:"胡正清",score:90}
		];
		$scope.users = users;
		console.log($scope.users);
		$scope.update = function(){
			var result = [
				{id:1040,name:"刘三夫",score:40},
				{id:1050,name:"闻钟华",scroe:50},
				{id:1060,name:"钱少忠",score:60}
			];
			$scope.users = result;
			console.log($scope.users);
		}
	
	})
	===============================================上JavaScript
	
**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g5.png)

![MacDown logo](../../../../../assets/results/20151230/g6.png)

**[源码分析]**

在这个例子代码中，当使用ng-repeat指令绑定数据源时，如果不使用track by表达式排序，那么，当单击“更新”按钮重置新数据时，初始化数据的DOM元素将全部被删除，并重新生成与初始化数据结构一样的DOM元素来加载和渲染新获取的数据。

出现这种重复生成相同DOM元素的情况，根源在于每次替换数据源时，都会导致ng-repeat指令为每一个数据元素自动生成一个全新的字符型Key值，这个值由Angular内部的nextUid方法以自增的方式生成，因此，缺少标识DOM元素的唯一属性，导致每次更新时，没有办法重用原有的DOM元素，只能反复重新生成。

为了解决这种情况，首先，在数据源中尽可能增加一个唯一的标识属性值，如本示例中的id号；然后，在绑定数据源时，调用track by表达式指定排序的属性名，如id号，通过这种方式将会删除自动添加的字符型Key值，使DOM元素有了唯一的标识属性。因此，当下次进行数据更新时，将会自动调用这些已有的DOM元素，从而加快页面渲染和加载的速度。

**3、正确理解ng-repeat指令中scope的继承关系**

在调用ng-repeat指令显示数据时，ng-repeat在新建DOM元素时，也为每个新建的DOM元素创建了独立的scope作用域。虽然如此，但它们的父级scope作用域是相同的，都是构建控制器时注入的$scope对象，调用angular.element(domElement).scope方法可以获取某个DOM元素所对应的作用域，通过某个元素的作用域又可以访问到它的父级作用域，从而修改绑定的数据源。

**[功能描述]**

在页面中，首先，通过ng-repeat指令以列表的形式显示3条学生数据信息；然后，新添加3个按钮。当单击“按钮1”时，在控制台输出列表中每个元素scope作用域是否相同；单击“按钮2”时，在控制台输出列表中某个元素的父级scope作用域获取绑定的数据源，并进行更新。

**[实现代码]**

	<div ng-controller="c10" class="frame">
		<input type="button" value="按钮1" ng-click="change1();">
		<input type="button" value="按钮2" ng-click="change2();">
		<input type="button" value="按钮3" ng-click="change3();">
		<li id="spn{{user.id}}" ng-repeat="user in users track by user.id">
			<span>{{user.id}}</span>
			<span>{{user.name}}</span>
			<span>{{user.score}}</span>
		</li>
	</div>
	======================================================上html
	angular.module('a10',[])
	.controller('c10',function($scope){
		$scope.users = [
			{id:1010,name:"张立秋",score:10},
			{id:1020,name:"李山浃",score:70},
			{id:1030,name:"胡正清",score:90}
		];
		$scope.change1 = function(){
			var scope1 = angular.element(document.getElementById("spn1010")).scope();
			var scope2 = angular.element(document.getElementById("spn1020")).scope();
			console.log(scope1 == scope2);
		}
		$scope.change2 = function(){
			var scope = angular.element(document.getElementById("spn1020")).scope();
			console.log(scope.$parent == $scope);
		}
		$scope.change3 = function(){
			var scope = angular.element(document.getElementById("spn1030")).scope();
			scope.$parent.users = [
				{id:1040,name:"刘三夫",score:40},
				{id:1050,name:"闻钟华",scroe:50},
				{id:1060,name:"钱少忠",score:60}
			]
		}
	})
	=====================================================上JavaScript
	
**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g7.png)

**[源码分析]**

在这个例子中，首先，当单击”按钮1”时，执行绑定的change1方法，在该方法中，分别调用angular.element(domElement).scope方法获取列表中两个不同id号元素的scope作用域。由于ng-repeat指令在新创建元素时，对应的作用域是相互独立，因此，控制台输出false值。

接下来，当单击“按钮2”时，执行绑定change2()方法，在该方法中，由于列表中单个独立元素的父级作用域是控制器在构建时注入的$scope对象，因此，控制台输出true值。

最后，在单击“按钮3”执行change3方法时，由于通过$parent方式可以访问到父级作用域，而通过父级作用域则可以重置ng-repeat指令绑定的数据源，因此，单击“按钮3”时，将重置后的数据源绑定到列表中，并展示在页面中。

# 三、解决单击按钮事件中的冒泡现象

冒泡事件是DOM元素中的一种事件类型，简单而言，当单击子节点元素时，会向上触发父节点、祖先级节点的单击事件，出现冒泡现象会导致许多父级的事件被自动触发，页面效果无法控制，因此，必须解决这种元素的冒泡事件。

解决的方法是，当子节点元素触发单击事件后，就需要终止该事件的冒泡，终止的方法是调用事件本身的stopPropagation方法，即event.stopPropagation，该方法的功能是终止事件的传播，在事件的节点上调用事件后，不再将事件分派到其他节点上。

**[功能描述]**

在页面中添加一个复选框元素，并将它的值绑定ng-model指令。另外，再添加一个按钮元素，当单击该按钮时，将根据复选框的选中状态，如果选中，则阻止按钮单击时的冒泡现象，否则，不阻止按钮单击时的冒泡现象。阻止或不阻止，主要看单击按钮时父元素是否响应单击事件。

**[实现代码]**

	<div ng-controller="c10 as o" class="frame">
		<div ng-click="o.click('父级',$event)">
			<br />
			<input type="checkbox" ng-click="o.change($event)" ng-model="o.stopPropagation">
			<button type="button" ng-click="o.click('按钮',$event)">点击我</button>
		</div>
	</div>
	================================================================上html
	angular.module('a10',[])
	.controller('c10',function($scope){
		var obj = this;
		obj.click = function(name,$event){
			console.log(name + '被触发');
			if(obj.stopPropagation){
				$event.stopPropagation();
			}
		};
		obj.change = function($event){
			$event.stopPropagation();
		}
		return obj;
	})
	===========================================================上JavaScript
	
**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g8.png)

**[源码分析]**

在这个例子中，当用户单击按钮时，将触发控制器中自定义的click方法，该方法需要传入两个参数，一个是触发事件的元素名称，如“按钮”，另一个是Angular内部的常量—$event。在Angular中，当元素执行事件函数时，将通过$event常量返回当前触发事件的对象元素，因此，可以调用这个返回常量的stopPropagation方法来阻止元素事件的冒泡现象。

在自定义的click方法中，接收到传回的元素名称和$event常量后，先检测复选框是否被选中，如果被选中，则调用$event常量的stopPropagation方法阻止元素事件的冒泡，如果不选中，则不执行阻止元素事件冒泡的代码，而进行事件的默认操作。

在这里，由于复选框元素本身也是一个子节点，为了防止它在单击时同样出现元素事件的冒泡现象，需要在复选框的单击事件中调用$event常量的stopPropagation方法进行冒泡阻止，完整代码如自定义change方法所示。

# 四、释放多余的$watch监测函数

我们知道，在Angular中，数据的双向绑定是它非常强大的功能，也是它区别于其他前端框架的特征之一，而这个功能的实现离不开$watch函数。如果在移动端设备中，众多的数据双向绑定必然诞生大量的$watch函数执行，这些$watch函数的执行效率过低等性能问题，因此，当不需要时，必须及时释放多余的$watch监测函数。

在Angular中，当$watch函数被直接调用时，将返回一个释放$watch绑定的unbind函数。因此，根据这个特征，当需要释放某个多余的$watch监测函数时，只需要再次调用这个$watch函数就可以轻松地释放它的监测功能。

**[功能描述]**

在页面中，先添加一个输入框元素，并通过ng-model指令实现输入内容的双向绑定，当输入框的内容发生变化时，新添加的<div>元素将动态显示它变化后的总次数。此外，再添加一个“停止”监测按钮，单击该按钮时，将释放输入框的$watch监测函数，<div>元素将停止显示总次数。

**[实现代码]**

	<div ng-controller="c10" class="frame">
		<input type="text" ng-model="content">
		<div>第{{num}}次数据变化</div>
		<button ng-click="stopWatch()">停止监测</button>
	</div>
	==================================================html
	
	angular.module('a10',[])
	.controller('c10',function($scope,$timeout){
		$scope.num = 0;
		$scope.stopWatch = function(){
			contentWatch();
		}
			
		var contentWatch = $scope
		.$watch('content',function(newVal,oldVal){
			if(newVal === oldVal){return;}
			$scope.num++;
		})
	})
	==================================================javascript

**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g9.png)

**[源码分析]**

在上面的例子中，由于输入框元素通过ng-model指令实现了值的双向绑定，因此Angular将会通过$watch监测“content”值的变化，即自动执行$scope.$watch方法。

需要说明的是，当页面加载完成时，$watch函数将会被首次执行。为了使首次监测时不进行累计数，根据首次执行函数newValue和oldValue的值都为“undefined”的特征，即两者此时拥有相同的值，如果相同，则调用return语句，退出累计数。

当单击“停止监测”按钮时，将会调用stopWatch方法，在这个方法中，调用contentWatch方法，而这个方法对应的就是$watch函数的返回值，即返回一个释放$watch绑定的unbind函数，最终实现停止监测的效果。

# 五、解决ng-if中ng-model值无效的问题

在Angular中，`ng-if`指令的功能与`ng-show`指令相似，都用于控制元素的显示与隐藏，但两者又有区别，ng-if指令会移除DOM原有的元素，而ng-show指令只是将元素的`display`属性值设置为`none`。因此，在使用必须根据实现的需要进行选择使用。

此外，与其他指令一样，ng-if指令也会创建一个子级作用域，因此，如果在ng-if指令中添加了元素，并向元素属性增加ng-model指令，那么ng-model指令对应的作用域属性子级使用域。

**[功能描述]**

在页面中，分别以普通方式和ng-if方式添加两个复选框元素，并在元素的属性中增加ng-model属性双向绑定选择值，在ng-if方式中，复选框元素绑定的ng-model属性值必须与控制器定义的值保持同步，以实现双向绑定的效果。

**[实现代码]**

	<div ng-controller="c10" class="frame">
		<div>
			a的值：{{a}}<br />
			b的值：{{b}}
		</div>
		<div>
			普通方式：<input type="checkbox" ng-model="a"/>
		</div>
		<div ng-if="!a">
			ngif方式：<input type="checkbox" ng-model="$parent.b"/>
		</div>
	</div>
	=========================================================html
	angular.module('a10',[])
	.controller('c10',function($scope){
		$scope.a = false;
		$scope.b = false;
	})
	==========================================================javascript
	
**[页面效果]**

![MacDown logo](../../../../../assets/results/20151230/g10.png)

**[源码分析]**

在本示例的代码中，普通方式中复选框元素的ng-model属性绑定控制器中的变量a，ng-if方式中复选框元素的ng-model属性绑定控制器中的变量b。因为是双向数据绑定，因此，当复选框的选中状态发生变化时，对应绑定的变量值也将会自动同步变化。

在ng-if方式中，每个包含的元素都拥有自己的作用域，因此，复选框元素也拥有自己的$scope作用域，相对于控制器作用域来说，这个作用域属于一个子级作用域，所以，如果它想绑定控制器中的变量值，必须添加$parent标识，只有这样才能访问到控制器中的变量。

因此，解决ng-if中ng-model值无效问题，主要方法就是在绑定值时添加$parent标识，或者用ng-show指令代替ng-if指令，这两种方法都可以达到同样的页面效果。




