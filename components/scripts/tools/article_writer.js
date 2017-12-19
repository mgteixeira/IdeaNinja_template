
//  Article Writer Tool

var countable = require('countable'); //looping wordcount (see http://sacha.me/Countable/)
var Countable = countable
var Clipboard = require('clipboard');
var Ejs = require('ejs');
/* --- VARIABLES --- */

// Inputs - id : { words maximum : int, words now : int, keywords now : int, words : array }
var inputs = {
  "#articleName": { "max" : 8, "now" : 0, "k_now" : 0, "words" : [] },
  "#lead": { "max" : 30, "now" : 0, "k_now" : 0, "words" : [] },

  "#p1-h": { "max" : 8, "now" : 0, "k_now" : 0, "words" : [] },
  "#p1-s1": { "max" : 20, "now" : 0, "k_now" : 0, "words" : [] },
  "#p1-s2": { "max" : 20, "now" : 0, "k_now" : 0, "words" : [] },
  "#p1-s3": { "max" : 20, "now" : 0, "k_now" : 0, "words" : [] }
};

// Images - id : { src : string, alt : string }
var images = {};

// Keywords - id : value
var keywords = {
    "#wk1" : "",
    "#wk2" : "",
    "#wk3" : "",
    "#wk4" : "",
    "#wk5" : "",
    "#ak1" : "",
    "#ak2" : "",
    "#ak3" : "",
    "#ak4" : "",
    "#ak5" : ""
};

// Files
var files = {
  p : "parts/awt/paragraph.ejs",
  s : "parts/awt/sentence.ejs"
};

// Regex
var regex = {
  p: /#p(\d)-h/i,
  s: /#p(\d)-s(\d)/i,
  i: /#p(\d)-img/i
};
 
/* --- EVENTS --- */
/* Events that occur many times in code and/or uses the same variable.
 * Other single events can be placed with systems code.
 */

// Ready
$(function(){
  readyLocalStorage();
  initFiles();
});


/* --- SYSTEMS --- */

// Clipboard System

var clip = new Clipboard('.clip');

clip.on('success', function(e) {
    var btnText = e.trigger.innerHTML;
    e.trigger.innerHTML = 'Copied!';
    setTimeout(function(){
      e.clearSelection();
      e.trigger.innerHTML = btnText;
    }, 3000); // 3000 miliseconds are 3 seconds
});

clip.on('error', function(e) {
    e.trigger.innerHTML = fallbackMessage(e.action);
    e.clearSelection();
});

function fallbackMessage(action) {
    var actionMsg = '';
    var actionKey = (action === 'cut' ? 'X' : 'C');
    if (/iPhone|iPad/i.test(navigator.userAgent)) {
        actionMsg = 'No support :(';
    } else if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
    } else {
        actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
    }
    return actionMsg;
}

// New Article System

$("#new-article").click(function(){
    if(localStorage.length !== 0){
        if(window.confirm('Are you sure you want to erase your article to start a new one ?')){
          // Clean the localStorage
          localStorage.clear();
          location.reload(true);
        }
    }
});

// Preview System

$("#preview").mouseover(function(){
  $("#clip").html("");
  $.each(inputs, function(key, value){
    if (key === "#articleName") {
      $("#clip").append("<h1>" + value.words.join(" ") + "</h1>");
    } else if (key == "#lead"){
      $("#clip").append("<p>" + value.words.join(" ") + "</p>");
    }
  });

  // These loops are for writing paragraphs and sentences in correct order defining p and s dynamicaly 
  for(var p = 1; ; p++){
    if(!mouseP(p)){
      break;
    } else {
      for(var s = 1; ; s++){
        if(!mouseS(p, s)){
          break;
        }
      }
    }
  }

  $.each(images, function(key, value){
    $("#p" + regex.i.exec(key)[1] + "-prev").after("<img src='" + value.src + "' alt='" + value.alt + "'/>");
  });
});

function mouseP(p){
  var created = false;
  $.each(inputs, function(key, value){
    if (regex.p.test(key) && regex.p.exec(key)[1] == p){
      $("#clip").append("<h2>" + value.words.join(" ") + "</h2>");
      created = true;
      return false;
     }
  });
  return created;
}


