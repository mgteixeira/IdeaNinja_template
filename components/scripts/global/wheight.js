//window height
var wheight = $(window).height(); //get height of the window

$('.fullheight').css('height', wheight);

$(window).resize(function() {
  var wheight = $(window).height(); //get height of the window
  $('.fullheight').css('height', wheight);
}); //on resize


jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}}});


$(".arrowdown").hover(
		function(){
				$(this).stop().animate({bottom:-30},300, "easeOutBounce")
				},
		function(){
				$(this).stop().animate({bottom: 0},300, "easeOutBounce")
				}
);
