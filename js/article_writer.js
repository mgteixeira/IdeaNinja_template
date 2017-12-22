(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

//  Article Writer Tool

var countable = require('countable'); //looping wordcount (see http://sacha.me/Countable/)
var Countable = countable;
var Clipboard = require('clipboard');
var Ejs = require('ejs');
/* --- VARIABLES --- */

// Inputs - id : { words maximum : int, words now : int, keywords now : int, words : array }
var inputs = {
  "#articleName": { "max": 8, "now": 0, "k_now": 0, "words": [] },
  "#lead": { "max": 30, "now": 0, "k_now": 0, "words": [] },

  "#p1-h": { "max": 8, "now": 0, "k_now": 0, "words": [] },
  "#p1-s1": { "max": 20, "now": 0, "k_now": 0, "words": [] },
  "#p1-s2": { "max": 20, "now": 0, "k_now": 0, "words": [] },
  "#p1-s3": { "max": 20, "now": 0, "k_now": 0, "words": [] }
};

// Images - id : { src : string, alt : string }
var images = {};

// Keywords - id : value
var keywords = {
  "#wk1": "",
  "#wk2": "",
  "#wk3": "",
  "#wk4": "",
  "#wk5": "",
  "#ak1": "",
  "#ak2": "",
  "#ak3": "",
  "#ak4": "",
  "#ak5": ""
};

// Files
var files = {
  p: "parts/awt/paragraph.ejs",
  s: "parts/awt/sentence.ejs"
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
$(function () {
  readyLocalStorage();
  initFiles();
});

/* --- SYSTEMS --- */

// Clipboard System

var clip = new Clipboard('.clip');

clip.on('success', function (e) {
  var btnText = e.trigger.innerHTML;
  e.trigger.innerHTML = 'Copied!';
  setTimeout(function () {
    e.clearSelection();
    e.trigger.innerHTML = btnText;
  }, 3000); // 3000 miliseconds are 3 seconds
});

clip.on('error', function (e) {
  e.trigger.innerHTML = fallbackMessage(e.action);
  e.clearSelection();
});

function fallbackMessage(action) {
  var actionMsg = '';
  var actionKey = action === 'cut' ? 'X' : 'C';
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

$("#new-article").click(function () {
  if (localStorage.length !== 0) {
    if (window.confirm('Are you sure you want to erase your article to start a new one ?')) {
      // Clean the localStorage
      localStorage.clear();
      location.reload(true);
    }
  }
});

// Preview System

$("#preview").mouseover(function () {
  $("#clip").html("");
  $.each(inputs, function (key, value) {
    if (key === "#articleName") {
      $("#clip").append("<h1>" + value.words.join(" ") + "</h1>");
    } else if (key == "#lead") {
      $("#clip").append("<p>" + value.words.join(" ") + "</p>");
    }
  });

  // These loops are for writing paragraphs and sentences in correct order defining p and s dynamicaly 
  for (var p = 1;; p++) {
    if (!mouseP(p)) {
      break;
    } else {
      for (var s = 1;; s++) {
        if (!mouseS(p, s)) {
          break;
        }
      }
    }
  }

  $.each(images, function (key, value) {
    $("#p" + regex.i.exec(key)[1] + "-prev").after("<img src='" + value.src + "' alt='" + value.alt + "'/>");
  });
});

function mouseP(p) {
  var created = false;
  $.each(inputs, function (key, value) {
    if (regex.p.test(key) && regex.p.exec(key)[1] == p) {
      $("#clip").append("<h2>" + value.words.join(" ") + "</h2>");
      created = true;
      return false;
    }
  });
  return created;
}

function mouseS(p, s) {
  var created = false;
  $.each(inputs, function (key, value) {
    if (regex.s.test(key) && regex.s.exec(key)[1] == p && regex.s.exec(key)[2] == s) {
      var id = "p" + p + "-prev";
      if ($("#" + id).length === 0) {
        $("#clip").append("<p id='" + id + "'></p>");
      }
      //value.words[0].replace( /\b\w/g, function(H){ return H.toUpperCase() });
      //value.words[0];
      //console.log(value);
      a = value.words.join(" ");
      a = a.substring(0, 1).toUpperCase() + a.substring(1);
      //console.log(a)
      $("#" + id).text($("#" + id).text() + " " + a);
      created = true;
      return false;
    }
  });
  return created;
}

// Keyword System

// In focusout, get the val input, clean it, put it in correct keywords key and put it in localStorage
$.each(keywords, function (key, value) {
  $(key).focusout(function () {
    $(key).val(function (index, value) {
      keywords[key] = value.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      return keywords[key];
    });
  });
});

// Words System

// countKeywords - Count the keywords in each input
function countKeywords(key, value) {
  // Get the val input, clean it and put it in correct words key.
  $(key).val(function (val_index, val_value) {
    value.words = val_value.toLowerCase()
    //.replace(/[^a-zA-Z0-9 ]/g,'')
    .trim().split(/\s+/g);
    //console.log(value.words.join(' ')); 
    return value.words.join(' ');
  });
  // Count all the keywords used
  var count = 0;
  $.each(keywords, function (kw_key, kw_value) {
    for (var i in value.words) {
      if (value.words[i] === kw_value && kw_value !== "") {
        count++;
      }
    }
  });
  value.k_now = count;
  $(key + "-nkeys").text(count);
}

// Count the words in each input
function countWords(key, value) {
  Countable.on(document.querySelector(key), function (counter) {
    value.now = counter.words;
    if (counter.words > value.max) {
      $(key + '-count').text("Alert: Too many words");
    } else {
      $(key + '-count').text(counter.words);
    }
  });
}

// Count all words and keywords
function countAllWords() {
  var words = 0;
  var kwords = 0;
  $.each(inputs, function (key, value) {
    words += value.now;
    kwords += value.k_now;
  });
  $("#totwords").text(words);
  $("#totkeywords").text(kwords);
}

// Paragraphs System

// initFiles - Function used in $.ready for search the correct files BEFORE initPage
function initFiles() {
  $.get(files.p, function (data) {
    files.p = data;
    $.get(files.s, function (data) {
      files.s = data;
      initPage();

      setInputs();

      // Watch inputs
      $.each(keywords, function (key, value) {
        $(key).focusout(function () {
          setLocalStorage(keywords, "keywords");
        });
      });

      // Backup if something get's wrong
      $.each(inputs, function (key, value) {
        countKeywords(key, value);
        countWords(key, value);
        countAllWords();

        $(key).focusout(function () {
          countKeywords(key, value);
          countAllWords();
        });
      });
    });
  });
}

// initPage - Function used only in initFiles
function initPage() {
  // These loops are for write paragraphs and sentences in correct order
  for (var p = 1;; p++) {
    if (!eachP(p)) {
      break;
    } else {
      for (var s = 1;; s++) {
        if (!eachS(p, s)) {
          break;
        }
      }
    }
  }
  $("#button-p").click(function () {
    createParagraph();
  });
}

function eachP(p) {
  var created = false;
  $.each(inputs, function (key, value) {
    if (regex.p.test(key) && regex.p.exec(key)[1] == p) {
      createParagraph(regex.p.exec(key)[1]);
      created = true;
      return false;
    }
  });
  return created;
}

function eachS(p, s) {
  var created = false;
  $.each(inputs, function (key, value) {
    if (regex.s.test(key) && regex.s.exec(key)[1] == p && regex.s.exec(key)[2] == s) {
      createSentence(regex.s.exec(key)[1], regex.s.exec(key)[2]);
      created = true;
      return false;
    }
  });
  return created;
}

// createParagraph - p (number): nr of paragrapf
// This function is used for initPage and button event
function createParagraph(p) {
  var temp = typeof p === "undefined";
  if (typeof p === "undefined") {
    // Verify the last paragraph number
    var last_p = 0;

    $.each(inputs, function (key, value) {
      if (regex.p.test(key) && regex.p.exec(key)[1] > last_p) {
        last_p = regex.p.exec(key)[1];
      } //if
    }); //each
    p = ++last_p;
  } //if primeiro paragrafo

  // Add HTML it to the page
  var inp = "#p" + p + "-h";
  if (last_p > 9) {
    alert("no more than 9 paragraph are allowed");
  } else {
    $("#button-p").before(ejs.render(files.p, { "paragraph": p }));

    // Add more properties to the object
    if (!inputs[inp]) {
      inputs[inp] = { "max": 8, "now": 0, "k_now": 0, "words": [] };
    }
    if (!images["#p" + p + "-img"]) {
      images["#p" + p + "-img"] = { "src": "", "alt": "" };
    }

    // Add the correct events: inp, btn, img
    $(inp).focusout(function () {
      countKeywords(inp, inputs[inp]);
      countWords(inp, inputs[inp]);
      countAllWords();
      setLocalStorage(inputs, "inputs");
    });
    $("#button-s-p" + p).click(function () {
      createSentence(p);
    });
    $("#p" + p + "-img").focusout(function () {
      images["#p" + p + "-img"].src = $("#p" + p + "-img").val();
      setLocalStorage(images, "images");
    });
    $("#p" + p + "-img-alt").focusout(function () {
      images["#p" + p + "-img"].alt = $("#p" + p + "-img-alt").val();
      setLocalStorage(images, "images");
    });
  }
  if (temp) {
    createSentence(p, 1);
    createSentence(p, 2);
    createSentence(p, 3);
  }
}

// createSentence - p (number): nr of paragrapf ; s (number): nr of sentence
function createSentence(p, s) {
  // If doesn't have s, the s is equal to the last sentence number plus one.
  if (typeof s === 'undefined') {
    // Verify the last sentence number
    var last_s = 0;
    $.each(inputs, function (key, value) {
      if (regex.s.test(key) && regex.s.exec(key)[1] == p) {
        if (regex.s.exec(key)[2] > last_s) {
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

  if (last_s > 9) {
    alert("no more than 9 setences per paragraph are allowed");
  } else {
    $("#button-s-p" + p).before(ejs.render(files.s, { "paragraph": p, "sentence": s }));

    // Add more properties to the object
    if (!inputs[inp]) {
      inputs[inp] = { "max": 20, "now": 0, "k_now": 0, "words": [] };
    }

    // Add the correct events: inp
    $(inp).focusout(function () {
      countKeywords(inp, inputs[inp]);
      countWords(inp, inputs[inp]);
      countAllWords();
      setLocalStorage(inputs, "inputs");
    });
  }
}
// Session Storage System

// readyLocalStorage - Function to the ready event
function readyLocalStorage() {
  if (localStorage.getItem("local") === "true") {
    getLocalStorage(inputs, "inputs");
    getLocalStorage(images, "images");
    getLocalStorage(keywords, "keywords");
  }
}

// setLocalStorage - Get the obj and iterate all varible inside it
// If an object have another object, so call again the function with the mother string.
function setLocalStorage(obj, mother) {
  localStorage.setItem("local", "true");
  $.each(obj, function (key, value) {
    if ($.type(value) === "object") {
      if (mother !== "") {
        return setLocalStorage(value, mother + ":" + key);
      } else {
        return setLocalStorage(value, key);
      }
    } else {
      if (mother !== "") {
        localStorage.setItem(mother + ":" + key, value);
      } else {
        localStorage.setItem(key, value);
      }
    }
  });
  return;
}

// getLocalStorage - Get all variables in localStorage and populate the correct system variable
function getLocalStorage(obj, mother) {
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
      if (key_array.length > 2) {
        if ($.type(obj[key_array[1]]) != "object") {
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
function setInputs() {
  $.each(inputs, function (key, value) {
    $(key).val(value.words.join(" "));
  });
  $.each(images, function (key, value) {
    $(key).val(value.src);
    $(key + "-alt").val(value.alt);
  });
  $.each(keywords, function (key, value) {
    $(key).val(value);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxjb21wb25lbnRzXFxzY3JpcHRzXFx0b29sc1xcYXJ0aWNsZV93cml0ZXIuanMiXSwibmFtZXMiOlsiY291bnRhYmxlIiwicmVxdWlyZSIsIkNvdW50YWJsZSIsIkNsaXBib2FyZCIsIkVqcyIsImlucHV0cyIsImltYWdlcyIsImtleXdvcmRzIiwiZmlsZXMiLCJwIiwicyIsInJlZ2V4IiwiaSIsIiQiLCJyZWFkeUxvY2FsU3RvcmFnZSIsImluaXRGaWxlcyIsImNsaXAiLCJvbiIsImUiLCJidG5UZXh0IiwidHJpZ2dlciIsImlubmVySFRNTCIsInNldFRpbWVvdXQiLCJjbGVhclNlbGVjdGlvbiIsImZhbGxiYWNrTWVzc2FnZSIsImFjdGlvbiIsImFjdGlvbk1zZyIsImFjdGlvbktleSIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJjbGljayIsImxvY2FsU3RvcmFnZSIsImxlbmd0aCIsIndpbmRvdyIsImNvbmZpcm0iLCJjbGVhciIsImxvY2F0aW9uIiwicmVsb2FkIiwibW91c2VvdmVyIiwiaHRtbCIsImVhY2giLCJrZXkiLCJ2YWx1ZSIsImFwcGVuZCIsIndvcmRzIiwiam9pbiIsIm1vdXNlUCIsIm1vdXNlUyIsImV4ZWMiLCJhZnRlciIsInNyYyIsImFsdCIsImNyZWF0ZWQiLCJpZCIsImEiLCJzdWJzdHJpbmciLCJ0b1VwcGVyQ2FzZSIsInRleHQiLCJmb2N1c291dCIsInZhbCIsImluZGV4IiwidG9Mb3dlckNhc2UiLCJyZXBsYWNlIiwiY291bnRLZXl3b3JkcyIsInZhbF9pbmRleCIsInZhbF92YWx1ZSIsInRyaW0iLCJzcGxpdCIsImNvdW50Iiwia3dfa2V5Iiwia3dfdmFsdWUiLCJrX25vdyIsImNvdW50V29yZHMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb3VudGVyIiwibm93IiwibWF4IiwiY291bnRBbGxXb3JkcyIsImt3b3JkcyIsImdldCIsImRhdGEiLCJpbml0UGFnZSIsInNldElucHV0cyIsInNldExvY2FsU3RvcmFnZSIsImVhY2hQIiwiZWFjaFMiLCJjcmVhdGVQYXJhZ3JhcGgiLCJjcmVhdGVTZW50ZW5jZSIsInRlbXAiLCJsYXN0X3AiLCJpbnAiLCJhbGVydCIsImJlZm9yZSIsImVqcyIsInJlbmRlciIsImxhc3RfcyIsImdldEl0ZW0iLCJnZXRMb2NhbFN0b3JhZ2UiLCJvYmoiLCJtb3RoZXIiLCJzZXRJdGVtIiwidHlwZSIsImtleV9uciIsImtleV9uYW1lIiwia2V5X2FycmF5IiwiTnVtYmVyIl0sIm1hcHBpbmdzIjoiO0FBQ0E7O0FBRUEsSUFBSUEsWUFBWUMsUUFBUSxXQUFSLENBQWhCLEMsQ0FBc0M7QUFDdEMsSUFBSUMsWUFBWUYsU0FBaEI7QUFDQSxJQUFJRyxZQUFZRixRQUFRLFdBQVIsQ0FBaEI7QUFDQSxJQUFJRyxNQUFNSCxRQUFRLEtBQVIsQ0FBVjtBQUNBOztBQUVBO0FBQ0EsSUFBSUksU0FBUztBQUNYLGtCQUFnQixFQUFFLE9BQVEsQ0FBVixFQUFhLE9BQVEsQ0FBckIsRUFBd0IsU0FBVSxDQUFsQyxFQUFxQyxTQUFVLEVBQS9DLEVBREw7QUFFWCxXQUFTLEVBQUUsT0FBUSxFQUFWLEVBQWMsT0FBUSxDQUF0QixFQUF5QixTQUFVLENBQW5DLEVBQXNDLFNBQVUsRUFBaEQsRUFGRTs7QUFJWCxXQUFTLEVBQUUsT0FBUSxDQUFWLEVBQWEsT0FBUSxDQUFyQixFQUF3QixTQUFVLENBQWxDLEVBQXFDLFNBQVUsRUFBL0MsRUFKRTtBQUtYLFlBQVUsRUFBRSxPQUFRLEVBQVYsRUFBYyxPQUFRLENBQXRCLEVBQXlCLFNBQVUsQ0FBbkMsRUFBc0MsU0FBVSxFQUFoRCxFQUxDO0FBTVgsWUFBVSxFQUFFLE9BQVEsRUFBVixFQUFjLE9BQVEsQ0FBdEIsRUFBeUIsU0FBVSxDQUFuQyxFQUFzQyxTQUFVLEVBQWhELEVBTkM7QUFPWCxZQUFVLEVBQUUsT0FBUSxFQUFWLEVBQWMsT0FBUSxDQUF0QixFQUF5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QyxLQUFkLEVBQW9CO0FBQ2pDOUIsTUFBRTZCLEdBQUYsRUFBT2tCLEdBQVAsQ0FBV2pCLE1BQU1FLEtBQU4sQ0FBWUMsSUFBWixDQUFpQixHQUFqQixDQUFYO0FBQ0QsR0FGRDtBQUdBakMsSUFBRTRCLElBQUYsQ0FBT25DLE1BQVAsRUFBZSxVQUFTb0MsR0FBVCxFQUFjQyxLQUFkLEVBQW9CO0FBQ2pDOUIsTUFBRTZCLEdBQUYsRUFBT2tCLEdBQVAsQ0FBV2pCLE1BQU1RLEdBQWpCO0FBQ0F0QyxNQUFFNkIsTUFBTSxNQUFSLEVBQWdCa0IsR0FBaEIsQ0FBb0JqQixNQUFNUyxHQUExQjtBQUNELEdBSEQ7QUFJQXZDLElBQUU0QixJQUFGLENBQU9sQyxRQUFQLEVBQWlCLFVBQVNtQyxHQUFULEVBQWNDLEtBQWQsRUFBb0I7QUFDbkM5QixNQUFFNkIsR0FBRixFQUFPa0IsR0FBUCxDQUFXakIsS0FBWDtBQUNELEdBRkQ7QUFHRCIsImZpbGUiOiJhcnRpY2xlX3dyaXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vLyAgQXJ0aWNsZSBXcml0ZXIgVG9vbFxyXG5cclxudmFyIGNvdW50YWJsZSA9IHJlcXVpcmUoJ2NvdW50YWJsZScpOyAvL2xvb3Bpbmcgd29yZGNvdW50IChzZWUgaHR0cDovL3NhY2hhLm1lL0NvdW50YWJsZS8pXHJcbnZhciBDb3VudGFibGUgPSBjb3VudGFibGVcclxudmFyIENsaXBib2FyZCA9IHJlcXVpcmUoJ2NsaXBib2FyZCcpO1xyXG52YXIgRWpzID0gcmVxdWlyZSgnZWpzJyk7XHJcbi8qIC0tLSBWQVJJQUJMRVMgLS0tICovXHJcblxyXG4vLyBJbnB1dHMgLSBpZCA6IHsgd29yZHMgbWF4aW11bSA6IGludCwgd29yZHMgbm93IDogaW50LCBrZXl3b3JkcyBub3cgOiBpbnQsIHdvcmRzIDogYXJyYXkgfVxyXG52YXIgaW5wdXRzID0ge1xyXG4gIFwiI2FydGljbGVOYW1lXCI6IHsgXCJtYXhcIiA6IDgsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9LFxyXG4gIFwiI2xlYWRcIjogeyBcIm1heFwiIDogMzAsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9LFxyXG5cclxuICBcIiNwMS1oXCI6IHsgXCJtYXhcIiA6IDgsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9LFxyXG4gIFwiI3AxLXMxXCI6IHsgXCJtYXhcIiA6IDIwLCBcIm5vd1wiIDogMCwgXCJrX25vd1wiIDogMCwgXCJ3b3Jkc1wiIDogW10gfSxcclxuICBcIiNwMS1zMlwiOiB7IFwibWF4XCIgOiAyMCwgXCJub3dcIiA6IDAsIFwia19ub3dcIiA6IDAsIFwid29yZHNcIiA6IFtdIH0sXHJcbiAgXCIjcDEtczNcIjogeyBcIm1heFwiIDogMjAsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9XHJcbn07XHJcblxyXG4vLyBJbWFnZXMgLSBpZCA6IHsgc3JjIDogc3RyaW5nLCBhbHQgOiBzdHJpbmcgfVxyXG52YXIgaW1hZ2VzID0ge307XHJcblxyXG4vLyBLZXl3b3JkcyAtIGlkIDogdmFsdWVcclxudmFyIGtleXdvcmRzID0ge1xyXG4gICAgXCIjd2sxXCIgOiBcIlwiLFxyXG4gICAgXCIjd2syXCIgOiBcIlwiLFxyXG4gICAgXCIjd2szXCIgOiBcIlwiLFxyXG4gICAgXCIjd2s0XCIgOiBcIlwiLFxyXG4gICAgXCIjd2s1XCIgOiBcIlwiLFxyXG4gICAgXCIjYWsxXCIgOiBcIlwiLFxyXG4gICAgXCIjYWsyXCIgOiBcIlwiLFxyXG4gICAgXCIjYWszXCIgOiBcIlwiLFxyXG4gICAgXCIjYWs0XCIgOiBcIlwiLFxyXG4gICAgXCIjYWs1XCIgOiBcIlwiXHJcbn07XHJcblxyXG4vLyBGaWxlc1xyXG52YXIgZmlsZXMgPSB7XHJcbiAgcCA6IFwicGFydHMvYXd0L3BhcmFncmFwaC5lanNcIixcclxuICBzIDogXCJwYXJ0cy9hd3Qvc2VudGVuY2UuZWpzXCJcclxufTtcclxuXHJcbi8vIFJlZ2V4XHJcbnZhciByZWdleCA9IHtcclxuICBwOiAvI3AoXFxkKS1oL2ksXHJcbiAgczogLyNwKFxcZCktcyhcXGQpL2ksXHJcbiAgaTogLyNwKFxcZCktaW1nL2lcclxufTtcclxuIFxyXG4vKiAtLS0gRVZFTlRTIC0tLSAqL1xyXG4vKiBFdmVudHMgdGhhdCBvY2N1ciBtYW55IHRpbWVzIGluIGNvZGUgYW5kL29yIHVzZXMgdGhlIHNhbWUgdmFyaWFibGUuXHJcbiAqIE90aGVyIHNpbmdsZSBldmVudHMgY2FuIGJlIHBsYWNlZCB3aXRoIHN5c3RlbXMgY29kZS5cclxuICovXHJcblxyXG4vLyBSZWFkeVxyXG4kKGZ1bmN0aW9uKCl7XHJcbiAgcmVhZHlMb2NhbFN0b3JhZ2UoKTtcclxuICBpbml0RmlsZXMoKTtcclxufSk7XHJcblxyXG5cclxuLyogLS0tIFNZU1RFTVMgLS0tICovXHJcblxyXG4vLyBDbGlwYm9hcmQgU3lzdGVtXHJcblxyXG52YXIgY2xpcCA9IG5ldyBDbGlwYm9hcmQoJy5jbGlwJyk7XHJcblxyXG5jbGlwLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGJ0blRleHQgPSBlLnRyaWdnZXIuaW5uZXJIVE1MO1xyXG4gICAgZS50cmlnZ2VyLmlubmVySFRNTCA9ICdDb3BpZWQhJztcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgZS5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICBlLnRyaWdnZXIuaW5uZXJIVE1MID0gYnRuVGV4dDtcclxuICAgIH0sIDMwMDApOyAvLyAzMDAwIG1pbGlzZWNvbmRzIGFyZSAzIHNlY29uZHNcclxufSk7XHJcblxyXG5jbGlwLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUudHJpZ2dlci5pbm5lckhUTUwgPSBmYWxsYmFja01lc3NhZ2UoZS5hY3Rpb24pO1xyXG4gICAgZS5jbGVhclNlbGVjdGlvbigpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGZhbGxiYWNrTWVzc2FnZShhY3Rpb24pIHtcclxuICAgIHZhciBhY3Rpb25Nc2cgPSAnJztcclxuICAgIHZhciBhY3Rpb25LZXkgPSAoYWN0aW9uID09PSAnY3V0JyA/ICdYJyA6ICdDJyk7XHJcbiAgICBpZiAoL2lQaG9uZXxpUGFkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgIGFjdGlvbk1zZyA9ICdObyBzdXBwb3J0IDooJztcclxuICAgIH0gZWxzZSBpZiAoL01hYy9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcclxuICAgICAgICBhY3Rpb25Nc2cgPSAnUHJlc3Mg4oyYLScgKyBhY3Rpb25LZXkgKyAnIHRvICcgKyBhY3Rpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFjdGlvbk1zZyA9ICdQcmVzcyBDdHJsLScgKyBhY3Rpb25LZXkgKyAnIHRvICcgKyBhY3Rpb247XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWN0aW9uTXNnO1xyXG59XHJcblxyXG4vLyBOZXcgQXJ0aWNsZSBTeXN0ZW1cclxuXHJcbiQoXCIjbmV3LWFydGljbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgIGlmKGxvY2FsU3RvcmFnZS5sZW5ndGggIT09IDApe1xyXG4gICAgICAgIGlmKHdpbmRvdy5jb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZXJhc2UgeW91ciBhcnRpY2xlIHRvIHN0YXJ0IGEgbmV3IG9uZSA/Jykpe1xyXG4gICAgICAgICAgLy8gQ2xlYW4gdGhlIGxvY2FsU3RvcmFnZVxyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vIFByZXZpZXcgU3lzdGVtXHJcblxyXG4kKFwiI3ByZXZpZXdcIikubW91c2VvdmVyKGZ1bmN0aW9uKCl7XHJcbiAgJChcIiNjbGlwXCIpLmh0bWwoXCJcIik7XHJcbiAgJC5lYWNoKGlucHV0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICBpZiAoa2V5ID09PSBcIiNhcnRpY2xlTmFtZVwiKSB7XHJcbiAgICAgICQoXCIjY2xpcFwiKS5hcHBlbmQoXCI8aDE+XCIgKyB2YWx1ZS53b3Jkcy5qb2luKFwiIFwiKSArIFwiPC9oMT5cIik7XHJcbiAgICB9IGVsc2UgaWYgKGtleSA9PSBcIiNsZWFkXCIpe1xyXG4gICAgICAkKFwiI2NsaXBcIikuYXBwZW5kKFwiPHA+XCIgKyB2YWx1ZS53b3Jkcy5qb2luKFwiIFwiKSArIFwiPC9wPlwiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gVGhlc2UgbG9vcHMgYXJlIGZvciB3cml0aW5nIHBhcmFncmFwaHMgYW5kIHNlbnRlbmNlcyBpbiBjb3JyZWN0IG9yZGVyIGRlZmluaW5nIHAgYW5kIHMgZHluYW1pY2FseSBcclxuICBmb3IodmFyIHAgPSAxOyA7IHArKyl7XHJcbiAgICBpZighbW91c2VQKHApKXtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IodmFyIHMgPSAxOyA7IHMrKyl7XHJcbiAgICAgICAgaWYoIW1vdXNlUyhwLCBzKSl7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gICQuZWFjaChpbWFnZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgJChcIiNwXCIgKyByZWdleC5pLmV4ZWMoa2V5KVsxXSArIFwiLXByZXZcIikuYWZ0ZXIoXCI8aW1nIHNyYz0nXCIgKyB2YWx1ZS5zcmMgKyBcIicgYWx0PSdcIiArIHZhbHVlLmFsdCArIFwiJy8+XCIpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG1vdXNlUChwKXtcclxuICB2YXIgY3JlYXRlZCA9IGZhbHNlO1xyXG4gICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgaWYgKHJlZ2V4LnAudGVzdChrZXkpICYmIHJlZ2V4LnAuZXhlYyhrZXkpWzFdID09IHApe1xyXG4gICAgICAkKFwiI2NsaXBcIikuYXBwZW5kKFwiPGgyPlwiICsgdmFsdWUud29yZHMuam9pbihcIiBcIikgKyBcIjwvaDI+XCIpO1xyXG4gICAgICBjcmVhdGVkID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gY3JlYXRlZDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG1vdXNlUyhwLCBzKXtcclxuICB2YXIgY3JlYXRlZCA9IGZhbHNlO1xyXG4gICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgaWYgKHJlZ2V4LnMudGVzdChrZXkpICYmIHJlZ2V4LnMuZXhlYyhrZXkpWzFdID09IHAgJiYgcmVnZXgucy5leGVjKGtleSlbMl0gPT0gcyl7XHJcbiAgICAgIHZhciBpZCA9IFwicFwiICsgcCArIFwiLXByZXZcIjtcclxuICAgICAgaWYoJChcIiNcIiArIGlkKS5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICQoXCIjY2xpcFwiKS5hcHBlbmQoXCI8cCBpZD0nXCIgKyBpZCArIFwiJz48L3A+XCIpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vdmFsdWUud29yZHNbMF0ucmVwbGFjZSggL1xcYlxcdy9nLCBmdW5jdGlvbihIKXsgcmV0dXJuIEgudG9VcHBlckNhc2UoKSB9KTtcclxuICAgICAgLy92YWx1ZS53b3Jkc1swXTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh2YWx1ZSk7XHJcbiAgICAgIGEgPSB2YWx1ZS53b3Jkcy5qb2luKFwiIFwiKVxyXG4gICAgICBhID0gYS5zdWJzdHJpbmcoMCwxKS50b1VwcGVyQ2FzZSgpICsgYS5zdWJzdHJpbmcoMSlcclxuICAgICAgLy9jb25zb2xlLmxvZyhhKVxyXG4gICAgICAkKFwiI1wiICsgaWQpLnRleHQoJChcIiNcIiArIGlkKS50ZXh0KCkgKyBcIiBcIiArIGEgKTtcclxuICAgICAgY3JlYXRlZCA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNyZWF0ZWQ7XHJcbn1cclxuXHJcbi8vIEtleXdvcmQgU3lzdGVtXHJcblxyXG4vLyBJbiBmb2N1c291dCwgZ2V0IHRoZSB2YWwgaW5wdXQsIGNsZWFuIGl0LCBwdXQgaXQgaW4gY29ycmVjdCBrZXl3b3JkcyBrZXkgYW5kIHB1dCBpdCBpbiBsb2NhbFN0b3JhZ2VcclxuJC5lYWNoKGtleXdvcmRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAkKGtleSkuZm9jdXNvdXQoZnVuY3Rpb24oKXtcclxuICAgICQoa2V5KS52YWwoZnVuY3Rpb24oaW5kZXgsIHZhbHVlKXtcclxuICAgICAga2V5d29yZHNba2V5XSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW15hLXpBLVowLTldL2csJycpO1xyXG4gICAgICByZXR1cm4ga2V5d29yZHNba2V5XTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcblxyXG4vLyBXb3JkcyBTeXN0ZW1cclxuXHJcbi8vIGNvdW50S2V5d29yZHMgLSBDb3VudCB0aGUga2V5d29yZHMgaW4gZWFjaCBpbnB1dFxyXG5mdW5jdGlvbiBjb3VudEtleXdvcmRzIChrZXksIHZhbHVlKXtcclxuICAvLyBHZXQgdGhlIHZhbCBpbnB1dCwgY2xlYW4gaXQgYW5kIHB1dCBpdCBpbiBjb3JyZWN0IHdvcmRzIGtleS5cclxuICAkKGtleSkudmFsKGZ1bmN0aW9uKHZhbF9pbmRleCwgdmFsX3ZhbHVlKXtcclxuICAgIHZhbHVlLndvcmRzID0gdmFsX3ZhbHVlLnRvTG93ZXJDYXNlKClcclxuICAgIC8vLnJlcGxhY2UoL1teYS16QS1aMC05IF0vZywnJylcclxuICAgIC50cmltKCkuc3BsaXQoL1xccysvZyk7XHJcbiAgICAvL2NvbnNvbGUubG9nKHZhbHVlLndvcmRzLmpvaW4oJyAnKSk7IFxyXG4gICAgcmV0dXJuIHZhbHVlLndvcmRzLmpvaW4oJyAnKTtcclxuICB9KTtcclxuICAvLyBDb3VudCBhbGwgdGhlIGtleXdvcmRzIHVzZWRcclxuICB2YXIgY291bnQgPSAwO1xyXG4gICQuZWFjaChrZXl3b3JkcywgZnVuY3Rpb24oa3dfa2V5LCBrd192YWx1ZSl7XHJcbiAgICBmb3IodmFyIGkgaW4gdmFsdWUud29yZHMpe1xyXG4gICAgICBpZih2YWx1ZS53b3Jkc1tpXSA9PT0ga3dfdmFsdWUgJiYga3dfdmFsdWUgIT09IFwiXCIpe1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICB2YWx1ZS5rX25vdyA9IGNvdW50O1xyXG4gICQoa2V5ICsgXCItbmtleXNcIikudGV4dChjb3VudCk7XHJcbn1cclxuXHJcbi8vIENvdW50IHRoZSB3b3JkcyBpbiBlYWNoIGlucHV0XHJcbmZ1bmN0aW9uIGNvdW50V29yZHMgKGtleSwgdmFsdWUpe1xyXG4gIENvdW50YWJsZS5vbihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGtleSksIGZ1bmN0aW9uIChjb3VudGVyKSB7XHJcbiAgICB2YWx1ZS5ub3cgPSBjb3VudGVyLndvcmRzO1xyXG4gICAgaWYoY291bnRlci53b3JkcyA+IHZhbHVlLm1heCkge1xyXG4gICAgICAkKGtleSArICctY291bnQnKS50ZXh0KFwiQWxlcnQ6IFRvbyBtYW55IHdvcmRzXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChrZXkgKyAnLWNvdW50JykudGV4dChjb3VudGVyLndvcmRzKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLy8gQ291bnQgYWxsIHdvcmRzIGFuZCBrZXl3b3Jkc1xyXG5mdW5jdGlvbiBjb3VudEFsbFdvcmRzKCl7XHJcbiAgdmFyIHdvcmRzID0gMDtcclxuICB2YXIga3dvcmRzID0gMDtcclxuICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIHdvcmRzICs9IHZhbHVlLm5vdztcclxuICAgIGt3b3JkcyArPSB2YWx1ZS5rX25vdztcclxuICB9KTtcclxuICAkKFwiI3RvdHdvcmRzXCIpLnRleHQod29yZHMpO1xyXG4gICQoXCIjdG90a2V5d29yZHNcIikudGV4dChrd29yZHMpO1xyXG59XHJcblxyXG4vLyBQYXJhZ3JhcGhzIFN5c3RlbVxyXG5cclxuLy8gaW5pdEZpbGVzIC0gRnVuY3Rpb24gdXNlZCBpbiAkLnJlYWR5IGZvciBzZWFyY2ggdGhlIGNvcnJlY3QgZmlsZXMgQkVGT1JFIGluaXRQYWdlXHJcbmZ1bmN0aW9uIGluaXRGaWxlcygpe1xyXG4gICQuZ2V0KGZpbGVzLnAsIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgZmlsZXMucCA9IGRhdGE7XHJcbiAgICAkLmdldChmaWxlcy5zLCBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgZmlsZXMucyA9IGRhdGE7XHJcbiAgICAgIGluaXRQYWdlKCk7XHJcblxyXG4gICAgICBzZXRJbnB1dHMoKTtcclxuXHJcbiAgICAgIC8vIFdhdGNoIGlucHV0c1xyXG4gICAgICAkLmVhY2goa2V5d29yZHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICAgICQoa2V5KS5mb2N1c291dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgc2V0TG9jYWxTdG9yYWdlKGtleXdvcmRzLCBcImtleXdvcmRzXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIEJhY2t1cCBpZiBzb21ldGhpbmcgZ2V0J3Mgd3JvbmdcclxuICAgICAgJC5lYWNoKGlucHV0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgICAgY291bnRLZXl3b3JkcyhrZXksIHZhbHVlKTtcclxuICAgICAgICBjb3VudFdvcmRzKGtleSwgdmFsdWUpO1xyXG4gICAgICAgIGNvdW50QWxsV29yZHMoKTtcclxuXHJcbiAgICAgICAgJChrZXkpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICBjb3VudEtleXdvcmRzKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgY291bnRBbGxXb3JkcygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBpbml0UGFnZSAtIEZ1bmN0aW9uIHVzZWQgb25seSBpbiBpbml0RmlsZXNcclxuZnVuY3Rpb24gaW5pdFBhZ2UoKXtcclxuICAvLyBUaGVzZSBsb29wcyBhcmUgZm9yIHdyaXRlIHBhcmFncmFwaHMgYW5kIHNlbnRlbmNlcyBpbiBjb3JyZWN0IG9yZGVyXHJcbiAgZm9yKHZhciBwID0gMTsgOyBwKyspe1xyXG4gICAgaWYoIWVhY2hQKHApKXtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IodmFyIHMgPSAxOyA7IHMrKyl7XHJcbiAgICAgICAgaWYoIWVhY2hTKHAsIHMpKXtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICAkKFwiI2J1dHRvbi1wXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICBjcmVhdGVQYXJhZ3JhcGgoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZWFjaFAocCl7XHJcbiAgdmFyIGNyZWF0ZWQgPSBmYWxzZTtcclxuICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIGlmKHJlZ2V4LnAudGVzdChrZXkpICYmIHJlZ2V4LnAuZXhlYyhrZXkpWzFdID09IHApe1xyXG4gICAgICBjcmVhdGVQYXJhZ3JhcGgocmVnZXgucC5leGVjKGtleSlbMV0pO1xyXG4gICAgICBjcmVhdGVkID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBjcmVhdGVkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlYWNoUyhwLCBzKXtcclxuICB2YXIgY3JlYXRlZCA9IGZhbHNlO1xyXG4gICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgaWYocmVnZXgucy50ZXN0KGtleSkgJiYgcmVnZXgucy5leGVjKGtleSlbMV0gPT0gcCAmJiByZWdleC5zLmV4ZWMoa2V5KVsyXSA9PSBzKXtcclxuICAgICAgY3JlYXRlU2VudGVuY2UocmVnZXgucy5leGVjKGtleSlbMV0sIHJlZ2V4LnMuZXhlYyhrZXkpWzJdKTtcclxuICAgICAgY3JlYXRlZCA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gY3JlYXRlZDtcclxufVxyXG5cclxuLy8gY3JlYXRlUGFyYWdyYXBoIC0gcCAobnVtYmVyKTogbnIgb2YgcGFyYWdyYXBmXHJcbi8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBmb3IgaW5pdFBhZ2UgYW5kIGJ1dHRvbiBldmVudFxyXG5mdW5jdGlvbiBjcmVhdGVQYXJhZ3JhcGgocCl7XHJcbiAgdmFyIHRlbXAgPSAodHlwZW9mIHAgPT09IFwidW5kZWZpbmVkXCIpO1xyXG4gIGlmKHR5cGVvZiBwID09PSBcInVuZGVmaW5lZFwiKXtcclxuICAgIC8vIFZlcmlmeSB0aGUgbGFzdCBwYXJhZ3JhcGggbnVtYmVyXHJcbiAgICB2YXIgbGFzdF9wID0gMDtcclxuXHJcbiAgICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgaWYocmVnZXgucC50ZXN0KGtleSkgJiYgcmVnZXgucC5leGVjKGtleSlbMV0gPiBsYXN0X3Ape1xyXG4gICAgICAgIGxhc3RfcCA9IHJlZ2V4LnAuZXhlYyhrZXkpWzFdO1xyXG4gICAgICB9Ly9pZlxyXG4gICAgfSk7Ly9lYWNoXHJcbiAgICBwID0gKytsYXN0X3A7XHJcbiAgfS8vaWYgcHJpbWVpcm8gcGFyYWdyYWZvXHJcblxyXG4gIC8vIEFkZCBIVE1MIGl0IHRvIHRoZSBwYWdlXHJcbiAgdmFyIGlucCA9IFwiI3BcIiArIHAgKyBcIi1oXCI7XHJcbiAgaWYobGFzdF9wID4gOSl7IGFsZXJ0KFwibm8gbW9yZSB0aGFuIDkgcGFyYWdyYXBoIGFyZSBhbGxvd2VkXCIpXHJcbiAgfWVsc2V7XHJcbiAgJChcIiNidXR0b24tcFwiKS5iZWZvcmUoZWpzLnJlbmRlcihmaWxlcy5wLCB7XCJwYXJhZ3JhcGhcIiA6IHB9KSk7XHJcblxyXG4gIC8vIEFkZCBtb3JlIHByb3BlcnRpZXMgdG8gdGhlIG9iamVjdFxyXG4gIGlmKCFpbnB1dHNbaW5wXSl7XHJcbiAgICBpbnB1dHNbaW5wXSA9IHsgXCJtYXhcIiA6IDgsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9O1xyXG4gIH1cclxuICBpZighaW1hZ2VzW1wiI3BcIiArIHAgKyBcIi1pbWdcIl0pe1xyXG4gICAgaW1hZ2VzW1wiI3BcIiArIHAgKyBcIi1pbWdcIl0gPSB7IFwic3JjXCIgOiBcIlwiLCBcImFsdFwiIDogXCJcIiB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHRoZSBjb3JyZWN0IGV2ZW50czogaW5wLCBidG4sIGltZ1xyXG4gICQoaW5wKS5mb2N1c291dChmdW5jdGlvbigpe1xyXG4gICAgY291bnRLZXl3b3JkcyhpbnAsIGlucHV0c1tpbnBdKTtcclxuICAgIGNvdW50V29yZHMoaW5wLCBpbnB1dHNbaW5wXSk7XHJcbiAgICBjb3VudEFsbFdvcmRzKCk7XHJcbiAgICBzZXRMb2NhbFN0b3JhZ2UoaW5wdXRzLCBcImlucHV0c1wiKTtcclxuICB9KTtcclxuICAkKFwiI2J1dHRvbi1zLXBcIiArIHApLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICBjcmVhdGVTZW50ZW5jZShwKTtcclxuICB9KTtcclxuICAkKFwiI3BcIiArIHAgKyBcIi1pbWdcIikuZm9jdXNvdXQoZnVuY3Rpb24oKXtcclxuICAgIGltYWdlc1tcIiNwXCIgKyBwICsgXCItaW1nXCJdLnNyYyA9ICQoXCIjcFwiICsgcCArIFwiLWltZ1wiKS52YWwoKTtcclxuICAgIHNldExvY2FsU3RvcmFnZShpbWFnZXMsIFwiaW1hZ2VzXCIpO1xyXG4gIH0pO1xyXG4gICQoXCIjcFwiICsgcCArIFwiLWltZy1hbHRcIikuZm9jdXNvdXQoZnVuY3Rpb24oKXtcclxuICAgIGltYWdlc1tcIiNwXCIgKyBwICsgXCItaW1nXCJdLmFsdCA9ICQoXCIjcFwiICsgcCArIFwiLWltZy1hbHRcIikudmFsKCk7XHJcbiAgICBzZXRMb2NhbFN0b3JhZ2UoaW1hZ2VzLCBcImltYWdlc1wiKTtcclxuICB9KTtcclxufVxyXG4gIGlmKHRlbXApe1xyXG4gICAgY3JlYXRlU2VudGVuY2UocCwgMSk7XHJcbiAgICBjcmVhdGVTZW50ZW5jZShwLCAyKTtcclxuICAgIGNyZWF0ZVNlbnRlbmNlKHAsIDMpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gY3JlYXRlU2VudGVuY2UgLSBwIChudW1iZXIpOiBuciBvZiBwYXJhZ3JhcGYgOyBzIChudW1iZXIpOiBuciBvZiBzZW50ZW5jZVxyXG5mdW5jdGlvbiBjcmVhdGVTZW50ZW5jZShwLCBzKXtcclxuICAvLyBJZiBkb2Vzbid0IGhhdmUgcywgdGhlIHMgaXMgZXF1YWwgdG8gdGhlIGxhc3Qgc2VudGVuY2UgbnVtYmVyIHBsdXMgb25lLlxyXG4gIGlmKHR5cGVvZiBzID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAvLyBWZXJpZnkgdGhlIGxhc3Qgc2VudGVuY2UgbnVtYmVyXHJcbiAgICB2YXIgbGFzdF9zID0gMDtcclxuICAgICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICBpZihyZWdleC5zLnRlc3Qoa2V5KSAmJiByZWdleC5zLmV4ZWMoa2V5KVsxXSA9PSBwKXtcclxuICAgICAgICBpZihyZWdleC5zLmV4ZWMoa2V5KVsyXSA+IGxhc3Rfcyl7XHJcbiAgICAgICAgICBsYXN0X3MgPSByZWdleC5zLmV4ZWMoa2V5KVsyXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBzID0gKytsYXN0X3M7XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgSFRNTCB0byB0aGUgcGFnZVxyXG4gIHZhciBpbnAgPSBcIiNwXCIgKyBwICsgXCItc1wiICsgcztcclxuXHJcbiAgaWYobGFzdF9zID4gOSl7IGFsZXJ0KFwibm8gbW9yZSB0aGFuIDkgc2V0ZW5jZXMgcGVyIHBhcmFncmFwaCBhcmUgYWxsb3dlZFwiKVxyXG4gIH1lbHNle1xyXG4gICQoXCIjYnV0dG9uLXMtcFwiICsgcCkuYmVmb3JlKGVqcy5yZW5kZXIoZmlsZXMucywge1wicGFyYWdyYXBoXCIgOiBwLCBcInNlbnRlbmNlXCIgOiBzfSkpO1xyXG5cclxuICAvLyBBZGQgbW9yZSBwcm9wZXJ0aWVzIHRvIHRoZSBvYmplY3RcclxuICBpZighaW5wdXRzW2lucF0pe1xyXG4gICAgaW5wdXRzW2lucF0gPSB7IFwibWF4XCIgOiAyMCwgXCJub3dcIiA6IDAsIFwia19ub3dcIiA6IDAsIFwid29yZHNcIiA6IFtdIH07XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgdGhlIGNvcnJlY3QgZXZlbnRzOiBpbnBcclxuICAkKGlucCkuZm9jdXNvdXQoZnVuY3Rpb24oKXtcclxuICAgIGNvdW50S2V5d29yZHMoaW5wLCBpbnB1dHNbaW5wXSk7XHJcbiAgICBjb3VudFdvcmRzKGlucCwgaW5wdXRzW2lucF0pO1xyXG4gICAgY291bnRBbGxXb3JkcygpO1xyXG4gICAgc2V0TG9jYWxTdG9yYWdlKGlucHV0cywgXCJpbnB1dHNcIik7XHJcbiAgfSk7XHJcbn1cclxufVxyXG4vLyBTZXNzaW9uIFN0b3JhZ2UgU3lzdGVtXHJcblxyXG4vLyByZWFkeUxvY2FsU3RvcmFnZSAtIEZ1bmN0aW9uIHRvIHRoZSByZWFkeSBldmVudFxyXG5mdW5jdGlvbiByZWFkeUxvY2FsU3RvcmFnZSAoKSB7XHJcbiAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsb2NhbFwiKSA9PT0gXCJ0cnVlXCIpe1xyXG4gICAgZ2V0TG9jYWxTdG9yYWdlKGlucHV0cywgXCJpbnB1dHNcIik7XHJcbiAgICBnZXRMb2NhbFN0b3JhZ2UoaW1hZ2VzLCBcImltYWdlc1wiKTtcclxuICAgIGdldExvY2FsU3RvcmFnZShrZXl3b3JkcywgXCJrZXl3b3Jkc1wiKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIHNldExvY2FsU3RvcmFnZSAtIEdldCB0aGUgb2JqIGFuZCBpdGVyYXRlIGFsbCB2YXJpYmxlIGluc2lkZSBpdFxyXG4vLyBJZiBhbiBvYmplY3QgaGF2ZSBhbm90aGVyIG9iamVjdCwgc28gY2FsbCBhZ2FpbiB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgbW90aGVyIHN0cmluZy5cclxuZnVuY3Rpb24gc2V0TG9jYWxTdG9yYWdlKG9iaiwgbW90aGVyKXtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsXCIsIFwidHJ1ZVwiKTtcclxuICAkLmVhY2gob2JqLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIGlmKCQudHlwZSh2YWx1ZSkgPT09IFwib2JqZWN0XCIpe1xyXG4gICAgICBpZiAobW90aGVyICE9PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHNldExvY2FsU3RvcmFnZSh2YWx1ZSwgbW90aGVyICsgXCI6XCIgKyBrZXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzZXRMb2NhbFN0b3JhZ2UodmFsdWUsIGtleSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmKG1vdGhlciAhPT0gXCJcIil7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obW90aGVyICsgXCI6XCIgKyBrZXksIHZhbHVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybjtcclxufVxyXG5cclxuLy8gZ2V0TG9jYWxTdG9yYWdlIC0gR2V0IGFsbCB2YXJpYWJsZXMgaW4gbG9jYWxTdG9yYWdlIGFuZCBwb3B1bGF0ZSB0aGUgY29ycmVjdCBzeXN0ZW0gdmFyaWFibGVcclxuZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlKG9iaiwgbW90aGVyKXtcclxuICAvLyBHZXQgdGhlIGtleSBudW1iZXJcclxuICBmb3IgKHZhciBrZXlfbnIgPSAwOyBrZXlfbnIgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBrZXlfbnIrKykge1xyXG5cclxuICAgIC8vIEdldCB0aGUga2V5IG5hbWVcclxuICAgIHZhciBrZXlfbmFtZSA9IGxvY2FsU3RvcmFnZS5rZXkoa2V5X25yKTtcclxuXHJcbiAgICAvLyBTcGxpdCBuYW1lIG9mIGtleVxyXG4gICAgdmFyIGtleV9hcnJheSA9IGtleV9uYW1lLnNwbGl0KFwiOlwiKTtcclxuXHJcbiAgICAvLyBWYWx1ZVxyXG4gICAgdmFyIHZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5X25hbWUpO1xyXG4gICAgc3dpdGNoIChrZXlfYXJyYXlba2V5X2FycmF5Lmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgIGNhc2UgXCJtYXhcIjpcclxuICAgICAgY2FzZSBcIm5vd1wiOlxyXG4gICAgICBjYXNlIFwia19ub3dcIjpcclxuICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJ3b3Jkc1wiOlxyXG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoJywnKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb25zdHJ1Y3QgdGhlIG9iamVjdFxyXG4gICAgaWYgKGtleV9hcnJheVswXSA9PSBtb3RoZXIpIHtcclxuICAgICAgaWYoa2V5X2FycmF5Lmxlbmd0aCA+IDIpe1xyXG4gICAgICAgIGlmKCQudHlwZShvYmpba2V5X2FycmF5WzFdXSkgIT0gXCJvYmplY3RcIil7XHJcbiAgICAgICAgICBvYmpba2V5X2FycmF5WzFdXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvYmpba2V5X2FycmF5WzFdXVtrZXlfYXJyYXlbMl1dID0gdmFsdWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqW2tleV9hcnJheVsxXV0gPSB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gc2V0SW5wdXRzIC0gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIG9uIGRvY3VtZW50LnJlYWR5IGZvciBwb3B1bGF0ZSB0aGUgaW5wdXRzLlxyXG5mdW5jdGlvbiBzZXRJbnB1dHMgKCl7XHJcbiAgJC5lYWNoKGlucHV0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAkKGtleSkudmFsKHZhbHVlLndvcmRzLmpvaW4oXCIgXCIpKTtcclxuICB9KTtcclxuICAkLmVhY2goaW1hZ2VzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICQoa2V5KS52YWwodmFsdWUuc3JjKTtcclxuICAgICQoa2V5ICsgXCItYWx0XCIpLnZhbCh2YWx1ZS5hbHQpO1xyXG4gIH0pO1xyXG4gICQuZWFjaChrZXl3b3JkcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAkKGtleSkudmFsKHZhbHVlKTtcclxuICB9KTtcclxufVxyXG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/article_writer.js","/")
},{"9FoBSB":17,"buffer":4,"clipboard":6,"countable":7,"ejs":10}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var PLUS = '+'.charCodeAt(0);
	var SLASH = '/'.charCodeAt(0);
	var NUMBER = '0'.charCodeAt(0);
	var LOWER = 'a'.charCodeAt(0);
	var UPPER = 'A'.charCodeAt(0);
	var PLUS_URL_SAFE = '-'.charCodeAt(0);
	var SLASH_URL_SAFE = '_'.charCodeAt(0);

	function decode(elt) {
		var code = elt.charCodeAt(0);
		if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
		if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
		if (code < NUMBER) return -1; //no match
		if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
		if (code < UPPER + 26) return code - UPPER;
		if (code < LOWER + 26) return code - LOWER + 26;
	}

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4');
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length;
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		var L = 0;

		function push(v) {
			arr[L++] = v;
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
			push((tmp & 0xFF0000) >> 16);
			push((tmp & 0xFF00) >> 8);
			push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
			push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
			push(tmp >> 8 & 0xFF);
			push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
		    extraBytes = uint8.length % 3,
		    // if we have 1 byte left, pad 2 bytes
		output = "",
		    temp,
		    length;

		function encode(num) {
			return lookup.charAt(num);
		}

		function tripletToBase64(num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += encode(temp >> 2);
				output += encode(temp << 4 & 0x3F);
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
				output += encode(temp >> 10);
				output += encode(temp >> 4 & 0x3F);
				output += encode(temp << 2 & 0x3F);
				output += '=';
				break;
		}

		return output;
	}

	exports.toByteArray = b64ToByteArray;
	exports.fromByteArray = uint8ToBase64;
})(typeof exports === 'undefined' ? this.base64js = {} : exports);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGJhc2U2NC1qc1xcbGliXFxiNjQuanMiXSwibmFtZXMiOlsibG9va3VwIiwiZXhwb3J0cyIsIkFyciIsIlVpbnQ4QXJyYXkiLCJBcnJheSIsIlBMVVMiLCJjaGFyQ29kZUF0IiwiU0xBU0giLCJOVU1CRVIiLCJMT1dFUiIsIlVQUEVSIiwiUExVU19VUkxfU0FGRSIsIlNMQVNIX1VSTF9TQUZFIiwiZGVjb2RlIiwiZWx0IiwiY29kZSIsImI2NFRvQnl0ZUFycmF5IiwiYjY0IiwiaSIsImoiLCJsIiwidG1wIiwicGxhY2VIb2xkZXJzIiwiYXJyIiwibGVuZ3RoIiwiRXJyb3IiLCJsZW4iLCJjaGFyQXQiLCJMIiwicHVzaCIsInYiLCJ1aW50OFRvQmFzZTY0IiwidWludDgiLCJleHRyYUJ5dGVzIiwib3V0cHV0IiwidGVtcCIsImVuY29kZSIsIm51bSIsInRyaXBsZXRUb0Jhc2U2NCIsInRvQnl0ZUFycmF5IiwiZnJvbUJ5dGVBcnJheSIsImJhc2U2NGpzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxTQUFTLGtFQUFiOztBQUVBLENBQUUsV0FBVUMsT0FBVixFQUFtQjtBQUNwQjs7QUFFQyxLQUFJQyxNQUFPLE9BQU9DLFVBQVAsS0FBc0IsV0FBdkIsR0FDTkEsVUFETSxHQUVOQyxLQUZKOztBQUlELEtBQUlDLE9BQVMsSUFBSUMsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlDLFFBQVMsSUFBSUQsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlFLFNBQVMsSUFBSUYsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlHLFFBQVMsSUFBSUgsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlJLFFBQVMsSUFBSUosVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlLLGdCQUFnQixJQUFJTCxVQUFKLENBQWUsQ0FBZixDQUFw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QTs7QUFFRDtBQUNBLFVBQVFGLFVBQVI7QUFDQyxRQUFLLENBQUw7QUFDQ0UsV0FBT0gsTUFBTUEsTUFBTVIsTUFBTixHQUFlLENBQXJCLENBQVA7QUFDQVUsY0FBVUUsT0FBT0QsUUFBUSxDQUFmLENBQVY7QUFDQUQsY0FBVUUsT0FBUUQsUUFBUSxDQUFULEdBQWMsSUFBckIsQ0FBVjtBQUNBRCxjQUFVLElBQVY7QUFDQTtBQUNELFFBQUssQ0FBTDtBQUNDQyxXQUFPLENBQUNILE1BQU1BLE1BQU1SLE1BQU4sR0FBZSxDQUFyQixLQUEyQixDQUE1QixJQUFrQ1EsTUFBTUEsTUFBTVIsTUFBTixHQUFlLENBQXJCLENBQXpDO0FBQ0FVLGNBQVVFLE9BQU9ELFFBQVEsRUFBZixDQUFWO0FBQ0FELGNBQVVFLE9BQVFELFFBQVEsQ0FBVCxHQUFjLElBQXJCLENBQVY7QUFDQUQsY0FBVUUsT0FBUUQsUUFBUSxDQUFULEdBQWMsSUFBckIsQ0FBVjtBQUNBRCxjQUFVLEdBQVY7QUFDQTtBQWJGOztBQWdCQSxTQUFPQSxNQUFQO0FBQ0E7O0FBRURqQyxTQUFRc0MsV0FBUixHQUFzQnZCLGNBQXRCO0FBQ0FmLFNBQVF1QyxhQUFSLEdBQXdCVCxhQUF4QjtBQUNBLENBekhDLEVBeUhBLE9BQU85QixPQUFQLEtBQW1CLFdBQW5CLEdBQWtDLEtBQUt3QyxRQUFMLEdBQWdCLEVBQWxELEdBQXdEeEMsT0F6SHhELENBQUQiLCJmaWxlIjoiYjY0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\base64-js\\lib\\b64.js","/..\\..\\..\\node_modules\\base64-js\\lib")
},{"9FoBSB":17,"buffer":4}],3:[function(require,module,exports){

},{"9FoBSB":17,"buffer":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js');
var ieee754 = require('ieee754');

exports.Buffer = Buffer;
exports.SlowBuffer = Buffer;
exports.INSPECT_MAX_BYTES = 50;
Buffer.poolSize = 8192;

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0);
    var arr = new Uint8Array(buf);
    arr.foo = function () {
      return 42;
    };
    return 42 === arr.foo() && typeof arr.subarray === 'function'; // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false;
  }
}();

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer(subject, encoding, noZero) {
  if (!(this instanceof Buffer)) return new Buffer(subject, encoding, noZero);

  var type = typeof subject;

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject);
    while (subject.length % 4 !== 0) {
      subject = subject + '=';
    }
  }

  // Find the length
  var length;
  if (type === 'number') length = coerce(subject);else if (type === 'string') length = Buffer.byteLength(subject, encoding);else if (type === 'object') length = coerce(subject.length); // assume that object is array-like
  else throw new Error('First argument needs to be a number, array or string.');

  var buf;
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length));
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this;
    buf.length = length;
    buf._isBuffer = true;
  }

  var i;
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject);
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject)) buf[i] = subject.readUInt8(i);else buf[i] = subject[i];
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding);
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0;
    }
  }

  return buf;
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer);
};