function mouseS(p, s){
  var created = false;
  $.each(inputs, function(key, value){
    if (regex.s.test(key) && regex.s.exec(key)[1] == p && regex.s.exec(key)[2] == s){
      var id = "p" + p + "-prev";
      if($("#" + id).length === 0){
        $("#clip").append("<p id='" + id + "'></p>");
      }
      //value.words[0].replace( /\b\w/g, function(H){ return H.toUpperCase() });
      //value.words[0];
      //console.log(value);
      a = value.words.join(" ")
      a = a.substring(0,1).toUpperCase() + a.substring(1)
      //console.log(a)
      $("#" + id).text($("#" + id).text() + " " + a );
      created = true;
      return false;
     }
  });
  return created;
}

// Keyword System

// In focusout, get the val input, clean it, put it in correct keywords key and put it in localStorage
$.each(keywords, function(key, value){
  $(key).focusout(function(){
    $(key).val(function(index, value){
      keywords[key] = value.toLowerCase().replace(/[^a-zA-Z0-9]/g,'');
      return keywords[key];
    });
  });
});


// Words System

// countKeywords - Count the keywords in each input
function countKeywords (key, value){
  // Get the val input, clean it and put it in correct words key.
  $(key).val(function(val_index, val_value){
    value.words = val_value.toLowerCase()
    //.replace(/[^a-zA-Z0-9 ]/g,'')
    .trim().split(/\s+/g);
    //console.log(value.words.join(' ')); 
    return value.words.join(' ');
  });
  // Count all the keywords used
  var count = 0;
  $.each(keywords, function(kw_key, kw_value){
    for(var i in value.words){
      if(value.words[i] === kw_value && kw_value !== ""){
        count++;
      }
    }
  });
  value.k_now = count;
  $(key + "-nkeys").text(count);
}

// Count the words in each input
function countWords (key, value){
  Countable.on(document.querySelector(key), function (counter) {
    value.now = counter.words;
    if(counter.words > value.max) {
      $(key + '-count').text("Alert: Too many words");
    } else {
      $(key + '-count').text(counter.words);
    }
  });
}

// Count all words and keywords
function countAllWords(){
  var words = 0;
  var kwords = 0;
  $.each(inputs, function(key, value){
    words += value.now;
    kwords += value.k_now;
  });
  $("#totwords").text(words);
  $("#totkeywords").text(kwords);
}

// Paragraphs System

// initFiles - Function used in $.ready for search the correct files BEFORE initPage
function initFiles(){
  $.get(files.p, function(data){
    files.p = data;
    $.get(files.s, function(data){
      files.s = data;
      initPage();

      setInputs();

      // Watch inputs
      $.each(keywords, function(key, value){
        $(key).focusout(function(){
          setLocalStorage(keywords, "keywords");
        });
      });

      // Backup if something get's wrong
      $.each(inputs, function(key, value){
        countKeywords(key, value);
        countWords(key, value);
        countAllWords();

        $(key).focusout(function(){
          countKeywords(key, value);
          countAllWords();
        });
      });
    });
  });
}

// initPage - Function used only in initFiles
function initPage(){
  // These loops are for write paragraphs and sentences in correct order
  for(var p = 1; ; p++){
    if(!eachP(p)){
      break;
    } else {
      for(var s = 1; ; s++){
        if(!eachS(p, s)){
          break;
        }
      }
    }
  }
  $("#button-p").click(function(){
    createParagraph();
  });
}

function eachP(p){
  var created = false;
  $.each(inputs, function(key, value){
    if(regex.p.test(key) && regex.p.exec(key)[1] == p){
      createParagraph(regex.p.exec(key)[1]);
      created = true;
      return false;
    }
  });
  return created;
}

function eachS(p, s){
  var created = false;
  $.each(inputs, function(key, value){
    if(regex.s.test(key) && regex.s.exec(key)[1] == p && regex.s.exec(key)[2] == s){
      createSentence(regex.s.exec(key)[1], regex.s.exec(key)[2]);
      created = true;
      return false;
    }
  });
  return created;
}

