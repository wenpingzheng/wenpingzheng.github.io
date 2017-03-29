---
layout: post
title :  "node语法-文件系统(filesystem)"
date  :   2017-03-22 16:48:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "文件系统使用细节"
tag : node
---


## 文件路径操作

> var path = require('path');


### 1、查询路径

	// 当前文件夹和文件名的完整路径
	console.log(__dirname);
	console.log(__filename);
	
	// 当前执行目录shell所有位置
	console.log(process.cwd());
	
	
	process.chdir("/");
	// /表示shell跑到根目录下
	console.log(process.cwd()); 
	
	// /usr/local/bin/node 表示bin目录安装地方
	console.log(process.execPath);
	
### 2、操作路径

	var dir = ["foo", "bar", "baz"];// array
	// foo\bar\baz
	console.log(dir.join('\\')); // windows
	// foo/bar/baz
	console.log(dir.join('/'));// mac linux
	
	// if in window it will print '\' but here is '/';
	console.log(path.sep); 
	// foo/bar/baz
	console.log(dir.join(path.sep)); 
	
### 3、环境变量
> path.delimiter

	// 输出 :
	console.log(path.delimiter);
	process.env.PATH.split(path.delimiter).forEach(function(dir){
		console.log(dir);
	});
	console.log(process.env.PATH);
	
### 4、返回文件扩展名
> path.extname

	var fileName = "/foo/bar/baz.txt";
	var extension = path.extname(fileName);
	// .txt
	console.log(extension);
	
### 5、返回文件名
> path.basename

	var fileName = "/foo/bar/baz.txt";
	var file = path.basename(fileName)
	// baz.txt
	console.log(file);
	
### 6、返回父文件夹的路径
> path.dirname

	var fileName = "/foo/bar/baz.txt";
	var file1 = path.dirname(fileName);
	// /foo/bar
	console.log(file1);
	
### 7、序列化路径
> path.normalize

	var dirName = "/foo/bar/.././bar/../../baz";
	var normalized = path.normalize(dirName);
	// 同样的功能
	// var normalized = path.join("/foo/bar", ".././bar", "../..", "/baz");
	// /baz
	console.log(normalized);
	
### 8、相对路径
> path.relative

	var from = '/foo/bar';
	var to = '/baz/biff';
	var relative = path.relative(from,to);
	// ../../baz/biff
	console.log(relative);
	
### 9、其它
> path.resolve、path.join、path.isAbsolute、path.parse、path.format

	// /Users/zhengwenping/works/webServer/nodestudy/foo/bar/baz
	// 类似命令行cd一个个执行 执行路径
	console.log(path.resolve('../foo/bar','./baz'));
	
	// ../foo/bar/baz 拼路径
	console.log(path.join('../foo/bar','./baz'));
	
	// 是否是一个绝对路径isAbsolute
	// false true
	console.log(path.isAbsolute('./foo/bar'),path.isAbsolute('/foo/bar'));
	
	// 输出路径信息
	var parsed = path.parse('/home/user/dir/file.txt');
	/*
	{ root: '/',
	  dir: '/home/user/dir',
	  base: 'file.txt',
	  ext: '.txt',
	  name: 'file' 
	}
	*/
	// console.log(parsed);
	
	
	// path.format
	
	var pt = path.format({
		dir:'/home/user/dir',
		base:'file.txt'
	});
	// /home/user/dir/file.txt
	console.log(pt);
	
## 文件系统操作
> var fs = require("fs") 

**接下来就是文件系统 纯JS没法实现 只能调用底层c++/c实现方法**

### 1、判断文件是否存在
> fs.exists() and fs.existsSync() return boolean

	var path = __dirname + "/filesystem.js";
	var existsSync = fs.existsSync(path); // 同步
	console.log(existsSync); // true;
	var existsSync = fs.exists(path,function(exists){
		console.log(exists); // 异步 true;
	})
	
### 2、文件属性
> fs.stat fs.lstat fs.fstat

	
	fs.stat('./end.jpeg',function(error,stats){
		console.log(stats);
	});
	
	// 快捷文件文件图标返回不是实际对应文件大小
	fs.lstat('./end.jpeg',function(error,stats){
		console.log(stats);
	});
	
	fs.open('./end.jpeg','a',function(error,fd){
		fs.fstat(fd,function(error,stats){
			console.log(stats);
		})
	})
	
	/*
	{ dev: 16777220,
	  mode: 33188,
	  nlink: 1,
	  uid: 501,
	  gid: 20,
	  rdev: 0,
	  blksize: 4096,
	  ino: 22663534,
	  size: 1921,
	  blocks: 8,
	  atime: 2017-02-22T07:22:10.000Z,
	  mtime: 2016-10-30T01:10:50.000Z,
	  ctime: 2016-11-03T09:23:16.000Z,
	  birthtime: 2016-10-30T01:10:50.000Z }
	*/

### 3、读文件内容
> fs.readFile fs.readFileSync

	var path = __dirname + "/oread.txt";
	fs.readFile(path,"utf8",function(error,data){
		if(error) {
			console.error("read error:"+ error.message);
		}else {
			console.log(data);
		}
	})

### 4、写入文件内容
> fs.writeFile fs.writeFileSync

	var data = "Lorem ipsum dolor sit amet sssss";
	fs.writeFile(path, data, function(error) {
		if(error){
			console.log("write error: "+ error.message );
		}else{
			console.log("Successfully wrote" + path);
		}
	})

### 5、重命名
> fs.rename

	var oldPath = __dirname + "/oread.txt";
	var newPath = __dirname + "/read.txt";
	
	fs.rename(oldPath,newPath,function(error){
		if(error) {
			console.error("rename error:" + error.message);
		}else{
			console.log("Successfully renamed the file!");
		}
	})

### 6、新建文件夹
> mkdir mkdirSync

	var path = __dirname + "/feo";
	fs.mkdir(path,function(error){
		
	});

### 7、删除文件
> fs.unlink

	var path = __dirname + "/foo/txt.js";
	fs.unlink(path,function(error){
		if(error){
			console.error("unlink error:"+error.message);
		}
	})

### 8、返回目录下所有文件
> fs.readdir() and fs.readdirSync()

	var path = process.cwd();
	fs.readdir(path, function(error,files){
		console.log(files);
	})
	/*
	[ '.DS_Store',
	  'end.jpeg',
	  'feo',
	  'filesystem.js',
	  'foo',
	  'read.txt',
	  'tmp.js' ]*/

### 9、删除文件夹
> fs.rmdir() rmdirSync()

	var path = __dirname + "/feo";
	fs.rmdir(path,function(error){
		if(error){
			console.error("unlink error:"+error.message);
		}
	})









 





