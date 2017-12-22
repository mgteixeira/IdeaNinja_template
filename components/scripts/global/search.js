var data = require ('./data.js'); 
articles = data.articles 

var idx = lunr(function () {
  this.ref('id')
  this.field('title')
  this.field('description')
  this.field('html')

  articles.forEach(function (doc) {
    this.add(doc)
  }, this)
})

//var qry = $(this).val();

$('#search').submit(function(e){
  e.preventDefault()
  window.evento = e
  //console.log("search")
  //console.log(evento)
  //console loging the results
  var res = idx.search( $('#searchinput').val())
  //console.log(res)
  order = []
  for ( i=0; i<res.length;  i++) {
    order.push(res[i].ref)
    };//for
 $("div").remove('.feed')
 $("div").remove('.card-panel')
 //console.log("beforerendercards")
 //console.log(order)
 
  if(order.length == 0){
  $("#searchheader").html("<p>No results. please search for other kewords</p>")
  } else {
    $("#searchheader").html("<h2>Search results</h2>")
    rendercards(evento)
    }//else
})//search


$('#searchmobile').submit(function(e){
  e.preventDefault()
  window.evento = e
  //console.log("searchmobile")
  //console.log(evento)
  //console loging the results
  var res = idx.search( $('#searchmobileinput').val() )
  //console.log(res)
  order = []
  for ( i=0; i<res.length;  i++) {
  order.push(res[i].ref)
  };//for
 $("div").remove('.feed')
 $("div").remove('.card-panel')
 //console.log("beforerendercards")
 //console.log(order)
 
 if(order.length == 0){
  $("#searchheader").html("<p>No results. please search for other kewords</p>")
  } else {
      $("#searchheader").html("<h2>Search results</h2>")
      rendercards(evento)

    }//else
  $(".drag-target").click()
})//searchmobile