Buffer.byteLength = function (str, encoding) {
  var ret;
  str = str + '';
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2;
      break;
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length;
      break;
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length;
      break;
    case 'base64':
      ret = base64ToBytes(str).length;
      break;
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2;
      break;
    default:
      throw new Error('Unknown encoding');
  }
  return ret;
};

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' + 'list should be an Array.');

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  var i;
  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length;
    }
  }

  var buf = new Buffer(totalLength);
  var pos = 0;
  for (i = 0; i < list.length; i++) {
    var item = list[i];
    item.copy(buf, pos);
    pos += item.length;
  }
  return buf;
};

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  assert(strLen % 2 === 0, 'Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    assert(!isNaN(byte), 'Invalid hex string');
    buf[offset + i] = byte;
  }
  Buffer._charsWritten = i * 2;
  return i;
}

function _utf8Write(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length);
  return charsWritten;
}

function _asciiWrite(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length);
  return charsWritten;
}

function _binaryWrite(buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length);
}

function _base64Write(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length);
  return charsWritten;
}

function _utf16leWrite(buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length);
  return charsWritten;
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {
    // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = Number(offset) || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length);
      break;
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length);
      break;
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length);
      break;
    case 'binary':
      ret = _binaryWrite(this, string, offset, length);
      break;
    case 'base64':
      ret = _base64Write(this, string, offset, length);
      break;
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length);
      break;
    default:
      throw new Error('Unknown encoding');
  }
  return ret;
};

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this;

  encoding = String(encoding || 'utf8').toLowerCase();
  start = Number(start) || 0;
  end = end !== undefined ? Number(end) : end = self.length;

  // Fastpath empty strings
  if (end === start) return '';

  var ret;
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end);
      break;
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end);
      break;
    case 'ascii':
      ret = _asciiSlice(self, start, end);
      break;
    case 'binary':
      ret = _binarySlice(self, start, end);
      break;
    case 'base64':
      ret = _base64Slice(self, start, end);
      break;
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end);
      break;
    default:
      throw new Error('Unknown encoding');
  }
  return ret;
};

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this;

  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (!target_start) target_start = 0;

  // Copy 0 bytes; we're done
  if (end === start) return;
  if (target.length === 0 || source.length === 0) return;

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart');
  assert(target_start >= 0 && target_start < target.length, 'targetStart out of bounds');
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds');
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - target_start < end - start) end = target.length - target_start + start;

  var len = end - start;

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++) target[i + target_start] = this[i + start];
  } else {
    target._set(this.subarray(start, start + len), target_start);
  }
};

function _base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function _utf8Slice(buf, start, end) {
  var res = '';
  var tmp = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
      tmp = '';
    } else {
      tmp += '%' + buf[i].toString(16);
    }
  }

  return res + decodeUtf8Char(tmp);
}

function _asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; i++) ret += String.fromCharCode(buf[i]);
  return ret;
}

function _binarySlice(buf, start, end) {
  return _asciiSlice(buf, start, end);
}

function _hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(buf[i]);
  }
  return out;
}

function _utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length;
  start = clamp(start, len, 0);
  end = clamp(end, len, len);

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end));
  } else {
    var sliceLen = end - start;
    var newBuf = new Buffer(sliceLen, undefined, true);
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start];
    }
    return newBuf;
  }
};

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.');
  return this.readUInt8(offset);
};

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.');
  return this.writeUInt8(v, offset);
};

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'Trying to read beyond buffer length');
  }

  if (offset >= this.length) return;

  return this[offset];
};

function _readUInt16(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val;
  if (littleEndian) {
    val = buf[offset];
    if (offset + 1 < len) val |= buf[offset + 1] << 8;
  } else {
    val = buf[offset] << 8;
    if (offset + 1 < len) val |= buf[offset + 1];
  }
  return val;
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert);
};

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert);
};

function _readUInt32(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val;
  if (littleEndian) {
    if (offset + 2 < len) val = buf[offset + 2] << 16;
    if (offset + 1 < len) val |= buf[offset + 1] << 8;
    val |= buf[offset];
    if (offset + 3 < len) val = val + (buf[offset + 3] << 24 >>> 0);
  } else {
    if (offset + 1 < len) val = buf[offset + 1] << 16;
    if (offset + 2 < len) val |= buf[offset + 2] << 8;
    if (offset + 3 < len) val |= buf[offset + 3];
    val = val + (buf[offset] << 24 >>> 0);
  }
  return val;
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert);
};

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'Trying to read beyond buffer length');
  }

  if (offset >= this.length) return;

  var neg = this[offset] & 0x80;
  if (neg) return (0xff - this[offset] + 1) * -1;else return this[offset];
};

function _readInt16(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val = _readUInt16(buf, offset, littleEndian, true);
  var neg = val & 0x8000;
  if (neg) return (0xffff - val + 1) * -1;else return val;
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert);
};

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert);
};

function _readInt32(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
  }

  var len = buf.length;
  if (offset >= len) return;

  var val = _readUInt32(buf, offset, littleEndian, true);
  var neg = val & 0x80000000;
  if (neg) return (0xffffffff - val + 1) * -1;else return val;
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert);
};

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert);
};

function _readFloat(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length');
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4);
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert);
};

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert);
};

function _readDouble(buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length');
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8);
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert);
};

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert);
};

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'trying to write beyond buffer length');
    verifuint(value, 0xff);
  }

  if (offset >= this.length) return;

  this[offset] = value;
};

function _writeUInt16(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length');
    verifuint(value, 0xffff);
  }

  var len = buf.length;
  if (offset >= len) return;

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert);
};

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert);
};

function _writeUInt32(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length');
    verifuint(value, 0xffffffff);
  }

  var len = buf.length;
  if (offset >= len) return;

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert);
};

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset < this.length, 'Trying to write beyond buffer length');
    verifsint(value, 0x7f, -0x80);
  }

  if (offset >= this.length) return;

  if (value >= 0) this.writeUInt8(value, offset, noAssert);else this.writeUInt8(0xff + value + 1, offset, noAssert);
};

function _writeInt16(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length');
    verifsint(value, 0x7fff, -0x8000);
  }

  var len = buf.length;
  if (offset >= len) return;

  if (value >= 0) _writeUInt16(buf, value, offset, littleEndian, noAssert);else _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert);
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert);
};

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert);
};

function _writeInt32(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length');
    verifsint(value, 0x7fffffff, -0x80000000);
  }

  var len = buf.length;
  if (offset >= len) return;

  if (value >= 0) _writeUInt32(buf, value, offset, littleEndian, noAssert);else _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert);
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert);
};

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert);
};

function _writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length');
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  var len = buf.length;
  if (offset >= len) return;

  ieee754.write(buf, value, offset, littleEndian, 23, 4);
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert);
};

function _writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value');
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian');
    assert(offset !== undefined && offset !== null, 'missing offset');
    assert(offset + 7 < buf.length, 'Trying to write beyond buffer length');
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  var len = buf.length;
  if (offset >= len) return;

  ieee754.write(buf, value, offset, littleEndian, 52, 8);
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert);
};

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0;
  if (!start) start = 0;
  if (!end) end = this.length;

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number');
  assert(end >= start, 'end < start');

  // Fill 0 bytes; we're done
  if (end === start) return;
  if (this.length === 0) return;

  assert(start >= 0 && start < this.length, 'start out of bounds');
  assert(end >= 0 && end <= this.length, 'end out of bounds');

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
};

