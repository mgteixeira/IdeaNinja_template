//trying to make this work
require('jquery-hammerjs'); 


// 
ejs = require('ejs');
EJS = ejs; 
var data = require ('./data.js'); 
articles = data.articles
require ('./search.js'); 

window.order = [ 28, 25, 2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 26,  13, 14, 15, 16, 17, 18 , 19, 20, 21, 22, 23, 24, 27]; 

//console.log("cardDisplay"); 

var cardparts = {
	article: "parts/cards/article.ejs", 
	video: "parts/cards/video.ejs",
	institutional_video: "parts/cards/inst_video.ejs",
	tool: "parts/cards/tool.ejs"
}; 

//onload fires initcards
window.onload = function (e){
	var evento = e; 
	initcards(evento);

}

// loads ejs data into the object cardparts so that it can render 
var initcards = function (evento){
	$.get(cardparts.article, function(data1){
    	cardparts.article = data1;
    	$.get(cardparts.video, function(data2){
      		cardparts.video = data2;
      		$.get(cardparts.institutional_video, function(data3){
      		cardparts.institutional_video = data3;
      			$.get(cardparts.tool, function(data4){
      			cardparts.tool = data4;
	      		if(order.length !== 0){
    	  			//console.log("order size = " + order.length)
      				rendercards(evento)
      				}//if
      			})//cardparts.tool
      			}) //cardparts.inst_video			
      		})//cardparts.video
      	})//card.parts.articles
  	}//initfiles

// render cards render the homepage
window.rendercards = function rendercards (evento) {
	//console.log("rendercards")
	//console.log(evento)
	var i = 0
	var popOrder = {}

	var addarticle = function () {
		console.log("addarticle")
	 	$("#endofcards").before(
		ejs.render( cardparts.article, {
				"title":arttitle, 
				"description": artdescription, 
				"image": artimage,
				"href": arthref
				} )//ejs.renderFile
			)//before
		}//add 

	var addvideo = function () {
		console.log("addvideo")
	 	$("#endofcards").before(
		ejs.render( cardparts.video, {
				"description": artdescription, 
				"href": arthref
				} )//ejs.render
			)//before
		}//add 

	var addtool = function () {
		console.log("addtool")
		$("#endofcards").before(
		ejs.render( cardparts.tool, {
				"description": artdescription, 
				"image": artimage,
				"href": arthref
				} )//ejs.render
			)//before
		}//add 

	var addinstvideo = function () {
		console.log("addinstvideo")
	 	$("#endofcards").before(
		ejs.render( cardparts.institutional_video, {
				"description": artdescription, 
				"href": arthref
				} )//ejs.render
			)//before
		}//add 
	
	if(evento.type === "load" && window.location.pathname !== "/" ) {}
			else {
				

	$.each(order, function(){
		var orderid = order[i]
		var popOrderfunc = function(card) {return card.id == orderid }
		popOrder[orderid] =  articles.find(popOrderfunc)
		//switch case - article, tools, service, video
		
		switch (popOrder[orderid].type){
			
			case "article":
				artdescription = popOrder[orderid].description;
				artdescription = artdescription.substring(0,150) + "...";
				arttitle = popOrder[orderid].title;
				artimage = popOrder[orderid].image;
				arthref = popOrder[orderid].href; 
				console.log("article " + arttitle + artdescription + artimage + arthref)
				addarticle()
				break;

			case "video": 
				artdescription = popOrder[orderid].description;
				artdescription = artdescription.substring(0,150) + "...";
				arthref = popOrder[orderid].href; 
				console.log("video " + artdescription + arthref)
				addvideo()
				break; 

			case "inst_video": 
				artdescription = popOrder[orderid].description;
				artdescription = artdescription.substring(0,150) + "...";
				arthref = popOrder[orderid].href; 
				console.log("inst_video " + artdescription + arthref)
				addinstvideo()
				break; 

			case "tool": 
				artdescription = popOrder[orderid].description;
				artdescription = artdescription.substring(0,150) + "...";
				artimage = popOrder[orderid].image;
				arthref = popOrder[orderid].href; 
				console.log("tool " + artdescription + arthref + artimage)
				addtool()
				break;
			}//switch
		i++
	})//Each
}//if


}//rendercards
//on search