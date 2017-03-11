---
layout: post
title :  "JavaScript有哪些技巧"
date  :   2016-12-16 11:15:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "分享一些JavaScript的技巧，秘诀和最佳实践，除了少数几个外，不管是浏览器的JavaScript引擎，还是服务器端JavaScript解释器，均适用。"
tag: js
---
		
**1、首次为变量赋值时务必使用var关键字**

变量没有声明而直接赋值的话，默认会作为一个新的全局变量，要尽量避免使用全局变量。

**2、使用===取代==**

== 和！=操作符会在需要的情况下自动转换数据类型。但 ===和！==不会，它们会同时比较值 和数据 类型，这也使用它们要比==和！=快。

**3、undefined、null、0、false 、NaN、空字符串的逻辑均为false。**

**4、行尾使用分号**

实践中最好还是使用分号，忘了定也没事，大部分情况下JavaScript解释器都会自动添加。

**5、使用对象构造器**


	function Person(firstName,lastName) {
	    this.firstName = firstName;
	    this.lastName = lastName;
	}
	var Saad = new Person("Saad","Mousliki");


**6、小心使用typeof、instanceof和contructor**

**7、使用自调用函数**


	(function(){
	    // 置于此处的代码将自动执行
	})();
	(function(a,b){
	    var result = a+b;
	    return result;
	})(10,20);


**8、从数组中随机获取成员**


	var items = [12,548,'a',2,5478,'foo',233,,'ss'];
	var randomItem = items[Math.floor(Math.random() * items.length)];


**9、获取指定范围内的随机数**


	var x = Math.floor(Math.random()*(max-min+1)) + min;


**10、生成从0到指定值的数字数组**


	var numbersArray = [], max= 100;
	for(var i= 1;numbesArray.push(i++) < max); // numbers = [1,2,3,...100]


**11、生成随机的字母数字字符串**


	function generateRandomAlphaNum(len) {
	    var rdmString = "";
	    for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
	    return  rdmString.substr(0, len);
	}


**13、字符串去空格**

	String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, "");};

新的JavaScript引擎已经有了trim()的原生实现

**14、数组之间追加**

	var array1 = [12 , "foo" , {name :"Joe"} , -2458];
	var array2 = ["Doe" , 555 , 100];
	Array.prototype.push.apply(array1, array2);
	console.log(array1) // [12, "foo", Object, -2458, "Doe", 555, 100]

**15、对象转成数组**

	var obj ={length:3,0:'first',1:'second',2:'dd'};
	var argArray = Array.prototype.slice.call(obj);
	console.log(argArray);//['first','second','dd'];

**16、验证是否是数字**

// parseFloat:指定字符串中的首个字符是否是数字不是则返回NaN

	function isNumber(n){
	    return !isNaN(parseFloat(n)) && isFinite(n);
	}

**18、获取数组中最大值和最小值**

	var  numbers = [5, 458 , 120 , -215 , 228 , 400 , 122205, -85411]; 
	var maxInNumbers = Math.max.apply(Math, numbers); 
	var minInNumbers = Math.min.apply(Math, numbers);

**19、清空数组**

	var myArray = [12 , 222 , 1000 ];  
	myArray.length = 0; // myArray will be equal to [].

**22、在条件中使用逻辑与域**

	var foo = 10;  
	foo == 10 && doSomething(); // is the same thing as if (foo == 10) doSomething(); 
	foo == 5 || doSomething(); // is the same thing as if (foo != 5) doSomething();

逻辑或还可用来设置默认值，比如函数参数的默认值 

	function doSomething(arg1){ 
	    arg1 = arg1 || 10; // arg1 will have 10 as a default value if it’s not already set
	}

**23、使得map()函数方法对数据循环**

	var squares = [1,2,3,4].map(function (val) {  
	    return val * val;  
	}); 
	// squares will be equal to [1, 4, 9, 16]

**24、保留指定小数位数**

	var num =2.443242342;
	num = num.toFixed(4);  // num will be equal to 2.4432

**26、通过for-in循环检查对象的属性**

需要防止迭代的时候进入到对象的原型属性中


	for(var name in object) {
	    if(object.hasOwnProperty(name)) {
	        // do something with name
	   }
	}

**27、逗号操作符**
逗号运算符，它将先计算左边的参数，再计算右边的参数值。然后返回最右边参数的值。

	var a = 0; 
	var b = ( a++, 99 ); 
	console.log(a);  // a will be equal to 1 
	console.log(b);  // b is equal to 99

**28、临时存储用于计算和查询的变量**

在jQuery选择器中，可以临时存储整个DOM元素

	var navright = document.querySelector('#right'); 
	var navleft = document.querySelector('#left'); 
	var navup = document.querySelector('#up'); 
	var navdown = document.querySelector('#down');

**29、提前检查传入isFinite()的参数**

	isFinite(0/0) ; // false
	isFinite("foo"); // false
	isFinite("10"); // true
	isFinite(10);   // true
	isFinite(undefined);  // false
	isFinite();   // false
	isFinite(null);  // true，这点当特别注意

**31、用JSON来序列化与反序列化**

	var person = {name :'Saad', age : 26, department : {ID : 15, name : "R&D"} };
	var stringFromPerson = JSON.stringify(person);
	/* stringFromPerson 结果为 "{"name":"Saad","age":26,"department":{"ID":15,"name":"R&D"}}"   */
	var personFromString = JSON.parse(stringFromPerson);
	/* personFromString 的值与 person 对象相同  */

**41、使用XMLHttpRequests时注意设置超时**

XMLHttpRequests在执行时，当长时间没有响应（如出现网络问题等）时，应该中止掉连接，可以通过setTimeout()来完成这个工作，同时需要注意的是，不要同时发起多个XMLHttpRequest请求。


	var xhr = new XMLHttpRequest (); 
	xhr.onreadystatechange = function () {  
	    if (this.readyState == 4) {  
	        clearTimeout(timeout);  
	        // do something with response data 
	    }  
	}  
	var timeout = setTimeout( function () {  
	    xhr.abort(); // call error callback  
	}, 60*1000 /* timeout after a minute */ ); 
	xhr.open('GET', url, true);  
	xhr.send();