Buffer.prototype.inspect = function () {
  var out = [];
  var len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<Buffer ' + out.join(' ') + '>';
};

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return new Buffer(this).buffer;
    } else {
      var buf = new Uint8Array(this.length);
      for (var i = 0, len = buf.length; i < len; i += 1) buf[i] = this[i];
      return buf.buffer;
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser');
  }
};

// HELPER FUNCTIONS
// ================

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

var BP = Buffer.prototype;

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true;

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get;
  arr._set = arr.set;

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get;
  arr.set = BP.set;

  arr.write = BP.write;
  arr.toString = BP.toString;
  arr.toLocaleString = BP.toString;
  arr.toJSON = BP.toJSON;
  arr.copy = BP.copy;
  arr.slice = BP.slice;
  arr.readUInt8 = BP.readUInt8;
  arr.readUInt16LE = BP.readUInt16LE;
  arr.readUInt16BE = BP.readUInt16BE;
  arr.readUInt32LE = BP.readUInt32LE;
  arr.readUInt32BE = BP.readUInt32BE;
  arr.readInt8 = BP.readInt8;
  arr.readInt16LE = BP.readInt16LE;
  arr.readInt16BE = BP.readInt16BE;
  arr.readInt32LE = BP.readInt32LE;
  arr.readInt32BE = BP.readInt32BE;
  arr.readFloatLE = BP.readFloatLE;
  arr.readFloatBE = BP.readFloatBE;
  arr.readDoubleLE = BP.readDoubleLE;
  arr.readDoubleBE = BP.readDoubleBE;
  arr.writeUInt8 = BP.writeUInt8;
  arr.writeUInt16LE = BP.writeUInt16LE;
  arr.writeUInt16BE = BP.writeUInt16BE;
  arr.writeUInt32LE = BP.writeUInt32LE;
  arr.writeUInt32BE = BP.writeUInt32BE;
  arr.writeInt8 = BP.writeInt8;
  arr.writeInt16LE = BP.writeInt16LE;
  arr.writeInt16BE = BP.writeInt16BE;
  arr.writeInt32LE = BP.writeInt32LE;
  arr.writeInt32BE = BP.writeInt32BE;
  arr.writeFloatLE = BP.writeFloatLE;
  arr.writeFloatBE = BP.writeFloatBE;
  arr.writeDoubleLE = BP.writeDoubleLE;
  arr.writeDoubleBE = BP.writeDoubleBE;
  arr.fill = BP.fill;
  arr.inspect = BP.inspect;
  arr.toArrayBuffer = BP.toArrayBuffer;

  return arr;
};

// slice(start, end)
function clamp(index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue;
  index = ~~index; // Coerce to integer.
  if (index >= len) return len;
  if (index >= 0) return index;
  index += len;
  if (index >= 0) return index;
  return 0;
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}

function isArray(subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]';
  })(subject);
}

function isArrayish(subject) {
  return isArray(subject) || Buffer.isBuffer(subject) || subject && typeof subject === 'object' && typeof subject.length === 'number';
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i);
    if (b <= 0x7F) byteArray.push(str.charCodeAt(i));else {
      var start = i;
      if (b >= 0xD800 && b <= 0xDFFF) i++;
      var h = encodeURIComponent(str.slice(start, i + 1)).substr(1).split('%');
      for (var j = 0; j < h.length; j++) byteArray.push(parseInt(h[j], 16));
    }
  }
  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(str);
}

function blitBuffer(src, dst, offset, length) {
  var pos;
  for (var i = 0; i < length; i++) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint(value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value >= 0, 'specified a negative value for writing an unsigned value');
  assert(value <= max, 'value is larger than maximum value for type');
  assert(Math.floor(value) === value, 'value has a fractional component');
}

function verifsint(value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value <= max, 'value larger than maximum allowed value');
  assert(value >= min, 'value smaller than minimum allowed value');
  assert(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number');
  assert(value <= max, 'value larger than maximum allowed value');
  assert(value >= min, 'value smaller than minimum allowed value');
}

