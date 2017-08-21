require('../global/script.js');

var	slidercount = 1;
var slidernamecount= [];
var numberofsliders = 3; 


$(window).resize(function(){
	numslides(); 
	descsize(); 
}); 

var numslides = function(){
	windowwidth = window.innerWidth;
		
		if(windowwidth<650) {
			console.log("window menor que 650"); 
			numberofsliders = 1;
			$("#artslot2").hide();
			$("#artslot3").hide();
			$(".slidedesc").css("margin-top", 110);
			$("#artslot1").css(	{"width": "100%"});

		}
		else {
			numberofsliders = 3;
			$("#artslot2").show();
			$("#artslot3").show();
			$(".slidedesc").css("margin-top", 190);
			$("#artslot1").css({"width": "33%"});
		}

	sliderchange(numberofsliders);
}

var descsize = function(){
	windowwidth = window.innerWidth;
	//console.log(windowwidth); 
	
}

var whgt=0;

var autoslide = function(){
	setTimeout(function(){
		whgt++; 
		//console.log(i); 
		$("#pbar").css("width", whgt*4 + "%");
		//console.log("whgt =" + whgt);
		if(whgt >  24) {
		slidercount = slidercount + numberofsliders;
		sliderchange(numberofsliders);
		}

		else{autoslide();}
	},300);
}

var sliderchange = function (slides) {
	whgt=0;
	$.getJSON("./models/articles.json", function(article){
		articles = article;
		slidernamecount = []
		for (i=0; i<slides; i++){
			
			if (slidercount  + i > articles.range.length) 
				{ 	slidernamecount[i]  = (slidercount + i) % articles.range.length } 	
			else { 	slidernamecount[i]  = slidercount +i};

			if (	slidernamecount[i]  == 0) 
				{	slidernamecount[i]  = articles.range.length };

				position  = "a" + slidernamecount[i];
				slider = i +1

				document.getElementById("anchor" + slider).setAttribute("href", articles[position].href ); 
				document.getElementById("2anchor" + slider).setAttribute("href", articles[position].href );
				document.getElementById("img" + slider).setAttribute("src", articles[position].image);
				document.getElementById("tit" + slider).innerHTML = articles[position].title;
				document.getElementById("tags" + slider).innerHTML = articles[position].tags.join(", ");
				document.getElementById("par" + slider).innerHTML = articles[position].description.substr(0,100);

		}
		
	});
	autoslide();
	
}


$(document).ready(function(){
	numslides();
	sliderchange(numberofsliders);
	descsize(); 
	setTimeout(function(){
		$('#artslider').hide().show(0);
	},100);
});

$(addarrow).click(function(){
		slidercount = slidercount + numberofsliders;
		//console.log("slidercount é " + slidercount);
		sliderchange(numberofsliders); 
});

$(subtractarrow).click(function(){
	if (slidercount -numberofsliders < 1){
		slidercount = slidercount + articles.range.length -numberofsliders;
		//console.log("slidercount é " + slidercount);
		sliderchange(numberofsliders);
	}
	else {
		slidercount = slidercount -numberofsliders
		//console.log("slidercount é " + slidercount);
		sliderchange(numberofsliders); 
		}
});

