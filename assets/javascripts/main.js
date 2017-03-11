$(function(){
	var nEvent = function(){
		var e = window.event || event;
		e.preventDefault();
	};
	var navList = $(".post-list");
	var navMain = $(".nav-pc_tag");
	navMain.find("a").each(function(index,obj){
		$(this).on("click",function(){
			var nameClass = $(this).data("class");
			$("#cb-search-content").focus().val(nameClass);
		})
	})
})
	