function assert(test, message) {
  if (!test) throw new Error(message || 'Failed assertion');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGJ1ZmZlclxcaW5kZXguanMiXSwibmFtZXMiOlsiYmFzZTY0IiwicmVxdWlyZSIsImllZWU3NTQiLCJleHBvcnRzIiwiQnVmZmVyIiwiU2xvd0J1ZmZlciIsIklOU1BFQ1RfTUFYX0JZVEVTIiwicG9vbFNpemUiLCJfdXNlVHlwZWRBcnJheXMiLCJidWYiLCJBcnJheUJ1ZmZlciIsImFyciIsIlVpbnQ4QXJyYXkiLCJmb28iLCJzdWJhcnJheSIsImUiLCJzdWJqZWN0IiwiZW5jb2RpbmciLCJub1plcm8iLCJ0eXBlIiwic3RyaW5ndHJpbSIsImxlbmd0aCIsImNvZXJjZSIsImJ5dGVMZW5ndGgiLCJFcnJvciIsIl9hdWdtZW50IiwiX2lzQnVmZmVyIiwiaSIsIl9zZXQiLCJpc0FycmF5aXNoIiwiaXNCdWZmZXIiLCJyZWFkVUludDgiLCJ3cml0ZSIsImlzRW5jb2RpbmciLCJTdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImIiLCJ1bmRlZmluZWQiLCJzdHIiLCJyZXQiLCJ1dGY4VG9CeXRlcyIsImJhc2U2NFRvQnl0ZXMiLCJjb25jYXQiLCJsaXN0IiwidG90YWxMZW5ndGgiLCJhc3NlcnQiLCJpc0FycmF5IiwicG9zIiwiaXRlbSIsImNvcHkiLCJfaGV4V3JpdGUiLCJzdHJpbmciLCJvZmZzZXQiLCJOdW1iZXIiLCJyZW1haW5pbmciLCJzdHJMZW4iLCJieXRlIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJpc05hTiIsIl9jaGFyc1dyaXR0ZW4iLCJfdXRmOFdyaXRlIiwiY2hhcnNXcml0dGVuIiwiYmxpdEJ1ZmZlciIsIl9hc2NpaVdyaXRlIiwiYXNjaWlUb0J5dGVzIiwiX2JpbmFyeVdyaXRlIiwiX2Jhc2U2NFdyaXRlIiwiX3V0ZjE2bGVXcml0ZSIsInV0ZjE2bGVUb0J5dGVzIiwicHJvdG90eXBlIiwiaXNGaW5pdGUiLCJzd2FwIiwidG9TdHJpbmciLCJzdGFydCIsImVuZCIsInNlbGYiLCJfaGV4U2xpY2UiLCJfdXRmOFNsaWNlIiwiX2FzY2lpU2xpY2UiLCJfYmluYXJ5U2xpY2UiLCJfYmFzZTY0U2xpY2UiLCJfdXRmMTZsZVNsaWNlIiwidG9KU09OIiwiZGF0YSIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwiX2FyciIsInRhcmdldCIsInRhcmdldF9zdGFydCIsInNvdXJjZSIsImxlbiIsImZyb21CeXRlQXJyYXkiLCJyZXMiLCJ0bXAiLCJNYXRoIiwibWluIiwiZGVjb2RlVXRmOENoYXIiLCJmcm9tQ2hhckNvZGUiLCJvdXQiLCJ0b0hleCIsImJ5dGVzIiwiY2xhbXAiLCJzbGljZUxlbiIsIm5ld0J1ZiIsImdldCIsImNvbnNvbGUiLCJsb2ciLCJzZXQiLCJ2Iiwid3JpdGVVSW50OCIsIm5vQXNzZXJ0IiwiX3JlYWRVSW50MTYiLCJsaXR0bGVFbmRpYW4iLCJ2YWwiLCJyZWFkVUludDE2TEUiLCJyZWFkVUludDE2QkUiLCJfcmVhZFVJbnQzMiIsInJlYWRVSW50MzJMRSIsInJlYWRVSW50MzJCRSIsInJlYWRJbnQ4IiwibmVnIiwiX3JlYWRJbnQxNiIsInJlYWRJbnQxNkxFIiwicmVhZEludDE2QkUiLCJfcmVhZEludDMyIiwicmVhZEludDMyTEUiLCJyZWFkSW50MzJCRSIsIl9yZWFkRmxvYXQiLCJyZWFkIiwicmVhZEZsb2F0TEUiLCJyZWFkRmxvYXRCRSIsIl9yZWFkRG91YmxlIiwicmVhZERvdWJsZUxFIiwicmVhZERvdWJsZUJFIiwidmFsdWUiLCJ2ZXJpZnVpbnQiLCJfd3JpdGVVSW50MTYiLCJqIiwid3JpdGVVSW50MTZMRSIsIndyaXRlVUludDE2QkUiLCJfd3JpdGVVSW50MzIiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGVVSW50MzJCRSIsIndyaXRlSW50OCIsInZlcmlmc2ludCIsIl93cml0ZUludDE2Iiwid3JpdGVJbnQxNkxFIiwid3JpdGVJbnQxNkJFIiwiX3dyaXRlSW50MzIiLCJ3cml0ZUludDMyTEUiLCJ3cml0ZUludDMyQkUiLCJfd3JpdGVGbG9hdCIsInZlcmlmSUVFRTc1NCIsIndyaXRlRmxvYXRMRSIsIndyaXRlRmxvYXRCRSIsIl93cml0ZURvdWJsZSIsIndyaXRlRG91YmxlTEUiLCJ3cml0ZURvdWJsZUJFIiwiZmlsbCIsImNoYXJDb2RlQXQiLCJpbnNwZWN0Iiwiam9pbiIsInRvQXJyYXlCdWZmZXIiLCJidWZmZXIiLCJ0cmltIiwicmVwbGFjZSIsIkJQIiwiX2dldCIsInRvTG9jYWxlU3RyaW5nIiwiaW5kZXgiLCJkZWZhdWx0VmFsdWUiLCJjZWlsIiwiT2JqZWN0IiwibiIsImJ5dGVBcnJheSIsInB1c2giLCJoIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3BsaXQiLCJjIiwiaGkiLCJsbyIsInRvQnl0ZUFycmF5Iiwic3JjIiwiZHN0IiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZXJyIiwibWF4IiwiZmxvb3IiLCJ0ZXN0IiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUFPQSxJQUFJQSxTQUFTQyxRQUFRLFdBQVIsQ0FBYjtBQUNBLElBQUlDLFVBQVVELFFBQVEsU0FBUixDQUFkOztBQUVBRSxRQUFRQyxNQUFSLEdBQWlCQSxNQUFqQjtBQUNBRCxRQUFRRSxVQUFSLEdBQXFCRCxNQUFyQjtBQUNBRCxRQUFRRyxpQkFBUixHQUE0QixFQUE1QjtBQUNBRixPQUFPRyxRQUFQLEdBQWtCLElBQWxCOztBQUVBOzs7OztBQUtBSCxPQUFPSSxlQUFQLEdBQTBCLFlBQVk7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUk7QUFDRixRQUFJQyxNQUFNLElBQUlDLFdBQUosQ0FBZ0IsQ0FBaEIsQ0FBVjtBQUNBLFFBQUlDLE1BQU0sSUFBSUMsVUFBSixDQUFlSCxHQUFmLENBQVY7QUFDQUUsUUFBSUUsR0FBSixHQUFVLFlBQVk7QUFBRSxhQUFPLEVBQVA7QUFBVyxLQUFuQztBQUNBLFdBQU8sT0FBT0YsSUFBSUUsR0FBSixFQUFQLElBQ0gsT0FBT0YsSUFBSUcsUUFBWCxLQUF3QixVQUQ1QixD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Q0FBckI7QUFDQXBELFNBQU9tRCxLQUFLOEYsS0FBTCxDQUFXdEQsS0FBWCxNQUFzQkEsS0FBN0IsRUFBb0Msa0NBQXBDO0FBQ0Q7O0FBRUQsU0FBU2tCLFlBQVQsQ0FBdUJsQixLQUF2QixFQUE4QnFELEdBQTlCLEVBQW1DNUYsR0FBbkMsRUFBd0M7QUFDdENwRCxTQUFPLE9BQU8yRixLQUFQLEtBQWlCLFFBQXhCLEVBQWtDLHVDQUFsQztBQUNBM0YsU0FBTzJGLFNBQVNxRCxHQUFoQixFQUFxQix5Q0FBckI7QUFDQWhKLFNBQU8yRixTQUFTdkMsR0FBaEIsRUFBcUIsMENBQXJCO0FBQ0Q7O0FBRUQsU0FBU3BELE1BQVQsQ0FBaUJrSixJQUFqQixFQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUIsTUFBSSxDQUFDRCxJQUFMLEVBQVcsTUFBTSxJQUFJdkssS0FBSixDQUFVd0ssV0FBVyxrQkFBckIsQ0FBTjtBQUNaIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cbiJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\buffer\\index.js","/..\\..\\..\\node_modules\\buffer")
},{"9FoBSB":17,"base64-js":2,"buffer":4,"ieee754":15}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'select'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */

        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGNsaXBib2FyZFxcbGliXFxjbGlwYm9hcmQtYWN0aW9uLmpzIl0sIm5hbWVzIjpbImdsb2JhbCIsImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwicmVxdWlyZSIsIm1vZCIsInNlbGVjdCIsImNsaXBib2FyZEFjdGlvbiIsIl9zZWxlY3QiLCJfc2VsZWN0MiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl90eXBlb2YiLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJDb25zdHJ1Y3RvciIsIlR5cGVFcnJvciIsIl9jcmVhdGVDbGFzcyIsImRlZmluZVByb3BlcnRpZXMiLCJ0YXJnZXQiLCJwcm9wcyIsImkiLCJsZW5ndGgiLCJkZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJwcm90b1Byb3BzIiwic3RhdGljUHJvcHMiLCJDbGlwYm9hcmRBY3Rpb24iLCJvcHRpb25zIiwicmVzb2x2ZU9wdGlvbnMiLCJpbml0U2VsZWN0aW9uIiwidmFsdWUiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJhY3Rpb24iLCJjb250YWluZXIiLCJlbWl0dGVyIiwidGV4dCIsInRyaWdnZXIiLCJzZWxlY3RlZFRleHQiLCJzZWxlY3RGYWtlIiwic2VsZWN0VGFyZ2V0IiwiX3RoaXMiLCJpc1JUTCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwicmVtb3ZlRmFrZSIsImZha2VIYW5kbGVyQ2FsbGJhY2siLCJmYWtlSGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJmYWtlRWxlbSIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImZvbnRTaXplIiwiYm9yZGVyIiwicGFkZGluZyIsIm1hcmdpbiIsInBvc2l0aW9uIiwieVBvc2l0aW9uIiwid2luZG93IiwicGFnZVlPZmZzZXQiLCJzY3JvbGxUb3AiLCJ0b3AiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImNvcHlUZXh0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlbW92ZUNoaWxkIiwic3VjY2VlZGVkIiwiZXhlY0NvbW1hbmQiLCJlcnIiLCJoYW5kbGVSZXN1bHQiLCJlbWl0IiwiY2xlYXJTZWxlY3Rpb24iLCJiaW5kIiwiZm9jdXMiLCJnZXRTZWxlY3Rpb24iLCJyZW1vdmVBbGxSYW5nZXMiLCJkZXN0cm95Iiwic2V0IiwiX2FjdGlvbiIsIkVycm9yIiwiZ2V0Iiwibm9kZVR5cGUiLCJoYXNBdHRyaWJ1dGUiLCJfdGFyZ2V0Il0sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVVBLE1BQVYsRUFBa0JDLE9BQWxCLEVBQTJCO0FBQ3hCLFFBQUksT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBM0MsRUFBZ0Q7QUFDNUNELGVBQU8sQ0FBQyxRQUFELEVBQVcsUUFBWCxDQUFQLEVBQTZCRCxPQUE3QjtBQUNILEtBRkQsTUFFTyxJQUFJLE9BQU9HLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDdkNILGdCQUFRSSxNQUFSLEVBQWdCQyxRQUFRLFFBQVIsQ0FBaEI7QUFDSCxLQUZNLE1BRUE7QUFDSCxZQUFJQyxNQUFNO0FBQ05ILHFCQUFTO0FBREgsU0FBVjtBQUdBSCxnQkFBUU0sR0FBUixFQUFhUCxPQUFPUSxNQUFwQjtBQUNBUixlQUFPUyxlQUFQLEdBQXlCRixJQUFJSCxPQUE3QjtBQUNIO0FBQ0osQ0FaRCxFQVlHLElBWkgsRUFZUyxVQUFVQyxNQUFWLEVBQWtCSyxPQUFsQixFQUEyQjtBQUNoQzs7QUFFQSxRQUFJQyxXQUFXQyx1QkFBdUJGLE9BQXZCLENBQWY7O0FB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QXJCRixTQWxJMkIsQ0FBOUI7O0FBMEpBLGVBQU8zRCxlQUFQO0FBQ0gsS0E1S3FCLEVBQXRCOztBQThLQW5DLFdBQU9ELE9BQVAsR0FBaUJvQyxlQUFqQjtBQUNILENBcE9EIiwiZmlsZSI6ImNsaXBib2FyZC1hY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWydtb2R1bGUnLCAnc2VsZWN0J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZmFjdG9yeShtb2R1bGUsIHJlcXVpcmUoJ3NlbGVjdCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbW9kID0ge1xuICAgICAgICAgICAgZXhwb3J0czoge31cbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeShtb2QsIGdsb2JhbC5zZWxlY3QpO1xuICAgICAgICBnbG9iYWwuY2xpcGJvYXJkQWN0aW9uID0gbW9kLmV4cG9ydHM7XG4gICAgfVxufSkodGhpcywgZnVuY3Rpb24gKG1vZHVsZSwgX3NlbGVjdCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBfc2VsZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NlbGVjdCk7XG5cbiAgICBmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgICAgICAgICAgZGVmYXVsdDogb2JqXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICAgICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgICAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgICAgICB9O1xuICAgIH0oKTtcblxuICAgIHZhciBDbGlwYm9hcmRBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gQ2xpcGJvYXJkQWN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDbGlwYm9hcmRBY3Rpb24pO1xuXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2VsZWN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lcyBiYXNlIHByb3BlcnRpZXMgcGFzc2VkIGZyb20gY29uc3RydWN0b3IuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgX2NyZWF0ZUNsYXNzKENsaXBib2FyZEFjdGlvbiwgW3tcbiAgICAgICAgICAgIGtleTogJ3Jlc29sdmVPcHRpb25zJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlT3B0aW9ucygpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyID0gb3B0aW9ucy5lbWl0dGVyO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gb3B0aW9ucy50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gb3B0aW9ucy50ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlciA9IG9wdGlvbnMudHJpZ2dlcjtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUZXh0ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2luaXRTZWxlY3Rpb24nLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaXRTZWxlY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEZha2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0VGFyZ2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdzZWxlY3RGYWtlJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZWxlY3RGYWtlKCkge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNSVEwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXInKSA9PSAncnRsJztcblxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRmFrZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlSGFuZGxlckNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVtb3ZlRmFrZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlSGFuZGxlciA9IHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5mYWtlSGFuZGxlckNhbGxiYWNrKSB8fCB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCB6b29taW5nIG9uIGlPU1xuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc3R5bGUuZm9udFNpemUgPSAnMTJwdCc7XG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgYm94IG1vZGVsXG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5ib3JkZXIgPSAnMCc7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5wYWRkaW5nID0gJzAnO1xuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc3R5bGUubWFyZ2luID0gJzAnO1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgZWxlbWVudCBvdXQgb2Ygc2NyZWVuIGhvcml6b250YWxseVxuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc3R5bGVbaXNSVEwgPyAncmlnaHQnIDogJ2xlZnQnXSA9ICctOTk5OXB4JztcbiAgICAgICAgICAgICAgICAvLyBNb3ZlIGVsZW1lbnQgdG8gdGhlIHNhbWUgcG9zaXRpb24gdmVydGljYWxseVxuICAgICAgICAgICAgICAgIHZhciB5UG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLnRvcCA9IHlQb3NpdGlvbiArICdweCc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnNldEF0dHJpYnV0ZSgncmVhZG9ubHknLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS52YWx1ZSA9IHRoaXMudGV4dDtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZmFrZUVsZW0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSAoMCwgX3NlbGVjdDIuZGVmYXVsdCkodGhpcy5mYWtlRWxlbSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5VGV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdyZW1vdmVGYWtlJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVGYWtlKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZha2VIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5mYWtlSGFuZGxlckNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWtlSGFuZGxlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFrZUhhbmRsZXJDYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmFrZUVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5mYWtlRWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnc2VsZWN0VGFyZ2V0JyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZWxlY3RUYXJnZXQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSAoMCwgX3NlbGVjdDIuZGVmYXVsdCkodGhpcy50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29weVRleHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnY29weVRleHQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvcHlUZXh0KCkge1xuICAgICAgICAgICAgICAgIHZhciBzdWNjZWVkZWQgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZWVkZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCh0aGlzLmFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2NlZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzdWx0KHN1Y2NlZWRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2hhbmRsZVJlc3VsdCcsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlUmVzdWx0KHN1Y2NlZWRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KHN1Y2NlZWRlZCA/ICdzdWNjZXNzJyA6ICdlcnJvcicsIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB0aGlzLmFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5zZWxlY3RlZFRleHQsXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6IHRoaXMudHJpZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb246IHRoaXMuY2xlYXJTZWxlY3Rpb24uYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdjbGVhclNlbGVjdGlvbicsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpZ2dlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2Rlc3Ryb3knLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGYWtlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2FjdGlvbicsXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnY29weSc7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9hY3Rpb24gPSBhY3Rpb247XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWN0aW9uICE9PSAnY29weScgJiYgdGhpcy5fYWN0aW9uICE9PSAnY3V0Jykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJhY3Rpb25cIiB2YWx1ZSwgdXNlIGVpdGhlciBcImNvcHlcIiBvciBcImN1dFwiJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ3RhcmdldCcsXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodGFyZ2V0KSkgPT09ICdvYmplY3QnICYmIHRhcmdldC5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAnY29weScgJiYgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcInRhcmdldFwiIGF0dHJpYnV0ZS4gUGxlYXNlIHVzZSBcInJlYWRvbmx5XCIgaW5zdGVhZCBvZiBcImRpc2FibGVkXCIgYXR0cmlidXRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ2N1dCcgJiYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ3JlYWRvbmx5JykgfHwgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJ0YXJnZXRcIiBhdHRyaWJ1dGUuIFlvdSBjYW5cXCd0IGN1dCB0ZXh0IGZyb20gZWxlbWVudHMgd2l0aCBcInJlYWRvbmx5XCIgb3IgXCJkaXNhYmxlZFwiIGF0dHJpYnV0ZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwidGFyZ2V0XCIgdmFsdWUsIHVzZSBhIHZhbGlkIEVsZW1lbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbiAgICAgICAgcmV0dXJuIENsaXBib2FyZEFjdGlvbjtcbiAgICB9KCk7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENsaXBib2FyZEFjdGlvbjtcbn0pOyJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\clipboard\\lib\\clipboard-action.js","/..\\..\\..\\node_modules\\clipboard\\lib")
},{"9FoBSB":17,"buffer":4,"select":18}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */

        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGNsaXBib2FyZFxcbGliXFxjbGlwYm9hcmQuanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwibW9kIiwiY2xpcGJvYXJkQWN0aW9uIiwidGlueUVtaXR0ZXIiLCJnb29kTGlzdGVuZXIiLCJjbGlwYm9hcmQiLCJfY2xpcGJvYXJkQWN0aW9uIiwiX3RpbnlFbWl0dGVyIiwiX2dvb2RMaXN0ZW5lciIsIl9jbGlwYm9hcmRBY3Rpb24yIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl90aW55RW1pdHRlcjIiLCJfZ29vZExpc3RlbmVyMiIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX3R5cGVvZiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJpbnN0YW5jZSIsIkNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuIiwic2VsZiIsImNhbGwiLCJSZWZlcmVuY2VFcnJvciIsIl9pbmhlcml0cyIsInN1YkNsYXNzIiwic3VwZXJDbGFzcyIsImNyZWF0ZSIsInZhbHVlIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJDbGlwYm9hcmQiLCJfRW1pdHRlciIsInRyaWdnZXIiLCJvcHRpb25zIiwiX3RoaXMiLCJnZXRQcm90b3R5cGVPZiIsInJlc29sdmVPcHRpb25zIiwibGlzdGVuQ2xpY2siLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJhY3Rpb24iLCJkZWZhdWx0QWN0aW9uIiwiZGVmYXVsdFRhcmdldCIsInRleHQiLCJkZWZhdWx0VGV4dCIsImNvbnRhaW5lciIsImRvY3VtZW50IiwiYm9keSIsIl90aGlzMiIsImxpc3RlbmVyIiwiZSIsIm9uQ2xpY2siLCJkZWxlZ2F0ZVRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJlbWl0dGVyIiwiZ2V0QXR0cmlidXRlVmFsdWUiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3IiLCJkZXN0cm95IiwiaXNTdXBwb3J0ZWQiLCJhY3Rpb25zIiwic3VwcG9ydCIsInF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCIsImZvckVhY2giLCJzdWZmaXgiLCJlbGVtZW50IiwiYXR0cmlidXRlIiwiaGFzQXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVVBLE1BQVYsRUFBa0JDLE9BQWxCLEVBQTJCO0FBQ3hCLFFBQUksT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBM0MsRUFBZ0Q7QUFDNUNELGVBQU8sQ0FBQyxRQUFELEVBQVcsb0JBQVgsRUFBaUMsY0FBakMsRUFBaUQsZUFBakQsQ0FBUCxFQUEwRUQsT0FBMUU7QUFDSCxLQUZELE1BRU8sSUFBSSxPQUFPRyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ3ZDSCxnQkFBUUksTUFBUixFQUFnQkMsUUFBUSxvQkFBUixDQUFoQixFQUErQ0EsUUFBUSxjQUFSLENBQS9DLEVBQXdFQSxRQUFRLGVBQVIsQ0FBeEU7QUFDSCxLQUZNLE1BRUE7QUFDSCxZQUFJQyxNQUFNO0FBQ05ILHFCQUFTO0FBREgsU0FBVjtBQUdBSCxnQkFBUU0sR0FBUixFQUFhUCxPQUFPUSxlQUFwQixFQUFxQ1IsT0FBT1MsV0FBNUMsRUFBeURULE9BQU9VLFlBQWhFO0FBQ0FWLGVBQU9XLFNBQVAsR0FBbUJKLElB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VSxDQUFWLE1BQWlCQyxTQUF6QyxHQUFxREQsVUFBVSxDQUFWLENBQXJELEdBQW9FLENBQUMsTUFBRCxFQUFTLEtBQVQsQ0FBakY7O0FBRUEsb0JBQUlzQixVQUFVLE9BQU9wQixNQUFQLEtBQWtCLFFBQWxCLEdBQTZCLENBQUNBLE1BQUQsQ0FBN0IsR0FBd0NBLE1BQXREO0FBQ0Esb0JBQUlxQixVQUFVLENBQUMsQ0FBQ2YsU0FBU2dCLHFCQUF6Qjs7QUFFQUYsd0JBQVFHLE9BQVIsQ0FBZ0IsVUFBVXZCLE1BQVYsRUFBa0I7QUFDOUJxQiw4QkFBVUEsV0FBVyxDQUFDLENBQUNmLFNBQVNnQixxQkFBVCxDQUErQnRCLE1BQS9CLENBQXZCO0FBQ0gsaUJBRkQ7O0FBSUEsdUJBQU9xQixPQUFQO0FBQ0g7QUFiQSxTQUFELENBbEVKOztBQWtGQSxlQUFPL0IsU0FBUDtBQUNILEtBM0dlLENBMkdkeEMsY0FBY0ksT0EzR0EsQ0FBaEI7O0FBNkdBOzs7OztBQUtBLGFBQVM2RCxpQkFBVCxDQUEyQlMsTUFBM0IsRUFBbUNDLE9BQW5DLEVBQTRDO0FBQ3hDLFlBQUlDLFlBQVksb0JBQW9CRixNQUFwQzs7QUFFQSxZQUFJLENBQUNDLFFBQVFFLFlBQVIsQ0FBcUJELFNBQXJCLENBQUwsRUFBc0M7QUFDbEM7QUFDSDs7QUFFRCxlQUFPRCxRQUFRRyxZQUFSLENBQXFCRixTQUFyQixDQUFQO0FBQ0g7O0FBRUR4RixXQUFPRCxPQUFQLEdBQWlCcUQsU0FBakI7QUFDSCxDQTlNRCIsImZpbGUiOiJjbGlwYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWydtb2R1bGUnLCAnLi9jbGlwYm9hcmQtYWN0aW9uJywgJ3RpbnktZW1pdHRlcicsICdnb29kLWxpc3RlbmVyJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZmFjdG9yeShtb2R1bGUsIHJlcXVpcmUoJy4vY2xpcGJvYXJkLWFjdGlvbicpLCByZXF1aXJlKCd0aW55LWVtaXR0ZXInKSwgcmVxdWlyZSgnZ29vZC1saXN0ZW5lcicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbW9kID0ge1xuICAgICAgICAgICAgZXhwb3J0czoge31cbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeShtb2QsIGdsb2JhbC5jbGlwYm9hcmRBY3Rpb24sIGdsb2JhbC50aW55RW1pdHRlciwgZ2xvYmFsLmdvb2RMaXN0ZW5lcik7XG4gICAgICAgIGdsb2JhbC5jbGlwYm9hcmQgPSBtb2QuZXhwb3J0cztcbiAgICB9XG59KSh0aGlzLCBmdW5jdGlvbiAobW9kdWxlLCBfY2xpcGJvYXJkQWN0aW9uLCBfdGlueUVtaXR0ZXIsIF9nb29kTGlzdGVuZXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgX2NsaXBib2FyZEFjdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGlwYm9hcmRBY3Rpb24pO1xuXG4gICAgdmFyIF90aW55RW1pdHRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aW55RW1pdHRlcik7XG5cbiAgICB2YXIgX2dvb2RMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nb29kTGlzdGVuZXIpO1xuXG4gICAgZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG9ialxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH0gOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgICAgICAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICBmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gICAgICAgIGlmICghc2VsZikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbiAgICB9XG5cbiAgICB2YXIgQ2xpcGJvYXJkID0gZnVuY3Rpb24gKF9FbWl0dGVyKSB7XG4gICAgICAgIF9pbmhlcml0cyhDbGlwYm9hcmQsIF9FbWl0dGVyKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8SFRNTEVsZW1lbnR8SFRNTENvbGxlY3Rpb258Tm9kZUxpc3R9IHRyaWdnZXJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIENsaXBib2FyZCh0cmlnZ2VyLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2xpcGJvYXJkKTtcblxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKENsaXBib2FyZC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKENsaXBib2FyZCkpLmNhbGwodGhpcykpO1xuXG4gICAgICAgICAgICBfdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICAgIF90aGlzLmxpc3RlbkNsaWNrKHRyaWdnZXIpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmluZXMgaWYgYXR0cmlidXRlcyB3b3VsZCBiZSByZXNvbHZlZCB1c2luZyBpbnRlcm5hbCBzZXR0ZXIgZnVuY3Rpb25zXG4gICAgICAgICAqIG9yIGN1c3RvbSBmdW5jdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgX2NyZWF0ZUNsYXNzKENsaXBib2FyZCwgW3tcbiAgICAgICAgICAgIGtleTogJ3Jlc29sdmVPcHRpb25zJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlT3B0aW9ucygpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IHR5cGVvZiBvcHRpb25zLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuYWN0aW9uIDogdGhpcy5kZWZhdWx0QWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdHlwZW9mIG9wdGlvbnMudGFyZ2V0ID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy50YXJnZXQgOiB0aGlzLmRlZmF1bHRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHlwZW9mIG9wdGlvbnMudGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGV4dCA6IHRoaXMuZGVmYXVsdFRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBfdHlwZW9mKG9wdGlvbnMuY29udGFpbmVyKSA9PT0gJ29iamVjdCcgPyBvcHRpb25zLmNvbnRhaW5lciA6IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2xpc3RlbkNsaWNrJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW5DbGljayh0cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyID0gKDAsIF9nb29kTGlzdGVuZXIyLmRlZmF1bHQpKHRyaWdnZXIsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIub25DbGljayhlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnb25DbGljaycsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25DbGljayhlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBlLmRlbGVnYXRlVGFyZ2V0IHx8IGUuY3VycmVudFRhcmdldDtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsaXBib2FyZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaXBib2FyZEFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGlwYm9hcmRBY3Rpb24gPSBuZXcgX2NsaXBib2FyZEFjdGlvbjIuZGVmYXVsdCh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogdGhpcy5hY3Rpb24odHJpZ2dlciksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXQodHJpZ2dlciksXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMudGV4dCh0cmlnZ2VyKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgZW1pdHRlcjogdGhpc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdkZWZhdWx0QWN0aW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZhdWx0QWN0aW9uKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoJ2FjdGlvbicsIHRyaWdnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdkZWZhdWx0VGFyZ2V0JyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZhdWx0VGFyZ2V0KHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBnZXRBdHRyaWJ1dGVWYWx1ZSgndGFyZ2V0JywgdHJpZ2dlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZGVmYXVsdFRleHQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlZmF1bHRUZXh0KHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoJ3RleHQnLCB0cmlnZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZGVzdHJveScsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsaXBib2FyZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaXBib2FyZEFjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpcGJvYXJkQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dLCBbe1xuICAgICAgICAgICAga2V5OiAnaXNTdXBwb3J0ZWQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFsnY29weScsICdjdXQnXTtcblxuICAgICAgICAgICAgICAgIHZhciBhY3Rpb25zID0gdHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycgPyBbYWN0aW9uXSA6IGFjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgc3VwcG9ydCA9ICEhZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkO1xuXG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydCA9IHN1cHBvcnQgJiYgISFkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQoYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBwb3J0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbiAgICAgICAgcmV0dXJuIENsaXBib2FyZDtcbiAgICB9KF90aW55RW1pdHRlcjIuZGVmYXVsdCk7XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gcmV0cmlldmUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVWYWx1ZShzdWZmaXgsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZSA9ICdkYXRhLWNsaXBib2FyZC0nICsgc3VmZml4O1xuXG4gICAgICAgIGlmICghZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDbGlwYm9hcmQ7XG59KTsiXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\clipboard\\lib\\clipboard.js","/..\\..\\..\\node_modules\\clipboard\\lib")
},{"./clipboard-action":5,"9FoBSB":17,"buffer":4,"good-listener":14,"tiny-emitter":19}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Countable is a script to allow for live paragraph-, word- and character-
 * counting on an HTML element.
 *
 * @author   Sacha Schmid (<https://github.com/RadLikeWhoa>)
 * @version  3.0.0
 * @license  MIT
 * @see      <http://radlikewhoa.github.io/Countable/>
 */

/**
 * Note: For the purpose of this internal documentation, arguments of the type
 * {Nodes} are to be interpreted as either {NodeList} or {Element}.
 */

;(function (global) {

  /**
   * @private
   *
   * `liveElements` holds all elements that have the live-counting
   * functionality bound to them.
   */

  let liveElements = [];
  const each = Array.prototype.forEach;

  /**
   * `ucs2decode` function from the punycode.js library.
   *
   * Creates an array containing the decimal code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally, this
   * function will convert a pair of surrogate halves (each of which UCS-2
   * exposes as separate characters) into a single code point, matching
   * UTF-16.
   *
   * @see     <http://goo.gl/8M09r>
   * @see     <http://goo.gl/u4UUC>
   *
   * @param   {String}  string   The Unicode input string (UCS-2).
   *
   * @return  {Array}   The new array of code points.
   */

  function decode(string) {
    const output = [];
    let counter = 0;
    const length = string.length;

    while (counter < length) {
      const value = string.charCodeAt(counter++);

      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {

        // It's a high surrogate, and there is a next character.

        const extra = string.charCodeAt(counter++);

        if ((extra & 0xFC00) == 0xDC00) {
          // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {

          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.

          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }

    return output;
  }

  /**
   * `validateArguments` validates the arguments given to each function call.
   * Errors are logged to the console as warnings, but Countable fails
   * silently.
   *
   * @private
   *
   * @param   {Nodes}     elements  The (collection of) element(s) to
   *                                validate.
   *
   * @param   {Function}  callback  The callback function to validate.
   *
   * @return  {Boolean}   Returns whether all arguments are vaild.
   */

  function validateArguments(elements, callback) {
    const nodes = Object.prototype.toString.call(elements);
    const elementsValid = nodes === '[object NodeList]' || nodes === '[object HTMLCollection]' || elements.nodeType === 1;
    const callbackValid = typeof callback === 'function';

    if (!elementsValid) console.error('Countable: Not a valid target');
    if (!callbackValid) console.error('Countable: Not a valid callback function');

    return elementsValid && callbackValid;
  }

  /**
   * `count` trims an element's value, optionally strips HTML tags and counts
   * paragraphs, sentences, words, characters and characters plus spaces.
   *
   * @private
   *
   * @param   {Element}  element  The element whose value is to be counted.
   *
   * @param   {Object}   options  The options to use for the counting.
   *
   * @return  {Object}   The object containing the number of paragraphs,
   *                     sentences, words, characters and characters plus
   *                     spaces.
   */

  function count(element, options) {
    let original = '' + ('value' in element ? element.value : element.textContent);
    options = options || {};

    /**
     * The initial implementation to allow for HTML tags stripping was created
     * @craniumslows while the current one was created by @Rob--W.
     *
     * @see <http://goo.gl/Exmlr>
     * @see <http://goo.gl/gFQQh>
     */

    if (options.stripTags) original = original.replace(/<\/?[a-z][^>]*>/gi, '');

    if (options.ignore) {
      each.call(options.ignore, function (i) {
        original = original.replace(i, '');
      });
    }

    const trimmed = original.trim();

    /**
     * Most of the performance improvements are based on the works of @epmatsw.
     *
     * @see <http://goo.gl/SWOLB>
     */

    return {
      paragraphs: trimmed ? (trimmed.match(options.hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0,
      sentences: trimmed ? (trimmed.match(/[.?!…]+./g) || []).length + 1 : 0,
      words: trimmed ? (trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []).length : 0,
      characters: trimmed ? decode(trimmed.replace(/\s/g, '')).length : 0,
      all: decode(original).length
    };
  }

  /**
   * This is the main object that will later be exposed to other scripts. It
   * holds all the public methods that can be used to enable the Countable
   * functionality.
   *
   * Some methods accept an optional options parameter. This includes the
   * following options.
   *
   * {Boolean}      hardReturns  Use two returns to seperate a paragraph
   *                             instead of one. (default: false)
   * {Boolean}      stripTags    Strip HTML tags before counting the values.
   *                             (default: false)
   * {Array<Char>}  ignore       A list of characters that should be removed
   *                             ignored when calculating the counters.
   *                             (default: )
   */

  const Countable = {

    /**
     * The `on` method binds the counting handler to all given elements. The
     * event is either `oninput` or `onkeydown`, based on the capabilities of
     * the browser.
     *
     * @param   {Nodes}     elements   All elements that should receive the
     *                                 Countable functionality.
     *
     * @param   {Function}  callback   The callback to fire whenever the
     *                                 element's value changes. The callback is
     *                                 called with the relevant element bound
     *                                 to `this` and the counted values as the
     *                                 single parameter.
     *
     * @param   {Object}    [options]  An object to modify Countable's
     *                                 behaviour.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    on: function (elements, callback, options) {
      if (!validateArguments(elements, callback)) return;

      if (elements.length === undefined) {
        elements = [elements];
      }

      each.call(elements, function (e) {
        const handler = function () {
          callback.call(e, count(e, options));
        };

        liveElements.push({ element: e, handler: handler });

        handler();

        e.addEventListener('input', handler);
      });

      return this;
    },

    /**
     * The `off` method removes the Countable functionality from all given
     * elements.
     *
     * @param   {Nodes}   elements  All elements whose Countable functionality
     *                              should be unbound.
     *
     * @return  {Object}  Returns the Countable object to allow for chaining.
     */

    off: function (elements) {
      if (!validateArguments(elements, function () {})) return;

      if (elements.length === undefined) {
        elements = [elements];
      }

      liveElements.filter(function (e) {
        return elements.indexOf(e.element) !== -1;
      }).forEach(function (e) {
        e.element.removeEventListener('input', e.handler);
      });

      liveElements = liveElements.filter(function (e) {
        return elements.indexOf(e.element) === -1;
      });

      return this;
    },

    /**
     * The `count` method works mostly like the `live` method, but no events are
     * bound, the functionality is only executed once.
     *
     * @param   {Nodes}     elements   All elements that should be counted.
     *
     * @param   {Function}  callback   The callback to fire whenever the
     *                                 element's value changes. The callback is
     *                                 called with the relevant element bound
     *                                 to `this` and the counted values as the
     *                                 single parameter.
     *
     * @param   {Object}    [options]  An object to modify Countable's
     *                                 behaviour.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    count: function (elements, callback, options) {
      if (!validateArguments(elements, callback)) return;

      if (elements.length === undefined) {
        elements = [elements];
      }

      each.call(elements, function (e) {
        callback.call(e, count(e, options));
      });

      return this;
    },

    /**
     * The `enabled` method checks if the live-counting functionality is bound
     * to an element.
     *
     * @param   {Element}  element  All elements that should be checked for the
     *                              Countable functionality.
     *
     * @return  {Boolean}  A boolean value representing whether Countable
     *                     functionality is bound to all given elements.
     */

    enabled: function (elements) {
      if (elements.length === undefined) {
        elements = [elements];
      }

      return liveElements.filter(function (e) {
        return elements.indexOf(e.element) !== -1;
      }).length === elements.length;
    }

    /**
     * Expose Countable depending on the module system used across the
     * application. (Node / CommonJS, AMD, global)
     */

  };if (typeof exports === 'object') {
    module.exports = Countable;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return Countable;
    });
  } else {
    global.Countable = Countable;
  }
})(this);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGNvdW50YWJsZVxcQ291bnRhYmxlLmpzIl0sIm5hbWVzIjpbImdsb2JhbCIsImxpdmVFbGVtZW50cyIsImVhY2giLCJBcnJheSIsInByb3RvdHlwZSIsImZvckVhY2giLCJkZWNvZGUiLCJzdHJpbmciLCJvdXRwdXQiLCJjb3VudGVyIiwibGVuZ3RoIiwidmFsdWUiLCJjaGFyQ29kZUF0IiwiZXh0cmEiLCJwdXNoIiwidmFsaWRhdGVBcmd1bWVudHMiLCJlbGVtZW50cyIsImNhbGxiYWNrIiwibm9kZXMiLCJPYmplY3QiLCJ0b1N0cmluZyIsImNhbGwiLCJlbGVtZW50c1ZhbGlkIiwibm9kZVR5cGUiLCJjYWxsYmFja1ZhbGlkIiwiY29uc29sZSIsImVycm9yIiwiY291bnQiLCJlbGVtZW50Iiwib3B0aW9ucyIsIm9yaWdpbmFsIiwidGV4dENvbnRlbnQiLCJzdHJpcFRhZ3MiLCJyZXBsYWNlIiwiaWdub3JlIiwiaSIsInRyaW1tZWQiLCJ0cmltIiwicGFyYWdyYXBocyIsIm1hdGNoIiwiaGFyZFJldHVybnMiLCJzZW50ZW5jZXMiLCJ3b3JkcyIsImNoYXJhY3RlcnMiLCJhbGwiLCJDb3VudGFibGUiLCJvbiIsInVuZGVmaW5lZCIsImUiLCJoYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9mZiIsImZpbHRlciIsImluZGV4T2YiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZW5hYmxlZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZpbmUiLCJhbWQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0EsQ0FBRSxXQUFVQSxNQUFWLEVBQWtCOztBQUVsQjs7Ozs7OztBQU9BLE1BQUlDLGVBQWUsRUFBbkI7QUFDQSxRQUFNQyxPQUFPQyxNQUFNQyxTQUFOLENBQWdCQyxPQUE3Qjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFvQixVQUFVSixDQUFWLEVBQWE7QUFDcEMsZUFBT2hDLFNBQVNxQyxPQUFULENBQWlCTCxFQUFFcEIsT0FBbkIsTUFBZ0MsQ0FBQyxDQUF4QztBQUNILE9BRk0sRUFFSmxCLE1BRkksS0FFT00sU0FBU04sTUFGdkI7QUFHRDs7QUFJSDs7Ozs7QUFqSWtCLEdBQWxCLENBc0lBLElBQUksT0FBTzhDLE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDL0JDLFdBQU9ELE9BQVAsR0FBaUJYLFNBQWpCO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBT2EsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBM0MsRUFBZ0Q7QUFDckRELFdBQU8sWUFBWTtBQUFFLGFBQU9iLFNBQVA7QUFBa0IsS0FBdkM7QUFDRCxHQUZNLE1BRUE7QUFDTDdDLFdBQU82QyxTQUFQLEdBQW1CQSxTQUFuQjtBQUNEO0FBQ0YsQ0F6U0MsRUF5U0EsSUF6U0EsQ0FBRCIsImZpbGUiOiJDb3VudGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvdW50YWJsZSBpcyBhIHNjcmlwdCB0byBhbGxvdyBmb3IgbGl2ZSBwYXJhZ3JhcGgtLCB3b3JkLSBhbmQgY2hhcmFjdGVyLVxuICogY291bnRpbmcgb24gYW4gSFRNTCBlbGVtZW50LlxuICpcbiAqIEBhdXRob3IgICBTYWNoYSBTY2htaWQgKDxodHRwczovL2dpdGh1Yi5jb20vUmFkTGlrZVdob2E+KVxuICogQHZlcnNpb24gIDMuMC4wXG4gKiBAbGljZW5zZSAgTUlUXG4gKiBAc2VlICAgICAgPGh0dHA6Ly9yYWRsaWtld2hvYS5naXRodWIuaW8vQ291bnRhYmxlLz5cbiAqL1xuXG4vKipcbiAqIE5vdGU6IEZvciB0aGUgcHVycG9zZSBvZiB0aGlzIGludGVybmFsIGRvY3VtZW50YXRpb24sIGFyZ3VtZW50cyBvZiB0aGUgdHlwZVxuICoge05vZGVzfSBhcmUgdG8gYmUgaW50ZXJwcmV0ZWQgYXMgZWl0aGVyIHtOb2RlTGlzdH0gb3Ige0VsZW1lbnR9LlxuICovXG5cbjsoZnVuY3Rpb24gKGdsb2JhbCkge1xuICBcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIGBsaXZlRWxlbWVudHNgIGhvbGRzIGFsbCBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIGxpdmUtY291bnRpbmdcbiAgICogZnVuY3Rpb25hbGl0eSBib3VuZCB0byB0aGVtLlxuICAgKi9cblxuICBsZXQgbGl2ZUVsZW1lbnRzID0gW11cbiAgY29uc3QgZWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoXG5cbiAgLyoqXG4gICAqIGB1Y3MyZGVjb2RlYCBmdW5jdGlvbiBmcm9tIHRoZSBwdW55Y29kZS5qcyBsaWJyYXJ5LlxuICAgKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGRlY2ltYWwgY29kZSBwb2ludHMgb2YgZWFjaCBVbmljb2RlXG4gICAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSwgdGhpc1xuICAgKiBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgYSBwYWlyIG9mIHN1cnJvZ2F0ZSBoYWx2ZXMgKGVhY2ggb2Ygd2hpY2ggVUNTLTJcbiAgICogZXhwb3NlcyBhcyBzZXBhcmF0ZSBjaGFyYWN0ZXJzKSBpbnRvIGEgc2luZ2xlIGNvZGUgcG9pbnQsIG1hdGNoaW5nXG4gICAqIFVURi0xNi5cbiAgICpcbiAgICogQHNlZSAgICAgPGh0dHA6Ly9nb28uZ2wvOE0wOXI+XG4gICAqIEBzZWUgICAgIDxodHRwOi8vZ29vLmdsL3U0VVVDPlxuICAgKlxuICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgc3RyaW5nICAgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG4gICAqXG4gICAqIEByZXR1cm4gIHtBcnJheX0gICBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuICAgKi9cblxuICBmdW5jdGlvbiBkZWNvZGUgKHN0cmluZykge1xuICAgIGNvbnN0IG91dHB1dCA9IFtdXG4gIFx0bGV0IGNvdW50ZXIgPSAwXG4gIFx0Y29uc3QgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuXG4gIFx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcbiAgXHRcdGNvbnN0IHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKVxuXG4gIFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cbiAgXHRcdFx0Ly8gSXQncyBhIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3Rlci5cblxuICBcdFx0XHRjb25zdCBleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKylcblxuICBcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gTG93IHN1cnJvZ2F0ZS5cbiAgXHRcdFx0XHRvdXRwdXQucHVzaCgoKHZhbHVlICYgMHgzRkYpIDw8IDEwKSArIChleHRyYSAmIDB4M0ZGKSArIDB4MTAwMDApXG4gIFx0XHRcdH0gZWxzZSB7XG5cbiAgXHRcdFx0XHQvLyBJdCdzIGFuIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZVxuICBcdFx0XHRcdC8vIG5leHQgY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyLlxuXG4gIFx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpXG4gIFx0XHRcdFx0Y291bnRlci0tXG4gIFx0XHRcdH1cbiAgXHRcdH0gZWxzZSB7XG4gIFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKVxuICBcdFx0fVxuICBcdH1cblxuICBcdHJldHVybiBvdXRwdXRcbiAgfVxuXG4gIC8qKlxuICAgKiBgdmFsaWRhdGVBcmd1bWVudHNgIHZhbGlkYXRlcyB0aGUgYXJndW1lbnRzIGdpdmVuIHRvIGVhY2ggZnVuY3Rpb24gY2FsbC5cbiAgICogRXJyb3JzIGFyZSBsb2dnZWQgdG8gdGhlIGNvbnNvbGUgYXMgd2FybmluZ3MsIGJ1dCBDb3VudGFibGUgZmFpbHNcbiAgICogc2lsZW50bHkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSAgIHtOb2Rlc30gICAgIGVsZW1lbnRzICBUaGUgKGNvbGxlY3Rpb24gb2YpIGVsZW1lbnQocykgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlLlxuICAgKlxuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBjYWxsYmFjayAgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHZhbGlkYXRlLlxuICAgKlxuICAgKiBAcmV0dXJuICB7Qm9vbGVhbn0gICBSZXR1cm5zIHdoZXRoZXIgYWxsIGFyZ3VtZW50cyBhcmUgdmFpbGQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlQXJndW1lbnRzIChlbGVtZW50cywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBub2RlcyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlbGVtZW50cylcbiAgICBjb25zdCBlbGVtZW50c1ZhbGlkID0gKG5vZGVzID09PSAnW29iamVjdCBOb2RlTGlzdF0nIHx8IG5vZGVzID09PSAnW29iamVjdCBIVE1MQ29sbGVjdGlvbl0nKSB8fCBlbGVtZW50cy5ub2RlVHlwZSA9PT0gMVxuICAgIGNvbnN0IGNhbGxiYWNrVmFsaWQgPSB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbidcblxuICAgIGlmICghZWxlbWVudHNWYWxpZCkgY29uc29sZS5lcnJvcignQ291bnRhYmxlOiBOb3QgYSB2YWxpZCB0YXJnZXQnKVxuICAgIGlmICghY2FsbGJhY2tWYWxpZCkgY29uc29sZS5lcnJvcignQ291bnRhYmxlOiBOb3QgYSB2YWxpZCBjYWxsYmFjayBmdW5jdGlvbicpXG5cbiAgICByZXR1cm4gZWxlbWVudHNWYWxpZCAmJiBjYWxsYmFja1ZhbGlkXG4gIH1cblxuICAvKipcbiAgICogYGNvdW50YCB0cmltcyBhbiBlbGVtZW50J3MgdmFsdWUsIG9wdGlvbmFsbHkgc3RyaXBzIEhUTUwgdGFncyBhbmQgY291bnRzXG4gICAqIHBhcmFncmFwaHMsIHNlbnRlbmNlcywgd29yZHMsIGNoYXJhY3RlcnMgYW5kIGNoYXJhY3RlcnMgcGx1cyBzcGFjZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSAgIHtFbGVtZW50fSAgZWxlbWVudCAgVGhlIGVsZW1lbnQgd2hvc2UgdmFsdWUgaXMgdG8gYmUgY291bnRlZC5cbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gICBvcHRpb25zICBUaGUgb3B0aW9ucyB0byB1c2UgZm9yIHRoZSBjb3VudGluZy5cbiAgICpcbiAgICogQHJldHVybiAge09iamVjdH0gICBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG51bWJlciBvZiBwYXJhZ3JhcGhzLFxuICAgKiAgICAgICAgICAgICAgICAgICAgIHNlbnRlbmNlcywgd29yZHMsIGNoYXJhY3RlcnMgYW5kIGNoYXJhY3RlcnMgcGx1c1xuICAgKiAgICAgICAgICAgICAgICAgICAgIHNwYWNlcy5cbiAgICovXG5cbiAgZnVuY3Rpb24gY291bnQgKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBsZXQgb3JpZ2luYWwgPSAnJyArICgndmFsdWUnIGluIGVsZW1lbnQgPyBlbGVtZW50LnZhbHVlIDogZWxlbWVudC50ZXh0Q29udGVudClcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gICAgLyoqXG4gICAgICogVGhlIGluaXRpYWwgaW1wbGVtZW50YXRpb24gdG8gYWxsb3cgZm9yIEhUTUwgdGFncyBzdHJpcHBpbmcgd2FzIGNyZWF0ZWRcbiAgICAgKiBAY3Jhbml1bXNsb3dzIHdoaWxlIHRoZSBjdXJyZW50IG9uZSB3YXMgY3JlYXRlZCBieSBAUm9iLS1XLlxuICAgICAqXG4gICAgICogQHNlZSA8aHR0cDovL2dvby5nbC9FeG1scj5cbiAgICAgKiBAc2VlIDxodHRwOi8vZ29vLmdsL2dGUVFoPlxuICAgICAqL1xuXG4gICAgaWYgKG9wdGlvbnMuc3RyaXBUYWdzKSBvcmlnaW5hbCA9IG9yaWdpbmFsLnJlcGxhY2UoLzxcXC8/W2Etel1bXj5dKj4vZ2ksICcnKVxuXG4gICAgaWYgKG9wdGlvbnMuaWdub3JlKSB7XG4gICAgICAgIGVhY2guY2FsbChvcHRpb25zLmlnbm9yZSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsID0gb3JpZ2luYWwucmVwbGFjZShpLCAnJylcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB0cmltbWVkID0gb3JpZ2luYWwudHJpbSgpXG5cbiAgICAvKipcbiAgICAgKiBNb3N0IG9mIHRoZSBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMgYXJlIGJhc2VkIG9uIHRoZSB3b3JrcyBvZiBAZXBtYXRzdy5cbiAgICAgKlxuICAgICAqIEBzZWUgPGh0dHA6Ly9nb28uZ2wvU1dPTEI+XG4gICAgICovXG5cbiAgICByZXR1cm4ge1xuICAgICAgcGFyYWdyYXBoczogdHJpbW1lZCA/ICh0cmltbWVkLm1hdGNoKG9wdGlvbnMuaGFyZFJldHVybnMgPyAvXFxuezIsfS9nIDogL1xcbisvZykgfHwgW10pLmxlbmd0aCArIDEgOiAwLFxuICAgICAgc2VudGVuY2VzOiB0cmltbWVkID8gKHRyaW1tZWQubWF0Y2goL1suPyHigKZdKy4vZykgfHwgW10pLmxlbmd0aCArIDEgOiAwLFxuICAgICAgd29yZHM6IHRyaW1tZWQgPyAodHJpbW1lZC5yZXBsYWNlKC9bJ1wiOzosLj/Cv1xcLSHCoV0rL2csICcnKS5tYXRjaCgvXFxTKy9nKSB8fCBbXSkubGVuZ3RoIDogMCxcbiAgICAgIGNoYXJhY3RlcnM6IHRyaW1tZWQgPyBkZWNvZGUodHJpbW1lZC5yZXBsYWNlKC9cXHMvZywgJycpKS5sZW5ndGggOiAwLFxuICAgICAgYWxsOiBkZWNvZGUob3JpZ2luYWwpLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBtYWluIG9iamVjdCB0aGF0IHdpbGwgbGF0ZXIgYmUgZXhwb3NlZCB0byBvdGhlciBzY3JpcHRzLiBJdFxuICAgKiBob2xkcyBhbGwgdGhlIHB1YmxpYyBtZXRob2RzIHRoYXQgY2FuIGJlIHVzZWQgdG8gZW5hYmxlIHRoZSBDb3VudGFibGVcbiAgICogZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogU29tZSBtZXRob2RzIGFjY2VwdCBhbiBvcHRpb25hbCBvcHRpb25zIHBhcmFtZXRlci4gVGhpcyBpbmNsdWRlcyB0aGVcbiAgICogZm9sbG93aW5nIG9wdGlvbnMuXG4gICAqXG4gICAqIHtCb29sZWFufSAgICAgIGhhcmRSZXR1cm5zICBVc2UgdHdvIHJldHVybnMgdG8gc2VwZXJhdGUgYSBwYXJhZ3JhcGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RlYWQgb2Ygb25lLiAoZGVmYXVsdDogZmFsc2UpXG4gICAqIHtCb29sZWFufSAgICAgIHN0cmlwVGFncyAgICBTdHJpcCBIVE1MIHRhZ3MgYmVmb3JlIGNvdW50aW5nIHRoZSB2YWx1ZXMuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGVmYXVsdDogZmFsc2UpXG4gICAqIHtBcnJheTxDaGFyPn0gIGlnbm9yZSAgICAgICBBIGxpc3Qgb2YgY2hhcmFjdGVycyB0aGF0IHNob3VsZCBiZSByZW1vdmVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmVkIHdoZW4gY2FsY3VsYXRpbmcgdGhlIGNvdW50ZXJzLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRlZmF1bHQ6IClcbiAgICovXG5cbiAgY29uc3QgQ291bnRhYmxlID0ge1xuXG4gICAgLyoqXG4gICAgICogVGhlIGBvbmAgbWV0aG9kIGJpbmRzIHRoZSBjb3VudGluZyBoYW5kbGVyIHRvIGFsbCBnaXZlbiBlbGVtZW50cy4gVGhlXG4gICAgICogZXZlbnQgaXMgZWl0aGVyIGBvbmlucHV0YCBvciBgb25rZXlkb3duYCwgYmFzZWQgb24gdGhlIGNhcGFiaWxpdGllcyBvZlxuICAgICAqIHRoZSBicm93c2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtICAge05vZGVzfSAgICAgZWxlbWVudHMgICBBbGwgZWxlbWVudHMgdGhhdCBzaG91bGQgcmVjZWl2ZSB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvdW50YWJsZSBmdW5jdGlvbmFsaXR5LlxuICAgICAqXG4gICAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgY2FsbGJhY2sgICBUaGUgY2FsbGJhY2sgdG8gZmlyZSB3aGVuZXZlciB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQncyB2YWx1ZSBjaGFuZ2VzLiBUaGUgY2FsbGJhY2sgaXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxlZCB3aXRoIHRoZSByZWxldmFudCBlbGVtZW50IGJvdW5kXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBgdGhpc2AgYW5kIHRoZSBjb3VudGVkIHZhbHVlcyBhcyB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICBbb3B0aW9uc10gIEFuIG9iamVjdCB0byBtb2RpZnkgQ291bnRhYmxlJ3NcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW91ci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtPYmplY3R9ICAgIFJldHVybnMgdGhlIENvdW50YWJsZSBvYmplY3QgdG8gYWxsb3cgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuXG4gICAgb246IGZ1bmN0aW9uIChlbGVtZW50cywgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgIGlmICghdmFsaWRhdGVBcmd1bWVudHMoZWxlbWVudHMsIGNhbGxiYWNrKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVsZW1lbnRzID0gWyBlbGVtZW50cyBdXG4gICAgICB9XG5cbiAgICAgIGVhY2guY2FsbChlbGVtZW50cywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlLCBjb3VudChlLCBvcHRpb25zKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXZlRWxlbWVudHMucHVzaCh7IGVsZW1lbnQ6IGUsIGhhbmRsZXI6IGhhbmRsZXIgfSlcblxuICAgICAgICAgIGhhbmRsZXIoKVxuXG4gICAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZXIpXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYG9mZmAgbWV0aG9kIHJlbW92ZXMgdGhlIENvdW50YWJsZSBmdW5jdGlvbmFsaXR5IGZyb20gYWxsIGdpdmVuXG4gICAgICogZWxlbWVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7Tm9kZXN9ICAgZWxlbWVudHMgIEFsbCBlbGVtZW50cyB3aG9zZSBDb3VudGFibGUgZnVuY3Rpb25hbGl0eVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkIGJlIHVuYm91bmQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgUmV0dXJucyB0aGUgQ291bnRhYmxlIG9iamVjdCB0byBhbGxvdyBmb3IgY2hhaW5pbmcuXG4gICAgICovXG5cbiAgICBvZmY6IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgaWYgKCF2YWxpZGF0ZUFyZ3VtZW50cyhlbGVtZW50cywgZnVuY3Rpb24gKCkge30pKSByZXR1cm5cblxuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZWxlbWVudHMgPSBbIGVsZW1lbnRzIF1cbiAgICAgIH1cblxuICAgICAgbGl2ZUVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50cy5pbmRleE9mKGUuZWxlbWVudCkgIT09IC0xXG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZS5oYW5kbGVyKVxuICAgICAgfSlcblxuICAgICAgbGl2ZUVsZW1lbnRzID0gbGl2ZUVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50cy5pbmRleE9mKGUuZWxlbWVudCkgPT09IC0xXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYGNvdW50YCBtZXRob2Qgd29ya3MgbW9zdGx5IGxpa2UgdGhlIGBsaXZlYCBtZXRob2QsIGJ1dCBubyBldmVudHMgYXJlXG4gICAgICogYm91bmQsIHRoZSBmdW5jdGlvbmFsaXR5IGlzIG9ubHkgZXhlY3V0ZWQgb25jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtOb2Rlc30gICAgIGVsZW1lbnRzICAgQWxsIGVsZW1lbnRzIHRoYXQgc2hvdWxkIGJlIGNvdW50ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBjYWxsYmFjayAgIFRoZSBjYWxsYmFjayB0byBmaXJlIHdoZW5ldmVyIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCdzIHZhbHVlIGNoYW5nZXMuIFRoZSBjYWxsYmFjayBpc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVkIHdpdGggdGhlIHJlbGV2YW50IGVsZW1lbnQgYm91bmRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGB0aGlzYCBhbmQgdGhlIGNvdW50ZWQgdmFsdWVzIGFzIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlIHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIFtvcHRpb25zXSAgQW4gb2JqZWN0IHRvIG1vZGlmeSBDb3VudGFibGUnc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3VyLlxuICAgICAqXG4gICAgICogQHJldHVybiAge09iamVjdH0gICAgUmV0dXJucyB0aGUgQ291bnRhYmxlIG9iamVjdCB0byBhbGxvdyBmb3IgY2hhaW5pbmcuXG4gICAgICovXG5cbiAgICBjb3VudDogZnVuY3Rpb24gKGVsZW1lbnRzLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgaWYgKCF2YWxpZGF0ZUFyZ3VtZW50cyhlbGVtZW50cywgY2FsbGJhY2spKSByZXR1cm5cblxuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZWxlbWVudHMgPSBbIGVsZW1lbnRzIF1cbiAgICAgIH1cblxuICAgICAgZWFjaC5jYWxsKGVsZW1lbnRzLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZSwgY291bnQoZSwgb3B0aW9ucykpXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYGVuYWJsZWRgIG1ldGhvZCBjaGVja3MgaWYgdGhlIGxpdmUtY291bnRpbmcgZnVuY3Rpb25hbGl0eSBpcyBib3VuZFxuICAgICAqIHRvIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7RWxlbWVudH0gIGVsZW1lbnQgIEFsbCBlbGVtZW50cyB0aGF0IHNob3VsZCBiZSBjaGVja2VkIGZvciB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvdW50YWJsZSBmdW5jdGlvbmFsaXR5LlxuICAgICAqXG4gICAgICogQHJldHVybiAge0Jvb2xlYW59ICBBIGJvb2xlYW4gdmFsdWUgcmVwcmVzZW50aW5nIHdoZXRoZXIgQ291bnRhYmxlXG4gICAgICogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbmFsaXR5IGlzIGJvdW5kIHRvIGFsbCBnaXZlbiBlbGVtZW50cy5cbiAgICAgKi9cblxuICAgIGVuYWJsZWQ6IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRzID0gWyBlbGVtZW50cyBdXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXZlRWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRzLmluZGV4T2YoZS5lbGVtZW50KSAhPT0gLTFcbiAgICAgIH0pLmxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoXG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIENvdW50YWJsZSBkZXBlbmRpbmcgb24gdGhlIG1vZHVsZSBzeXN0ZW0gdXNlZCBhY3Jvc3MgdGhlXG4gICAqIGFwcGxpY2F0aW9uLiAoTm9kZSAvIENvbW1vbkpTLCBBTUQsIGdsb2JhbClcbiAgICovXG5cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gQ291bnRhYmxlXG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIENvdW50YWJsZSB9KVxuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5Db3VudGFibGUgPSBDb3VudGFibGVcbiAgfVxufSh0aGlzKSk7XG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\countable\\Countable.js","/..\\..\\..\\node_modules\\countable")
},{"9FoBSB":17,"buffer":4}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest(element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' && element.matches(selector)) {
            return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGRlbGVnYXRlXFxzcmNcXGNsb3Nlc3QuanMiXSwibmFtZXMiOlsiRE9DVU1FTlRfTk9ERV9UWVBFIiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJwcm90byIsIm1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsImNsb3Nlc3QiLCJlbGVtZW50Iiwic2VsZWN0b3IiLCJub2RlVHlwZSIsInBhcmVudE5vZGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxxQkFBcUIsQ0FBekI7O0FBRUE7OztBQUdBLElBQUksT0FBT0MsT0FBUCxLQUFtQixXQUFuQixJQUFrQyxDQUFDQSxRQUFRQyxTQUFSLENBQWtCQyxPQUF6RCxFQUFrRTtBQUM5RCxRQUFJQyxRQUFRSCxRQUFRQyxTQUFwQjs7QUFFQUUsVUFBTUQsT0FBTixHQUFnQkMsTUFBTUMsZUFBTixJQUNBRCxNQUFNRSxrQkFETixJQUVBRixNQUFNRyxpQkFGTixJQUdBSCxNQUFNSSxnQkFITixJQUlBSixNQUFNSyxxQkFKdEI7QUFLSDs7QUFFRDs7Ozs7OztBQU9BLFNBQVNDLE9BQVQsQ0FBa0JDLE9BQWxCLEVBQTJCQyxRQUEzQixFQUFxQztBQUNqQyxXQUFPRCxXQUFXQSxRQUFRRSxRQUFSLEtBQXFCYixrQkFBdkMsRUFBMkQ7QUFDdkQsWUFBSSxPQUFPVyxRQUFRUixPQUFmLEtBQTJCLFVBQTNCLElBQ0FRLFFBQVFSLE9BQVIsQ0FBZ0JTLFFBQWhCLENBREosRUFDK0I7QUFDN0IsbUJBQU9ELE9BQVA7QUFDRDtBQUNEQSxrQkFBVUEsUUFBUUcsVUFBbEI7QUFDSDtBQUNKOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCTixPQUFqQiIsImZpbGUiOiJjbG9zZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIERPQ1VNRU5UX05PREVfVFlQRSA9IDk7XG5cbi8qKlxuICogQSBwb2x5ZmlsbCBmb3IgRWxlbWVudC5tYXRjaGVzKClcbiAqL1xuaWYgKHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIHZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG4gICAgcHJvdG8ubWF0Y2hlcyA9IHByb3RvLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgcGFyZW50IHRoYXQgbWF0Y2hlcyBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY2xvc2VzdCAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSBET0NVTUVOVF9OT0RFX1RZUEUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50Lm1hdGNoZXMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgIGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIl19
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\delegate\\src\\closest.js","/..\\..\\..\\node_modules\\delegate\\src")
},{"9FoBSB":17,"buffer":4}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var closest = require('./closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function () {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    };
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function (e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    };
}

module.exports = delegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGRlbGVnYXRlXFxzcmNcXGRlbGVnYXRlLmpzIl0sIm5hbWVzIjpbImNsb3Nlc3QiLCJyZXF1aXJlIiwiX2RlbGVnYXRlIiwiZWxlbWVudCIsInNlbGVjdG9yIiwidHlwZSIsImNhbGxiYWNrIiwidXNlQ2FwdHVyZSIsImxpc3RlbmVyRm4iLCJsaXN0ZW5lciIsImFwcGx5IiwiYXJndW1lbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlc3Ryb3kiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGVsZWdhdGUiLCJlbGVtZW50cyIsImJpbmQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJBcnJheSIsInByb3RvdHlwZSIsIm1hcCIsImNhbGwiLCJlIiwiZGVsZWdhdGVUYXJnZXQiLCJ0YXJnZXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxVQUFVQyxRQUFRLFdBQVIsQ0FBZDs7QUFFQTs7Ozs7Ozs7OztBQVVBLFNBQVNDLFNBQVQsQ0FBbUJDLE9BQW5CLEVBQTRCQyxRQUE1QixFQUFzQ0MsSUFBdEMsRUFBNENDLFFBQTVDLEVBQXNEQyxVQUF0RCxFQUFrRTtBQUM5RCxRQUFJQyxhQUFhQyxTQUFTQyxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckIsQ0FBakI7O0FBRUFSLFlBQVFTLGdCQUFSLENBQXlCUCxJQUF6QixFQUErQkcsVUFBL0IsRUFBMkNELFVBQTNDOztBQUVBLFdBQU87QUFDSE0saUJBQVMsWUFBVztBQUNoQlYsb0JBQVFXLG1CQUFSLENBQTRCVCxJQUE1QixFQUFrQ0csVUFBbEMsRUFBOENELFVBQTlDO0FBQ0g7QUFIRSxLQUFQO0FBS0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTUSxRQUFULENBQWtCQyxRQUFsQixFQUE0QlosUUFBNUIsRUFBc0NDLElBQXRDLEVBQTRDQyxRQUE1QyxFQUFzREMsVUFBdEQsRUFBa0U7QUFDOUQ7QUFDQSxRQUFJLE9BQU9TLFNBQVNKLGdCQUFoQixLQUFxQyxVQUF6QyxFQUFxRDtBQUNqRCxlQUFPVixVQUFVUSxLQUFWLENBQWdCLElBQWhCLEVBQXNCQyxTQUF0QixDQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLE9BQU9OLElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDNUI7QUFDQTtBQUNBLGVBQU9ILFVBQVVlLElBQVYsQ0FBZSxJQUFmLEVBQXFCQyxRQUFyQixFQUErQlIsS0FBL0IsQ0FBcUMsSUFBckMsRUFBMkNDLFNBQTNDLENBQVA7QUFDSDs7QUFFRDtBQUNBLFFBQUksT0FBT0ssUUFBUCxLQUFvQixRQUF4QixFQUFrQztBQUM5QkEsbUJBQVdFLFNBQVNDLGdCQUFULENBQTBCSCxRQUExQixDQUFYO0FBQ0g7O0FBRUQ7QUFDQSxXQUFPSSxNQUFNQyxTQUFOLENBQWdCQyxHQUFoQixDQUFvQkMsSUFBcEIsQ0FBeUJQLFFBQXpCLEVBQW1DLFVBQVViLE9BQVYsRUFBbUI7QUFDekQsZUFBT0QsVUFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkJDLElBQTdCLEVBQW1DQyxRQUFuQyxFQUE2Q0MsVUFBN0MsQ0FBUDtBQUNILEtBRk0sQ0FBUDtBQUdIOztBQUVEOzs7Ozs7Ozs7QUFTQSxTQUFTRSxRQUFULENBQWtCTixPQUFsQixFQUEyQkMsUUFBM0IsRUFBcUNDLElBQXJDLEVBQTJDQyxRQUEzQyxFQUFxRDtBQUNqRCxXQUFPLFVBQVNrQixDQUFULEVBQVk7QUFDZkEsVUFBRUMsY0FBRixHQUFtQnpCLFFBQVF3QixFQUFFRSxNQUFWLEVBQWtCdEIsUUFBbEIsQ0FBbkI7O0FBRUEsWUFBSW9CLEVBQUVDLGNBQU4sRUFBc0I7QUFDbEJuQixxQkFBU2lCLElBQVQsQ0FBY3BCLE9BQWQsRUFBdUJxQixDQUF2QjtBQUNIO0FBQ0osS0FORDtBQU9IOztBQUVERyxPQUFPQyxPQUFQLEdBQWlCYixRQUFqQiIsImZpbGUiOiJkZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIF9kZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8U3RyaW5nfEFycmF5fSBbZWxlbWVudHNdXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnRzLCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICAvLyBIYW5kbGUgdGhlIHJlZ3VsYXIgRWxlbWVudCB1c2FnZVxuICAgIGlmICh0eXBlb2YgZWxlbWVudHMuYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gX2RlbGVnYXRlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIEVsZW1lbnQtbGVzcyB1c2FnZSwgaXQgZGVmYXVsdHMgdG8gZ2xvYmFsIGRlbGVnYXRpb25cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gVXNlIGBkb2N1bWVudGAgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciwgdGhlbiBhcHBseSBhcmd1bWVudHNcbiAgICAgICAgLy8gVGhpcyBpcyBhIHNob3J0IHdheSB0byAudW5zaGlmdCBgYXJndW1lbnRzYCB3aXRob3V0IHJ1bm5pbmcgaW50byBkZW9wdGltaXphdGlvbnNcbiAgICAgICAgcmV0dXJuIF9kZWxlZ2F0ZS5iaW5kKG51bGwsIGRvY3VtZW50KS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBTZWxlY3Rvci1iYXNlZCB1c2FnZVxuICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIEFycmF5LWxpa2UgYmFzZWQgdXNhZ2VcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gX2RlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\delegate\\src\\delegate.js","/..\\..\\..\\node_modules\\delegate\\src")
},{"./closest":8,"9FoBSB":17,"buffer":4}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

'use strict';

/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var scopeOptionWarned = false;
var _VERSION_STRING = require('../package.json').version;
var _DEFAULT_DELIMITER = '%';
var _DEFAULT_LOCALS_NAME = 'locals';
var _NAME = 'ejs';
var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
var _OPTS = ['delimiter', 'scope', 'context', 'debug', 'compileDebug', 'client', '_with', 'rmWhitespace', 'strict', 'filename'];
// We don't allow 'cache' option to be passed in the data obj
// for the normal `render` call, but this is where Express puts it
// so we make an exception for `renderFile`
var _OPTS_EXPRESS = _OPTS.concat('cache');
var _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Custom file loader. Useful for template preprocessing or restricting access
 * to a certain part of the filesystem.
 *
 * @type {fileLoader}
 */

exports.fileLoader = fs.readFileSync;

/**
 * Name of the object containing the locals.
 *
 * This variable is overridden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name     specified path
 * @param {String}  filename parent file path
 * @param {Boolean} isDir    parent file path whether is directory
 * @return {String}
 */
exports.resolveInclude = function (name, filename, isDir) {
  var dirname = path.dirname;
  var extname = path.extname;
  var resolve = path.resolve;
  var includePath = resolve(isDir ? filename : dirname(filename), name);
  var ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getIncludePath(path, options) {
  var includePath;
  var filePath;
  var views = options.views;

  // Abs path
  if (path.charAt(0) == '/') {
    includePath = exports.resolveInclude(path.replace(/^\/*/, ''), options.root || '/', true);
  }
  // Relative paths
  else {
      // Look relative to a passed filename first
      if (options.filename) {
        filePath = exports.resolveInclude(path, options.filename);
        if (fs.existsSync(filePath)) {
          includePath = filePath;
        }
      }
      // Then look in any views directories
      if (!includePath) {
        if (Array.isArray(views) && views.some(function (v) {
          filePath = exports.resolveInclude(path, v, true);
          return fs.existsSync(filePath);
        })) {
          includePath = filePath;
        }
      }
      if (!includePath) {
        throw new Error('Could not find include include file.');
      }
    }
  return includePath;
}

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var func;
  var filename = options.filename;
  var hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!filename) {
      throw new Error('cache option requires a filename');
    }
    func = exports.cache.get(filename);
    if (func) {
      return func;
    }
    if (!hasTemplate) {
      template = fileLoader(filename).toString().replace(_BOM, '');
    }
  } else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!filename) {
      throw new Error('Internal EJS error: no file name or template ' + 'provided');
    }
    template = fileLoader(filename).toString().replace(_BOM, '');
  }
  func = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(filename, func);
  }
  return func;
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @memberof module:ejs-internal
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache(options, data, cb) {
  var result;
  try {
    result = handleCache(options)(data);
  } catch (err) {
    return cb(err);
  }
  return cb(null, result);
}

/**
 * fileLoader is independent
 *
 * @param {String} filePath ejs file path.
 * @return {String} The contents of the specified file.
 * @static
 */

function fileLoader(filePath) {
  return exports.fileLoader(filePath);
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  opts.filename = getIncludePath(path, opts);
  return handleCache(opts);
}

/**
 * Get the JavaScript source of an included file.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {Object}
 * @static
 */

function includeSource(path, options) {
  var opts = utils.shallowCopy({}, options);
  var includePath;
  var template;
  includePath = getIncludePath(path, opts);
  template = fileLoader(includePath).toString().replace(_BOM, '');
  opts.filename = includePath;
  var templ = new Template(template, opts);
  templ.generateSource();
  return {
    source: templ.source,
    filename: includePath,
    template: template
  };
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements RethrowCallback
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} filename file name of the EJS file
 * @param {String} lineno   line number of the error
 * @static
 */

function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm); // eslint-disable-line
  // Error context
  var context = lines.slice(start, end).map(function (line, i) {
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ') + curr + '| ' + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':' + lineno + '\n' + context + '\n\n' + err.message;

  throw err;
}

function stripSemi(str) {
  return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} opts     compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned) {
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {String}
 * @public
 */

exports.render = function (template, d, o) {
  var data = d || {};
  var opts = o || {};

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    utils.shallowCopyFromList(opts, data, _OPTS);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var filename = arguments[0];
  var cb = arguments[arguments.length - 1];
  var opts = { filename: filename };
  var data;

  if (arguments.length > 2) {
    data = arguments[1];

    // No options object -- if there are optiony names
    // in the data, copy them to options
    if (arguments.length === 3) {
      // Express 4
      if (data.settings) {
        if (data.settings['view options']) {
          utils.shallowCopyFromList(opts, data.settings['view options'], _OPTS_EXPRESS);
        }
        if (data.settings.views) {
          opts.views = data.settings.views;
        }
      }
      // Express 3 and lower
      else {
          utils.shallowCopyFromList(opts, data, _OPTS_EXPRESS);
        }
    } else {
      // Use shallowCopy so we don't pollute passed in opts obj with new vals
      utils.shallowCopy(opts, arguments[2]);
    }

    opts.filename = filename;
  } else {
    data = {};
  }

  return tryHandleCache(opts, data, cb);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  this.dependencies = [];
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.root = opts.root;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
  options.views = opts.views;

  if (options.strict) {
    options._with = false;
  } else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING;
    var delim = utils.escapeRegExpChars(this.opts.delimiter);
    str = str.replace(/%/g, delim);
    return new RegExp(str);
  },

  compile: function () {
    var src;
    var fn;
    var opts = this.opts;
    var prepended = '';
    var appended = '';
    var escapeFn = opts.escapeFunction;

    if (!this.source) {
      this.generateSource();
      prepended += '  var __output = [], __append = __output.push.bind(__output);' + '\n';
      if (opts._with !== false) {
        prepended += '  with (' + opts.localsName + ' || {}) {' + '\n';
        appended += '  }' + '\n';
      }
      appended += '  return __output.join("");' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n' + '  , __lines = ' + JSON.stringify(this.templateText) + '\n' + '  , __filename = ' + (opts.filename ? JSON.stringify(opts.filename) : 'undefined') + ';' + '\n' + 'try {' + '\n' + this.source + '} catch (e) {' + '\n' + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n' + '}' + '\n';
    } else {
      src = this.source;
    }

    if (opts.client) {
      src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }
    if (opts.debug) {
      console.log(src);
    }

    try {
      fn = new Function(opts.localsName + ', escapeFn, include, rethrow', src);
    } catch (e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs\n\n';
        e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
        e.message += 'https://github.com/RyanZim/EJS-Lint';
      }
      throw e;
    }

    if (opts.client) {
      fn.dependencies = this.dependencies;
      return fn;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = function (data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    };
    returnedFn.dependencies = this.dependencies;
    return returnedFn;
  },

  generateSource: function () {
    var opts = this.opts;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r`.
      this.templateText = this.templateText.replace(/\r/g, '').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText = this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    var self = this;
    var matches = this.parseTemplateText();
    var d = this.opts.delimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var opening;
        var closing;
        var include;
        var includeOpts;
        var includeObj;
        var includeSrc;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with '<' + delimiter as key
        // Then this can simply check against the map
        if (line.indexOf('<' + d) === 0 // If it is a tag
        && line.indexOf('<' + d + d) !== 0) {
          // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + '>' || closing == '-' + d + '>' || closing == '_' + d + '>')) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        // HACK: backward-compat `include` preprocessor directives
        if (include = line.match(/^\s*include\s+(\S+)/)) {
          opening = matches[index - 1];
          // Must be in EVAL or RAW mode
          if (opening && (opening == '<' + d || opening == '<' + d + '-' || opening == '<' + d + '_')) {
            includeOpts = utils.shallowCopy({}, self.opts);
            includeObj = includeSource(include[1], includeOpts);
            if (self.opts.compileDebug) {
              includeSrc = '    ; (function(){' + '\n' + '      var __line = 1' + '\n' + '      , __lines = ' + JSON.stringify(includeObj.template) + '\n' + '      , __filename = ' + JSON.stringify(includeObj.filename) + ';' + '\n' + '      try {' + '\n' + includeObj.source + '      } catch (e) {' + '\n' + '        rethrow(e, __lines, __filename, __line, escapeFn);' + '\n' + '      }' + '\n' + '    ; }).call(this)' + '\n';
            } else {
              includeSrc = '    ; (function(){' + '\n' + includeObj.source + '    ; }).call(this)' + '\n';
            }
            self.source += includeSrc;
            self.dependencies.push(exports.resolveInclude(include[1], includeOpts.filename));
            return;
          }
        }
        self.scanLine(line);
      });
    }
  },

  parseTemplateText: function () {
    var str = this.templateText;
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  },

  _addOutput: function (line) {
    if (this.truncate) {
      // Only replace single leading linebreak in the line after
      // -%> tag -- this is the single, trailing linebreak
      // after the tag that the truncation mode replaces
      // Handle Win / Unix / old Mac linebreaks -- do the \r\n
      // combo first in the regex-or
      line = line.replace(/^(?:\r\n|\r|\n)/, '');
      this.truncate = false;
    } else if (this.opts.rmWhitespace) {
      // rmWhitespace has already removed trailing spaces, just need
      // to remove linebreaks
      line = line.replace(/^\n/, '');
    }
    if (!line) {
      return line;
    }

    // Preserve literal slashes
    line = line.replace(/\\/g, '\\\\');

    // Convert linebreaks
    line = line.replace(/\n/g, '\\n');
    line = line.replace(/\r/g, '\\r');

    // Escape double-quotes
    // - this will be the delimiter during execution
    line = line.replace(/"/g, '\\"');
    this.source += '    ; __append("' + line + '")' + '\n';
  },

  scanLine: function (line) {
    var self = this;
    var d = this.opts.delimiter;
    var newLineCount = 0;

    newLineCount = line.split('\n').length - 1;

    switch (line) {
      case '<' + d:
      case '<' + d + '_':
        this.mode = Template.modes.EVAL;
        break;
      case '<' + d + '=':
        this.mode = Template.modes.ESCAPED;
        break;
      case '<' + d + '-':
        this.mode = Template.modes.RAW;
        break;
      case '<' + d + '#':
        this.mode = Template.modes.COMMENT;
        break;
      case '<' + d + d:
        this.mode = Template.modes.LITERAL;
        this.source += '    ; __append("' + line.replace('<' + d + d, '<' + d) + '")' + '\n';
        break;
      case d + d + '>':
        this.mode = Template.modes.LITERAL;
        this.source += '    ; __append("' + line.replace(d + d + '>', d + '>') + '")' + '\n';
        break;
      case d + '>':
      case '-' + d + '>':
      case '_' + d + '>':
        if (this.mode == Template.modes.LITERAL) {
          this._addOutput(line);
        }

        this.mode = null;
        this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
        break;
      default:
        // In script mode, depends on type of tag
        if (this.mode) {
          // If '//' is found without a line break, add a line break.
          switch (this.mode) {
            case Template.modes.EVAL:
            case Template.modes.ESCAPED:
            case Template.modes.RAW:
              if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
                line += '\n';
              }
          }
          switch (this.mode) {
            // Just executing code
            case Template.modes.EVAL:
              this.source += '    ; ' + line + '\n';
              break;
            // Exec, esc, and output
            case Template.modes.ESCAPED:
              this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
              break;
            // Exec and output
            case Template.modes.RAW:
              this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
              break;
            case Template.modes.COMMENT:
              // Do nothing
              break;
            // Literal <%% mode, append as raw output
            case Template.modes.LITERAL:
              this._addOutput(line);
              break;
          }
        }
        // In string mode, just add the output
        else {
            this._addOutput(line);
          }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Escape characters reserved in XML.
 *
 * This is simply an export of {@link module:utils.escapeXML}.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @public
 * @func
 * */
exports.escapeXML = utils.escapeXML;

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

// Add require support
/* istanbul ignore else */
if (require.extensions) {
  require.extensions['.ejs'] = function (module, flnm) {
    var filename = flnm || /* istanbul ignore next */module.filename;
    var options = {
      filename: filename,
      client: true
    };
    var template = fileLoader(filename).toString();
    var fn = exports.compile(template, options);
    module._compile('module.exports = ' + fn.toString() + ';', filename);
  };
}

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/**
 * Name for detection of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.name = _NAME;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGVqc1xcbGliXFxlanMuanMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwicGF0aCIsInV0aWxzIiwic2NvcGVPcHRpb25XYXJuZWQiLCJfVkVSU0lPTl9TVFJJTkciLCJ2ZXJzaW9uIiwiX0RFRkFVTFRfREVMSU1JVEVSIiwiX0RFRkFVTFRfTE9DQUxTX05BTUUiLCJfTkFNRSIsIl9SRUdFWF9TVFJJTkciLCJfT1BUUyIsIl9PUFRTX0VYUFJFU1MiLCJjb25jYXQiLCJfQk9NIiwiZXhwb3J0cyIsImNhY2hlIiwiZmlsZUxvYWRlciIsInJlYWRGaWxlU3luYyIsImxvY2Fsc05hbWUiLCJyZXNvbHZlSW5jbHVkZSIsIm5hbWUiLCJmaWxlbmFtZSIsImlzRGlyIiwiZGlybmFtZSIsImV4dG5hbWUiLCJyZXNvbHZlIiwiaW5jbHVkZVBhdGgiLCJleHQiLCJnZXRJbmNsdWRlUGF0aCIsIm9wdGlvbnMiLCJmaWxlUGF0aCIsInZpZXdzIiwiY2hhckF0IiwicmVwbGFjZSIsInJvb3QiLCJleGlzdHNTeW5jIiwiQXJyYXkiLCJpc0FycmF5Iiwic29tZSIsInYiLCJFcnJvciIsImhhbmRsZUNhY2hlIiwidGVtcGxhdGUiLCJmdW5jIiwiaGFzVGVtcGxhdGUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJnZXQiLCJ0b1N0cmluZyIsImNvbXBpbGUiLCJzZXQiLCJ0cnlIYW5kbGVDYWNoZSIsImRhdGEiLCJjYiIsInJlc3VsdCIsImVyciIsImluY2x1ZGVGaWxlIiwib3B0cyIsInNoYWxsb3dDb3B5IiwiaW5jbHVkZVNvdXJjZSIsInRlbXBsIiwiVGVtcGxhdGUiLCJnZW5lcmF0ZVNvdXJjZSIsInNvdXJjZSIsInJldGhyb3ciLCJzdHIiLCJmbG5tIiwibGluZW5vIiwiZXNjIiwibGluZXMiLCJzcGxpdCIsInN0YXJ0IiwiTWF0aCIsIm1heCIsImVuZCIsIm1pbiIsImNvbnRleHQiLCJzbGljZSIsIm1hcCIsImxpbmUiLCJpIiwiY3VyciIsImpvaW4iLCJtZXNzYWdlIiwic3RyaXBTZW1pIiwic2NvcGUiLCJjb25zb2xlIiwid2FybiIsInJlbmRlciIsImQiLCJvIiwic2hhbGxvd0NvcHlGcm9tTGlzdCIsInJlbmRlckZpbGUiLCJzZXR0aW5ncyIsImNsZWFyQ2FjaGUiLCJyZXNldCIsInRleHQiLCJ0ZW1wbGF0ZVRleHQiLCJtb2RlIiwidHJ1bmNhdGUiLCJjdXJyZW50TGluZSIsImRlcGVuZGVuY2llcyIsImNsaWVudCIsImVzY2FwZUZ1bmN0aW9uIiwiZXNjYXBlIiwiZXNjYXBlWE1MIiwiY29tcGlsZURlYnVnIiwiZGVidWciLCJkZWxpbWl0ZXIiLCJzdHJpY3QiLCJybVdoaXRlc3BhY2UiLCJfd2l0aCIsInJlZ2V4IiwiY3JlYXRlUmVnZXgiLCJtb2RlcyIsIkVWQUwiLCJFU0NBUEVEIiwiUkFXIiwiQ09NTUVOVCIsIkxJVEVSQUwiLCJwcm90b3R5cGUiLCJkZWxpbSIsImVzY2FwZVJlZ0V4cENoYXJzIiwiUmVnRXhwIiwic3JjIiwiZm4iLCJwcmVwZW5kZWQiLCJhcHBlbmRlZCIsImVzY2FwZUZuIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvZyIsIkZ1bmN0aW9uIiwiZSIsIlN5bnRheEVycm9yIiwicmV0dXJuZWRGbiIsImluY2x1ZGUiLCJpbmNsdWRlRGF0YSIsImFwcGx5Iiwic2VsZiIsIm1hdGNoZXMiLCJwYXJzZVRlbXBsYXRlVGV4dCIsImZvckVhY2giLCJpbmRleCIsIm9wZW5pbmciLCJjbG9zaW5nIiwiaW5jbHVkZU9wdHMiLCJpbmNsdWRlT2JqIiwiaW5jbHVkZVNyYyIsImluZGV4T2YiLCJtYXRjaCIsInB1c2giLCJzY2FuTGluZSIsInBhdCIsImV4ZWMiLCJhcnIiLCJmaXJzdFBvcyIsInN1YnN0cmluZyIsIl9hZGRPdXRwdXQiLCJuZXdMaW5lQ291bnQiLCJsYXN0SW5kZXhPZiIsIl9fZXhwcmVzcyIsImV4dGVuc2lvbnMiLCJtb2R1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QUFmOztBQUVBO0FBQ0EsSUFBSSxPQUFPOEosTUFBUCxJQUFpQixXQUFyQixFQUFrQztBQUNoQ0EsU0FBT0MsR0FBUCxHQUFhekosT0FBYjtBQUNEIiwiZmlsZSI6ImVqcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBFSlMgRW1iZWRkZWQgSmF2YVNjcmlwdCB0ZW1wbGF0ZXNcbiAqIENvcHlyaWdodCAyMTEyIE1hdHRoZXcgRWVybmlzc2UgKG1kZUBmbGVlZ2l4Lm9yZylcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAZmlsZSBFbWJlZGRlZCBKYXZhU2NyaXB0IHRlbXBsYXRpbmcgZW5naW5lLiB7QGxpbmsgaHR0cDovL2Vqcy5jb31cbiAqIEBhdXRob3IgTWF0dGhldyBFZXJuaXNzZSA8bWRlQGZsZWVnaXgub3JnPlxuICogQGF1dGhvciBUaWFuY2hlbmcgXCJUaW1vdGh5XCIgR3UgPHRpbW90aHlndTk5QGdtYWlsLmNvbT5cbiAqIEBwcm9qZWN0IEVKU1xuICogQGxpY2Vuc2Uge0BsaW5rIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMCBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjB9XG4gKi9cblxuLyoqXG4gKiBFSlMgaW50ZXJuYWwgZnVuY3Rpb25zLlxuICpcbiAqIFRlY2huaWNhbGx5IHRoaXMgXCJtb2R1bGVcIiBsaWVzIGluIHRoZSBzYW1lIGZpbGUgYXMge0BsaW5rIG1vZHVsZTplanN9LCBmb3JcbiAqIHRoZSBzYWtlIG9mIG9yZ2FuaXphdGlvbiBhbGwgdGhlIHByaXZhdGUgZnVuY3Rpb25zIHJlIGdyb3VwZWQgaW50byB0aGlzXG4gKiBtb2R1bGUuXG4gKlxuICogQG1vZHVsZSBlanMtaW50ZXJuYWxcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBFbWJlZGRlZCBKYXZhU2NyaXB0IHRlbXBsYXRpbmcgZW5naW5lLlxuICpcbiAqIEBtb2R1bGUgZWpzXG4gKiBAcHVibGljXG4gKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgc2NvcGVPcHRpb25XYXJuZWQgPSBmYWxzZTtcbnZhciBfVkVSU0lPTl9TVFJJTkcgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xudmFyIF9ERUZBVUxUX0RFTElNSVRFUiA9ICclJztcbnZhciBfREVGQVVMVF9MT0NBTFNfTkFNRSA9ICdsb2NhbHMnO1xudmFyIF9OQU1FID0gJ2Vqcyc7XG52YXIgX1JFR0VYX1NUUklORyA9ICcoPCUlfCUlPnw8JT18PCUtfDwlX3w8JSN8PCV8JT58LSU+fF8lPiknO1xudmFyIF9PUFRTID0gWydkZWxpbWl0ZXInLCAnc2NvcGUnLCAnY29udGV4dCcsICdkZWJ1ZycsICdjb21waWxlRGVidWcnLFxuICAnY2xpZW50JywgJ193aXRoJywgJ3JtV2hpdGVzcGFjZScsICdzdHJpY3QnLCAnZmlsZW5hbWUnXTtcbi8vIFdlIGRvbid0IGFsbG93ICdjYWNoZScgb3B0aW9uIHRvIGJlIHBhc3NlZCBpbiB0aGUgZGF0YSBvYmpcbi8vIGZvciB0aGUgbm9ybWFsIGByZW5kZXJgIGNhbGwsIGJ1dCB0aGlzIGlzIHdoZXJlIEV4cHJlc3MgcHV0cyBpdFxuLy8gc28gd2UgbWFrZSBhbiBleGNlcHRpb24gZm9yIGByZW5kZXJGaWxlYFxudmFyIF9PUFRTX0VYUFJFU1MgPSBfT1BUUy5jb25jYXQoJ2NhY2hlJyk7XG52YXIgX0JPTSA9IC9eXFx1RkVGRi87XG5cbi8qKlxuICogRUpTIHRlbXBsYXRlIGZ1bmN0aW9uIGNhY2hlLiBUaGlzIGNhbiBiZSBhIExSVSBvYmplY3QgZnJvbSBscnUtY2FjaGUgTlBNXG4gKiBtb2R1bGUuIEJ5IGRlZmF1bHQsIGl0IGlzIHtAbGluayBtb2R1bGU6dXRpbHMuY2FjaGV9LCBhIHNpbXBsZSBpbi1wcm9jZXNzXG4gKiBjYWNoZSB0aGF0IGdyb3dzIGNvbnRpbnVvdXNseS5cbiAqXG4gKiBAdHlwZSB7Q2FjaGV9XG4gKi9cblxuZXhwb3J0cy5jYWNoZSA9IHV0aWxzLmNhY2hlO1xuXG4vKipcbiAqIEN1c3RvbSBmaWxlIGxvYWRlci4gVXNlZnVsIGZvciB0ZW1wbGF0ZSBwcmVwcm9jZXNzaW5nIG9yIHJlc3RyaWN0aW5nIGFjY2Vzc1xuICogdG8gYSBjZXJ0YWluIHBhcnQgb2YgdGhlIGZpbGVzeXN0ZW0uXG4gKlxuICogQHR5cGUge2ZpbGVMb2FkZXJ9XG4gKi9cblxuZXhwb3J0cy5maWxlTG9hZGVyID0gZnMucmVhZEZpbGVTeW5jO1xuXG4vKipcbiAqIE5hbWUgb2YgdGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBsb2NhbHMuXG4gKlxuICogVGhpcyB2YXJpYWJsZSBpcyBvdmVycmlkZGVuIGJ5IHtAbGluayBPcHRpb25zfWAubG9jYWxzTmFtZWAgaWYgaXQgaXMgbm90XG4gKiBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMubG9jYWxzTmFtZSA9IF9ERUZBVUxUX0xPQ0FMU19OQU1FO1xuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBmcm9tIHRoZSBwYXJlbnQgZmlsZSBwYXRoIGFuZCB0aGVcbiAqIHNwZWNpZmllZCBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgbmFtZSAgICAgc3BlY2lmaWVkIHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSAgZmlsZW5hbWUgcGFyZW50IGZpbGUgcGF0aFxuICogQHBhcmFtIHtCb29sZWFufSBpc0RpciAgICBwYXJlbnQgZmlsZSBwYXRoIHdoZXRoZXIgaXMgZGlyZWN0b3J5XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMucmVzb2x2ZUluY2x1ZGUgPSBmdW5jdGlvbihuYW1lLCBmaWxlbmFtZSwgaXNEaXIpIHtcbiAgdmFyIGRpcm5hbWUgPSBwYXRoLmRpcm5hbWU7XG4gIHZhciBleHRuYW1lID0gcGF0aC5leHRuYW1lO1xuICB2YXIgcmVzb2x2ZSA9IHBhdGgucmVzb2x2ZTtcbiAgdmFyIGluY2x1ZGVQYXRoID0gcmVzb2x2ZShpc0RpciA/IGZpbGVuYW1lIDogZGlybmFtZShmaWxlbmFtZSksIG5hbWUpO1xuICB2YXIgZXh0ID0gZXh0bmFtZShuYW1lKTtcbiAgaWYgKCFleHQpIHtcbiAgICBpbmNsdWRlUGF0aCArPSAnLmVqcyc7XG4gIH1cbiAgcmV0dXJuIGluY2x1ZGVQYXRoO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggdG8gdGhlIGluY2x1ZGVkIGZpbGUgYnkgT3B0aW9uc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gIHBhdGggICAgc3BlY2lmaWVkIHBhdGhcbiAqIEBwYXJhbSAge09wdGlvbnN9IG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRJbmNsdWRlUGF0aChwYXRoLCBvcHRpb25zKSB7XG4gIHZhciBpbmNsdWRlUGF0aDtcbiAgdmFyIGZpbGVQYXRoO1xuICB2YXIgdmlld3MgPSBvcHRpb25zLnZpZXdzO1xuXG4gIC8vIEFicyBwYXRoXG4gIGlmIChwYXRoLmNoYXJBdCgwKSA9PSAnLycpIHtcbiAgICBpbmNsdWRlUGF0aCA9IGV4cG9ydHMucmVzb2x2ZUluY2x1ZGUocGF0aC5yZXBsYWNlKC9eXFwvKi8sJycpLCBvcHRpb25zLnJvb3QgfHwgJy8nLCB0cnVlKTtcbiAgfVxuICAvLyBSZWxhdGl2ZSBwYXRoc1xuICBlbHNlIHtcbiAgICAvLyBMb29rIHJlbGF0aXZlIHRvIGEgcGFzc2VkIGZpbGVuYW1lIGZpcnN0XG4gICAgaWYgKG9wdGlvbnMuZmlsZW5hbWUpIHtcbiAgICAgIGZpbGVQYXRoID0gZXhwb3J0cy5yZXNvbHZlSW5jbHVkZShwYXRoLCBvcHRpb25zLmZpbGVuYW1lKTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBpbmNsdWRlUGF0aCA9IGZpbGVQYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGVuIGxvb2sgaW4gYW55IHZpZXdzIGRpcmVjdG9yaWVzXG4gICAgaWYgKCFpbmNsdWRlUGF0aCkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmlld3MpICYmIHZpZXdzLnNvbWUoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgZmlsZVBhdGggPSBleHBvcnRzLnJlc29sdmVJbmNsdWRlKHBhdGgsIHYsIHRydWUpO1xuICAgICAgICByZXR1cm4gZnMuZXhpc3RzU3luYyhmaWxlUGF0aCk7XG4gICAgICB9KSkge1xuICAgICAgICBpbmNsdWRlUGF0aCA9IGZpbGVQYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWluY2x1ZGVQYXRoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGluY2x1ZGUgaW5jbHVkZSBmaWxlLicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaW5jbHVkZVBhdGg7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZmlsZSwgZWl0aGVyIGNvbXBpbGVkIG9uLXRoZS1mbHkgb3JcbiAqIHJlYWQgZnJvbSBjYWNoZSAoaWYgZW5hYmxlZCksIGFuZCBjYWNoZSB0aGUgdGVtcGxhdGUgaWYgbmVlZGVkLlxuICpcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgbm90IHNldCwgdGhlIGZpbGUgc3BlY2lmaWVkIGluIGBvcHRpb25zLmZpbGVuYW1lYCB3aWxsIGJlXG4gKiByZWFkLlxuICpcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyB0cnVlLCB0aGlzIGZ1bmN0aW9uIHJlYWRzIHRoZSBmaWxlIGZyb21cbiAqIGBvcHRpb25zLmZpbGVuYW1lYCBzbyBpdCBtdXN0IGJlIHNldCBwcmlvciB0byBjYWxsaW5nIHRoaXMgZnVuY3Rpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyAgIGNvbXBpbGF0aW9uIG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdGVtcGxhdGVdIHRlbXBsYXRlIHNvdXJjZVxuICogQHJldHVybiB7KFRlbXBsYXRlRnVuY3Rpb258Q2xpZW50RnVuY3Rpb24pfVxuICogRGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgb3B0aW9ucy5jbGllbnRgLCBlaXRoZXIgdHlwZSBtaWdodCBiZSByZXR1cm5lZC5cbiAqIEBzdGF0aWNcbiAqL1xuXG5mdW5jdGlvbiBoYW5kbGVDYWNoZShvcHRpb25zLCB0ZW1wbGF0ZSkge1xuICB2YXIgZnVuYztcbiAgdmFyIGZpbGVuYW1lID0gb3B0aW9ucy5maWxlbmFtZTtcbiAgdmFyIGhhc1RlbXBsYXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDE7XG5cbiAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcbiAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhY2hlIG9wdGlvbiByZXF1aXJlcyBhIGZpbGVuYW1lJyk7XG4gICAgfVxuICAgIGZ1bmMgPSBleHBvcnRzLmNhY2hlLmdldChmaWxlbmFtZSk7XG4gICAgaWYgKGZ1bmMpIHtcbiAgICAgIHJldHVybiBmdW5jO1xuICAgIH1cbiAgICBpZiAoIWhhc1RlbXBsYXRlKSB7XG4gICAgICB0ZW1wbGF0ZSA9IGZpbGVMb2FkZXIoZmlsZW5hbWUpLnRvU3RyaW5nKCkucmVwbGFjZShfQk9NLCAnJyk7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKCFoYXNUZW1wbGF0ZSkge1xuICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBpZjogc2hvdWxkIG5vdCBoYXBwZW4gYXQgYWxsXG4gICAgaWYgKCFmaWxlbmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnRlcm5hbCBFSlMgZXJyb3I6IG5vIGZpbGUgbmFtZSBvciB0ZW1wbGF0ZSAnXG4gICAgICAgICAgICAgICAgICAgICsgJ3Byb3ZpZGVkJyk7XG4gICAgfVxuICAgIHRlbXBsYXRlID0gZmlsZUxvYWRlcihmaWxlbmFtZSkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sICcnKTtcbiAgfVxuICBmdW5jID0gZXhwb3J0cy5jb21waWxlKHRlbXBsYXRlLCBvcHRpb25zKTtcbiAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcbiAgICBleHBvcnRzLmNhY2hlLnNldChmaWxlbmFtZSwgZnVuYyk7XG4gIH1cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbi8qKlxuICogVHJ5IGNhbGxpbmcgaGFuZGxlQ2FjaGUgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBhbmQgZGF0YSBhbmQgY2FsbCB0aGVcbiAqIGNhbGxiYWNrIHdpdGggdGhlIHJlc3VsdC4gSWYgYW4gZXJyb3Igb2NjdXJzLCBjYWxsIHRoZSBjYWxsYmFjayB3aXRoXG4gKiB0aGUgZXJyb3IuIFVzZWQgYnkgcmVuZGVyRmlsZSgpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgICAgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgICAgICAgIHRlbXBsYXRlIGRhdGFcbiAqIEBwYXJhbSB7UmVuZGVyRmlsZUNhbGxiYWNrfSBjYiBjYWxsYmFja1xuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIHRyeUhhbmRsZUNhY2hlKG9wdGlvbnMsIGRhdGEsIGNiKSB7XG4gIHZhciByZXN1bHQ7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gaGFuZGxlQ2FjaGUob3B0aW9ucykoZGF0YSk7XG4gIH1cbiAgY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBjYihlcnIpO1xuICB9XG4gIHJldHVybiBjYihudWxsLCByZXN1bHQpO1xufVxuXG4vKipcbiAqIGZpbGVMb2FkZXIgaXMgaW5kZXBlbmRlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGggZWpzIGZpbGUgcGF0aC5cbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGNvbnRlbnRzIG9mIHRoZSBzcGVjaWZpZWQgZmlsZS5cbiAqIEBzdGF0aWNcbiAqL1xuXG5mdW5jdGlvbiBmaWxlTG9hZGVyKGZpbGVQYXRoKXtcbiAgcmV0dXJuIGV4cG9ydHMuZmlsZUxvYWRlcihmaWxlUGF0aCk7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbi5cbiAqXG4gKiBJZiBgb3B0aW9ucy5jYWNoZWAgaXMgYHRydWVgLCB0aGVuIHRoZSB0ZW1wbGF0ZSBpcyBjYWNoZWQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7U3RyaW5nfSAgcGF0aCAgICBwYXRoIGZvciB0aGUgc3BlY2lmaWVkIGZpbGVcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRpb25zLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gaW5jbHVkZUZpbGUocGF0aCwgb3B0aW9ucykge1xuICB2YXIgb3B0cyA9IHV0aWxzLnNoYWxsb3dDb3B5KHt9LCBvcHRpb25zKTtcbiAgb3B0cy5maWxlbmFtZSA9IGdldEluY2x1ZGVQYXRoKHBhdGgsIG9wdHMpO1xuICByZXR1cm4gaGFuZGxlQ2FjaGUob3B0cyk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBKYXZhU2NyaXB0IHNvdXJjZSBvZiBhbiBpbmNsdWRlZCBmaWxlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge1N0cmluZ30gIHBhdGggICAgcGF0aCBmb3IgdGhlIHNwZWNpZmllZCBmaWxlXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fVxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGluY2x1ZGVTb3VyY2UocGF0aCwgb3B0aW9ucykge1xuICB2YXIgb3B0cyA9IHV0aWxzLnNoYWxsb3dDb3B5KHt9LCBvcHRpb25zKTtcbiAgdmFyIGluY2x1ZGVQYXRoO1xuICB2YXIgdGVtcGxhdGU7XG4gIGluY2x1ZGVQYXRoID0gZ2V0SW5jbHVkZVBhdGgocGF0aCwgb3B0cyk7XG4gIHRlbXBsYXRlID0gZmlsZUxvYWRlcihpbmNsdWRlUGF0aCkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sICcnKTtcbiAgb3B0cy5maWxlbmFtZSA9IGluY2x1ZGVQYXRoO1xuICB2YXIgdGVtcGwgPSBuZXcgVGVtcGxhdGUodGVtcGxhdGUsIG9wdHMpO1xuICB0ZW1wbC5nZW5lcmF0ZVNvdXJjZSgpO1xuICByZXR1cm4ge1xuICAgIHNvdXJjZTogdGVtcGwuc291cmNlLFxuICAgIGZpbGVuYW1lOiBpbmNsdWRlUGF0aCxcbiAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcbiAgfTtcbn1cblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGUgYHN0cmAgb2YgZWpzLCBgZmlsZW5hbWVgLCBhbmRcbiAqIGBsaW5lbm9gLlxuICpcbiAqIEBpbXBsZW1lbnRzIFJldGhyb3dDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7RXJyb3J9ICBlcnIgICAgICBFcnJvciBvYmplY3RcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgICAgICBFSlMgc291cmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWUgZmlsZSBuYW1lIG9mIHRoZSBFSlMgZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVubyAgIGxpbmUgbnVtYmVyIG9mIHRoZSBlcnJvclxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIHJldGhyb3coZXJyLCBzdHIsIGZsbm0sIGxpbmVubywgZXNjKXtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKTtcbiAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gMywgMCk7XG4gIHZhciBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIDMpO1xuICB2YXIgZmlsZW5hbWUgPSBlc2MoZmxubSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbiAobGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnID4+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnZWpzJykgKyAnOidcbiAgICArIGxpbmVubyArICdcXG4nXG4gICAgKyBjb250ZXh0ICsgJ1xcblxcbidcbiAgICArIGVyci5tZXNzYWdlO1xuXG4gIHRocm93IGVycjtcbn1cblxuZnVuY3Rpb24gc3RyaXBTZW1pKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvOyhcXHMqJCkvLCAnJDEnKTtcbn1cblxuLyoqXG4gKiBDb21waWxlIHRoZSBnaXZlbiBgc3RyYCBvZiBlanMgaW50byBhIHRlbXBsYXRlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgdGVtcGxhdGUgRUpTIHRlbXBsYXRlXG4gKlxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRzICAgICBjb21waWxhdGlvbiBvcHRpb25zXG4gKlxuICogQHJldHVybiB7KFRlbXBsYXRlRnVuY3Rpb258Q2xpZW50RnVuY3Rpb24pfVxuICogRGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgb3B0cy5jbGllbnRgLCBlaXRoZXIgdHlwZSBtaWdodCBiZSByZXR1cm5lZC5cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmNvbXBpbGUgPSBmdW5jdGlvbiBjb21waWxlKHRlbXBsYXRlLCBvcHRzKSB7XG4gIHZhciB0ZW1wbDtcblxuICAvLyB2MSBjb21wYXRcbiAgLy8gJ3Njb3BlJyBpcyAnY29udGV4dCdcbiAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIGluIGEgZnV0dXJlIHZlcnNpb25cbiAgaWYgKG9wdHMgJiYgb3B0cy5zY29wZSkge1xuICAgIGlmICghc2NvcGVPcHRpb25XYXJuZWQpe1xuICAgICAgY29uc29sZS53YXJuKCdgc2NvcGVgIG9wdGlvbiBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gRUpTIDMnKTtcbiAgICAgIHNjb3BlT3B0aW9uV2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFvcHRzLmNvbnRleHQpIHtcbiAgICAgIG9wdHMuY29udGV4dCA9IG9wdHMuc2NvcGU7XG4gICAgfVxuICAgIGRlbGV0ZSBvcHRzLnNjb3BlO1xuICB9XG4gIHRlbXBsID0gbmV3IFRlbXBsYXRlKHRlbXBsYXRlLCBvcHRzKTtcbiAgcmV0dXJuIHRlbXBsLmNvbXBpbGUoKTtcbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBgdGVtcGxhdGVgIG9mIGVqcy5cbiAqXG4gKiBJZiB5b3Ugd291bGQgbGlrZSB0byBpbmNsdWRlIG9wdGlvbnMgYnV0IG5vdCBkYXRhLCB5b3UgbmVlZCB0byBleHBsaWNpdGx5XG4gKiBjYWxsIHRoaXMgZnVuY3Rpb24gd2l0aCBgZGF0YWAgYmVpbmcgYW4gZW1wdHkgb2JqZWN0IG9yIGBudWxsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gICB0ZW1wbGF0ZSBFSlMgdGVtcGxhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2RhdGE9e31dIHRlbXBsYXRlIGRhdGFcbiAqIEBwYXJhbSB7T3B0aW9uc30gW29wdHM9e31dIGNvbXBpbGF0aW9uIGFuZCByZW5kZXJpbmcgb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMucmVuZGVyID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBkLCBvKSB7XG4gIHZhciBkYXRhID0gZCB8fCB7fTtcbiAgdmFyIG9wdHMgPSBvIHx8IHt9O1xuXG4gIC8vIE5vIG9wdGlvbnMgb2JqZWN0IC0tIGlmIHRoZXJlIGFyZSBvcHRpb255IG5hbWVzXG4gIC8vIGluIHRoZSBkYXRhLCBjb3B5IHRoZW0gdG8gb3B0aW9uc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgdXRpbHMuc2hhbGxvd0NvcHlGcm9tTGlzdChvcHRzLCBkYXRhLCBfT1BUUyk7XG4gIH1cblxuICByZXR1cm4gaGFuZGxlQ2FjaGUob3B0cywgdGVtcGxhdGUpKGRhdGEpO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgYW4gRUpTIGZpbGUgYXQgdGhlIGdpdmVuIGBwYXRoYCBhbmQgY2FsbGJhY2sgYGNiKGVyciwgc3RyKWAuXG4gKlxuICogSWYgeW91IHdvdWxkIGxpa2UgdG8gaW5jbHVkZSBvcHRpb25zIGJ1dCBub3QgZGF0YSwgeW91IG5lZWQgdG8gZXhwbGljaXRseVxuICogY2FsbCB0aGlzIGZ1bmN0aW9uIHdpdGggYGRhdGFgIGJlaW5nIGFuIGVtcHR5IG9iamVjdCBvciBgbnVsbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgICAgIHBhdGggICAgIHBhdGggdG8gdGhlIEVKUyBmaWxlXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgICBbZGF0YT17fV0gdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtPcHRpb25zfSAgICAgICAgICAgW29wdHM9e31dIGNvbXBpbGF0aW9uIGFuZCByZW5kZXJpbmcgb3B0aW9uc1xuICogQHBhcmFtIHtSZW5kZXJGaWxlQ2FsbGJhY2t9IGNiIGNhbGxiYWNrXG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5yZW5kZXJGaWxlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZmlsZW5hbWUgPSBhcmd1bWVudHNbMF07XG4gIHZhciBjYiA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gIHZhciBvcHRzID0ge2ZpbGVuYW1lOiBmaWxlbmFtZX07XG4gIHZhciBkYXRhO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgIGRhdGEgPSBhcmd1bWVudHNbMV07XG5cbiAgICAvLyBObyBvcHRpb25zIG9iamVjdCAtLSBpZiB0aGVyZSBhcmUgb3B0aW9ueSBuYW1lc1xuICAgIC8vIGluIHRoZSBkYXRhLCBjb3B5IHRoZW0gdG8gb3B0aW9uc1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAvLyBFeHByZXNzIDRcbiAgICAgIGlmIChkYXRhLnNldHRpbmdzKSB7XG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzWyd2aWV3IG9wdGlvbnMnXSkge1xuICAgICAgICAgIHV0aWxzLnNoYWxsb3dDb3B5RnJvbUxpc3Qob3B0cywgZGF0YS5zZXR0aW5nc1sndmlldyBvcHRpb25zJ10sIF9PUFRTX0VYUFJFU1MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnZpZXdzKSB7XG4gICAgICAgICAgb3B0cy52aWV3cyA9IGRhdGEuc2V0dGluZ3Mudmlld3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEV4cHJlc3MgMyBhbmQgbG93ZXJcbiAgICAgIGVsc2Uge1xuICAgICAgICB1dGlscy5zaGFsbG93Q29weUZyb21MaXN0KG9wdHMsIGRhdGEsIF9PUFRTX0VYUFJFU1MpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFVzZSBzaGFsbG93Q29weSBzbyB3ZSBkb24ndCBwb2xsdXRlIHBhc3NlZCBpbiBvcHRzIG9iaiB3aXRoIG5ldyB2YWxzXG4gICAgICB1dGlscy5zaGFsbG93Q29weShvcHRzLCBhcmd1bWVudHNbMl0pO1xuICAgIH1cblxuICAgIG9wdHMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgfVxuICBlbHNlIHtcbiAgICBkYXRhID0ge307XG4gIH1cblxuICByZXR1cm4gdHJ5SGFuZGxlQ2FjaGUob3B0cywgZGF0YSwgY2IpO1xufTtcblxuLyoqXG4gKiBDbGVhciBpbnRlcm1lZGlhdGUgSmF2YVNjcmlwdCBjYWNoZS4gQ2FsbHMge0BsaW5rIENhY2hlI3Jlc2V0fS5cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiAoKSB7XG4gIGV4cG9ydHMuY2FjaGUucmVzZXQoKTtcbn07XG5cbmZ1bmN0aW9uIFRlbXBsYXRlKHRleHQsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBvcHRpb25zID0ge307XG4gIHRoaXMudGVtcGxhdGVUZXh0ID0gdGV4dDtcbiAgdGhpcy5tb2RlID0gbnVsbDtcbiAgdGhpcy50cnVuY2F0ZSA9IGZhbHNlO1xuICB0aGlzLmN1cnJlbnRMaW5lID0gMTtcbiAgdGhpcy5zb3VyY2UgPSAnJztcbiAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgb3B0aW9ucy5jbGllbnQgPSBvcHRzLmNsaWVudCB8fCBmYWxzZTtcbiAgb3B0aW9ucy5lc2NhcGVGdW5jdGlvbiA9IG9wdHMuZXNjYXBlIHx8IHV0aWxzLmVzY2FwZVhNTDtcbiAgb3B0aW9ucy5jb21waWxlRGVidWcgPSBvcHRzLmNvbXBpbGVEZWJ1ZyAhPT0gZmFsc2U7XG4gIG9wdGlvbnMuZGVidWcgPSAhIW9wdHMuZGVidWc7XG4gIG9wdGlvbnMuZmlsZW5hbWUgPSBvcHRzLmZpbGVuYW1lO1xuICBvcHRpb25zLmRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8IGV4cG9ydHMuZGVsaW1pdGVyIHx8IF9ERUZBVUxUX0RFTElNSVRFUjtcbiAgb3B0aW9ucy5zdHJpY3QgPSBvcHRzLnN0cmljdCB8fCBmYWxzZTtcbiAgb3B0aW9ucy5jb250ZXh0ID0gb3B0cy5jb250ZXh0O1xuICBvcHRpb25zLmNhY2hlID0gb3B0cy5jYWNoZSB8fCBmYWxzZTtcbiAgb3B0aW9ucy5ybVdoaXRlc3BhY2UgPSBvcHRzLnJtV2hpdGVzcGFjZTtcbiAgb3B0aW9ucy5yb290ID0gb3B0cy5yb290O1xuICBvcHRpb25zLmxvY2Fsc05hbWUgPSBvcHRzLmxvY2Fsc05hbWUgfHwgZXhwb3J0cy5sb2NhbHNOYW1lIHx8IF9ERUZBVUxUX0xPQ0FMU19OQU1FO1xuICBvcHRpb25zLnZpZXdzID0gb3B0cy52aWV3cztcblxuICBpZiAob3B0aW9ucy5zdHJpY3QpIHtcbiAgICBvcHRpb25zLl93aXRoID0gZmFsc2U7XG4gIH1cbiAgZWxzZSB7XG4gICAgb3B0aW9ucy5fd2l0aCA9IHR5cGVvZiBvcHRzLl93aXRoICE9ICd1bmRlZmluZWQnID8gb3B0cy5fd2l0aCA6IHRydWU7XG4gIH1cblxuICB0aGlzLm9wdHMgPSBvcHRpb25zO1xuXG4gIHRoaXMucmVnZXggPSB0aGlzLmNyZWF0ZVJlZ2V4KCk7XG59XG5cblRlbXBsYXRlLm1vZGVzID0ge1xuICBFVkFMOiAnZXZhbCcsXG4gIEVTQ0FQRUQ6ICdlc2NhcGVkJyxcbiAgUkFXOiAncmF3JyxcbiAgQ09NTUVOVDogJ2NvbW1lbnQnLFxuICBMSVRFUkFMOiAnbGl0ZXJhbCdcbn07XG5cblRlbXBsYXRlLnByb3RvdHlwZSA9IHtcbiAgY3JlYXRlUmVnZXg6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RyID0gX1JFR0VYX1NUUklORztcbiAgICB2YXIgZGVsaW0gPSB1dGlscy5lc2NhcGVSZWdFeHBDaGFycyh0aGlzLm9wdHMuZGVsaW1pdGVyKTtcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvJS9nLCBkZWxpbSk7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoc3RyKTtcbiAgfSxcblxuICBjb21waWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNyYztcbiAgICB2YXIgZm47XG4gICAgdmFyIG9wdHMgPSB0aGlzLm9wdHM7XG4gICAgdmFyIHByZXBlbmRlZCA9ICcnO1xuICAgIHZhciBhcHBlbmRlZCA9ICcnO1xuICAgIHZhciBlc2NhcGVGbiA9IG9wdHMuZXNjYXBlRnVuY3Rpb247XG5cbiAgICBpZiAoIXRoaXMuc291cmNlKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlU291cmNlKCk7XG4gICAgICBwcmVwZW5kZWQgKz0gJyAgdmFyIF9fb3V0cHV0ID0gW10sIF9fYXBwZW5kID0gX19vdXRwdXQucHVzaC5iaW5kKF9fb3V0cHV0KTsnICsgJ1xcbic7XG4gICAgICBpZiAob3B0cy5fd2l0aCAhPT0gZmFsc2UpIHtcbiAgICAgICAgcHJlcGVuZGVkICs9ICAnICB3aXRoICgnICsgb3B0cy5sb2NhbHNOYW1lICsgJyB8fCB7fSkgeycgKyAnXFxuJztcbiAgICAgICAgYXBwZW5kZWQgKz0gJyAgfScgKyAnXFxuJztcbiAgICAgIH1cbiAgICAgIGFwcGVuZGVkICs9ICcgIHJldHVybiBfX291dHB1dC5qb2luKFwiXCIpOycgKyAnXFxuJztcbiAgICAgIHRoaXMuc291cmNlID0gcHJlcGVuZGVkICsgdGhpcy5zb3VyY2UgKyBhcHBlbmRlZDtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5jb21waWxlRGVidWcpIHtcbiAgICAgIHNyYyA9ICd2YXIgX19saW5lID0gMScgKyAnXFxuJ1xuICAgICAgICAgICsgJyAgLCBfX2xpbmVzID0gJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudGVtcGxhdGVUZXh0KSArICdcXG4nXG4gICAgICAgICAgKyAnICAsIF9fZmlsZW5hbWUgPSAnICsgKG9wdHMuZmlsZW5hbWUgP1xuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KG9wdHMuZmlsZW5hbWUpIDogJ3VuZGVmaW5lZCcpICsgJzsnICsgJ1xcbidcbiAgICAgICAgICArICd0cnkgeycgKyAnXFxuJ1xuICAgICAgICAgICsgdGhpcy5zb3VyY2VcbiAgICAgICAgICArICd9IGNhdGNoIChlKSB7JyArICdcXG4nXG4gICAgICAgICAgKyAnICByZXRocm93KGUsIF9fbGluZXMsIF9fZmlsZW5hbWUsIF9fbGluZSwgZXNjYXBlRm4pOycgKyAnXFxuJ1xuICAgICAgICAgICsgJ30nICsgJ1xcbic7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc3JjID0gdGhpcy5zb3VyY2U7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuY2xpZW50KSB7XG4gICAgICBzcmMgPSAnZXNjYXBlRm4gPSBlc2NhcGVGbiB8fCAnICsgZXNjYXBlRm4udG9TdHJpbmcoKSArICc7JyArICdcXG4nICsgc3JjO1xuICAgICAgaWYgKG9wdHMuY29tcGlsZURlYnVnKSB7XG4gICAgICAgIHNyYyA9ICdyZXRocm93ID0gcmV0aHJvdyB8fCAnICsgcmV0aHJvdy50b1N0cmluZygpICsgJzsnICsgJ1xcbicgKyBzcmM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuc3RyaWN0KSB7XG4gICAgICBzcmMgPSAnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHNyYztcbiAgICB9XG4gICAgaWYgKG9wdHMuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHNyYyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZuID0gbmV3IEZ1bmN0aW9uKG9wdHMubG9jYWxzTmFtZSArICcsIGVzY2FwZUZuLCBpbmNsdWRlLCByZXRocm93Jywgc3JjKTtcbiAgICB9XG4gICAgY2F0Y2goZSkge1xuICAgICAgLy8gaXN0YW5idWwgaWdub3JlIGVsc2VcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICAgICAgaWYgKG9wdHMuZmlsZW5hbWUpIHtcbiAgICAgICAgICBlLm1lc3NhZ2UgKz0gJyBpbiAnICsgb3B0cy5maWxlbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlLm1lc3NhZ2UgKz0gJyB3aGlsZSBjb21waWxpbmcgZWpzXFxuXFxuJztcbiAgICAgICAgZS5tZXNzYWdlICs9ICdJZiB0aGUgYWJvdmUgZXJyb3IgaXMgbm90IGhlbHBmdWwsIHlvdSBtYXkgd2FudCB0byB0cnkgRUpTLUxpbnQ6XFxuJztcbiAgICAgICAgZS5tZXNzYWdlICs9ICdodHRwczovL2dpdGh1Yi5jb20vUnlhblppbS9FSlMtTGludCc7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmNsaWVudCkge1xuICAgICAgZm4uZGVwZW5kZW5jaWVzID0gdGhpcy5kZXBlbmRlbmNpZXM7XG4gICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgY2FsbGFibGUgZnVuY3Rpb24gd2hpY2ggd2lsbCBleGVjdXRlIHRoZSBmdW5jdGlvblxuICAgIC8vIGNyZWF0ZWQgYnkgdGhlIHNvdXJjZS1jb2RlLCB3aXRoIHRoZSBwYXNzZWQgZGF0YSBhcyBsb2NhbHNcbiAgICAvLyBBZGRzIGEgbG9jYWwgYGluY2x1ZGVgIGZ1bmN0aW9uIHdoaWNoIGFsbG93cyBmdWxsIHJlY3Vyc2l2ZSBpbmNsdWRlXG4gICAgdmFyIHJldHVybmVkRm4gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIGluY2x1ZGUgPSBmdW5jdGlvbiAocGF0aCwgaW5jbHVkZURhdGEpIHtcbiAgICAgICAgdmFyIGQgPSB1dGlscy5zaGFsbG93Q29weSh7fSwgZGF0YSk7XG4gICAgICAgIGlmIChpbmNsdWRlRGF0YSkge1xuICAgICAgICAgIGQgPSB1dGlscy5zaGFsbG93Q29weShkLCBpbmNsdWRlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluY2x1ZGVGaWxlKHBhdGgsIG9wdHMpKGQpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBmbi5hcHBseShvcHRzLmNvbnRleHQsIFtkYXRhIHx8IHt9LCBlc2NhcGVGbiwgaW5jbHVkZSwgcmV0aHJvd10pO1xuICAgIH07XG4gICAgcmV0dXJuZWRGbi5kZXBlbmRlbmNpZXMgPSB0aGlzLmRlcGVuZGVuY2llcztcbiAgICByZXR1cm4gcmV0dXJuZWRGbjtcbiAgfSxcblxuICBnZW5lcmF0ZVNvdXJjZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRzID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKG9wdHMucm1XaGl0ZXNwYWNlKSB7XG4gICAgICAvLyBIYXZlIHRvIHVzZSB0d28gc2VwYXJhdGUgcmVwbGFjZSBoZXJlIGFzIGBeYCBhbmQgYCRgIG9wZXJhdG9ycyBkb24ndFxuICAgICAgLy8gd29yayB3ZWxsIHdpdGggYFxccmAuXG4gICAgICB0aGlzLnRlbXBsYXRlVGV4dCA9XG4gICAgICAgIHRoaXMudGVtcGxhdGVUZXh0LnJlcGxhY2UoL1xcci9nLCAnJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sICcnKTtcbiAgICB9XG5cbiAgICAvLyBTbHVycCBzcGFjZXMgYW5kIHRhYnMgYmVmb3JlIDwlXyBhbmQgYWZ0ZXIgXyU+XG4gICAgdGhpcy50ZW1wbGF0ZVRleHQgPVxuICAgICAgdGhpcy50ZW1wbGF0ZVRleHQucmVwbGFjZSgvWyBcXHRdKjwlXy9nbSwgJzwlXycpLnJlcGxhY2UoL18lPlsgXFx0XSovZ20sICdfJT4nKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbWF0Y2hlcyA9IHRoaXMucGFyc2VUZW1wbGF0ZVRleHQoKTtcbiAgICB2YXIgZCA9IHRoaXMub3B0cy5kZWxpbWl0ZXI7XG5cbiAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lLCBpbmRleCkge1xuICAgICAgICB2YXIgb3BlbmluZztcbiAgICAgICAgdmFyIGNsb3Npbmc7XG4gICAgICAgIHZhciBpbmNsdWRlO1xuICAgICAgICB2YXIgaW5jbHVkZU9wdHM7XG4gICAgICAgIHZhciBpbmNsdWRlT2JqO1xuICAgICAgICB2YXIgaW5jbHVkZVNyYztcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhbiBvcGVuaW5nIHRhZywgY2hlY2sgZm9yIGNsb3NpbmcgdGFnc1xuICAgICAgICAvLyBGSVhNRTogTWF5IGVuZCB1cCB3aXRoIHNvbWUgZmFsc2UgcG9zaXRpdmVzIGhlcmVcbiAgICAgICAgLy8gQmV0dGVyIHRvIHN0b3JlIG1vZGVzIGFzIGsvdiB3aXRoICc8JyArIGRlbGltaXRlciBhcyBrZXlcbiAgICAgICAgLy8gVGhlbiB0aGlzIGNhbiBzaW1wbHkgY2hlY2sgYWdhaW5zdCB0aGUgbWFwXG4gICAgICAgIGlmICggbGluZS5pbmRleE9mKCc8JyArIGQpID09PSAwICAgICAgICAvLyBJZiBpdCBpcyBhIHRhZ1xuICAgICAgICAgICYmIGxpbmUuaW5kZXhPZignPCcgKyBkICsgZCkgIT09IDApIHsgLy8gYW5kIGlzIG5vdCBlc2NhcGVkXG4gICAgICAgICAgY2xvc2luZyA9IG1hdGNoZXNbaW5kZXggKyAyXTtcbiAgICAgICAgICBpZiAoIShjbG9zaW5nID09IGQgKyAnPicgfHwgY2xvc2luZyA9PSAnLScgKyBkICsgJz4nIHx8IGNsb3NpbmcgPT0gJ18nICsgZCArICc+JykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgbWF0Y2hpbmcgY2xvc2UgdGFnIGZvciBcIicgKyBsaW5lICsgJ1wiLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBIQUNLOiBiYWNrd2FyZC1jb21wYXQgYGluY2x1ZGVgIHByZXByb2Nlc3NvciBkaXJlY3RpdmVzXG4gICAgICAgIGlmICgoaW5jbHVkZSA9IGxpbmUubWF0Y2goL15cXHMqaW5jbHVkZVxccysoXFxTKykvKSkpIHtcbiAgICAgICAgICBvcGVuaW5nID0gbWF0Y2hlc1tpbmRleCAtIDFdO1xuICAgICAgICAgIC8vIE11c3QgYmUgaW4gRVZBTCBvciBSQVcgbW9kZVxuICAgICAgICAgIGlmIChvcGVuaW5nICYmIChvcGVuaW5nID09ICc8JyArIGQgfHwgb3BlbmluZyA9PSAnPCcgKyBkICsgJy0nIHx8IG9wZW5pbmcgPT0gJzwnICsgZCArICdfJykpIHtcbiAgICAgICAgICAgIGluY2x1ZGVPcHRzID0gdXRpbHMuc2hhbGxvd0NvcHkoe30sIHNlbGYub3B0cyk7XG4gICAgICAgICAgICBpbmNsdWRlT2JqID0gaW5jbHVkZVNvdXJjZShpbmNsdWRlWzFdLCBpbmNsdWRlT3B0cyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRzLmNvbXBpbGVEZWJ1Zykge1xuICAgICAgICAgICAgICBpbmNsdWRlU3JjID1cbiAgICAgICAgICAgICAgICAgICcgICAgOyAoZnVuY3Rpb24oKXsnICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgJyAgICAgIHZhciBfX2xpbmUgPSAxJyArICdcXG4nXG4gICAgICAgICAgICAgICAgICArICcgICAgICAsIF9fbGluZXMgPSAnICsgSlNPTi5zdHJpbmdpZnkoaW5jbHVkZU9iai50ZW1wbGF0ZSkgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgKyAnICAgICAgLCBfX2ZpbGVuYW1lID0gJyArIEpTT04uc3RyaW5naWZ5KGluY2x1ZGVPYmouZmlsZW5hbWUpICsgJzsnICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgJyAgICAgIHRyeSB7JyArICdcXG4nXG4gICAgICAgICAgICAgICAgICArIGluY2x1ZGVPYmouc291cmNlXG4gICAgICAgICAgICAgICAgICArICcgICAgICB9IGNhdGNoIChlKSB7JyArICdcXG4nXG4gICAgICAgICAgICAgICAgICArICcgICAgICAgIHJldGhyb3coZSwgX19saW5lcywgX19maWxlbmFtZSwgX19saW5lLCBlc2NhcGVGbik7JyArICdcXG4nXG4gICAgICAgICAgICAgICAgICArICcgICAgICB9JyArICdcXG4nXG4gICAgICAgICAgICAgICAgICArICcgICAgOyB9KS5jYWxsKHRoaXMpJyArICdcXG4nO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGluY2x1ZGVTcmMgPSAnICAgIDsgKGZ1bmN0aW9uKCl7JyArICdcXG4nICsgaW5jbHVkZU9iai5zb3VyY2UgK1xuICAgICAgICAgICAgICAgICAgJyAgICA7IH0pLmNhbGwodGhpcyknICsgJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnNvdXJjZSArPSBpbmNsdWRlU3JjO1xuICAgICAgICAgICAgc2VsZi5kZXBlbmRlbmNpZXMucHVzaChleHBvcnRzLnJlc29sdmVJbmNsdWRlKGluY2x1ZGVbMV0sXG4gICAgICAgICAgICAgICAgaW5jbHVkZU9wdHMuZmlsZW5hbWUpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5zY2FuTGluZShsaW5lKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9LFxuXG4gIHBhcnNlVGVtcGxhdGVUZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0ciA9IHRoaXMudGVtcGxhdGVUZXh0O1xuICAgIHZhciBwYXQgPSB0aGlzLnJlZ2V4O1xuICAgIHZhciByZXN1bHQgPSBwYXQuZXhlYyhzdHIpO1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICB2YXIgZmlyc3RQb3M7XG5cbiAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICBmaXJzdFBvcyA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgaWYgKGZpcnN0UG9zICE9PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKHN0ci5zdWJzdHJpbmcoMCwgZmlyc3RQb3MpKTtcbiAgICAgICAgc3RyID0gc3RyLnNsaWNlKGZpcnN0UG9zKTtcbiAgICAgIH1cblxuICAgICAgYXJyLnB1c2gocmVzdWx0WzBdKTtcbiAgICAgIHN0ciA9IHN0ci5zbGljZShyZXN1bHRbMF0ubGVuZ3RoKTtcbiAgICAgIHJlc3VsdCA9IHBhdC5leGVjKHN0cik7XG4gICAgfVxuXG4gICAgaWYgKHN0cikge1xuICAgICAgYXJyLnB1c2goc3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xuICB9LFxuXG4gIF9hZGRPdXRwdXQ6IGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgaWYgKHRoaXMudHJ1bmNhdGUpIHtcbiAgICAgIC8vIE9ubHkgcmVwbGFjZSBzaW5nbGUgbGVhZGluZyBsaW5lYnJlYWsgaW4gdGhlIGxpbmUgYWZ0ZXJcbiAgICAgIC8vIC0lPiB0YWcgLS0gdGhpcyBpcyB0aGUgc2luZ2xlLCB0cmFpbGluZyBsaW5lYnJlYWtcbiAgICAgIC8vIGFmdGVyIHRoZSB0YWcgdGhhdCB0aGUgdHJ1bmNhdGlvbiBtb2RlIHJlcGxhY2VzXG4gICAgICAvLyBIYW5kbGUgV2luIC8gVW5peCAvIG9sZCBNYWMgbGluZWJyZWFrcyAtLSBkbyB0aGUgXFxyXFxuXG4gICAgICAvLyBjb21ibyBmaXJzdCBpbiB0aGUgcmVnZXgtb3JcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL14oPzpcXHJcXG58XFxyfFxcbikvLCAnJyk7XG4gICAgICB0aGlzLnRydW5jYXRlID0gZmFsc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMub3B0cy5ybVdoaXRlc3BhY2UpIHtcbiAgICAgIC8vIHJtV2hpdGVzcGFjZSBoYXMgYWxyZWFkeSByZW1vdmVkIHRyYWlsaW5nIHNwYWNlcywganVzdCBuZWVkXG4gICAgICAvLyB0byByZW1vdmUgbGluZWJyZWFrc1xuICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXlxcbi8sICcnKTtcbiAgICB9XG4gICAgaWYgKCFsaW5lKSB7XG4gICAgICByZXR1cm4gbGluZTtcbiAgICB9XG5cbiAgICAvLyBQcmVzZXJ2ZSBsaXRlcmFsIHNsYXNoZXNcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpO1xuXG4gICAgLy8gQ29udmVydCBsaW5lYnJlYWtzXG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxuL2csICdcXFxcbicpO1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKTtcblxuICAgIC8vIEVzY2FwZSBkb3VibGUtcXVvdGVzXG4gICAgLy8gLSB0aGlzIHdpbGwgYmUgdGhlIGRlbGltaXRlciBkdXJpbmcgZXhlY3V0aW9uXG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpO1xuICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZChcIicgKyBsaW5lICsgJ1wiKScgKyAnXFxuJztcbiAgfSxcblxuICBzY2FuTGluZTogZnVuY3Rpb24gKGxpbmUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGQgPSB0aGlzLm9wdHMuZGVsaW1pdGVyO1xuICAgIHZhciBuZXdMaW5lQ291bnQgPSAwO1xuXG4gICAgbmV3TGluZUNvdW50ID0gKGxpbmUuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDEpO1xuXG4gICAgc3dpdGNoIChsaW5lKSB7XG4gICAgY2FzZSAnPCcgKyBkOlxuICAgIGNhc2UgJzwnICsgZCArICdfJzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkVWQUw7XG4gICAgICBicmVhaztcbiAgICBjYXNlICc8JyArIGQgKyAnPSc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5FU0NBUEVEO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnPCcgKyBkICsgJy0nOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuUkFXO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnPCcgKyBkICsgJyMnOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuQ09NTUVOVDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzwnICsgZCArIGQ6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMO1xuICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUucmVwbGFjZSgnPCcgKyBkICsgZCwgJzwnICsgZCkgKyAnXCIpJyArICdcXG4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBkICsgZCArICc+JzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkxJVEVSQUw7XG4gICAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgX19hcHBlbmQoXCInICsgbGluZS5yZXBsYWNlKGQgKyBkICsgJz4nLCBkICsgJz4nKSArICdcIiknICsgJ1xcbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGQgKyAnPic6XG4gICAgY2FzZSAnLScgKyBkICsgJz4nOlxuICAgIGNhc2UgJ18nICsgZCArICc+JzpcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gVGVtcGxhdGUubW9kZXMuTElURVJBTCkge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXQobGluZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW9kZSA9IG51bGw7XG4gICAgICB0aGlzLnRydW5jYXRlID0gbGluZS5pbmRleE9mKCctJykgPT09IDAgfHwgbGluZS5pbmRleE9mKCdfJykgPT09IDA7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgICAvLyBJbiBzY3JpcHQgbW9kZSwgZGVwZW5kcyBvbiB0eXBlIG9mIHRhZ1xuICAgICAgaWYgKHRoaXMubW9kZSkge1xuICAgICAgICAgIC8vIElmICcvLycgaXMgZm91bmQgd2l0aG91dCBhIGxpbmUgYnJlYWssIGFkZCBhIGxpbmUgYnJlYWsuXG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuRVZBTDpcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FU0NBUEVEOlxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLlJBVzpcbiAgICAgICAgICBpZiAobGluZS5sYXN0SW5kZXhPZignLy8nKSA+IGxpbmUubGFzdEluZGV4T2YoJ1xcbicpKSB7XG4gICAgICAgICAgICBsaW5lICs9ICdcXG4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgICAgICAgLy8gSnVzdCBleGVjdXRpbmcgY29kZVxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVWQUw6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7ICcgKyBsaW5lICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBFeGVjLCBlc2MsIGFuZCBvdXRwdXRcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FU0NBUEVEOlxuICAgICAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZChlc2NhcGVGbignICsgc3RyaXBTZW1pKGxpbmUpICsgJykpJyArICdcXG4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gRXhlYyBhbmQgb3V0cHV0XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuUkFXOlxuICAgICAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZCgnICsgc3RyaXBTZW1pKGxpbmUpICsgJyknICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuQ09NTUVOVDpcbiAgICAgICAgICAgICAgLy8gRG8gbm90aGluZ1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gTGl0ZXJhbCA8JSUgbW9kZSwgYXBwZW5kIGFzIHJhdyBvdXRwdXRcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMOlxuICAgICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgICAvLyBJbiBzdHJpbmcgbW9kZSwganVzdCBhZGQgdGhlIG91dHB1dFxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5vcHRzLmNvbXBpbGVEZWJ1ZyAmJiBuZXdMaW5lQ291bnQpIHtcbiAgICAgIHRoaXMuY3VycmVudExpbmUgKz0gbmV3TGluZUNvdW50O1xuICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fbGluZSA9ICcgKyB0aGlzLmN1cnJlbnRMaW5lICsgJ1xcbic7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEVzY2FwZSBjaGFyYWN0ZXJzIHJlc2VydmVkIGluIFhNTC5cbiAqXG4gKiBUaGlzIGlzIHNpbXBseSBhbiBleHBvcnQgb2Yge0BsaW5rIG1vZHVsZTp1dGlscy5lc2NhcGVYTUx9LlxuICpcbiAqIElmIGBtYXJrdXBgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWFya3VwIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHB1YmxpY1xuICogQGZ1bmNcbiAqICovXG5leHBvcnRzLmVzY2FwZVhNTCA9IHV0aWxzLmVzY2FwZVhNTDtcblxuLyoqXG4gKiBFeHByZXNzLmpzIHN1cHBvcnQuXG4gKlxuICogVGhpcyBpcyBhbiBhbGlhcyBmb3Ige0BsaW5rIG1vZHVsZTplanMucmVuZGVyRmlsZX0sIGluIG9yZGVyIHRvIHN1cHBvcnRcbiAqIEV4cHJlc3MuanMgb3V0LW9mLXRoZS1ib3guXG4gKlxuICogQGZ1bmNcbiAqL1xuXG5leHBvcnRzLl9fZXhwcmVzcyA9IGV4cG9ydHMucmVuZGVyRmlsZTtcblxuLy8gQWRkIHJlcXVpcmUgc3VwcG9ydFxuLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbmlmIChyZXF1aXJlLmV4dGVuc2lvbnMpIHtcbiAgcmVxdWlyZS5leHRlbnNpb25zWycuZWpzJ10gPSBmdW5jdGlvbiAobW9kdWxlLCBmbG5tKSB7XG4gICAgdmFyIGZpbGVuYW1lID0gZmxubSB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBtb2R1bGUuZmlsZW5hbWU7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gICAgICBjbGllbnQ6IHRydWVcbiAgICB9O1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZpbGVMb2FkZXIoZmlsZW5hbWUpLnRvU3RyaW5nKCk7XG4gICAgdmFyIGZuID0gZXhwb3J0cy5jb21waWxlKHRlbXBsYXRlLCBvcHRpb25zKTtcbiAgICBtb2R1bGUuX2NvbXBpbGUoJ21vZHVsZS5leHBvcnRzID0gJyArIGZuLnRvU3RyaW5nKCkgKyAnOycsIGZpbGVuYW1lKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBWZXJzaW9uIG9mIEVKUy5cbiAqXG4gKiBAcmVhZG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5WRVJTSU9OID0gX1ZFUlNJT05fU1RSSU5HO1xuXG4vKipcbiAqIE5hbWUgZm9yIGRldGVjdGlvbiBvZiBFSlMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMubmFtZSA9IF9OQU1FO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbmlmICh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5lanMgPSBleHBvcnRzO1xufVxuIl19
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\ejs\\lib\\ejs.js","/..\\..\\..\\node_modules\\ejs\\lib")
},{"../package.json":12,"./utils":11,"9FoBSB":17,"buffer":4,"fs":3,"path":16}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */

'use strict';

var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, '\\$&');
};

var _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
var _MATCH_HTML = /[&<>\'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr = 'var _ENCODE_HTML_RULES = {\n' + '      "&": "&amp;"\n' + '    , "<": "&lt;"\n' + '    , ">": "&gt;"\n' + '    , \'"\': "&#34;"\n' + '    , "\'": "&#39;"\n' + '    }\n' + '  , _MATCH_HTML = /[&<>\'"]/g;\n' + 'function encode_char(c) {\n' + '  return _ENCODE_HTML_RULES[c] || c;\n' + '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined ? '' : String(markup).replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Naive copy of a list of key names, from one object to another.
 * Only copies property if it is actually defined
 * Does not recurse into non-scalar properties
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @param  {Array} list List of properties to copy
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopyFromList = function (to, from, list) {
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (typeof from[p] != 'undefined') {
      to[p] = from[p];
    }
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements Cache
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGVqc1xcbGliXFx1dGlscy5qcyJdLCJuYW1lcyI6WyJyZWdFeHBDaGFycyIsImV4cG9ydHMiLCJlc2NhcGVSZWdFeHBDaGFycyIsInN0cmluZyIsIlN0cmluZyIsInJlcGxhY2UiLCJfRU5DT0RFX0hUTUxfUlVMRVMiLCJfTUFUQ0hfSFRNTCIsImVuY29kZV9jaGFyIiwiYyIsImVzY2FwZUZ1bmNTdHIiLCJlc2NhcGVYTUwiLCJtYXJrdXAiLCJ1bmRlZmluZWQiLCJ0b1N0cmluZyIsIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwiY2FsbCIsInNoYWxsb3dDb3B5IiwidG8iLCJmcm9tIiwicCIsInNoYWxsb3dDb3B5RnJvbUxpc3QiLCJsaXN0IiwiaSIsImxlbmd0aCIsImNhY2hlIiwiX2RhdGEiLCJzZXQiLCJrZXkiLCJ2YWwiLCJnZXQiLCJyZXNldCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7Ozs7O0FBTUE7O0FBRUEsSUFBSUEsY0FBYyxxQkFBbEI7O0FBRUE7Ozs7Ozs7Ozs7QUFVQUMsUUFBUUMsaUJBQVIsR0FBNEIsVUFBVUMsTUFBVixFQUFrQjtBQUM1QztBQUNBLE1BQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1gsV0FBTyxFQUFQO0FBQ0Q7QUFDRCxTQUFPQyxPQUFPRCxNQUFQLEVBQWVFLE9BQWYsQ0FBdUJMLFdBQXZCLEVBQW9DLE1BQXBDLENBQVA7QUFDRCxDQU5EOztBQVFBLElBQUlNLHFCQUFxQjtBQUN2QixPQUFLLE9BRGtCO0FBRXZCLE9BQUssTUFGa0I7QUFHdkIsT0FBSyxNQUhrQjtBQUl2QixPQUFLLE9BSmtCO0FBS3ZCLE9BQUs7QUFMa0IsQ0FBekI7QUFPQSxJQUFJQyxjQUFjLFdBQWxCOztBQUVBLFNBQVNDLFdBQVQsQ0FBcUJDLENBQXJCLEVBQXdCO0FBQ3RCLFNBQU9ILG1CQUFtQkcsQ0FBbkIsS0FBeUJBLENBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVNBLElBQUlDLGdCQUNGLGlDQUNBLHNCQURBLEdBRUEscUJBRkEsR0FHQSxxQkFIQSxHQUlBLHdCQUpBLEdBS0EsdUJBTEEsR0FNQSxTQU5BLEdBT0Esa0NBUEEsR0FRQSw2QkFSQSxHQVNBLHdDQVRBLEdBVUEsTUFYRjs7QUFhQTs7Ozs7Ozs7Ozs7O0FBWUFULFFBQVFVLFNBQVIsR0FBb0IsVUFBVUMsTUFBVixFQUFrQjtBQUNwQyxTQUFPQSxVQUFVQyxTQUFWLEdBQ0gsRUFERyxHQUVIVCxPQUFPUSxNQUFQLEVBQ0dQLE9BREgsQ0FDV0UsV0FEWCxFQUN3QkMsV0FEeEIsQ0FGSjtBQUlELENBTEQ7QUFNQVAsUUFBUVUsU0FBUixDQUFrQkcsUUFBbEIsR0FBNkIsWUFBWTtBQUN2QyxTQUFPQyxTQUFTQyxTQUFULENBQW1CRixRQUFuQixDQUE0QkcsSUFBNUIsQ0FBaUMsSUFBakMsSUFBeUMsS0FBekMsR0FBaURQLGFBQXhEO0FBQ0QsQ0FGRDs7QUFJQTs7Ozs7Ozs7Ozs7QUFXQVQsUUFBUWlCLFdBQVIsR0FBc0IsVUFBVUMsRUFBVixFQUFjQyxJQUFkLEVBQW9CO0FBQ3hDQSxTQUFPQSxRQUFRLEVBQWY7QUFDQSxPQUFLLElBQUlDLENBQVQsSUFBY0QsSUFBZCxFQUFvQjtBQUNsQkQsT0FBR0UsQ0FBSCxJQUFRRCxLQUFLQyxDQUFMLENBQVI7QUFDRDtBQUNELFNBQU9GLEVBQVA7QUFDRCxDQU5EOztBQVFBOzs7Ozs7Ozs7Ozs7QUFZQWxCLFFBQVFxQixtQkFBUixHQUE4QixVQUFVSCxFQUFWLEVBQWNDLElBQWQsRUFBb0JHLElBQXBCLEVBQTBCO0FBQ3RELE9BQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxLQUFLRSxNQUF6QixFQUFpQ0QsR0FBakMsRUFBc0M7QUFDcEMsUUFBSUgsSUFBSUUsS0FBS0MsQ0FBTCxDQUFSO0FBQ0EsUUFBSSxPQUFPSixLQUFLQyxDQUFMLENBQVAsSUFBa0IsV0FBdEIsRUFBbUM7QUFDakNGLFNBQUdFLENBQUgsSUFBUUQsS0FBS0MsQ0FBTCxDQUFSO0FBQ0Q7QUFDRjtBQUNELFNBQU9GLEVBQVA7QUFDRCxDQVJEOztBQVVBOzs7Ozs7OztBQVFBbEIsUUFBUXlCLEtBQVIsR0FBZ0I7QUFDZEMsU0FBTyxFQURPO0FBRWRDLE9BQUssVUFBVUMsR0FBVixFQUFlQyxHQUFmLEVBQW9CO0FBQ3ZCLFNBQUtILEtBQUwsQ0FBV0UsR0FBWCxJQUFrQkMsR0FBbEI7QUFDRCxHQUphO0FBS2RDLE9BQUssVUFBVUYsR0FBVixFQUFlO0FBQ2xCLFdBQU8sS0FBS0YsS0FBTCxDQUFXRSxHQUFYLENBQVA7QUFDRCxHQVBhO0FBUWRHLFNBQU8sWUFBWTtBQUNqQixTQUFLTCxLQUFMLEdBQWEsRUFBYjtBQUNEO0FBVmEsQ0FBaEIiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogRUpTIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGVzXG4gKiBDb3B5cmlnaHQgMjExMiBNYXR0aGV3IEVlcm5pc3NlIChtZGVAZmxlZWdpeC5vcmcpXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4qL1xuXG4vKipcbiAqIFByaXZhdGUgdXRpbGl0eSBmdW5jdGlvbnNcbiAqIEBtb2R1bGUgdXRpbHNcbiAqIEBwcml2YXRlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnRXhwQ2hhcnMgPSAvW3xcXFxce30oKVtcXF1eJCsqPy5dL2c7XG5cbi8qKlxuICogRXNjYXBlIGNoYXJhY3RlcnMgcmVzZXJ2ZWQgaW4gcmVndWxhciBleHByZXNzaW9ucy5cbiAqXG4gKiBJZiBgc3RyaW5nYCBpcyBgdW5kZWZpbmVkYCBvciBgbnVsbGAsIHRoZSBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBJbnB1dCBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gRXNjYXBlZCBzdHJpbmdcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuZXNjYXBlUmVnRXhwQ2hhcnMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoIXN0cmluZykge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZWdFeHBDaGFycywgJ1xcXFwkJicpO1xufTtcblxudmFyIF9FTkNPREVfSFRNTF9SVUxFUyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmIzM0OycsXG4gIFwiJ1wiOiAnJiMzOTsnXG59O1xudmFyIF9NQVRDSF9IVE1MID0gL1smPD5cXCdcIl0vZztcblxuZnVuY3Rpb24gZW5jb2RlX2NoYXIoYykge1xuICByZXR1cm4gX0VOQ09ERV9IVE1MX1JVTEVTW2NdIHx8IGM7XG59XG5cbi8qKlxuICogU3RyaW5naWZpZWQgdmVyc2lvbiBvZiBjb25zdGFudHMgdXNlZCBieSB7QGxpbmsgbW9kdWxlOnV0aWxzLmVzY2FwZVhNTH0uXG4gKlxuICogSXQgaXMgdXNlZCBpbiB0aGUgcHJvY2VzcyBvZiBnZW5lcmF0aW5nIHtAbGluayBDbGllbnRGdW5jdGlvbn1zLlxuICpcbiAqIEByZWFkb25seVxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuXG52YXIgZXNjYXBlRnVuY1N0ciA9XG4gICd2YXIgX0VOQ09ERV9IVE1MX1JVTEVTID0ge1xcbidcbisgJyAgICAgIFwiJlwiOiBcIiZhbXA7XCJcXG4nXG4rICcgICAgLCBcIjxcIjogXCImbHQ7XCJcXG4nXG4rICcgICAgLCBcIj5cIjogXCImZ3Q7XCJcXG4nXG4rICcgICAgLCBcXCdcIlxcJzogXCImIzM0O1wiXFxuJ1xuKyAnICAgICwgXCJcXCdcIjogXCImIzM5O1wiXFxuJ1xuKyAnICAgIH1cXG4nXG4rICcgICwgX01BVENIX0hUTUwgPSAvWyY8PlxcJ1wiXS9nO1xcbidcbisgJ2Z1bmN0aW9uIGVuY29kZV9jaGFyKGMpIHtcXG4nXG4rICcgIHJldHVybiBfRU5DT0RFX0hUTUxfUlVMRVNbY10gfHwgYztcXG4nXG4rICd9O1xcbic7XG5cbi8qKlxuICogRXNjYXBlIGNoYXJhY3RlcnMgcmVzZXJ2ZWQgaW4gWE1MLlxuICpcbiAqIElmIGBtYXJrdXBgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAaW1wbGVtZW50cyB7RXNjYXBlQ2FsbGJhY2t9XG4gKiBAcGFyYW0ge1N0cmluZ30gbWFya3VwIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZVhNTCA9IGZ1bmN0aW9uIChtYXJrdXApIHtcbiAgcmV0dXJuIG1hcmt1cCA9PSB1bmRlZmluZWRcbiAgICA/ICcnXG4gICAgOiBTdHJpbmcobWFya3VwKVxuICAgICAgICAucmVwbGFjZShfTUFUQ0hfSFRNTCwgZW5jb2RlX2NoYXIpO1xufTtcbmV4cG9ydHMuZXNjYXBlWE1MLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcykgKyAnO1xcbicgKyBlc2NhcGVGdW5jU3RyO1xufTtcblxuLyoqXG4gKiBOYWl2ZSBjb3B5IG9mIHByb3BlcnRpZXMgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gKiBEb2VzIG5vdCByZWN1cnNlIGludG8gbm9uLXNjYWxhciBwcm9wZXJ0aWVzXG4gKiBEb2VzIG5vdCBjaGVjayB0byBzZWUgaWYgdGhlIHByb3BlcnR5IGhhcyBhIHZhbHVlIGJlZm9yZSBjb3B5aW5nXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSB0byAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBmcm9tIFNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuc2hhbGxvd0NvcHkgPSBmdW5jdGlvbiAodG8sIGZyb20pIHtcbiAgZnJvbSA9IGZyb20gfHwge307XG4gIGZvciAodmFyIHAgaW4gZnJvbSkge1xuICAgIHRvW3BdID0gZnJvbVtwXTtcbiAgfVxuICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIE5haXZlIGNvcHkgb2YgYSBsaXN0IG9mIGtleSBuYW1lcywgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gKiBPbmx5IGNvcGllcyBwcm9wZXJ0eSBpZiBpdCBpcyBhY3R1YWxseSBkZWZpbmVkXG4gKiBEb2VzIG5vdCByZWN1cnNlIGludG8gbm9uLXNjYWxhciBwcm9wZXJ0aWVzXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSB0byAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBmcm9tIFNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAge0FycmF5fSBsaXN0IExpc3Qgb2YgcHJvcGVydGllcyB0byBjb3B5XG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgRGVzdGluYXRpb24gb2JqZWN0XG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLnNoYWxsb3dDb3B5RnJvbUxpc3QgPSBmdW5jdGlvbiAodG8sIGZyb20sIGxpc3QpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHAgPSBsaXN0W2ldO1xuICAgIGlmICh0eXBlb2YgZnJvbVtwXSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdG9bcF0gPSBmcm9tW3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFNpbXBsZSBpbi1wcm9jZXNzIGNhY2hlIGltcGxlbWVudGF0aW9uLiBEb2VzIG5vdCBpbXBsZW1lbnQgbGltaXRzIG9mIGFueVxuICogc29ydC5cbiAqXG4gKiBAaW1wbGVtZW50cyBDYWNoZVxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5jYWNoZSA9IHtcbiAgX2RhdGE6IHt9LFxuICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgfSxcbiAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9kYXRhID0ge307XG4gIH1cbn07XG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\ejs\\lib\\utils.js","/..\\..\\..\\node_modules\\ejs\\lib")
},{"9FoBSB":17,"buffer":4}],12:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "raw": "ejs",
        "scope": null,
        "escapedName": "ejs",
        "name": "ejs",
        "rawSpec": "",
        "spec": "latest",
        "type": "tag"
      },
      "C:\\Users\\mgtei\\Documents\\github\\ideaninja_dev"
    ]
  ],
  "_from": "ejs@latest",
  "_id": "ejs@2.5.7",
  "_inCache": true,
  "_location": "/ejs",
  "_nodeVersion": "6.9.1",
  "_npmOperationalInternal": {
    "host": "s3://npm-registry-packages",
    "tmp": "tmp/ejs-2.5.7.tgz_1501385411193_0.3807816591579467"
  },
  "_npmUser": {
    "name": "mde",
    "email": "mde@fleegix.org"
  },
  "_npmVersion": "3.10.8",
  "_phantomChildren": {},
  "_requested": {
    "raw": "ejs",
    "scope": null,
    "escapedName": "ejs",
    "name": "ejs",
    "rawSpec": "",
    "spec": "latest",
    "type": "tag"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/ejs/-/ejs-2.5.7.tgz",
  "_shasum": "cc872c168880ae3c7189762fd5ffc00896c9518a",
  "_shrinkwrap": null,
  "_spec": "ejs",
  "_where": "C:\\Users\\mgtei\\Documents\\github\\ideaninja_dev",
  "author": {
    "name": "Matthew Eernisse",
    "email": "mde@fleegix.org",
    "url": "http://fleegix.org"
  },
  "bugs": {
    "url": "https://github.com/mde/ejs/issues"
  },
  "contributors": [
    {
      "name": "Timothy Gu",
      "email": "timothygu99@gmail.com",
      "url": "https://timothygu.github.io"
    }
  ],
  "dependencies": {},
  "description": "Embedded JavaScript templates",
  "devDependencies": {
    "browserify": "^13.0.1",
    "eslint": "^3.0.0",
    "git-directory-deploy": "^1.5.1",
    "istanbul": "~0.4.3",
    "jake": "^8.0.0",
    "jsdoc": "^3.4.0",
    "lru-cache": "^4.0.1",
    "mocha": "^3.0.2",
    "uglify-js": "^2.6.2"
  },
  "directories": {},
  "dist": {
    "shasum": "cc872c168880ae3c7189762fd5ffc00896c9518a",
    "tarball": "https://registry.npmjs.org/ejs/-/ejs-2.5.7.tgz"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "homepage": "https://github.com/mde/ejs",
  "keywords": [
    "template",
    "engine",
    "ejs"
  ],
  "license": "Apache-2.0",
  "main": "./lib/ejs.js",
  "maintainers": [
    {
      "name": "mde",
      "email": "mde@fleegix.org"
    }
  ],
  "name": "ejs",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git://github.com/mde/ejs.git"
  },
  "scripts": {
    "coverage": "istanbul cover node_modules/mocha/bin/_mocha",
    "devdoc": "jake doc[dev]",
    "doc": "jake doc",
    "lint": "eslint \"**/*.js\" Jakefile",
    "test": "jake test"
  },
  "version": "2.5.7"
}

},{}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function (value) {
  return value !== undefined && value instanceof HTMLElement && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function (value) {
  var type = Object.prototype.toString.call(value);

  return value !== undefined && (type === '[object NodeList]' || type === '[object HTMLCollection]') && 'length' in value && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function (value) {
  return typeof value === 'string' || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function (value) {
  var type = Object.prototype.toString.call(value);

  return type === '[object Function]';
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGdvb2QtbGlzdGVuZXJcXHNyY1xcaXMuanMiXSwibmFtZXMiOlsiZXhwb3J0cyIsIm5vZGUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsIkhUTUxFbGVtZW50Iiwibm9kZVR5cGUiLCJub2RlTGlzdCIsInR5cGUiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJsZW5ndGgiLCJzdHJpbmciLCJTdHJpbmciLCJmbiJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQU1BQSxRQUFRQyxJQUFSLEdBQWUsVUFBU0MsS0FBVCxFQUFnQjtBQUMzQixTQUFPQSxVQUFVQyxTQUFWLElBQ0FELGlCQUFpQkUsV0FEakIsSUFFQUYsTUFBTUcsUUFBTixLQUFtQixDQUYxQjtBQUdILENBSkQ7O0FBTUE7Ozs7OztBQU1BTCxRQUFRTSxRQUFSLEdBQW1CLFVBQVNKLEtBQVQsRUFBZ0I7QUFDL0IsTUFBSUssT0FBT0MsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCVCxLQUEvQixDQUFYOztBQUVBLFNBQU9BLFVBQVVDLFNBQVYsS0FDQ0ksU0FBUyxtQkFBVCxJQUFnQ0EsU0FBUyx5QkFEMUMsS0FFQyxZQUFZTCxLQUZiLEtBR0NBLE1BQU1VLE1BQU4sS0FBaUIsQ0FBakIsSUFBc0JaLFFBQVFDLElBQVIsQ0FBYUMsTUFBTSxDQUFOLENBQWIsQ0FIdkIsQ0FBUDtBQUlILENBUEQ7O0FBU0E7Ozs7OztBQU1BRixRQUFRYSxNQUFSLEdBQWlCLFVBQVNYLEtBQVQsRUFBZ0I7QUFDN0IsU0FBTyxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQ0FBLGlCQUFpQlksTUFEeEI7QUFFSCxDQUhEOztBQUtBOzs7Ozs7QUFNQWQsUUFBUWUsRUFBUixHQUFhLFVBQVNiLEtBQVQsRUFBZ0I7QUFDekIsTUFBSUssT0FBT0MsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCVCxLQUEvQixDQUFYOztBQUVBLFNBQU9LLFNBQVMsbUJBQWhCO0FBQ0gsQ0FKRCIsImZpbGUiOiJpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2hlY2sgaWYgYXJndW1lbnQgaXMgYSBIVE1MIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnRzLm5vZGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICYmIHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgICAgICAgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGFyZ3VtZW50IGlzIGEgbGlzdCBvZiBIVE1MIGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0cy5ub2RlTGlzdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXG4gICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAgICAgJiYgKHR5cGUgPT09ICdbb2JqZWN0IE5vZGVMaXN0XScgfHwgdHlwZSA9PT0gJ1tvYmplY3QgSFRNTENvbGxlY3Rpb25dJylcbiAgICAgICAgJiYgKCdsZW5ndGgnIGluIHZhbHVlKVxuICAgICAgICAmJiAodmFsdWUubGVuZ3RoID09PSAwIHx8IGV4cG9ydHMubm9kZSh2YWx1ZVswXSkpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhcmd1bWVudCBpcyBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydHMuc3RyaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuICAgICAgICB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYXJndW1lbnQgaXMgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydHMuZm4gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcblxuICAgIHJldHVybiB0eXBlID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcbiJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\good-listener\\src\\is.js","/..\\..\\..\\node_modules\\good-listener\\src")
},{"9FoBSB":17,"buffer":4}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    } else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    } else if (is.string(target)) {
        return listenSelector(target, type, callback);
    } else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function () {
            node.removeEventListener(type, callback);
        }
    };
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function (node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function () {
            Array.prototype.forEach.call(nodeList, function (node) {
                node.removeEventListener(type, callback);
            });
        }
    };
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGdvb2QtbGlzdGVuZXJcXHNyY1xcbGlzdGVuLmpzIl0sIm5hbWVzIjpbImlzIiwicmVxdWlyZSIsImRlbGVnYXRlIiwibGlzdGVuIiwidGFyZ2V0IiwidHlwZSIsImNhbGxiYWNrIiwiRXJyb3IiLCJzdHJpbmciLCJUeXBlRXJyb3IiLCJmbiIsIm5vZGUiLCJsaXN0ZW5Ob2RlIiwibm9kZUxpc3QiLCJsaXN0ZW5Ob2RlTGlzdCIsImxpc3RlblNlbGVjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlc3Ryb3kiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJmb3JFYWNoIiwiY2FsbCIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJib2R5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsS0FBS0MsUUFBUSxNQUFSLENBQVQ7QUFDQSxJQUFJQyxXQUFXRCxRQUFRLFVBQVIsQ0FBZjs7QUFFQTs7Ozs7Ozs7O0FBU0EsU0FBU0UsTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0JDLElBQXhCLEVBQThCQyxRQUE5QixFQUF3QztBQUNwQyxRQUFJLENBQUNGLE1BQUQsSUFBVyxDQUFDQyxJQUFaLElBQW9CLENBQUNDLFFBQXpCLEVBQW1DO0FBQy9CLGNBQU0sSUFBSUMsS0FBSixDQUFVLDRCQUFWLENBQU47QUFDSDs7QUFFRCxRQUFJLENBQUNQLEdBQUdRLE1BQUgsQ0FBVUgsSUFBVixDQUFMLEVBQXNCO0FBQ2xCLGNBQU0sSUFBSUksU0FBSixDQUFjLGtDQUFkLENBQU47QUFDSDs7QUFFRCxRQUFJLENBQUNULEdBQUdVLEVBQUgsQ0FBTUosUUFBTixDQUFMLEVBQXNCO0FBQ2xCLGNBQU0sSUFBSUcsU0FBSixDQUFjLG1DQUFkLENBQU47QUFDSDs7QUFFRCxRQUFJVCxHQUFHVyxJQUFILENBQVFQLE1BQVIsQ0FBSixFQUFxQjtBQUNqQixlQUFPUSxXQUFXUixNQUFYLEVBQW1CQyxJQUFuQixFQUF5QkMsUUFBekIsQ0FBUDtBQUNILEtBRkQsTUFHSyxJQUFJTixHQUFHYSxRQUFILENBQVlULE1BQVosQ0FBSixFQUF5QjtBQUMxQixlQUFPVSxlQUFlVixNQUFmLEVBQXVCQyxJQUF2QixFQUE2QkMsUUFBN0IsQ0FBUDtBQUNILEtBRkksTUFHQSxJQUFJTixHQUFHUSxNQUFILENBQVVKLE1BQVYsQ0FBSixFQUF1QjtBQUN4QixlQUFPVyxlQUFlWCxNQUFmLEVBQXVCQyxJQUF2QixFQUE2QkMsUUFBN0IsQ0FBUDtBQUNILEtBRkksTUFHQTtBQUNELGNBQU0sSUFBSUcsU0FBSixDQUFjLDJFQUFkLENBQU47QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7QUFTQSxTQUFTRyxVQUFULENBQW9CRCxJQUFwQixFQUEwQk4sSUFBMUIsRUFBZ0NDLFFBQWhDLEVBQTBDO0FBQ3RDSyxTQUFLSyxnQkFBTCxDQUFzQlgsSUFBdEIsRUFBNEJDLFFBQTVCOztBQUVBLFdBQU87QUFDSFcsaUJBQVMsWUFBVztBQUNoQk4saUJBQUtPLG1CQUFMLENBQXlCYixJQUF6QixFQUErQkMsUUFBL0I7QUFDSDtBQUhFLEtBQVA7QUFLSDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU1EsY0FBVCxDQUF3QkQsUUFBeEIsRUFBa0NSLElBQWxDLEVBQXdDQyxRQUF4QyxFQUFrRDtBQUM5Q2EsVUFBTUMsU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0JDLElBQXhCLENBQTZCVCxRQUE3QixFQUF1QyxVQUFTRixJQUFULEVBQWU7QUFDbERBLGFBQUtLLGdCQUFMLENBQXNCWCxJQUF0QixFQUE0QkMsUUFBNUI7QUFDSCxLQUZEOztBQUlBLFdBQU87QUFDSFcsaUJBQVMsWUFBVztBQUNoQkUsa0JBQU1DLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCQyxJQUF4QixDQUE2QlQsUUFBN0IsRUFBdUMsVUFBU0YsSUFBVCxFQUFlO0FBQ2xEQSxxQkFBS08sbUJBQUwsQ0FBeUJiLElBQXpCLEVBQStCQyxRQUEvQjtBQUNILGFBRkQ7QUFHSDtBQUxFLEtBQVA7QUFPSDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU1MsY0FBVCxDQUF3QlEsUUFBeEIsRUFBa0NsQixJQUFsQyxFQUF3Q0MsUUFBeEMsRUFBa0Q7QUFDOUMsV0FBT0osU0FBU3NCLFNBQVNDLElBQWxCLEVBQXdCRixRQUF4QixFQUFrQ2xCLElBQWxDLEVBQXdDQyxRQUF4QyxDQUFQO0FBQ0g7O0FBRURvQixPQUFPQyxPQUFQLEdBQWlCeEIsTUFBakIiLCJmaWxlIjoibGlzdGVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpO1xudmFyIGRlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcblxuLyoqXG4gKiBWYWxpZGF0ZXMgYWxsIHBhcmFtcyBhbmQgY2FsbHMgdGhlIHJpZ2h0XG4gKiBsaXN0ZW5lciBmdW5jdGlvbiBiYXNlZCBvbiBpdHMgdGFyZ2V0IHR5cGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8SFRNTEVsZW1lbnR8SFRNTENvbGxlY3Rpb258Tm9kZUxpc3R9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGxpc3Rlbih0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0YXJnZXQgJiYgIXR5cGUgJiYgIWNhbGxiYWNrKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyByZXF1aXJlZCBhcmd1bWVudHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzLnN0cmluZyh0eXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIFN0cmluZycpO1xuICAgIH1cblxuICAgIGlmICghaXMuZm4oY2FsbGJhY2spKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXJkIGFyZ3VtZW50IG11c3QgYmUgYSBGdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGlmIChpcy5ub2RlKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rlbk5vZGUodGFyZ2V0LCB0eXBlLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzLm5vZGVMaXN0KHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rlbk5vZGVMaXN0KHRhcmdldCwgdHlwZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBlbHNlIGlmIChpcy5zdHJpbmcodGFyZ2V0KSkge1xuICAgICAgICByZXR1cm4gbGlzdGVuU2VsZWN0b3IodGFyZ2V0LCB0eXBlLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgU3RyaW5nLCBIVE1MRWxlbWVudCwgSFRNTENvbGxlY3Rpb24sIG9yIE5vZGVMaXN0Jyk7XG4gICAgfVxufVxuXG4vKipcbiAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYSBIVE1MIGVsZW1lbnRcbiAqIGFuZCByZXR1cm5zIGEgcmVtb3ZlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBsaXN0ZW5Ob2RlKG5vZGUsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYSBsaXN0IG9mIEhUTUwgZWxlbWVudHNcbiAqIGFuZCByZXR1cm5zIGEgcmVtb3ZlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R8SFRNTENvbGxlY3Rpb259IG5vZGVMaXN0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuTm9kZUxpc3Qobm9kZUxpc3QsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChub2RlTGlzdCwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2spO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKG5vZGVMaXN0LCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBhIHNlbGVjdG9yXG4gKiBhbmQgcmV0dXJucyBhIHJlbW92ZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBsaXN0ZW5TZWxlY3RvcihzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZGVsZWdhdGUoZG9jdW1lbnQuYm9keSwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0ZW47XG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\good-listener\\src\\listen.js","/..\\..\\..\\node_modules\\good-listener\\src")
},{"./is":13,"9FoBSB":17,"buffer":4,"delegate":9}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGllZWU3NTRcXGluZGV4LmpzIl0sIm5hbWVzIjpbImV4cG9ydHMiLCJyZWFkIiwiYnVmZmVyIiwib2Zmc2V0IiwiaXNMRSIsIm1MZW4iLCJuQnl0ZXMiLCJlIiwibSIsImVMZW4iLCJlTWF4IiwiZUJpYXMiLCJuQml0cyIsImkiLCJkIiwicyIsIk5hTiIsIkluZmluaXR5IiwiTWF0aCIsInBvdyIsIndyaXRlIiwidmFsdWUiLCJjIiwicnQiLCJhYnMiLCJpc05hTiIsImZsb29yIiwibG9nIiwiTE4yIl0sIm1hcHBpbmdzIjoiQUFBQUEsUUFBUUMsSUFBUixHQUFlLFVBQVVDLE1BQVYsRUFBa0JDLE1BQWxCLEVBQTBCQyxJQUExQixFQUFnQ0MsSUFBaEMsRUFBc0NDLE1BQXRDLEVBQThDO0FBQzNELE1BQUlDLENBQUosRUFBT0MsQ0FBUDtBQUNBLE1BQUlDLE9BQU9ILFNBQVMsQ0FBVCxHQUFhRCxJQUFiLEdBQW9CLENBQS9CO0FBQ0EsTUFBSUssT0FBTyxDQUFDLEtBQUtELElBQU4sSUFBYyxDQUF6QjtBQUNBLE1BQUlFLFFBQVFELFFBQVEsQ0FBcEI7QUFDQSxNQUFJRSxRQUFRLENBQUMsQ0FBYjtBQUNBLE1BQUlDLElBQUlULE9BQVFFLFNBQVMsQ0FBakIsR0FBc0IsQ0FBOUI7QUFDQSxNQUFJUSxJQUFJVixPQUFPLENBQUMsQ0FBUixHQUFZLENBQXBCO0FBQ0EsTUFBSVcsSUFBSWIsT0FBT0MsU0FBU1UsQ0FBaEIsQ0FBUjs7QUFFQUEsT0FBS0MsQ0FBTDs7QUFFQVAsTUFBSVEsSUFBSyxDQUFDLEtBQU0sQ0FBQ0gsS0FBUixJQUFrQixDQUEzQjtBQUNBRyxRQUFPLENBQUNILEtBQVI7QUFDQUEsV0FBU0gsSUFBVDtBQUNBLFNBQU9HLFFBQVEsQ0FBZixFQUFrQkwsSUFBSUEsSUFBSSxHQUFKLEdBQVVMLE9BQU9DLFNBQVNVLENBQWhC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SUksS0FBSixJQUFhRCxJQUFqQixFQUF1QjtBQUNyQkYsVUFBSSxDQUFKO0FBQ0FELFVBQUlHLElBQUo7QUFDRCxLQUhELE1BR08sSUFBSUgsSUFBSUksS0FBSixJQUFhLENBQWpCLEVBQW9CO0FBQ3pCSCxVQUFJLENBQUNhLFFBQVFDLENBQVIsR0FBWSxDQUFiLElBQWtCSixLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZZCxJQUFaLENBQXRCO0FBQ0FFLFVBQUlBLElBQUlJLEtBQVI7QUFDRCxLQUhNLE1BR0E7QUFDTEgsVUFBSWEsUUFBUUgsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWVIsUUFBUSxDQUFwQixDQUFSLEdBQWlDTyxLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZZCxJQUFaLENBQXJDO0FBQ0FFLFVBQUksQ0FBSjtBQUNEO0FBQ0Y7O0FBRUQsU0FBT0YsUUFBUSxDQUFmLEVBQWtCSCxPQUFPQyxTQUFTVSxDQUFoQixJQUFxQkwsSUFBSSxJQUF6QixFQUErQkssS0FBS0MsQ0FBcEMsRUFBdUNOLEtBQUssR0FBNUMsRUFBaURILFFBQVEsQ0FBM0UsRUFBOEUsQ0FBRTs7QUFFaEZFLE1BQUtBLEtBQUtGLElBQU4sR0FBY0csQ0FBbEI7QUFDQUMsVUFBUUosSUFBUjtBQUNBLFNBQU9JLE9BQU8sQ0FBZCxFQUFpQlAsT0FBT0MsU0FBU1UsQ0FBaEIsSUFBcUJOLElBQUksSUFBekIsRUFBK0JNLEtBQUtDLENBQXBDLEVBQXVDUCxLQUFLLEdBQTVDLEVBQWlERSxRQUFRLENBQTFFLEVBQTZFLENBQUU7O0FBRS9FUCxTQUFPQyxTQUFTVSxDQUFULEdBQWFDLENBQXBCLEtBQTBCQyxJQUFJLEdBQTlCO0FBQ0QsQ0FsREQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\ieee754\\index.js","/..\\..\\..\\node_modules\\ieee754")
},{"9FoBSB":17,"buffer":4}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function (filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function () {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function (path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function (path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};

// path.relative(from, to)
// posix version
exports.relative = function (from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};

exports.basename = function (path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  return splitPath(path)[3];
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXHBhdGgtYnJvd3NlcmlmeVxcaW5kZXguanMiXSwibmFtZXMiOlsibm9ybWFsaXplQXJyYXkiLCJwYXJ0cyIsImFsbG93QWJvdmVSb290IiwidXAiLCJpIiwibGVuZ3RoIiwibGFzdCIsInNwbGljZSIsInVuc2hpZnQiLCJzcGxpdFBhdGhSZSIsInNwbGl0UGF0aCIsImZpbGVuYW1lIiwiZXhlYyIsInNsaWNlIiwiZXhwb3J0cyIsInJlc29sdmUiLCJyZXNvbHZlZFBhdGgiLCJyZXNvbHZlZEFic29sdXRlIiwiYXJndW1lbnRzIiwicGF0aCIsInByb2Nlc3MiLCJjd2QiLCJUeXBlRXJyb3IiLCJjaGFyQXQiLCJmaWx0ZXIiLCJzcGxpdCIsInAiLCJqb2luIiwibm9ybWFsaXplIiwiaXNBYnNvbHV0ZSIsInRyYWlsaW5nU2xhc2giLCJzdWJzdHIiLCJwYXRocyIsIkFycmF5IiwicHJvdG90eXBlIiwiY2FsbCIsImluZGV4IiwicmVsYXRpdmUiLCJmcm9tIiwidG8iLCJ0cmltIiwiYXJyIiwic3RhcnQiLCJlbmQiLCJmcm9tUGFydHMiLCJ0b1BhcnRzIiwiTWF0aCIsIm1pbiIsInNhbWVQYXJ0c0xlbmd0aCIsIm91dHB1dFBhcnRzIiwicHVzaCIsImNvbmNhdCIsInNlcCIsImRlbGltaXRlciIsImRpcm5hbWUiLCJyZXN1bHQiLCJyb290IiwiZGlyIiwiYmFzZW5hbWUiLCJleHQiLCJmIiwiZXh0bmFtZSIsInhzIiwicmVzIiwic3RyIiwibGVuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU0EsY0FBVCxDQUF3QkMsS0FBeEIsRUFB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QUNmLE1BQUlHLE1BQU0sRUFBVjtBQUNBLE9BQUssSUFBSTNELElBQUksQ0FBYixFQUFnQkEsSUFBSTBELEdBQUd6RCxNQUF2QixFQUErQkQsR0FBL0IsRUFBb0M7QUFDaEMsUUFBSXdELEVBQUVFLEdBQUcxRCxDQUFILENBQUYsRUFBU0EsQ0FBVCxFQUFZMEQsRUFBWixDQUFKLEVBQXFCQyxJQUFJYixJQUFKLENBQVNZLEdBQUcxRCxDQUFILENBQVQ7QUFDeEI7QUFDRCxTQUFPMkQsR0FBUDtBQUNIOztBQUVEO0FBQ0EsSUFBSWhDLFNBQVMsS0FBS0EsTUFBTCxDQUFZLENBQUMsQ0FBYixNQUFvQixHQUFwQixHQUNQLFVBQVVpQyxHQUFWLEVBQWV0QixLQUFmLEVBQXNCdUIsR0FBdEIsRUFBMkI7QUFBRSxTQUFPRCxJQUFJakMsTUFBSixDQUFXVyxLQUFYLEVBQWtCdUIsR0FBbEIsQ0FBUDtBQUErQixDQURyRCxHQUVQLFVBQVVELEdBQVYsRUFBZXRCLEtBQWYsRUFBc0J1QixHQUF0QixFQUEyQjtBQUN6QixNQUFJdkIsUUFBUSxDQUFaLEVBQWVBLFFBQVFzQixJQUFJM0QsTUFBSixHQUFhcUMsS0FBckI7QUFDZixTQUFPc0IsSUFBSWpDLE1BQUosQ0FBV1csS0FBWCxFQUFrQnVCLEdBQWxCLENBQVA7QUFDSCxDQUxMIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\path-browserify\\index.js","/..\\..\\..\\node_modules\\path-browserify")
},{"9FoBSB":17,"buffer":4}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = function () {
    var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
    var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;

    if (canSetImmediate) {
        return function (f) {
            return window.setImmediate(f);
        };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
}();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXHByb2Nlc3NcXGJyb3dzZXIuanMiXSwibmFtZXMiOlsicHJvY2VzcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJuZXh0VGljayIsImNhblNldEltbWVkaWF0ZSIsIndpbmRvdyIsInNldEltbWVkaWF0ZSIsImNhblBvc3QiLCJwb3N0TWVzc2FnZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJmIiwicXVldWUiLCJldiIsInNvdXJjZSIsImRhdGEiLCJzdG9wUHJvcGFnYXRpb24iLCJsZW5ndGgiLCJmbiIsInNoaWZ0IiwicHVzaCIsInNldFRpbWVvdXQiLCJ0aXRsZSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2Iiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwiYmluZGluZyIsIm5hbWUiLCJFcnJvciIsImN3ZCIsImNoZGlyIiwiZGlyIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJQSxVQUFVQyxPQUFPQyxPQUFQLEdBQWlCLEVBQS9COztBQUVBRixRQUFRRyxRQUFSLEdBQW9CLFlBQVk7QUFDNUIsUUFBSUMsa0JBQWtCLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFDbkJBLE9BQU9DLFlBRFY7QUFFQSxRQUFJQyxVQUFVLE9BQU9GLE1BQVAsS0FBa0IsV0FBbEIsSUFDWEEsT0FBT0csV0FESSxJQUNXSCxPQUFPSSxnQkFEaEM7O0FBSUEsUUFBSUwsZUFBSixFQUFxQjtBQUNqQixlQUFPLFVBQVVNLENBQVYsRUFBYTtBQUFFLG1CQUFPTCxPQUFPQyxZQUFQLENBQW9CSSxDQUFwQixDQUFQO0FBQStCLFNBQXJEO0FBQ0g7O0FBRUQsUUFBSUgsT0FBSixFQUFhO0FBQ1QsWUFBSUksUUFBUSxFQUFaO0FBQ0FOLGVBQU9JLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQVVHLEVBQVYsRUFBYztBQUM3QyxnQkFBSUMsU0FBU0QsR0FBR0MsTUFBaEI7QUFDQSxnQkFBSSxDQUFDQSxXQUFXUixNQUFYLElBQXFCUSxXQUFXLElBQWpDLEtBQTBDRCxHQUFHRSxJQUFILEtBQVksY0FBMUQsRUFBMEU7QUFDdEVGLG1CQUFHRyxlQUFIO0FBQ0Esb0JBQUlKLE1BQU1LLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNsQix3QkFBSUMsS0FBS04sTUFBTU8sS0FBTixFQUFUO0FBQ0FEO0FBQ0g7QUFDSjtBQUNKLFNBVEQsRUFTRyxJQVRIOztBQVdBLGVBQU8sU0FBU2QsUUFBVCxDQUFrQmMsRUFBbEIsRUFBc0I7QUFDekJOLGtCQUFNUSxJQUFOLENBQVdGLEVBQVg7QUFDQVosbUJBQU9HLFdBQVAsQ0FBbUIsY0FBbkIsRUFBbUMsR0FBbkM7QUFDSCxTQUhEO0FBSUg7O0FBRUQsV0FBTyxTQUFTTCxRQUFULENBQWtCYyxFQUFsQixFQUFzQjtBQUN6QkcsbUJBQVdILEVBQVgsRUFBZSxDQUFmO0FBQ0gsS0FGRDtBQUdILENBakNrQixFQUFuQjs7QUFtQ0FqQixRQUFRcUIsS0FBUixHQUFnQixTQUFoQjtBQUNBckIsUUFBUXNCLE9BQVIsR0FBa0IsSUFBbEI7QUFDQXRCLFFBQVF1QixHQUFSLEdBQWMsRUFBZDtBQUNBdkIsUUFBUXdCLElBQVIsR0FBZSxFQUFmOztBQUVBLFNBQVNDLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEJ6QixRQUFRMEIsRUFBUixHQUFhRCxJQUFiO0FBQ0F6QixRQUFRMkIsV0FBUixHQUFzQkYsSUFBdEI7QUFDQXpCLFFBQVE0QixJQUFSLEdBQWVILElBQWY7QUFDQXpCLFFBQVE2QixHQUFSLEdBQWNKLElBQWQ7QUFDQXpCLFFBQVE4QixjQUFSLEdBQXlCTCxJQUF6QjtBQUNBekIsUUFBUStCLGtCQUFSLEdBQTZCTixJQUE3QjtBQUNBekIsUUFBUWdDLElBQVIsR0FBZVAsSUFBZjs7QUFFQXpCLFFBQVFpQyxPQUFSLEdBQWtCLFVBQVVDLElBQVYsRUFBZ0I7QUFDOUIsVUFBTSxJQUFJQyxLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNILENBRkQ7O0FBSUE7QUFDQW5DLFFBQVFvQyxHQUFSLEdBQWMsWUFBWTtBQUFFLFdBQU8sR0FBUDtBQUFZLENBQXhDO0FBQ0FwQyxRQUFRcUMsS0FBUixHQUFnQixVQUFVQyxHQUFWLEVBQWU7QUFDM0IsVUFBTSxJQUFJSCxLQUFKLENBQVUsZ0NBQVYsQ0FBTjtBQUNILENBRkQiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIl19
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\process\\browser.js","/..\\..\\..\\node_modules\\process")
},{"9FoBSB":17,"buffer":4}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    } else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXHNlbGVjdFxcc3JjXFxzZWxlY3QuanMiXSwibmFtZXMiOlsic2VsZWN0IiwiZWxlbWVudCIsInNlbGVjdGVkVGV4dCIsIm5vZGVOYW1lIiwiZm9jdXMiLCJ2YWx1ZSIsImlzUmVhZE9ubHkiLCJoYXNBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImxlbmd0aCIsInJlbW92ZUF0dHJpYnV0ZSIsInNlbGVjdGlvbiIsIndpbmRvdyIsImdldFNlbGVjdGlvbiIsInJhbmdlIiwiZG9jdW1lbnQiLCJjcmVhdGVSYW5nZSIsInNlbGVjdE5vZGVDb250ZW50cyIsInJlbW92ZUFsbFJhbmdlcyIsImFkZFJhbmdlIiwidG9TdHJpbmciLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTQSxNQUFULENBQWdCQyxPQUFoQixFQUF5QjtBQUNyQixRQUFJQyxZQUFKOztBQUVBLFFBQUlELFFBQVFFLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDL0JGLGdCQUFRRyxLQUFSOztBQUVBRix1QkFBZUQsUUFBUUksS0FBdkI7QUFDSCxLQUpELE1BS0ssSUFBSUosUUFBUUUsUUFBUixLQUFxQixPQUFyQixJQUFnQ0YsUUFBUUUsUUFBUixLQUFxQixVQUF6RCxFQUFxRTtBQUN0RSxZQUFJRyxhQUFhTCxRQUFRTSxZQUFSLENBQXFCLFVBQXJCLENBQWpCOztBQUVBLFlBQUksQ0FBQ0QsVUFBTCxFQUFpQjtBQUNiTCxvQkFBUU8sWUFBUixDQUFxQixVQUFyQixFQUFpQyxFQUFqQztBQUNIOztBQUVEUCxnQkFBUUQsTUFBUjtBQUNBQyxnQkFBUVEsaUJBQVIsQ0FBMEIsQ0FBMUIsRUFBNkJSLFFBQVFJLEtBQVIsQ0FBY0ssTUFBM0M7O0FBRUEsWUFBSSxDQUFDSixVQUFMLEVBQWlCO0FBQ2JMLG9CQUFRVSxlQUFSLENBQXdCLFVBQXhCO0FBQ0g7O0FBRURULHVCQUFlRCxRQUFRSSxLQUF2QjtBQUNILEtBZkksTUFnQkE7QUFDRCxZQUFJSixRQUFRTSxZQUFSLENBQXFCLGlCQUFyQixDQUFKLEVBQTZDO0FBQ3pDTixvQkFBUUcsS0FBUjtBQUNIOztBQUVELFlBQUlRLFlBQVlDLE9BQU9DLFlBQVAsRUFBaEI7QUFDQSxZQUFJQyxRQUFRQyxTQUFTQyxXQUFULEVBQVo7O0FBRUFGLGNBQU1HLGtCQUFOLENBQXlCakIsT0FBekI7QUFDQVcsa0JBQVVPLGVBQVY7QUFDQVAsa0JBQVVRLFFBQVYsQ0FBbUJMLEtBQW5COztBQUVBYix1QkFBZVUsVUFBVVMsUUFBVixFQUFmO0FBQ0g7O0FBRUQsV0FBT25CLFlBQVA7QUFDSDs7QUFFRG9CLE9BQU9DLE9BQVAsR0FBaUJ2QixNQUFqQiIsImZpbGUiOiJzZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzZWxlY3QoZWxlbWVudCkge1xuICAgIHZhciBzZWxlY3RlZFRleHQ7XG5cbiAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IGVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcgfHwgZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgICB2YXIgaXNSZWFkT25seSA9IGVsZW1lbnQuaGFzQXR0cmlidXRlKCdyZWFkb25seScpO1xuXG4gICAgICAgIGlmICghaXNSZWFkT25seSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zZWxlY3QoKTtcbiAgICAgICAgZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSgwLCBlbGVtZW50LnZhbHVlLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKCFpc1JlYWRPbmx5KSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncmVhZG9ubHknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IGVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpKSB7XG4gICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuXG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbGVtZW50KTtcbiAgICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICBzZWxlY3Rpb24uYWRkUmFuZ2UocmFuZ2UpO1xuXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbi50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3RlZFRleHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2VsZWN0O1xuIl19
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\select\\src\\select.js","/..\\..\\..\\node_modules\\select\\src")
},{"9FoBSB":17,"buffer":4}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function E() {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener() {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    liveEvents.length ? e[name] = liveEvents : delete e[name];

    return this;
  }
};

module.exports = E;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXHRpbnktZW1pdHRlclxcaW5kZXguanMiXSwibmFtZXMiOlsiRSIsInByb3RvdHlwZSIsIm9uIiwibmFtZSIsImNhbGxiYWNrIiwiY3R4IiwiZSIsInB1c2giLCJmbiIsIm9uY2UiLCJzZWxmIiwibGlzdGVuZXIiLCJvZmYiLCJhcHBseSIsImFyZ3VtZW50cyIsIl8iLCJlbWl0IiwiZGF0YSIsInNsaWNlIiwiY2FsbCIsImV2dEFyciIsImkiLCJsZW4iLCJsZW5ndGgiLCJldnRzIiwibGl2ZUV2ZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLENBQVQsR0FBYztBQUNaO0FBQ0E7QUFDRDs7QUFFREEsRUFBRUMsU0FBRixHQUFjO0FBQ1pDLE1BQUksVUFBVUMsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLEdBQTFCLEVBQStCO0FBQ2pDLFFBQUlDLElBQUksS0FBS0EsQ0FBTCxLQUFXLEtBQUtBLENBQUwsR0FBUyxFQUFwQixDQUFSOztBQUVBLEtBQUNBLEVBQUVILElBQUYsTUFBWUcsRUFBRUgsSUFBRixJQUFVLEVBQXRCLENBQUQsRUFBNEJJLElBQTVCLENBQWlDO0FBQy9CQyxVQUFJSixRQUQyQjtBQUUvQkMsV0FBS0E7QUFGMEIsS0FBakM7O0FBS0EsV0FBTyxJQUFQO0FBQ0QsR0FWVzs7QUFZWkksUUFBTSxVQUFVTixJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsR0FBMUIsRUFBK0I7QUFDbkMsUUFBSUssT0FBTyxJQUFYO0FBQ0EsYUFBU0MsUUFBVCxHQUFxQjtBQUNuQkQsV0FBS0UsR0FBTCxDQUFTVCxJQUFULEVBQWVRLFFBQWY7QUFDQVAsZUFBU1MsS0FBVCxDQUFlUixHQUFmLEVBQW9CUyxTQUFwQjtBQUNEOztBQUVESCxhQUFTSSxDQUFULEdBQWFYLFFBQWI7QUFDQSxXQUFPLEtBQUtGLEVBQUwsQ0FBUUMsSUFBUixFQUFjUSxRQUFkLEVBQXdCTixHQUF4QixDQUFQO0FBQ0QsR0FyQlc7O0FBdUJaVyxRQUFNLFVBQVViLElBQVYsRUFBZ0I7QUFDcEIsUUFBSWMsT0FBTyxHQUFHQyxLQUFILENBQVNDLElBQVQsQ0FBY0wsU0FBZCxFQUF5QixDQUF6QixDQUFYO0FBQ0EsUUFBSU0sU0FBUyxDQUFDLENBQUMsS0FBS2QsQ0FBTCxLQUFXLEtBQUtBLENBQUwsR0FBUyxFQUFwQixDQUFELEVBQTBCSCxJQUExQixLQUFtQyxFQUFwQyxFQUF3Q2UsS0FBeEMsRUFBYjtBQUNBLFFBQUlHLElBQUksQ0FBUjtBQUNBLFFBQUlDLE1BQU1GLE9BQU9HLE1BQWpCOztBQUVBLFNBQUtGLENBQUwsRUFBUUEsSUFBSUMsR0FBWixFQUFpQkQsR0FBakIsRUFBc0I7QUFDcEJELGFBQU9DLENBQVAsRUFBVWIsRUFBVixDQUFhSyxLQUFiLENBQW1CTyxPQUFPQyxDQUFQLEVBQVVoQixHQUE3QixFQUFrQ1ksSUFBbEM7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRCxHQWxDVzs7QUFvQ1pMLE9BQUssVUFBVVQsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEI7QUFDN0IsUUFBSUUsSUFBSSxLQUFLQSxDQUFMLEtBQVcsS0FBS0EsQ0FBTCxHQUFTLEVBQXBCLENBQVI7QUFDQSxRQUFJa0IsT0FBT2xCLEVBQUVILElBQUYsQ0FBWDtBQUNBLFFBQUlzQixhQUFhLEVBQWpCOztBQUVBLFFBQUlELFFBQVFwQixRQUFaLEVBQXNCO0FBQ3BCLFdBQUssSUFBSWlCLElBQUksQ0FBUixFQUFXQyxNQUFNRSxLQUFLRCxNQUEzQixFQUFtQ0YsSUFBSUMsR0FBdkMsRUFBNENELEdBQTVDLEVBQWlEO0FBQy9DLFlBQUlHLEtBQUtILENBQUwsRUFBUWIsRUFBUixLQUFlSixRQUFmLElBQTJCb0IsS0FBS0gsQ0FBTCxFQUFRYixFQUFSLENBQVdPLENBQVgsS0FBaUJYLFFBQWhELEVBQ0VxQixXQUFXbEIsSUFBWCxDQUFnQmlCLEtBQUtILENBQUwsQ0FBaEI7QUFDSDtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7QUFFQ0ksZUFBV0YsTUFBWixHQUNJakIsRUFBRUgsSUFBRixJQUFVc0IsVUFEZCxHQUVJLE9BQU9uQixFQUFFSCxJQUFGLENBRlg7O0FBSUEsV0FBTyxJQUFQO0FBQ0Q7QUF6RFcsQ0FBZDs7QUE0REF1QixPQUFPQyxPQUFQLEdBQWlCM0IsQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbiJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\tiny-emitter\\index.js","/..\\..\\..\\node_modules\\tiny-emitter")
},{"9FoBSB":17,"buffer":4}]},{},[1])