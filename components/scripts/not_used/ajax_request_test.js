//login with facebook
$('#loginfb').click(
	function(){
	window.location.href="https://vast-cliffs-91195.herokuapp.com/api/auth/facebook/callback"
	/*
	function(e){
	e.preventDefault(); 
	var settings_fblogin = {
		"url": "https://vast-cliffs-91195.herokuapp.com/api/auth/facebook/callback",
  		"method": "GET",
  		"success": function(req, res) {console.log("Login success");},
  		"error":  function(req, res) {console.log("Login failed" , res);}
	};
	$.ajax(settings_fblogin).done();
	console.log("done fb login")
	*/
});

//login Google
$('#logingoog').click(function(e){
	e.preventDefault(); 
	var settings_fblogin = {
		"url": "https://vast-cliffs-91195.herokuapp.com/api/auth/google/callback",
  		"method": "GET",
  		"success": function(req, res) {console.log("Login sucess");},
  		"error":  function(req, res) {console.log("Login failed");}
	};
	$.ajax(settings_fblogin).done();
	console.log("done goog login")
});


//User
$('#post_user').click(function(e){
	e.preventDefault(); 
	//console.log("click"); 
	var settings_post = {
  		"url": "https://vast-cliffs-91195.herokuapp.com/api/login/",
  		"method": "POST",
  		"data": {
    		"_id": $('#user_in').val(),
    		"pw": $('#pw_in').val()
  		}, 
  		"success": function(data){console.log("sucess", data);},
	 	"error":  function(data){console.log("error", data);}
	}; 
	var settings_get = {
		"url": "https://vast-cliffs-91195.herokuapp.com/api/login/",
  		"method": "GET",
  		"success": function(data){
  					//console.log("get sucess");
  					for (var i =0; i<data.length; i++) {
  						$("#documents").append("<p> user: " + data[i]["_id"] + "<br> pw: " + data[i]["pw"] + "</p>"); 
  					}; 
  				},
	 	"error":  function(err){console.log("error", err);}
	};
	
	$.ajax(settings_post).done();
	$("#documents").replaceWith("<span id='documents'></span></p>"); 
	$.ajax(settings_get).done();
});

$('#delete_user').click(function(e){
	e.preventDefault(); 
	//console.log("click"); 
	var settings_delete = {
  		"url": "http://vast-cliffs-91195.herokuapp.com/api/login/" + $('#user_in').val(),
  		"method": "DELETE",
  		"success": function(data){console.log("sucess", data);},
	 	"error":  function(data){console.log("error", data);}
	}; 
	$.ajax(settings_delete).done();
});

$('#put_user').click(function(e){
	e.preventDefault(); 
	//console.log("click"); 
	var settings_put = {
  		"url": "http://vast-cliffs-91195.herokuapp.com/api/login/" + $('#user_in').val(),
  		"method": "PUT",
  		"data": {
    		"pw": $('#pw_in').val()
  		}, 
  		"success": function(data){console.log("sucess", data);},
	 	"error":  function(data){console.log("error", data);}
	}; 
	$.ajax(settings_put).done();
});

//Article//
$('#post_article').click(function(e){
	e.preventDefault(); 
	var settings_art_post = {
  		"url": "https://vast-cliffs-91195.herokuapp.com/api/article/",
  		"method": "POST",
  		"data": {
    		"_id": $('#article_id').val(), 
    		"article": $('#article1').val()
  		}, 
  		"success": function(data){console.log("sucess", data);},
	 	"error":  function(data){console.log("error", data);}
	 }; 
	 $.ajax(settings_art_post).done();
});

$('#delete_article').click(function(e){
	e.preventDefault(); 
	//console.log("click"); 
	var settings_art_del = {
  		"url": "https://vast-cliffs-91195.herokuapp.com/api/article/" + encodeURIComponent($('#article_id').val()), 
  		"method": "DELETE",
  		"success": function(data){console.log("sucess", data);},
	 	"error":  function(data){console.log("error", data);}
	}; 
	$.ajax(settings_art_del).done();
});

$('#put_article').click(function(e){
	e.preventDefault(); 
  a = "https://vast-cliffs-91195.herokuapp.com/api/article/" + encodeURIComponent($('#article_id').val()); 
	console.log(a); 
	var settings_art_put = {
  		"url": a, 
  		// + $('#article_id').val(),
  		"method": "PUT",
  		"data": {
    	"article": $('#article1').val()
  		}, 
  		"success": function(data){console.log("sucess", data);},
	 	"error":  function(data){console.log("error", data);}
	}; 
	$.ajax(settings_art_put).done();
});