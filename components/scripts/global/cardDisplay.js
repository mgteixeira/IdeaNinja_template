ejs = require('ejs');
var data = require ('./data.js'); 
articles = data.articles
require ('./search.js'); 

window.order = [ 2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 , 19, 20, 21, 22, 23, 24]; 

//console.log("cardDisplay"); 

var cardparts = {
	article: "parts/cards/article.ejs", 
	video: "parts/cards/video.ejs"
}; 

//onload fires initcards
window.onload = function (e){
	var evento = e; 
	initcards(evento);

}
	/*
window.imageresize = function () {
	//console.log("imageresize")
cardwidth = $(".card-image").css("width")
	cardwidth = cardwidth.substring(0, cardwidth.length -2)
	cardwidth = Number(cardwidth)
	cardheight= cardwidth*0.66
	$(".card-image").css({height: cardheight})
}
*/

// loads ejs data into the object cardparts so that it can render 
var initcards = function (evento){
	$.get(cardparts.article, function(data1){
    	cardparts.article = data1;
    	$.get(cardparts.video, function(data2){
      		cardparts.video = data2;
      		if(order.length !== 0){
      			//console.log("order size = " + order.length)
      			rendercards(evento)
      			}

      	
      			
      		})//card.parts.articles
      	})//cardparts.video
  	}//initfiles

// render cards render the homepage
window.rendercards = function rendercards (evento) {
	//console.log("rendercards")
	//console.log(evento)
	var i = 0
	var popOrder = {}

	var addarticle = function () {
	 	$("#endofcards").before(
		ejs.render( cardparts.article, {
				"title":arttitle, 
				"description": artdescription, 
				"image": artimage,
				"href": arthref
				} )//ejs.renderFile
			)//before
		}//add html
	
	if(evento.type === "load" && window.location.pathname !== "/" ) {}
			else {
				

	$.each(order, function(){
		var orderid = order[i]
		var popOrderfunc = function(card) {return card.id == orderid }
		popOrder[orderid] =  articles.find(popOrderfunc)
		//if case - article, tools, service, video
		artdescription = popOrder[orderid].description;
		artdescription = artdescription.substring(0,150) + "...";
		arttitle = popOrder[orderid].title;
		artimage = popOrder[orderid].image;
		arthref = popOrder[orderid].href; 
		addarticle()
		
		i++
	})//Each
}//if
}//rendercards
//on search