$(function(){
	var navList = $(".post-list");
	var navMain = $(".site-nav");
	navMain.find("a").each(function(index,obj){
		$(this).on("click",function(){
			var nameClass = $(this).data("class");
			navList.find("li").hide();
			navList.find("."+nameClass).show();
		})
	})
})
	