// createParagraph - p (number): nr of paragrapf
// This function is used for initPage and button event
function createParagraph(p){
  var temp = (typeof p === "undefined");
  if(typeof p === "undefined"){
    // Verify the last paragraph number
    var last_p = 0;

    $.each(inputs, function(key, value){
      if(regex.p.test(key) && regex.p.exec(key)[1] > last_p){
        last_p = regex.p.exec(key)[1];
      }//if
    });//each
    p = ++last_p;
  }//if primeiro paragrafo

  // Add HTML it to the page
  var inp = "#p" + p + "-h";
  if(last_p > 9){ alert("no more than 9 paragraph are allowed")
  }else{
  $("#button-p").before(ejs.render(files.p, {"paragraph" : p}));

  // Add more properties to the object
  if(!inputs[inp]){
    inputs[inp] = { "max" : 8, "now" : 0, "k_now" : 0, "words" : [] };
  }
  if(!images["#p" + p + "-img"]){
    images["#p" + p + "-img"] = { "src" : "", "alt" : "" };
  }

  // Add the correct events: inp, btn, img
  $(inp).focusout(function(){
    countKeywords(inp, inputs[inp]);
    countWords(inp, inputs[inp]);
    countAllWords();
    setLocalStorage(inputs, "inputs");
  });
  $("#button-s-p" + p).click(function(){
    createSentence(p);
  });
  $("#p" + p + "-img").focusout(function(){
    images["#p" + p + "-img"].src = $("#p" + p + "-img").val();
    setLocalStorage(images, "images");
  });
  $("#p" + p + "-img-alt").focusout(function(){
    images["#p" + p + "-img"].alt = $("#p" + p + "-img-alt").val();
    setLocalStorage(images, "images");
  });
}
  if(temp){
    createSentence(p, 1);
    createSentence(p, 2);
    createSentence(p, 3);
  }
}

// createSentence - p (number): nr of paragrapf ; s (number): nr of sentence
function createSentence(p, s){
  // If doesn't have s, the s is equal to the last sentence number plus one.
  if(typeof s === 'undefined'){
    // Verify the last sentence number
    var last_s = 0;
    $.each(inputs, function(key, value){
      if(regex.s.test(key) && regex.s.exec(key)[1] == p){
        if(regex.s.exec(key)[2] > last_s){
          last_s = regex.s.exec(key)[2];
        } else {
          return false;
        }
      }
    });
    s = ++last_s;
  }

  // Add HTML to the page
  var inp = "#p" + p + "-s" + s;

  if(last_s > 9){ alert("no more than 9 setences per paragraph are allowed")
  }else{
  $("#button-s-p" + p).before(ejs.render(files.s, {"paragraph" : p, "sentence" : s}));

  // Add more properties to the object
  if(!inputs[inp]){
    inputs[inp] = { "max" : 20, "now" : 0, "k_now" : 0, "words" : [] };
  }

  // Add the correct events: inp
  $(inp).focusout(function(){
    countKeywords(inp, inputs[inp]);
    countWords(inp, inputs[inp]);
    countAllWords();
    setLocalStorage(inputs, "inputs");
  });
}
}
// Session Storage System

// readyLocalStorage - Function to the ready event
function readyLocalStorage () {
  if(localStorage.getItem("local") === "true"){
    getLocalStorage(inputs, "inputs");
    getLocalStorage(images, "images");
    getLocalStorage(keywords, "keywords");
  }
}

// setLocalStorage - Get the obj and iterate all varible inside it
// If an object have another object, so call again the function with the mother string.
function setLocalStorage(obj, mother){
  localStorage.setItem("local", "true");
  $.each(obj, function(key, value){
    if($.type(value) === "object"){
      if (mother !== "") {
        return setLocalStorage(value, mother + ":" + key);
      } else {
        return setLocalStorage(value, key);
      }
    } else {
      if(mother !== ""){
        localStorage.setItem(mother + ":" + key, value);
      } else {
        localStorage.setItem(key, value);
      }
    }
  });
  return;
}

// getLocalStorage - Get all variables in localStorage and populate the correct system variable
function getLocalStorage(obj, mother){
  // Get the key number
  for (var key_nr = 0; key_nr < localStorage.length; key_nr++) {

    // Get the key name
    var key_name = localStorage.key(key_nr);

    // Split name of key
    var key_array = key_name.split(":");

    // Value
    var value = localStorage.getItem(key_name);
    switch (key_array[key_array.length - 1]) {
      case "max":
      case "now":
      case "k_now":
        value = Number(value);
        break;
      case "words":
        value = value.split(',');
        break;
    }

    // Construct the object
    if (key_array[0] == mother) {
      if(key_array.length > 2){
        if($.type(obj[key_array[1]]) != "object"){
          obj[key_array[1]] = {};
        }
        obj[key_array[1]][key_array[2]] = value;
      } else {
        obj[key_array[1]] = value;
      }
    }
  }
}

// setInputs - This function is used on document.ready for populate the inputs.
function setInputs (){
  $.each(inputs, function(key, value){
    $(key).val(value.words.join(" "));
  });
  $.each(images, function(key, value){
    $(key).val(value.src);
    $(key + "-alt").val(value.alt);
  });
  $.each(keywords, function(key, value){
    $(key).val(value);
  });
}
