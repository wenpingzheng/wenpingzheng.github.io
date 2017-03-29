---
layout: post
title :  "node语法-流（实例）(stream)"
date  :   2017-03-27 10:11:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "流的使用细节"
tag : node
---


## 整体认识一下流的概念

> 少量引用网文的内容 、 解决两个问题：一是为什么有流的概念及流在node中的表现形式。二、为什么又有管道的概念及使用。

nodejs的`fs`模块并没有提供一个`copy`的方法，但我们可以很容易的实现一个：

	var source = fs.readFileSync('/path/to/source', {encoding: 'utf8'});
	fs.writeFileSync('/path/to/dest', source);
	
这种方式是把文件内容全部读入内存，然后再写入文件，对于小型的文本文件，这没有多大问题，比如`grunt-file-copy`就是这样实现的。但是对于体积较大的`二进制`，比如音频、视频文件，动辄几个GB大小，如果使用这种方法，很容使内存`爆仓`。<span class="error">理想的方法应该是读一部分，写一部分，不管文件有多大，只要时间允许，总会处理完成，这里就需要用到流的概念。</span>
	

![MacDown logo](../../../../../assets/results/20170327/1.png)

上面图所示，我们把文件比作装水的桶，而水就是文件的内容，我们用一根管子（pipe）连接两个桶使得水从一个桶流入另一个桶，这样就慢慢的实现了大文件的复制过程。

`Stream`在nodejs中是`EventEmitter`的实现，并且有多种实现形式，例如

	* http responses request
	* fs read write streams
	* zlib streams
	* tcp sockets
	* child process stdout and stderr

上面的文件复制可以简单实现一下：

	var fs = require('fs');
	var readStream = fs.createReadStream('/path/to/source');
	var writeStream = fs.createWriteStream('/path/to/dest');
	
	// 当有数据流出时，写入数据
	readStream.on('data',function(chunk){
		wirteStream.write(chunk);
	}) 

	// 当没有数据时，关闭数据流
	readStream.on('end', function(){
		writeStream.end();
	})
	
上面的写法有一些问题，<span class="error">如果写入的速度跟不上读取的速度，有可能导致数据丢失。</span>正常情况应该是，写完一段，再读取下一段，如果没有写完的话就让读取流暂停，等写完再继续，于是代码可以修改为：

	var fs = require('fs');
	var readStream = fs.createReadStream('/path/to/source');
	var writeStream = fs.createWriteStream('/path/to/dest');
	
	// 当有数据流出时，写入数据
	readStream.on('data', function(chunk){
		// 如果没有写完，暂停读取流
		if(writeStream.write(chunk) == false){
			readStream.pause();
		}
	})
	
	// 写完后，继续读取
	writeStream.on('drain',function(){
		readStream.resume();
	})
	
	// 当没有数据时，关闭数据流
	readStream.on('end', function(){
		writeStream.end();
	})


或者使用更直接的`pipe`

	// pipe自动调用了data,end等事件
	fs.createReadStream('/path/to/source').pipe(fs.createWriteStream('/path/to/dest'));
	
下面是一个更加完整的复制文件的过程

	var fs = require('fs'),
    path = require('path'),
    out = process.stdout;

	var filePath = 'QQ.dmg';
	
	var readStream = fs.createReadStream(filePath);
	var writeStream = fs.createWriteStream('filew.dmg');
	
	var stat = fs.statSync(filePath);
	
	
	var totalSize = stat.size;
	var passedLength = 0;
	var lastSize = 0;
	var startTime = Date.now();
	
	readStream.on('data', function(chunk) {
	  console.log(chunk.length);
	  passedLength += chunk.length;
	  if (writeStream.write(chunk) === false) {
	    readStream.pause();
	  }
	});
	
	readStream.on('end', function() {
	  writeStream.end();
	});
	
	writeStream.on('drain', function() {
	  readStream.resume();
	});
	
	setTimeout(function show() {
	  var percent = Math.ceil((passedLength / totalSize) * 100);
	  var size = Math.ceil(passedLength / 1000000);
	  var diff = size - lastSize;
	  lastSize = size;
	  out.clearLine();
	  out.cursorTo(0);
	  out.write('已完成' + size + 'MB, ' + percent + '%, 速度：' + diff * 2 + 'MB/s');
	  if (passedLength < totalSize) {
	    setTimeout(show, 500);
	  } else {
	    var endTime = Date.now();
	    console.log();
	    console.log('共用时：' + (endTime - startTime) / 1000 + '秒。');
	  }
	}, 500);





 





