---
layout: post
title :  "merge和rebase怎么理解"
date  :   2017-02-28 18:55:35
img   : "../../../../../assets/images/1.png"
author: "WP"
intro : "git做为一个受大家喜爱的项目管理软件，熟练使用它变得相当重要，其中有两个命令merge和rebase作用极其相似，我们来分析一下它们之间的本质分别 "
categories: git
---

假设有一个主分支master，然后在新建一个分支dev；主分支中有一个文件1.py，1.py内容是a=1。

#一、merge或者rebase之前准备工作
	
	cd ~/desktop/gitTuT  //  开发文件依然放在桌面上
	git branch dev // 新建一个分支
	// 确保在master分支上，更改1.py的内容a=1;b=2;
	git commit -am "change2 in master" // 添加和提交一块操作
	git checkout dev // 切换到dev分支上
	// 更改1.py的内容a=1;c=3
	git commit -am "change3 in dev" // 添加和提交一块操作
	git checkout master  // 回到master分支


提交时间：C1 C2 C3

![MacDown logo](../../../../../assets/results/20170228/1.jpg)

以上操作对于接下来的merge和rebase操作是一样的

#二、若是merge操作

	git merge dev
	// 若有冲突，解决冲突
	git commit -am "change4 in merge master" //合并后提交
	git log --oneline --graph // 查看提交状态


![MacDown logo](../../../../../assets/results/20170228/2.jpg)

提交时间：

master：C1 C2 C3 C4

dev：C1 C3

#三、若是rebase操作

	git rebase dev
	// 解决冲突 
	git add 1.py // 添加但不是需要commit
	git rebase --conbinue
	git log --oneline --graph //查看主分支提交顺序


提交时间：

master：C1 C3 C2

dev：C1 C3


![MacDown logo](../../../../../assets/results/20170228/3.jpg)

#四、有关于两者的区别

第一：commit提交的时间顺序不一样

第二：正回为第一点，在rebase时候 由于中间插入了C3提交导致C2不在是rebase之前的那个C2（因为reset C2时不在是回到之前的那个文件状态）












 





