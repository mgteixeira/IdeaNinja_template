(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFydGljbGVfd3JpdGVyLmpzIl0sIm5hbWVzIjpbImNvdW50YWJsZSIsInJlcXVpcmUiLCJDb3VudGFibGUiLCJDbGlwYm9hcmQiLCJFanMiLCJpbnB1dHMiLCJpbWFnZXMiLCJrZXl3b3JkcyIsImZpbGVzIiwicCIsInMiLCJyZWdleCIsImkiLCIkIiwicmVhZHlMb2NhbFN0b3JhZ2UiLCJpbml0RmlsZXMiLCJjbGlwIiwib24iLCJlIiwiYnRuVGV4dCIsInRyaWdnZXIiLCJpbm5lckhUTUwiLCJzZXRUaW1lb3V0IiwiY2xlYXJTZWxlY3Rpb24iLCJmYWxsYmFja01lc3NhZ2UiLCJhY3Rpb24iLCJhY3Rpb25Nc2ciLCJhY3Rpb25LZXkiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiY2xpY2siLCJsb2NhbFN0b3JhZ2UiLCJsZW5ndGgiLCJ3aW5kb3ciLCJjb25maXJtIiwiY2xlYXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm1vdXNlb3ZlciIsImh0bWwiLCJlYWNoIiwia2V5IiwidmFsdWUiLCJhcHBlbmQiLCJ3b3JkcyIsImpvaW4iLCJtb3VzZVAiLCJtb3VzZVMiLCJleGVjIiwiYWZ0ZXIiLCJzcmMiLCJhbHQiLCJjcmVhdGVkIiwiaWQiLCJhIiwic3Vic3RyaW5nIiwidG9VcHBlckNhc2UiLCJ0ZXh0IiwiZm9jdXNvdXQiLCJ2YWwiLCJpbmRleCIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsImNvdW50S2V5d29yZHMiLCJ2YWxfaW5kZXgiLCJ2YWxfdmFsdWUiLCJ0cmltIiwic3BsaXQiLCJjb3VudCIsImt3X2tleSIsImt3X3ZhbHVlIiwia19ub3ciLCJjb3VudFdvcmRzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY291bnRlciIsIm5vdyIsIm1heCIsImNvdW50QWxsV29yZHMiLCJrd29yZHMiLCJnZXQiLCJkYXRhIiwiaW5pdFBhZ2UiLCJzZXRJbnB1dHMiLCJzZXRMb2NhbFN0b3JhZ2UiLCJlYWNoUCIsImVhY2hTIiwiY3JlYXRlUGFyYWdyYXBoIiwiY3JlYXRlU2VudGVuY2UiLCJ0ZW1wIiwibGFzdF9wIiwiaW5wIiwiYWxlcnQiLCJiZWZvcmUiLCJlanMiLCJyZW5kZXIiLCJsYXN0X3MiLCJnZXRJdGVtIiwiZ2V0TG9jYWxTdG9yYWdlIiwib2JqIiwibW90aGVyIiwic2V0SXRlbSIsInR5cGUiLCJrZXlfbnIiLCJrZXlfbmFtZSIsImtleV9hcnJheSIsIk51bWJlciJdLCJtYXBwaW5ncyI6IjtBQUNBOztBQUVBLElBQUlBLFlBQVlDLFFBQVEsV0FBUixDQUFoQixDLENBQXNDO0FBQ3RDLElBQUlDLFlBQVlGLFNBQWhCO0FBQ0EsSUFBSUcsWUFBWUYsUUFBUSxXQUFSLENBQWhCO0FBQ0EsSUFBSUcsTUFBTUgsUUFBUSxLQUFSLENBQVY7QUFDQTs7QUFFQTtBQUNBLElBQUlJLFNBQVM7QUFDWCxrQkFBZ0IsRUFBRSxPQUFRLENBQVYsRUFBYSxPQUFRLENBQXJCLEVBQXdCLFNBQVUsQ0FBbEMsRUFBcUMsU0FBVSxFQUEvQyxFQURMO0FBRVgsV0FBUyxFQUFFLE9BQVEsRUFBVixFQUFjLE9BQVEsQ0FBdEIsRUFBeUIsU0FBVSxDQUFuQyxFQUFzQyxTQUFVLEVBQWhELEVBRkU7O0FBSVgsV0FBUyxFQUFFLE9BQVEsQ0FBVixFQUFhLE9BQVEsQ0FBckIsRUFBd0IsU0FBVSxDQUFsQyxFQUFxQyxTQUFVLEVBQS9DLEVBSkU7QUFLWCxZQUFVLEVBQUUsT0FBUSxFQUFWLEVBQWMsT0FBUSxDQUF0QixFQUF5QixTQUFVLENBQW5DLEVBQXNDLFNBQVUsRUFBaEQsRUFMQztBQU1YLFlBQVUsRUFBRSxPQUFRLEVBQVYsRUFBYyxPQUFRLENBQXRCLEVBQXlCLFNBQVUsQ0FBbkMsRUFBc0MsU0FBVSxFQUFoRCxFQU5DO0FBT1gsWUFBVSxFQUFFLE9BQVEsRUFBVixFQUFjLE9BQVEsQ0FBdEIsRUFBeUIsU0FBVSxDQUFuQyxFQUFzQyxTQUFVLEVBQWhEO0FBUEMsQ0FBYjs7QUFVQTtBQUNBLElBQUlDLFNBQVMsRUFBYjs7QUFFQTtBQUNBLElB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R0FBakIsQ0FBWDtBQUNELEdBRkQ7QUFHQWpDLElBQUU0QixJQUFGLENBQU9uQyxNQUFQLEVBQWUsVUFBU29DLEdBQVQsRUFBY0MsS0FBZCxFQUFvQjtBQUNqQzlCLE1BQUU2QixHQUFGLEVBQU9rQixHQUFQLENBQVdqQixNQUFNUSxHQUFqQjtBQUNBdEMsTUFBRTZCLE1BQU0sTUFBUixFQUFnQmtCLEdBQWhCLENBQW9CakIsTUFBTVMsR0FBMUI7QUFDRCxHQUhEO0FBSUF2QyxJQUFFNEIsSUFBRixDQUFPbEMsUUFBUCxFQUFpQixVQUFTbUMsR0FBVCxFQUFjQyxLQUFkLEVBQW9CO0FBQ25DOUIsTUFBRTZCLEdBQUYsRUFBT2tCLEdBQVAsQ0FBV2pCLEtBQVg7QUFDRCxHQUZEO0FBR0QiLCJmaWxlIjoiYXJ0aWNsZV93cml0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLy8gIEFydGljbGUgV3JpdGVyIFRvb2xcclxuXHJcbnZhciBjb3VudGFibGUgPSByZXF1aXJlKCdjb3VudGFibGUnKTsgLy9sb29waW5nIHdvcmRjb3VudCAoc2VlIGh0dHA6Ly9zYWNoYS5tZS9Db3VudGFibGUvKVxyXG52YXIgQ291bnRhYmxlID0gY291bnRhYmxlXHJcbnZhciBDbGlwYm9hcmQgPSByZXF1aXJlKCdjbGlwYm9hcmQnKTtcclxudmFyIEVqcyA9IHJlcXVpcmUoJ2VqcycpO1xyXG4vKiAtLS0gVkFSSUFCTEVTIC0tLSAqL1xyXG5cclxuLy8gSW5wdXRzIC0gaWQgOiB7IHdvcmRzIG1heGltdW0gOiBpbnQsIHdvcmRzIG5vdyA6IGludCwga2V5d29yZHMgbm93IDogaW50LCB3b3JkcyA6IGFycmF5IH1cclxudmFyIGlucHV0cyA9IHtcclxuICBcIiNhcnRpY2xlTmFtZVwiOiB7IFwibWF4XCIgOiA4LCBcIm5vd1wiIDogMCwgXCJrX25vd1wiIDogMCwgXCJ3b3Jkc1wiIDogW10gfSxcclxuICBcIiNsZWFkXCI6IHsgXCJtYXhcIiA6IDMwLCBcIm5vd1wiIDogMCwgXCJrX25vd1wiIDogMCwgXCJ3b3Jkc1wiIDogW10gfSxcclxuXHJcbiAgXCIjcDEtaFwiOiB7IFwibWF4XCIgOiA4LCBcIm5vd1wiIDogMCwgXCJrX25vd1wiIDogMCwgXCJ3b3Jkc1wiIDogW10gfSxcclxuICBcIiNwMS1zMVwiOiB7IFwibWF4XCIgOiAyMCwgXCJub3dcIiA6IDAsIFwia19ub3dcIiA6IDAsIFwid29yZHNcIiA6IFtdIH0sXHJcbiAgXCIjcDEtczJcIjogeyBcIm1heFwiIDogMjAsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9LFxyXG4gIFwiI3AxLXMzXCI6IHsgXCJtYXhcIiA6IDIwLCBcIm5vd1wiIDogMCwgXCJrX25vd1wiIDogMCwgXCJ3b3Jkc1wiIDogW10gfVxyXG59O1xyXG5cclxuLy8gSW1hZ2VzIC0gaWQgOiB7IHNyYyA6IHN0cmluZywgYWx0IDogc3RyaW5nIH1cclxudmFyIGltYWdlcyA9IHt9O1xyXG5cclxuLy8gS2V5d29yZHMgLSBpZCA6IHZhbHVlXHJcbnZhciBrZXl3b3JkcyA9IHtcclxuICAgIFwiI3drMVwiIDogXCJcIixcclxuICAgIFwiI3drMlwiIDogXCJcIixcclxuICAgIFwiI3drM1wiIDogXCJcIixcclxuICAgIFwiI3drNFwiIDogXCJcIixcclxuICAgIFwiI3drNVwiIDogXCJcIixcclxuICAgIFwiI2FrMVwiIDogXCJcIixcclxuICAgIFwiI2FrMlwiIDogXCJcIixcclxuICAgIFwiI2FrM1wiIDogXCJcIixcclxuICAgIFwiI2FrNFwiIDogXCJcIixcclxuICAgIFwiI2FrNVwiIDogXCJcIlxyXG59O1xyXG5cclxuLy8gRmlsZXNcclxudmFyIGZpbGVzID0ge1xyXG4gIHAgOiBcInBhcnRzL2F3dC9wYXJhZ3JhcGguZWpzXCIsXHJcbiAgcyA6IFwicGFydHMvYXd0L3NlbnRlbmNlLmVqc1wiXHJcbn07XHJcblxyXG4vLyBSZWdleFxyXG52YXIgcmVnZXggPSB7XHJcbiAgcDogLyNwKFxcZCktaC9pLFxyXG4gIHM6IC8jcChcXGQpLXMoXFxkKS9pLFxyXG4gIGk6IC8jcChcXGQpLWltZy9pXHJcbn07XHJcbiBcclxuLyogLS0tIEVWRU5UUyAtLS0gKi9cclxuLyogRXZlbnRzIHRoYXQgb2NjdXIgbWFueSB0aW1lcyBpbiBjb2RlIGFuZC9vciB1c2VzIHRoZSBzYW1lIHZhcmlhYmxlLlxyXG4gKiBPdGhlciBzaW5nbGUgZXZlbnRzIGNhbiBiZSBwbGFjZWQgd2l0aCBzeXN0ZW1zIGNvZGUuXHJcbiAqL1xyXG5cclxuLy8gUmVhZHlcclxuJChmdW5jdGlvbigpe1xyXG4gIHJlYWR5TG9jYWxTdG9yYWdlKCk7XHJcbiAgaW5pdEZpbGVzKCk7XHJcbn0pO1xyXG5cclxuXHJcbi8qIC0tLSBTWVNURU1TIC0tLSAqL1xyXG5cclxuLy8gQ2xpcGJvYXJkIFN5c3RlbVxyXG5cclxudmFyIGNsaXAgPSBuZXcgQ2xpcGJvYXJkKCcuY2xpcCcpO1xyXG5cclxuY2xpcC5vbignc3VjY2VzcycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBidG5UZXh0ID0gZS50cmlnZ2VyLmlubmVySFRNTDtcclxuICAgIGUudHJpZ2dlci5pbm5lckhUTUwgPSAnQ29waWVkISc7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIGUuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgZS50cmlnZ2VyLmlubmVySFRNTCA9IGJ0blRleHQ7XHJcbiAgICB9LCAzMDAwKTsgLy8gMzAwMCBtaWxpc2Vjb25kcyBhcmUgMyBzZWNvbmRzXHJcbn0pO1xyXG5cclxuY2xpcC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnRyaWdnZXIuaW5uZXJIVE1MID0gZmFsbGJhY2tNZXNzYWdlKGUuYWN0aW9uKTtcclxuICAgIGUuY2xlYXJTZWxlY3Rpb24oKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBmYWxsYmFja01lc3NhZ2UoYWN0aW9uKSB7XHJcbiAgICB2YXIgYWN0aW9uTXNnID0gJyc7XHJcbiAgICB2YXIgYWN0aW9uS2V5ID0gKGFjdGlvbiA9PT0gJ2N1dCcgPyAnWCcgOiAnQycpO1xyXG4gICAgaWYgKC9pUGhvbmV8aVBhZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcclxuICAgICAgICBhY3Rpb25Nc2cgPSAnTm8gc3VwcG9ydCA6KCc7XHJcbiAgICB9IGVsc2UgaWYgKC9NYWMvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICAgICAgYWN0aW9uTXNnID0gJ1ByZXNzIOKMmC0nICsgYWN0aW9uS2V5ICsgJyB0byAnICsgYWN0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhY3Rpb25Nc2cgPSAnUHJlc3MgQ3RybC0nICsgYWN0aW9uS2V5ICsgJyB0byAnICsgYWN0aW9uO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFjdGlvbk1zZztcclxufVxyXG5cclxuLy8gTmV3IEFydGljbGUgU3lzdGVtXHJcblxyXG4kKFwiI25ldy1hcnRpY2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICBpZihsb2NhbFN0b3JhZ2UubGVuZ3RoICE9PSAwKXtcclxuICAgICAgICBpZih3aW5kb3cuY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGVyYXNlIHlvdXIgYXJ0aWNsZSB0byBzdGFydCBhIG5ldyBvbmUgPycpKXtcclxuICAgICAgICAgIC8vIENsZWFuIHRoZSBsb2NhbFN0b3JhZ2VcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgbG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBQcmV2aWV3IFN5c3RlbVxyXG5cclxuJChcIiNwcmV2aWV3XCIpLm1vdXNlb3ZlcihmdW5jdGlvbigpe1xyXG4gICQoXCIjY2xpcFwiKS5odG1sKFwiXCIpO1xyXG4gICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgaWYgKGtleSA9PT0gXCIjYXJ0aWNsZU5hbWVcIikge1xyXG4gICAgICAkKFwiI2NsaXBcIikuYXBwZW5kKFwiPGgxPlwiICsgdmFsdWUud29yZHMuam9pbihcIiBcIikgKyBcIjwvaDE+XCIpO1xyXG4gICAgfSBlbHNlIGlmIChrZXkgPT0gXCIjbGVhZFwiKXtcclxuICAgICAgJChcIiNjbGlwXCIpLmFwcGVuZChcIjxwPlwiICsgdmFsdWUud29yZHMuam9pbihcIiBcIikgKyBcIjwvcD5cIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIFRoZXNlIGxvb3BzIGFyZSBmb3Igd3JpdGluZyBwYXJhZ3JhcGhzIGFuZCBzZW50ZW5jZXMgaW4gY29ycmVjdCBvcmRlciBkZWZpbmluZyBwIGFuZCBzIGR5bmFtaWNhbHkgXHJcbiAgZm9yKHZhciBwID0gMTsgOyBwKyspe1xyXG4gICAgaWYoIW1vdXNlUChwKSl7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKHZhciBzID0gMTsgOyBzKyspe1xyXG4gICAgICAgIGlmKCFtb3VzZVMocCwgcykpe1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkLmVhY2goaW1hZ2VzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICQoXCIjcFwiICsgcmVnZXguaS5leGVjKGtleSlbMV0gKyBcIi1wcmV2XCIpLmFmdGVyKFwiPGltZyBzcmM9J1wiICsgdmFsdWUuc3JjICsgXCInIGFsdD0nXCIgKyB2YWx1ZS5hbHQgKyBcIicvPlwiKTtcclxuICB9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBtb3VzZVAocCl7XHJcbiAgdmFyIGNyZWF0ZWQgPSBmYWxzZTtcclxuICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIGlmIChyZWdleC5wLnRlc3Qoa2V5KSAmJiByZWdleC5wLmV4ZWMoa2V5KVsxXSA9PSBwKXtcclxuICAgICAgJChcIiNjbGlwXCIpLmFwcGVuZChcIjxoMj5cIiArIHZhbHVlLndvcmRzLmpvaW4oXCIgXCIpICsgXCI8L2gyPlwiKTtcclxuICAgICAgY3JlYXRlZCA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNyZWF0ZWQ7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBtb3VzZVMocCwgcyl7XHJcbiAgdmFyIGNyZWF0ZWQgPSBmYWxzZTtcclxuICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIGlmIChyZWdleC5zLnRlc3Qoa2V5KSAmJiByZWdleC5zLmV4ZWMoa2V5KVsxXSA9PSBwICYmIHJlZ2V4LnMuZXhlYyhrZXkpWzJdID09IHMpe1xyXG4gICAgICB2YXIgaWQgPSBcInBcIiArIHAgKyBcIi1wcmV2XCI7XHJcbiAgICAgIGlmKCQoXCIjXCIgKyBpZCkubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAkKFwiI2NsaXBcIikuYXBwZW5kKFwiPHAgaWQ9J1wiICsgaWQgKyBcIic+PC9wPlwiKTtcclxuICAgICAgfVxyXG4gICAgICAvL3ZhbHVlLndvcmRzWzBdLnJlcGxhY2UoIC9cXGJcXHcvZywgZnVuY3Rpb24oSCl7IHJldHVybiBILnRvVXBwZXJDYXNlKCkgfSk7XHJcbiAgICAgIC8vdmFsdWUud29yZHNbMF07XHJcbiAgICAgIC8vY29uc29sZS5sb2codmFsdWUpO1xyXG4gICAgICBhID0gdmFsdWUud29yZHMuam9pbihcIiBcIilcclxuICAgICAgYSA9IGEuc3Vic3RyaW5nKDAsMSkudG9VcHBlckNhc2UoKSArIGEuc3Vic3RyaW5nKDEpXHJcbiAgICAgIC8vY29uc29sZS5sb2coYSlcclxuICAgICAgJChcIiNcIiArIGlkKS50ZXh0KCQoXCIjXCIgKyBpZCkudGV4dCgpICsgXCIgXCIgKyBhICk7XHJcbiAgICAgIGNyZWF0ZWQgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBjcmVhdGVkO1xyXG59XHJcblxyXG4vLyBLZXl3b3JkIFN5c3RlbVxyXG5cclxuLy8gSW4gZm9jdXNvdXQsIGdldCB0aGUgdmFsIGlucHV0LCBjbGVhbiBpdCwgcHV0IGl0IGluIGNvcnJlY3Qga2V5d29yZHMga2V5IGFuZCBwdXQgaXQgaW4gbG9jYWxTdG9yYWdlXHJcbiQuZWFjaChrZXl3b3JkcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgJChrZXkpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAkKGtleSkudmFsKGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSl7XHJcbiAgICAgIGtleXdvcmRzW2tleV0gPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCcnKTtcclxuICAgICAgcmV0dXJuIGtleXdvcmRzW2tleV07XHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG5cclxuLy8gV29yZHMgU3lzdGVtXHJcblxyXG4vLyBjb3VudEtleXdvcmRzIC0gQ291bnQgdGhlIGtleXdvcmRzIGluIGVhY2ggaW5wdXRcclxuZnVuY3Rpb24gY291bnRLZXl3b3JkcyAoa2V5LCB2YWx1ZSl7XHJcbiAgLy8gR2V0IHRoZSB2YWwgaW5wdXQsIGNsZWFuIGl0IGFuZCBwdXQgaXQgaW4gY29ycmVjdCB3b3JkcyBrZXkuXHJcbiAgJChrZXkpLnZhbChmdW5jdGlvbih2YWxfaW5kZXgsIHZhbF92YWx1ZSl7XHJcbiAgICB2YWx1ZS53b3JkcyA9IHZhbF92YWx1ZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAvLy5yZXBsYWNlKC9bXmEtekEtWjAtOSBdL2csJycpXHJcbiAgICAudHJpbSgpLnNwbGl0KC9cXHMrL2cpO1xyXG4gICAgLy9jb25zb2xlLmxvZyh2YWx1ZS53b3Jkcy5qb2luKCcgJykpOyBcclxuICAgIHJldHVybiB2YWx1ZS53b3Jkcy5qb2luKCcgJyk7XHJcbiAgfSk7XHJcbiAgLy8gQ291bnQgYWxsIHRoZSBrZXl3b3JkcyB1c2VkXHJcbiAgdmFyIGNvdW50ID0gMDtcclxuICAkLmVhY2goa2V5d29yZHMsIGZ1bmN0aW9uKGt3X2tleSwga3dfdmFsdWUpe1xyXG4gICAgZm9yKHZhciBpIGluIHZhbHVlLndvcmRzKXtcclxuICAgICAgaWYodmFsdWUud29yZHNbaV0gPT09IGt3X3ZhbHVlICYmIGt3X3ZhbHVlICE9PSBcIlwiKXtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgdmFsdWUua19ub3cgPSBjb3VudDtcclxuICAkKGtleSArIFwiLW5rZXlzXCIpLnRleHQoY291bnQpO1xyXG59XHJcblxyXG4vLyBDb3VudCB0aGUgd29yZHMgaW4gZWFjaCBpbnB1dFxyXG5mdW5jdGlvbiBjb3VudFdvcmRzIChrZXksIHZhbHVlKXtcclxuICBDb3VudGFibGUub24oZG9jdW1lbnQucXVlcnlTZWxlY3RvcihrZXkpLCBmdW5jdGlvbiAoY291bnRlcikge1xyXG4gICAgdmFsdWUubm93ID0gY291bnRlci53b3JkcztcclxuICAgIGlmKGNvdW50ZXIud29yZHMgPiB2YWx1ZS5tYXgpIHtcclxuICAgICAgJChrZXkgKyAnLWNvdW50JykudGV4dChcIkFsZXJ0OiBUb28gbWFueSB3b3Jkc1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoa2V5ICsgJy1jb3VudCcpLnRleHQoY291bnRlci53b3Jkcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIENvdW50IGFsbCB3b3JkcyBhbmQga2V5d29yZHNcclxuZnVuY3Rpb24gY291bnRBbGxXb3Jkcygpe1xyXG4gIHZhciB3b3JkcyA9IDA7XHJcbiAgdmFyIGt3b3JkcyA9IDA7XHJcbiAgJC5lYWNoKGlucHV0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICB3b3JkcyArPSB2YWx1ZS5ub3c7XHJcbiAgICBrd29yZHMgKz0gdmFsdWUua19ub3c7XHJcbiAgfSk7XHJcbiAgJChcIiN0b3R3b3Jkc1wiKS50ZXh0KHdvcmRzKTtcclxuICAkKFwiI3RvdGtleXdvcmRzXCIpLnRleHQoa3dvcmRzKTtcclxufVxyXG5cclxuLy8gUGFyYWdyYXBocyBTeXN0ZW1cclxuXHJcbi8vIGluaXRGaWxlcyAtIEZ1bmN0aW9uIHVzZWQgaW4gJC5yZWFkeSBmb3Igc2VhcmNoIHRoZSBjb3JyZWN0IGZpbGVzIEJFRk9SRSBpbml0UGFnZVxyXG5mdW5jdGlvbiBpbml0RmlsZXMoKXtcclxuICAkLmdldChmaWxlcy5wLCBmdW5jdGlvbihkYXRhKXtcclxuICAgIGZpbGVzLnAgPSBkYXRhO1xyXG4gICAgJC5nZXQoZmlsZXMucywgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIGZpbGVzLnMgPSBkYXRhO1xyXG4gICAgICBpbml0UGFnZSgpO1xyXG5cclxuICAgICAgc2V0SW5wdXRzKCk7XHJcblxyXG4gICAgICAvLyBXYXRjaCBpbnB1dHNcclxuICAgICAgJC5lYWNoKGtleXdvcmRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgICAkKGtleSkuZm9jdXNvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHNldExvY2FsU3RvcmFnZShrZXl3b3JkcywgXCJrZXl3b3Jkc1wiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBCYWNrdXAgaWYgc29tZXRoaW5nIGdldCdzIHdyb25nXHJcbiAgICAgICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICAgIGNvdW50S2V5d29yZHMoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgY291bnRXb3JkcyhrZXksIHZhbHVlKTtcclxuICAgICAgICBjb3VudEFsbFdvcmRzKCk7XHJcblxyXG4gICAgICAgICQoa2V5KS5mb2N1c291dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgY291bnRLZXl3b3JkcyhrZXksIHZhbHVlKTtcclxuICAgICAgICAgIGNvdW50QWxsV29yZHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuLy8gaW5pdFBhZ2UgLSBGdW5jdGlvbiB1c2VkIG9ubHkgaW4gaW5pdEZpbGVzXHJcbmZ1bmN0aW9uIGluaXRQYWdlKCl7XHJcbiAgLy8gVGhlc2UgbG9vcHMgYXJlIGZvciB3cml0ZSBwYXJhZ3JhcGhzIGFuZCBzZW50ZW5jZXMgaW4gY29ycmVjdCBvcmRlclxyXG4gIGZvcih2YXIgcCA9IDE7IDsgcCsrKXtcclxuICAgIGlmKCFlYWNoUChwKSl7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKHZhciBzID0gMTsgOyBzKyspe1xyXG4gICAgICAgIGlmKCFlYWNoUyhwLCBzKSl7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgJChcIiNidXR0b24tcFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgY3JlYXRlUGFyYWdyYXBoKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVhY2hQKHApe1xyXG4gIHZhciBjcmVhdGVkID0gZmFsc2U7XHJcbiAgJC5lYWNoKGlucHV0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICBpZihyZWdleC5wLnRlc3Qoa2V5KSAmJiByZWdleC5wLmV4ZWMoa2V5KVsxXSA9PSBwKXtcclxuICAgICAgY3JlYXRlUGFyYWdyYXBoKHJlZ2V4LnAuZXhlYyhrZXkpWzFdKTtcclxuICAgICAgY3JlYXRlZCA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gY3JlYXRlZDtcclxufVxyXG5cclxuZnVuY3Rpb24gZWFjaFMocCwgcyl7XHJcbiAgdmFyIGNyZWF0ZWQgPSBmYWxzZTtcclxuICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIGlmKHJlZ2V4LnMudGVzdChrZXkpICYmIHJlZ2V4LnMuZXhlYyhrZXkpWzFdID09IHAgJiYgcmVnZXgucy5leGVjKGtleSlbMl0gPT0gcyl7XHJcbiAgICAgIGNyZWF0ZVNlbnRlbmNlKHJlZ2V4LnMuZXhlYyhrZXkpWzFdLCByZWdleC5zLmV4ZWMoa2V5KVsyXSk7XHJcbiAgICAgIGNyZWF0ZWQgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNyZWF0ZWQ7XHJcbn1cclxuXHJcbi8vIGNyZWF0ZVBhcmFncmFwaCAtIHAgKG51bWJlcik6IG5yIG9mIHBhcmFncmFwZlxyXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGluaXRQYWdlIGFuZCBidXR0b24gZXZlbnRcclxuZnVuY3Rpb24gY3JlYXRlUGFyYWdyYXBoKHApe1xyXG4gIHZhciB0ZW1wID0gKHR5cGVvZiBwID09PSBcInVuZGVmaW5lZFwiKTtcclxuICBpZih0eXBlb2YgcCA9PT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAvLyBWZXJpZnkgdGhlIGxhc3QgcGFyYWdyYXBoIG51bWJlclxyXG4gICAgdmFyIGxhc3RfcCA9IDA7XHJcblxyXG4gICAgJC5lYWNoKGlucHV0cywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIGlmKHJlZ2V4LnAudGVzdChrZXkpICYmIHJlZ2V4LnAuZXhlYyhrZXkpWzFdID4gbGFzdF9wKXtcclxuICAgICAgICBsYXN0X3AgPSByZWdleC5wLmV4ZWMoa2V5KVsxXTtcclxuICAgICAgfS8vaWZcclxuICAgIH0pOy8vZWFjaFxyXG4gICAgcCA9ICsrbGFzdF9wO1xyXG4gIH0vL2lmIHByaW1laXJvIHBhcmFncmFmb1xyXG5cclxuICAvLyBBZGQgSFRNTCBpdCB0byB0aGUgcGFnZVxyXG4gIHZhciBpbnAgPSBcIiNwXCIgKyBwICsgXCItaFwiO1xyXG4gIGlmKGxhc3RfcCA+IDkpeyBhbGVydChcIm5vIG1vcmUgdGhhbiA5IHBhcmFncmFwaCBhcmUgYWxsb3dlZFwiKVxyXG4gIH1lbHNle1xyXG4gICQoXCIjYnV0dG9uLXBcIikuYmVmb3JlKGVqcy5yZW5kZXIoZmlsZXMucCwge1wicGFyYWdyYXBoXCIgOiBwfSkpO1xyXG5cclxuICAvLyBBZGQgbW9yZSBwcm9wZXJ0aWVzIHRvIHRoZSBvYmplY3RcclxuICBpZighaW5wdXRzW2lucF0pe1xyXG4gICAgaW5wdXRzW2lucF0gPSB7IFwibWF4XCIgOiA4LCBcIm5vd1wiIDogMCwgXCJrX25vd1wiIDogMCwgXCJ3b3Jkc1wiIDogW10gfTtcclxuICB9XHJcbiAgaWYoIWltYWdlc1tcIiNwXCIgKyBwICsgXCItaW1nXCJdKXtcclxuICAgIGltYWdlc1tcIiNwXCIgKyBwICsgXCItaW1nXCJdID0geyBcInNyY1wiIDogXCJcIiwgXCJhbHRcIiA6IFwiXCIgfTtcclxuICB9XHJcblxyXG4gIC8vIEFkZCB0aGUgY29ycmVjdCBldmVudHM6IGlucCwgYnRuLCBpbWdcclxuICAkKGlucCkuZm9jdXNvdXQoZnVuY3Rpb24oKXtcclxuICAgIGNvdW50S2V5d29yZHMoaW5wLCBpbnB1dHNbaW5wXSk7XHJcbiAgICBjb3VudFdvcmRzKGlucCwgaW5wdXRzW2lucF0pO1xyXG4gICAgY291bnRBbGxXb3JkcygpO1xyXG4gICAgc2V0TG9jYWxTdG9yYWdlKGlucHV0cywgXCJpbnB1dHNcIik7XHJcbiAgfSk7XHJcbiAgJChcIiNidXR0b24tcy1wXCIgKyBwKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgY3JlYXRlU2VudGVuY2UocCk7XHJcbiAgfSk7XHJcbiAgJChcIiNwXCIgKyBwICsgXCItaW1nXCIpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICBpbWFnZXNbXCIjcFwiICsgcCArIFwiLWltZ1wiXS5zcmMgPSAkKFwiI3BcIiArIHAgKyBcIi1pbWdcIikudmFsKCk7XHJcbiAgICBzZXRMb2NhbFN0b3JhZ2UoaW1hZ2VzLCBcImltYWdlc1wiKTtcclxuICB9KTtcclxuICAkKFwiI3BcIiArIHAgKyBcIi1pbWctYWx0XCIpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICBpbWFnZXNbXCIjcFwiICsgcCArIFwiLWltZ1wiXS5hbHQgPSAkKFwiI3BcIiArIHAgKyBcIi1pbWctYWx0XCIpLnZhbCgpO1xyXG4gICAgc2V0TG9jYWxTdG9yYWdlKGltYWdlcywgXCJpbWFnZXNcIik7XHJcbiAgfSk7XHJcbn1cclxuICBpZih0ZW1wKXtcclxuICAgIGNyZWF0ZVNlbnRlbmNlKHAsIDEpO1xyXG4gICAgY3JlYXRlU2VudGVuY2UocCwgMik7XHJcbiAgICBjcmVhdGVTZW50ZW5jZShwLCAzKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGNyZWF0ZVNlbnRlbmNlIC0gcCAobnVtYmVyKTogbnIgb2YgcGFyYWdyYXBmIDsgcyAobnVtYmVyKTogbnIgb2Ygc2VudGVuY2VcclxuZnVuY3Rpb24gY3JlYXRlU2VudGVuY2UocCwgcyl7XHJcbiAgLy8gSWYgZG9lc24ndCBoYXZlIHMsIHRoZSBzIGlzIGVxdWFsIHRvIHRoZSBsYXN0IHNlbnRlbmNlIG51bWJlciBwbHVzIG9uZS5cclxuICBpZih0eXBlb2YgcyA9PT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgLy8gVmVyaWZ5IHRoZSBsYXN0IHNlbnRlbmNlIG51bWJlclxyXG4gICAgdmFyIGxhc3RfcyA9IDA7XHJcbiAgICAkLmVhY2goaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgaWYocmVnZXgucy50ZXN0KGtleSkgJiYgcmVnZXgucy5leGVjKGtleSlbMV0gPT0gcCl7XHJcbiAgICAgICAgaWYocmVnZXgucy5leGVjKGtleSlbMl0gPiBsYXN0X3Mpe1xyXG4gICAgICAgICAgbGFzdF9zID0gcmVnZXgucy5leGVjKGtleSlbMl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcyA9ICsrbGFzdF9zO1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkIEhUTUwgdG8gdGhlIHBhZ2VcclxuICB2YXIgaW5wID0gXCIjcFwiICsgcCArIFwiLXNcIiArIHM7XHJcblxyXG4gIGlmKGxhc3RfcyA+IDkpeyBhbGVydChcIm5vIG1vcmUgdGhhbiA5IHNldGVuY2VzIHBlciBwYXJhZ3JhcGggYXJlIGFsbG93ZWRcIilcclxuICB9ZWxzZXtcclxuICAkKFwiI2J1dHRvbi1zLXBcIiArIHApLmJlZm9yZShlanMucmVuZGVyKGZpbGVzLnMsIHtcInBhcmFncmFwaFwiIDogcCwgXCJzZW50ZW5jZVwiIDogc30pKTtcclxuXHJcbiAgLy8gQWRkIG1vcmUgcHJvcGVydGllcyB0byB0aGUgb2JqZWN0XHJcbiAgaWYoIWlucHV0c1tpbnBdKXtcclxuICAgIGlucHV0c1tpbnBdID0geyBcIm1heFwiIDogMjAsIFwibm93XCIgOiAwLCBcImtfbm93XCIgOiAwLCBcIndvcmRzXCIgOiBbXSB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHRoZSBjb3JyZWN0IGV2ZW50czogaW5wXHJcbiAgJChpbnApLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICBjb3VudEtleXdvcmRzKGlucCwgaW5wdXRzW2lucF0pO1xyXG4gICAgY291bnRXb3JkcyhpbnAsIGlucHV0c1tpbnBdKTtcclxuICAgIGNvdW50QWxsV29yZHMoKTtcclxuICAgIHNldExvY2FsU3RvcmFnZShpbnB1dHMsIFwiaW5wdXRzXCIpO1xyXG4gIH0pO1xyXG59XHJcbn1cclxuLy8gU2Vzc2lvbiBTdG9yYWdlIFN5c3RlbVxyXG5cclxuLy8gcmVhZHlMb2NhbFN0b3JhZ2UgLSBGdW5jdGlvbiB0byB0aGUgcmVhZHkgZXZlbnRcclxuZnVuY3Rpb24gcmVhZHlMb2NhbFN0b3JhZ2UgKCkge1xyXG4gIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxcIikgPT09IFwidHJ1ZVwiKXtcclxuICAgIGdldExvY2FsU3RvcmFnZShpbnB1dHMsIFwiaW5wdXRzXCIpO1xyXG4gICAgZ2V0TG9jYWxTdG9yYWdlKGltYWdlcywgXCJpbWFnZXNcIik7XHJcbiAgICBnZXRMb2NhbFN0b3JhZ2Uoa2V5d29yZHMsIFwia2V5d29yZHNcIik7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBzZXRMb2NhbFN0b3JhZ2UgLSBHZXQgdGhlIG9iaiBhbmQgaXRlcmF0ZSBhbGwgdmFyaWJsZSBpbnNpZGUgaXRcclxuLy8gSWYgYW4gb2JqZWN0IGhhdmUgYW5vdGhlciBvYmplY3QsIHNvIGNhbGwgYWdhaW4gdGhlIGZ1bmN0aW9uIHdpdGggdGhlIG1vdGhlciBzdHJpbmcuXHJcbmZ1bmN0aW9uIHNldExvY2FsU3RvcmFnZShvYmosIG1vdGhlcil7XHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsb2NhbFwiLCBcInRydWVcIik7XHJcbiAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICBpZigkLnR5cGUodmFsdWUpID09PSBcIm9iamVjdFwiKXtcclxuICAgICAgaWYgKG1vdGhlciAhPT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybiBzZXRMb2NhbFN0b3JhZ2UodmFsdWUsIG1vdGhlciArIFwiOlwiICsga2V5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc2V0TG9jYWxTdG9yYWdlKHZhbHVlLCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZihtb3RoZXIgIT09IFwiXCIpe1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKG1vdGhlciArIFwiOlwiICsga2V5LCB2YWx1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm47XHJcbn1cclxuXHJcbi8vIGdldExvY2FsU3RvcmFnZSAtIEdldCBhbGwgdmFyaWFibGVzIGluIGxvY2FsU3RvcmFnZSBhbmQgcG9wdWxhdGUgdGhlIGNvcnJlY3Qgc3lzdGVtIHZhcmlhYmxlXHJcbmZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZShvYmosIG1vdGhlcil7XHJcbiAgLy8gR2V0IHRoZSBrZXkgbnVtYmVyXHJcbiAgZm9yICh2YXIga2V5X25yID0gMDsga2V5X25yIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsga2V5X25yKyspIHtcclxuXHJcbiAgICAvLyBHZXQgdGhlIGtleSBuYW1lXHJcbiAgICB2YXIga2V5X25hbWUgPSBsb2NhbFN0b3JhZ2Uua2V5KGtleV9ucik7XHJcblxyXG4gICAgLy8gU3BsaXQgbmFtZSBvZiBrZXlcclxuICAgIHZhciBrZXlfYXJyYXkgPSBrZXlfbmFtZS5zcGxpdChcIjpcIik7XHJcblxyXG4gICAgLy8gVmFsdWVcclxuICAgIHZhciB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleV9uYW1lKTtcclxuICAgIHN3aXRjaCAoa2V5X2FycmF5W2tleV9hcnJheS5sZW5ndGggLSAxXSkge1xyXG4gICAgICBjYXNlIFwibWF4XCI6XHJcbiAgICAgIGNhc2UgXCJub3dcIjpcclxuICAgICAgY2FzZSBcImtfbm93XCI6XHJcbiAgICAgICAgdmFsdWUgPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwid29yZHNcIjpcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29uc3RydWN0IHRoZSBvYmplY3RcclxuICAgIGlmIChrZXlfYXJyYXlbMF0gPT0gbW90aGVyKSB7XHJcbiAgICAgIGlmKGtleV9hcnJheS5sZW5ndGggPiAyKXtcclxuICAgICAgICBpZigkLnR5cGUob2JqW2tleV9hcnJheVsxXV0pICE9IFwib2JqZWN0XCIpe1xyXG4gICAgICAgICAgb2JqW2tleV9hcnJheVsxXV0gPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqW2tleV9hcnJheVsxXV1ba2V5X2FycmF5WzJdXSA9IHZhbHVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9ialtrZXlfYXJyYXlbMV1dID0gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIHNldElucHV0cyAtIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBvbiBkb2N1bWVudC5yZWFkeSBmb3IgcG9wdWxhdGUgdGhlIGlucHV0cy5cclxuZnVuY3Rpb24gc2V0SW5wdXRzICgpe1xyXG4gICQuZWFjaChpbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgJChrZXkpLnZhbCh2YWx1ZS53b3Jkcy5qb2luKFwiIFwiKSk7XHJcbiAgfSk7XHJcbiAgJC5lYWNoKGltYWdlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAkKGtleSkudmFsKHZhbHVlLnNyYyk7XHJcbiAgICAkKGtleSArIFwiLWFsdFwiKS52YWwodmFsdWUuYWx0KTtcclxuICB9KTtcclxuICAkLmVhY2goa2V5d29yZHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgJChrZXkpLnZhbCh2YWx1ZSk7XHJcbiAgfSk7XHJcbn1cclxuIl19
},{"clipboard":4,"countable":5,"ejs":8}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaXBib2FyZC1hY3Rpb24uanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwibW9kIiwic2VsZWN0IiwiY2xpcGJvYXJkQWN0aW9uIiwiX3NlbGVjdCIsIl9zZWxlY3QyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX3R5cGVvZiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJpbnN0YW5jZSIsIkNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsIkNsaXBib2FyZEFjdGlvbiIsIm9wdGlvbnMiLCJyZXNvbHZlT3B0aW9ucyIsImluaXRTZWxlY3Rpb24iLCJ2YWx1ZSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImFjdGlvbiIsImNvbnRhaW5lciIsImVtaXR0ZXIiLCJ0ZXh0IiwidHJpZ2dlciIsInNlbGVjdGVkVGV4dCIsInNlbGVjdEZha2UiLCJzZWxlY3RUYXJnZXQiLCJfdGhpcyIsImlzUlRMIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVGYWtlIiwiZmFrZUhhbmRsZXJDYWxsYmFjayIsImZha2VIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImZha2VFbGVtIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZm9udFNpemUiLCJib3JkZXIiLCJwYWRkaW5nIiwibWFyZ2luIiwicG9zaXRpb24iLCJ5UG9zaXRpb24iLCJ3aW5kb3ciLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRvcCIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwiY29weVRleHQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJzdWNjZWVkZWQiLCJleGVjQ29tbWFuZCIsImVyciIsImhhbmRsZVJlc3VsdCIsImVtaXQiLCJjbGVhclNlbGVjdGlvbiIsImJpbmQiLCJmb2N1cyIsImdldFNlbGVjdGlvbiIsInJlbW92ZUFsbFJhbmdlcyIsImRlc3Ryb3kiLCJzZXQiLCJfYWN0aW9uIiwiRXJyb3IiLCJnZXQiLCJub2RlVHlwZSIsImhhc0F0dHJpYnV0ZSIsIl90YXJnZXQiXSwibWFwcGluZ3MiOiJBQUFBLENBQUMsVUFBVUEsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7QUFDeEIsUUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM1Q0QsZUFBTyxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQVAsRUFBNkJELE9BQTdCO0FBQ0gsS0FGRCxNQUVPLElBQUksT0FBT0csT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUN2Q0gsZ0JBQVFJLE1BQVIsRUFBZ0JDLFFBQVEsUUFBUixDQUFoQjtBQUNILEtBRk0sTUFFQTtBQUNILFlBQUlDLE1BQU07QUFDTkgscUJBQVM7QUFESCxTQUFWO0FBR0FILGdCQUFRTSxHQUFSLEVBQWFQLE9BQU9RLE1BQXBCO0FBQ0FSLGVBQU9TLGVBQVAsR0FBeUJGLElBQUlILE9BQTdCO0FBQ0g7QUFDSixDQVpELEVBWUcsSUFaSCxFQVlTLFVBQVVDLE1BQVYsRUFBa0JLLE9BQWxCLEVBQTJCO0FBQ2hDOztBQUVBLFFBQUlDLFdBQVdDLHVCQUF1QkYsT0FBdkIsQ0FBZjs7QUFFQSxhQUFTRSxzQkFBVCxDQUFnQ0MsR0FBaEMsRUFBcUM7QUFDakMsZUFBT0EsT0FBT0EsSUFBSUMsVUFBWCxHQUF3QkQsR0FBeEIsR0FBOEI7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LGVBQWpCO0FBQ0gsQ0FwT0QiLCJmaWxlIjoiY2xpcGJvYXJkLWFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ21vZHVsZScsICdzZWxlY3QnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmYWN0b3J5KG1vZHVsZSwgcmVxdWlyZSgnc2VsZWN0JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtb2QgPSB7XG4gICAgICAgICAgICBleHBvcnRzOiB7fVxuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5KG1vZCwgZ2xvYmFsLnNlbGVjdCk7XG4gICAgICAgIGdsb2JhbC5jbGlwYm9hcmRBY3Rpb24gPSBtb2QuZXhwb3J0cztcbiAgICB9XG59KSh0aGlzLCBmdW5jdGlvbiAobW9kdWxlLCBfc2VsZWN0KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIF9zZWxlY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2VsZWN0KTtcblxuICAgIGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBvYmpcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgICAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICAgICAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgICAgIH07XG4gICAgfSgpO1xuXG4gICAgdmFyIENsaXBib2FyZEFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBDbGlwYm9hcmRBY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENsaXBib2FyZEFjdGlvbik7XG5cbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmluaXRTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZpbmVzIGJhc2UgcHJvcGVydGllcyBwYXNzZWQgZnJvbSBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICovXG5cblxuICAgICAgICBfY3JlYXRlQ2xhc3MoQ2xpcGJvYXJkQWN0aW9uLCBbe1xuICAgICAgICAgICAga2V5OiAncmVzb2x2ZU9wdGlvbnMnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc29sdmVPcHRpb25zKCkge1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gb3B0aW9ucy5hY3Rpb247XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXIgPSBvcHRpb25zLmVtaXR0ZXI7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBvcHRpb25zLnRhcmdldDtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnaW5pdFNlbGVjdGlvbicsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdFNlbGVjdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0RmFrZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYXJnZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ3NlbGVjdEZha2UnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdEZha2UoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHZhciBpc1JUTCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RpcicpID09ICdydGwnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGYWtlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZha2VIYW5kbGVyQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZW1vdmVGYWtlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VIYW5kbGVyID0gdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmZha2VIYW5kbGVyQ2FsbGJhY2spIHx8IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHpvb21pbmcgb24gaU9TXG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5mb250U2l6ZSA9ICcxMnB0JztcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBib3ggbW9kZWxcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLmJvcmRlciA9ICcwJztcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgICAgICAgICAgICAgLy8gTW92ZSBlbGVtZW50IG91dCBvZiBzY3JlZW4gaG9yaXpvbnRhbGx5XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZVtpc1JUTCA/ICdyaWdodCcgOiAnbGVmdCddID0gJy05OTk5cHgnO1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgZWxlbWVudCB0byB0aGUgc2FtZSBwb3NpdGlvbiB2ZXJ0aWNhbGx5XG4gICAgICAgICAgICAgICAgdmFyIHlQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc3R5bGUudG9wID0geVBvc2l0aW9uICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc2V0QXR0cmlidXRlKCdyZWFkb25seScsICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnZhbHVlID0gdGhpcy50ZXh0O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5mYWtlRWxlbSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9ICgwLCBfc2VsZWN0Mi5kZWZhdWx0KSh0aGlzLmZha2VFbGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ3JlbW92ZUZha2UnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUZha2UoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmFrZUhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmZha2VIYW5kbGVyQ2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZha2VIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWtlSGFuZGxlckNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mYWtlRWxlbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLmZha2VFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdzZWxlY3RUYXJnZXQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdFRhcmdldCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9ICgwLCBfc2VsZWN0Mi5kZWZhdWx0KSh0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5VGV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdjb3B5VGV4dCcsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29weVRleHQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2NlZWRlZCA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2NlZWRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKHRoaXMuYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXN1bHQoc3VjY2VlZGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnaGFuZGxlUmVzdWx0JyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoc3VjY2VlZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoc3VjY2VlZGVkID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJywge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHRoaXMuYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLnNlbGVjdGVkVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdGhpcy50cmlnZ2VyLFxuICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbjogdGhpcy5jbGVhclNlbGVjdGlvbi5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2NsZWFyU2VsZWN0aW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclNlbGVjdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlci5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZGVzdHJveScsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZha2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnYWN0aW9uJyxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KCkge1xuICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdjb3B5JztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hY3Rpb24gIT09ICdjb3B5JyAmJiB0aGlzLl9hY3Rpb24gIT09ICdjdXQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcImFjdGlvblwiIHZhbHVlLCB1c2UgZWl0aGVyIFwiY29weVwiIG9yIFwiY3V0XCInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAndGFyZ2V0JyxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHRhcmdldCkge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmICh0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0YXJnZXQpKSA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0Lm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3Rpb24gPT09ICdjb3B5JyAmJiB0YXJnZXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwidGFyZ2V0XCIgYXR0cmlidXRlLiBQbGVhc2UgdXNlIFwicmVhZG9ubHlcIiBpbnN0ZWFkIG9mIFwiZGlzYWJsZWRcIiBhdHRyaWJ1dGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAnY3V0JyAmJiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSgncmVhZG9ubHknKSB8fCB0YXJnZXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcInRhcmdldFwiIGF0dHJpYnV0ZS4gWW91IGNhblxcJ3QgY3V0IHRleHQgZnJvbSBlbGVtZW50cyB3aXRoIFwicmVhZG9ubHlcIiBvciBcImRpc2FibGVkXCIgYXR0cmlidXRlcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJ0YXJnZXRcIiB2YWx1ZSwgdXNlIGEgdmFsaWQgRWxlbWVudCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxuICAgICAgICByZXR1cm4gQ2xpcGJvYXJkQWN0aW9uO1xuICAgIH0oKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2xpcGJvYXJkQWN0aW9uO1xufSk7Il19
},{"select":15}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaXBib2FyZC5qcyJdLCJuYW1lcyI6WyJnbG9iYWwiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInJlcXVpcmUiLCJtb2QiLCJjbGlwYm9hcmRBY3Rpb24iLCJ0aW55RW1pdHRlciIsImdvb2RMaXN0ZW5lciIsImNsaXBib2FyZCIsIl9jbGlwYm9hcmRBY3Rpb24iLCJfdGlueUVtaXR0ZXIiLCJfZ29vZExpc3RlbmVyIiwiX2NsaXBib2FyZEFjdGlvbjIiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3RpbnlFbWl0dGVyMiIsIl9nb29kTGlzdGVuZXIyIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfdHlwZW9mIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsIl9jbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiQ29uc3RydWN0b3IiLCJUeXBlRXJyb3IiLCJfY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwidGFyZ2V0IiwicHJvcHMiLCJpIiwibGVuZ3RoIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwicHJvdG9Qcm9wcyIsInN0YXRpY1Byb3BzIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJzZWxmIiwiY2FsbCIsIlJlZmVyZW5jZUVycm9yIiwiX2luaGVyaXRzIiwic3ViQ2xhc3MiLCJzdXBlckNsYXNzIiwiY3JlYXRlIiwidmFsdWUiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsIkNsaXBib2FyZCIsIl9FbWl0dGVyIiwidHJpZ2dlciIsIm9wdGlvbnMiLCJfdGhpcyIsImdldFByb3RvdHlwZU9mIiwicmVzb2x2ZU9wdGlvbnMiLCJsaXN0ZW5DbGljayIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImFjdGlvbiIsImRlZmF1bHRBY3Rpb24iLCJkZWZhdWx0VGFyZ2V0IiwidGV4dCIsImRlZmF1bHRUZXh0IiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJib2R5IiwiX3RoaXMyIiwibGlzdGVuZXIiLCJlIiwib25DbGljayIsImRlbGVnYXRlVGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImVtaXR0ZXIiLCJnZXRBdHRyaWJ1dGVWYWx1ZSIsInNlbGVjdG9yIiwicXVlcnlTZWxlY3RvciIsImRlc3Ryb3kiLCJpc1N1cHBvcnRlZCIsImFjdGlvbnMiLCJzdXBwb3J0IiwicXVlcnlDb21tYW5kU3VwcG9ydGVkIiwiZm9yRWFjaCIsInN1ZmZpeCIsImVsZW1lbnQiLCJhdHRyaWJ1dGUiLCJoYXNBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiJBQUFBLENBQUMsVUFBVUEsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7QUFDeEIsUUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM1Q0QsZUFBTyxDQUFDLFFBQUQsRUFBVyxvQkFBWCxFQUFpQyxjQUFqQyxFQUFpRCxlQUFqRCxDQUFQLEVBQTBFRCxPQUExRTtBQUNILEtBRkQsTUFFTyxJQUFJLE9BQU9HLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDdkNILGdCQUFRSSxNQUFSLEVBQWdCQyxRQUFRLG9CQUFSLENBQWhCLEVBQStDQSxRQUFRLGNBQVIsQ0FBL0MsRUFBd0VBLFFBQVEsZUFBUixDQUF4RTtBQUNILEtBRk0sTUFFQTtBQUNILFlBQUlDLE1BQU07QUFDTkgscUJBQVM7QUFESCxTQUFWO0FBR0FILGdCQUFRTSxHQUFSLEVBQWFQLE9BQU9RLGVBQXBCLEVBQXFDUixPQUFPUyxXQUE1QyxFQUF5RFQsT0FBT1UsWUFBaEU7QUFDQVYsZUFBT1csU0FBUCxHQUFtQkosSUFBSUgsT0FBdkI7QUFDSDtBQUNKLENBWkQsRUFZRyxJQVpILEVBWVMsVUFBVUMsTUFBVixFQUFrQk8sZ0JBQWxCLEVBQW9DQyxZQUFwQyxFQUFr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QkFBSXNCLFVBQVUsT0FBT3BCLE1BQVAsS0FBa0IsUUFBbEIsR0FBNkIsQ0FBQ0EsTUFBRCxDQUE3QixHQUF3Q0EsTUFBdEQ7QUFDQSxvQkFBSXFCLFVBQVUsQ0FBQyxDQUFDZixTQUFTZ0IscUJBQXpCOztBQUVBRix3QkFBUUcsT0FBUixDQUFnQixVQUFVdkIsTUFBVixFQUFrQjtBQUM5QnFCLDhCQUFVQSxXQUFXLENBQUMsQ0FBQ2YsU0FBU2dCLHFCQUFULENBQStCdEIsTUFBL0IsQ0FBdkI7QUFDSCxpQkFGRDs7QUFJQSx1QkFBT3FCLE9BQVA7QUFDSDtBQWJBLFNBQUQsQ0FsRUo7O0FBa0ZBLGVBQU8vQixTQUFQO0FBQ0gsS0EzR2UsQ0EyR2R4QyxjQUFjSSxPQTNHQSxDQUFoQjs7QUE2R0E7Ozs7O0FBS0EsYUFBUzZELGlCQUFULENBQTJCUyxNQUEzQixFQUFtQ0MsT0FBbkMsRUFBNEM7QUFDeEMsWUFBSUMsWUFBWSxvQkFBb0JGLE1BQXBDOztBQUVBLFlBQUksQ0FBQ0MsUUFBUUUsWUFBUixDQUFxQkQsU0FBckIsQ0FBTCxFQUFzQztBQUNsQztBQUNIOztBQUVELGVBQU9ELFFBQVFHLFlBQVIsQ0FBcUJGLFNBQXJCLENBQVA7QUFDSDs7QUFFRHhGLFdBQU9ELE9BQVAsR0FBaUJxRCxTQUFqQjtBQUNILENBOU1EIiwiZmlsZSI6ImNsaXBib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ21vZHVsZScsICcuL2NsaXBib2FyZC1hY3Rpb24nLCAndGlueS1lbWl0dGVyJywgJ2dvb2QtbGlzdGVuZXInXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmYWN0b3J5KG1vZHVsZSwgcmVxdWlyZSgnLi9jbGlwYm9hcmQtYWN0aW9uJyksIHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpLCByZXF1aXJlKCdnb29kLWxpc3RlbmVyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtb2QgPSB7XG4gICAgICAgICAgICBleHBvcnRzOiB7fVxuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5KG1vZCwgZ2xvYmFsLmNsaXBib2FyZEFjdGlvbiwgZ2xvYmFsLnRpbnlFbWl0dGVyLCBnbG9iYWwuZ29vZExpc3RlbmVyKTtcbiAgICAgICAgZ2xvYmFsLmNsaXBib2FyZCA9IG1vZC5leHBvcnRzO1xuICAgIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUsIF9jbGlwYm9hcmRBY3Rpb24sIF90aW55RW1pdHRlciwgX2dvb2RMaXN0ZW5lcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBfY2xpcGJvYXJkQWN0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsaXBib2FyZEFjdGlvbik7XG5cbiAgICB2YXIgX3RpbnlFbWl0dGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RpbnlFbWl0dGVyKTtcblxuICAgIHZhciBfZ29vZExpc3RlbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dvb2RMaXN0ZW5lcik7XG5cbiAgICBmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgICAgICAgICAgZGVmYXVsdDogb2JqXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICAgICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgICAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgICAgICB9O1xuICAgIH0oKTtcblxuICAgIGZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgICAgICAgaWYgKCFzZWxmKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICAgIH1cblxuICAgIHZhciBDbGlwYm9hcmQgPSBmdW5jdGlvbiAoX0VtaXR0ZXIpIHtcbiAgICAgICAgX2luaGVyaXRzKENsaXBib2FyZCwgX0VtaXR0ZXIpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xIVE1MRWxlbWVudHxIVE1MQ29sbGVjdGlvbnxOb2RlTGlzdH0gdHJpZ2dlclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gQ2xpcGJvYXJkKHRyaWdnZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDbGlwYm9hcmQpO1xuXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQ2xpcGJvYXJkLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ2xpcGJvYXJkKSkuY2FsbCh0aGlzKSk7XG5cbiAgICAgICAgICAgIF90aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICAgICAgX3RoaXMubGlzdGVuQ2xpY2sodHJpZ2dlcik7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lcyBpZiBhdHRyaWJ1dGVzIHdvdWxkIGJlIHJlc29sdmVkIHVzaW5nIGludGVybmFsIHNldHRlciBmdW5jdGlvbnNcbiAgICAgICAgICogb3IgY3VzdG9tIGZ1bmN0aW9ucyB0aGF0IHdlcmUgcGFzc2VkIGluIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICovXG5cblxuICAgICAgICBfY3JlYXRlQ2xhc3MoQ2xpcGJvYXJkLCBbe1xuICAgICAgICAgICAga2V5OiAncmVzb2x2ZU9wdGlvbnMnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc29sdmVPcHRpb25zKCkge1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gdHlwZW9mIG9wdGlvbnMuYWN0aW9uID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5hY3Rpb24gOiB0aGlzLmRlZmF1bHRBY3Rpb247XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0eXBlb2Ygb3B0aW9ucy50YXJnZXQgPT09ICdmdW5jdGlvbicgPyBvcHRpb25zLnRhcmdldCA6IHRoaXMuZGVmYXVsdFRhcmdldDtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSB0eXBlb2Ygb3B0aW9ucy50ZXh0ID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy50ZXh0IDogdGhpcy5kZWZhdWx0VGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IF90eXBlb2Yob3B0aW9ucy5jb250YWluZXIpID09PSAnb2JqZWN0JyA/IG9wdGlvbnMuY29udGFpbmVyIDogZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnbGlzdGVuQ2xpY2snLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RlbkNsaWNrKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXIgPSAoMCwgX2dvb2RMaXN0ZW5lcjIuZGVmYXVsdCkodHJpZ2dlciwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMi5vbkNsaWNrKGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdvbkNsaWNrJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJpZ2dlciA9IGUuZGVsZWdhdGVUYXJnZXQgfHwgZS5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xpcGJvYXJkQWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpcGJvYXJkQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsaXBib2FyZEFjdGlvbiA9IG5ldyBfY2xpcGJvYXJkQWN0aW9uMi5kZWZhdWx0KHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB0aGlzLmFjdGlvbih0cmlnZ2VyKSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLnRhcmdldCh0cmlnZ2VyKSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy50ZXh0KHRyaWdnZXIpLFxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0cmlnZ2VyLFxuICAgICAgICAgICAgICAgICAgICBlbWl0dGVyOiB0aGlzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2RlZmF1bHRBY3Rpb24nLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlZmF1bHRBY3Rpb24odHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRBdHRyaWJ1dGVWYWx1ZSgnYWN0aW9uJywgdHJpZ2dlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2RlZmF1bHRUYXJnZXQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlZmF1bHRUYXJnZXQodHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGdldEF0dHJpYnV0ZVZhbHVlKCd0YXJnZXQnLCB0cmlnZ2VyKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdkZWZhdWx0VGV4dCcsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVmYXVsdFRleHQodHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRBdHRyaWJ1dGVWYWx1ZSgndGV4dCcsIHRyaWdnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdkZXN0cm95JyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXIuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xpcGJvYXJkQWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpcGJvYXJkQWN0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlwYm9hcmRBY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0sIFt7XG4gICAgICAgICAgICBrZXk6ICdpc1N1cHBvcnRlZCcsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogWydjb3B5JywgJ2N1dCddO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvbnMgPSB0eXBlb2YgYWN0aW9uID09PSAnc3RyaW5nJyA/IFthY3Rpb25dIDogYWN0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBzdXBwb3J0ID0gISFkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQ7XG5cbiAgICAgICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzdXBwb3J0ID0gc3VwcG9ydCAmJiAhIWRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZChhY3Rpb24pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cHBvcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxuICAgICAgICByZXR1cm4gQ2xpcGJvYXJkO1xuICAgIH0oX3RpbnlFbWl0dGVyMi5kZWZhdWx0KTtcblxuICAgIC8qKlxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byByZXRyaWV2ZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN1ZmZpeFxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZVZhbHVlKHN1ZmZpeCwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYXR0cmlidXRlID0gJ2RhdGEtY2xpcGJvYXJkLScgKyBzdWZmaXg7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IENsaXBib2FyZDtcbn0pOyJdfQ==
},{"./clipboard-action":3,"good-listener":12,"tiny-emitter":16}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvdW50YWJsZS5qcyJdLCJuYW1lcyI6WyJnbG9iYWwiLCJsaXZlRWxlbWVudHMiLCJlYWNoIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJmb3JFYWNoIiwiZGVjb2RlIiwic3RyaW5nIiwib3V0cHV0IiwiY291bnRlciIsImxlbmd0aCIsInZhbHVlIiwiY2hhckNvZGVBdCIsImV4dHJhIiwicHVzaCIsInZhbGlkYXRlQXJndW1lbnRzIiwiZWxlbWVudHMiLCJjYWxsYmFjayIsIm5vZGVzIiwiT2JqZWN0IiwidG9TdHJpbmciLCJjYWxsIiwiZWxlbWVudHNWYWxpZCIsIm5vZGVUeXBlIiwiY2FsbGJhY2tWYWxpZCIsImNvbnNvbGUiLCJlcnJvciIsImNvdW50IiwiZWxlbWVudCIsIm9wdGlvbnMiLCJvcmlnaW5hbCIsInRleHRDb250ZW50Iiwic3RyaXBUYWdzIiwicmVwbGFjZSIsImlnbm9yZSIsImkiLCJ0cmltbWVkIiwidHJpbSIsInBhcmFncmFwaHMiLCJtYXRjaCIsImhhcmRSZXR1cm5zIiwic2VudGVuY2VzIiwid29yZHMiLCJjaGFyYWN0ZXJzIiwiYWxsIiwiQ291bnRhYmxlIiwib24iLCJ1bmRlZmluZWQiLCJlIiwiaGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJmaWx0ZXIiLCJpbmRleE9mIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImVuYWJsZWQiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmaW5lIiwiYW1kIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBLENBQUUsV0FBVUEsTUFBVixFQUFrQjs7QUFFbEI7Ozs7Ozs7QUFPQSxNQUFJQyxlQUFlLEVBQW5CO0FBQ0EsUUFBTUMsT0FBT0MsTUFBTUMsU0FBTixDQUFnQkMsT0FBN0I7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLFdBQVNDLE1BQVQsQ0FBaUJDLE1BQWpCLEVBQXlCO0FBQ3ZCLFVBQU1DLFNBQVMsRUFBZjtBQUNELFFBQUlDLFVBQVUsQ0FB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Q0FBeEM7QUFDSCxPQUZNLEVBRUpsQixNQUZJLEtBRU9NLFNBQVNOLE1BRnZCO0FBR0Q7O0FBSUg7Ozs7O0FBaklrQixHQUFsQixDQXNJQSxJQUFJLE9BQU84QyxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQy9CQyxXQUFPRCxPQUFQLEdBQWlCWCxTQUFqQjtBQUNELEdBRkQsTUFFTyxJQUFJLE9BQU9hLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE9BQU9DLEdBQTNDLEVBQWdEO0FBQ3JERCxXQUFPLFlBQVk7QUFBRSxhQUFPYixTQUFQO0FBQWtCLEtBQXZDO0FBQ0QsR0FGTSxNQUVBO0FBQ0w3QyxXQUFPNkMsU0FBUCxHQUFtQkEsU0FBbkI7QUFDRDtBQUNGLENBelNDLEVBeVNBLElBelNBLENBQUQiLCJmaWxlIjoiQ291bnRhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3VudGFibGUgaXMgYSBzY3JpcHQgdG8gYWxsb3cgZm9yIGxpdmUgcGFyYWdyYXBoLSwgd29yZC0gYW5kIGNoYXJhY3Rlci1cbiAqIGNvdW50aW5nIG9uIGFuIEhUTUwgZWxlbWVudC5cbiAqXG4gKiBAYXV0aG9yICAgU2FjaGEgU2NobWlkICg8aHR0cHM6Ly9naXRodWIuY29tL1JhZExpa2VXaG9hPilcbiAqIEB2ZXJzaW9uICAzLjAuMFxuICogQGxpY2Vuc2UgIE1JVFxuICogQHNlZSAgICAgIDxodHRwOi8vcmFkbGlrZXdob2EuZ2l0aHViLmlvL0NvdW50YWJsZS8+XG4gKi9cblxuLyoqXG4gKiBOb3RlOiBGb3IgdGhlIHB1cnBvc2Ugb2YgdGhpcyBpbnRlcm5hbCBkb2N1bWVudGF0aW9uLCBhcmd1bWVudHMgb2YgdGhlIHR5cGVcbiAqIHtOb2Rlc30gYXJlIHRvIGJlIGludGVycHJldGVkIGFzIGVpdGhlciB7Tm9kZUxpc3R9IG9yIHtFbGVtZW50fS5cbiAqL1xuXG47KGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBgbGl2ZUVsZW1lbnRzYCBob2xkcyBhbGwgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBsaXZlLWNvdW50aW5nXG4gICAqIGZ1bmN0aW9uYWxpdHkgYm91bmQgdG8gdGhlbS5cbiAgICovXG5cbiAgbGV0IGxpdmVFbGVtZW50cyA9IFtdXG4gIGNvbnN0IGVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaFxuXG4gIC8qKlxuICAgKiBgdWNzMmRlY29kZWAgZnVuY3Rpb24gZnJvbSB0aGUgcHVueWNvZGUuanMgbGlicmFyeS5cbiAgICpcbiAgICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBkZWNpbWFsIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuICAgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksIHRoaXNcbiAgICogZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoIFVDUy0yXG4gICAqIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LCBtYXRjaGluZ1xuICAgKiBVVEYtMTYuXG4gICAqXG4gICAqIEBzZWUgICAgIDxodHRwOi8vZ29vLmdsLzhNMDlyPlxuICAgKiBAc2VlICAgICA8aHR0cDovL2dvby5nbC91NFVVQz5cbiAgICpcbiAgICogQHBhcmFtICAge1N0cmluZ30gIHN0cmluZyAgIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuICAgKlxuICAgKiBAcmV0dXJuICB7QXJyYXl9ICAgVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gZGVjb2RlIChzdHJpbmcpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBbXVxuICBcdGxldCBjb3VudGVyID0gMFxuICBcdGNvbnN0IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcblxuICBcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG4gIFx0XHRjb25zdCB2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKylcblxuICBcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXG4gIFx0XHRcdC8vIEl0J3MgYSBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXIuXG5cbiAgXHRcdFx0Y29uc3QgZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspXG5cbiAgXHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIExvdyBzdXJyb2dhdGUuXG4gIFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKVxuICBcdFx0XHR9IGVsc2Uge1xuXG4gIFx0XHRcdFx0Ly8gSXQncyBhbiB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGVcbiAgXHRcdFx0XHQvLyBuZXh0IGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpci5cblxuICBcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKVxuICBcdFx0XHRcdGNvdW50ZXItLVxuICBcdFx0XHR9XG4gIFx0XHR9IGVsc2Uge1xuICBcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSlcbiAgXHRcdH1cbiAgXHR9XG5cbiAgXHRyZXR1cm4gb3V0cHV0XG4gIH1cblxuICAvKipcbiAgICogYHZhbGlkYXRlQXJndW1lbnRzYCB2YWxpZGF0ZXMgdGhlIGFyZ3VtZW50cyBnaXZlbiB0byBlYWNoIGZ1bmN0aW9uIGNhbGwuXG4gICAqIEVycm9ycyBhcmUgbG9nZ2VkIHRvIHRoZSBjb25zb2xlIGFzIHdhcm5pbmdzLCBidXQgQ291bnRhYmxlIGZhaWxzXG4gICAqIHNpbGVudGx5LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0gICB7Tm9kZXN9ICAgICBlbGVtZW50cyAgVGhlIChjb2xsZWN0aW9uIG9mKSBlbGVtZW50KHMpIHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZS5cbiAgICpcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgY2FsbGJhY2sgIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byB2YWxpZGF0ZS5cbiAgICpcbiAgICogQHJldHVybiAge0Jvb2xlYW59ICAgUmV0dXJucyB3aGV0aGVyIGFsbCBhcmd1bWVudHMgYXJlIHZhaWxkLlxuICAgKi9cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUFyZ3VtZW50cyAoZWxlbWVudHMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZWxlbWVudHMpXG4gICAgY29uc3QgZWxlbWVudHNWYWxpZCA9IChub2RlcyA9PT0gJ1tvYmplY3QgTm9kZUxpc3RdJyB8fCBub2RlcyA9PT0gJ1tvYmplY3QgSFRNTENvbGxlY3Rpb25dJykgfHwgZWxlbWVudHMubm9kZVR5cGUgPT09IDFcbiAgICBjb25zdCBjYWxsYmFja1ZhbGlkID0gdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nXG5cbiAgICBpZiAoIWVsZW1lbnRzVmFsaWQpIGNvbnNvbGUuZXJyb3IoJ0NvdW50YWJsZTogTm90IGEgdmFsaWQgdGFyZ2V0JylcbiAgICBpZiAoIWNhbGxiYWNrVmFsaWQpIGNvbnNvbGUuZXJyb3IoJ0NvdW50YWJsZTogTm90IGEgdmFsaWQgY2FsbGJhY2sgZnVuY3Rpb24nKVxuXG4gICAgcmV0dXJuIGVsZW1lbnRzVmFsaWQgJiYgY2FsbGJhY2tWYWxpZFxuICB9XG5cbiAgLyoqXG4gICAqIGBjb3VudGAgdHJpbXMgYW4gZWxlbWVudCdzIHZhbHVlLCBvcHRpb25hbGx5IHN0cmlwcyBIVE1MIHRhZ3MgYW5kIGNvdW50c1xuICAgKiBwYXJhZ3JhcGhzLCBzZW50ZW5jZXMsIHdvcmRzLCBjaGFyYWN0ZXJzIGFuZCBjaGFyYWN0ZXJzIHBsdXMgc3BhY2VzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0gICB7RWxlbWVudH0gIGVsZW1lbnQgIFRoZSBlbGVtZW50IHdob3NlIHZhbHVlIGlzIHRvIGJlIGNvdW50ZWQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgb3B0aW9ucyAgVGhlIG9wdGlvbnMgdG8gdXNlIGZvciB0aGUgY291bnRpbmcuXG4gICAqXG4gICAqIEByZXR1cm4gIHtPYmplY3R9ICAgVGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBudW1iZXIgb2YgcGFyYWdyYXBocyxcbiAgICogICAgICAgICAgICAgICAgICAgICBzZW50ZW5jZXMsIHdvcmRzLCBjaGFyYWN0ZXJzIGFuZCBjaGFyYWN0ZXJzIHBsdXNcbiAgICogICAgICAgICAgICAgICAgICAgICBzcGFjZXMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNvdW50IChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgbGV0IG9yaWdpbmFsID0gJycgKyAoJ3ZhbHVlJyBpbiBlbGVtZW50ID8gZWxlbWVudC52YWx1ZSA6IGVsZW1lbnQudGV4dENvbnRlbnQpXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICAgIC8qKlxuICAgICAqIFRoZSBpbml0aWFsIGltcGxlbWVudGF0aW9uIHRvIGFsbG93IGZvciBIVE1MIHRhZ3Mgc3RyaXBwaW5nIHdhcyBjcmVhdGVkXG4gICAgICogQGNyYW5pdW1zbG93cyB3aGlsZSB0aGUgY3VycmVudCBvbmUgd2FzIGNyZWF0ZWQgYnkgQFJvYi0tVy5cbiAgICAgKlxuICAgICAqIEBzZWUgPGh0dHA6Ly9nb28uZ2wvRXhtbHI+XG4gICAgICogQHNlZSA8aHR0cDovL2dvby5nbC9nRlFRaD5cbiAgICAgKi9cblxuICAgIGlmIChvcHRpb25zLnN0cmlwVGFncykgb3JpZ2luYWwgPSBvcmlnaW5hbC5yZXBsYWNlKC88XFwvP1thLXpdW14+XSo+L2dpLCAnJylcblxuICAgIGlmIChvcHRpb25zLmlnbm9yZSkge1xuICAgICAgICBlYWNoLmNhbGwob3B0aW9ucy5pZ25vcmUsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbCA9IG9yaWdpbmFsLnJlcGxhY2UoaSwgJycpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdHJpbW1lZCA9IG9yaWdpbmFsLnRyaW0oKVxuXG4gICAgLyoqXG4gICAgICogTW9zdCBvZiB0aGUgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnRzIGFyZSBiYXNlZCBvbiB0aGUgd29ya3Mgb2YgQGVwbWF0c3cuXG4gICAgICpcbiAgICAgKiBAc2VlIDxodHRwOi8vZ29vLmdsL1NXT0xCPlxuICAgICAqL1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmFncmFwaHM6IHRyaW1tZWQgPyAodHJpbW1lZC5tYXRjaChvcHRpb25zLmhhcmRSZXR1cm5zID8gL1xcbnsyLH0vZyA6IC9cXG4rL2cpIHx8IFtdKS5sZW5ndGggKyAxIDogMCxcbiAgICAgIHNlbnRlbmNlczogdHJpbW1lZCA/ICh0cmltbWVkLm1hdGNoKC9bLj8h4oCmXSsuL2cpIHx8IFtdKS5sZW5ndGggKyAxIDogMCxcbiAgICAgIHdvcmRzOiB0cmltbWVkID8gKHRyaW1tZWQucmVwbGFjZSgvWydcIjs6LC4/wr9cXC0hwqFdKy9nLCAnJykubWF0Y2goL1xcUysvZykgfHwgW10pLmxlbmd0aCA6IDAsXG4gICAgICBjaGFyYWN0ZXJzOiB0cmltbWVkID8gZGVjb2RlKHRyaW1tZWQucmVwbGFjZSgvXFxzL2csICcnKSkubGVuZ3RoIDogMCxcbiAgICAgIGFsbDogZGVjb2RlKG9yaWdpbmFsKS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgbWFpbiBvYmplY3QgdGhhdCB3aWxsIGxhdGVyIGJlIGV4cG9zZWQgdG8gb3RoZXIgc2NyaXB0cy4gSXRcbiAgICogaG9sZHMgYWxsIHRoZSBwdWJsaWMgbWV0aG9kcyB0aGF0IGNhbiBiZSB1c2VkIHRvIGVuYWJsZSB0aGUgQ291bnRhYmxlXG4gICAqIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIFNvbWUgbWV0aG9kcyBhY2NlcHQgYW4gb3B0aW9uYWwgb3B0aW9ucyBwYXJhbWV0ZXIuIFRoaXMgaW5jbHVkZXMgdGhlXG4gICAqIGZvbGxvd2luZyBvcHRpb25zLlxuICAgKlxuICAgKiB7Qm9vbGVhbn0gICAgICBoYXJkUmV0dXJucyAgVXNlIHR3byByZXR1cm5zIHRvIHNlcGVyYXRlIGEgcGFyYWdyYXBoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIG9uZS4gKGRlZmF1bHQ6IGZhbHNlKVxuICAgKiB7Qm9vbGVhbn0gICAgICBzdHJpcFRhZ3MgICAgU3RyaXAgSFRNTCB0YWdzIGJlZm9yZSBjb3VudGluZyB0aGUgdmFsdWVzLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRlZmF1bHQ6IGZhbHNlKVxuICAgKiB7QXJyYXk8Q2hhcj59ICBpZ25vcmUgICAgICAgQSBsaXN0IG9mIGNoYXJhY3RlcnMgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWdub3JlZCB3aGVuIGNhbGN1bGF0aW5nIHRoZSBjb3VudGVycy5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkZWZhdWx0OiApXG4gICAqL1xuXG4gIGNvbnN0IENvdW50YWJsZSA9IHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBgb25gIG1ldGhvZCBiaW5kcyB0aGUgY291bnRpbmcgaGFuZGxlciB0byBhbGwgZ2l2ZW4gZWxlbWVudHMuIFRoZVxuICAgICAqIGV2ZW50IGlzIGVpdGhlciBgb25pbnB1dGAgb3IgYG9ua2V5ZG93bmAsIGJhc2VkIG9uIHRoZSBjYXBhYmlsaXRpZXMgb2ZcbiAgICAgKiB0aGUgYnJvd3Nlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtOb2Rlc30gICAgIGVsZW1lbnRzICAgQWxsIGVsZW1lbnRzIHRoYXQgc2hvdWxkIHJlY2VpdmUgdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb3VudGFibGUgZnVuY3Rpb25hbGl0eS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGNhbGxiYWNrICAgVGhlIGNhbGxiYWNrIHRvIGZpcmUgd2hlbmV2ZXIgdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50J3MgdmFsdWUgY2hhbmdlcy4gVGhlIGNhbGxiYWNrIGlzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZWQgd2l0aCB0aGUgcmVsZXZhbnQgZWxlbWVudCBib3VuZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYHRoaXNgIGFuZCB0aGUgY291bnRlZCB2YWx1ZXMgYXMgdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGUgcGFyYW1ldGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtICAge09iamVjdH0gICAgW29wdGlvbnNdICBBbiBvYmplY3QgdG8gbW9kaWZ5IENvdW50YWJsZSdzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvdXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICBSZXR1cm5zIHRoZSBDb3VudGFibGUgb2JqZWN0IHRvIGFsbG93IGZvciBjaGFpbmluZy5cbiAgICAgKi9cblxuICAgIG9uOiBmdW5jdGlvbiAoZWxlbWVudHMsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIXZhbGlkYXRlQXJndW1lbnRzKGVsZW1lbnRzLCBjYWxsYmFjaykpIHJldHVyblxuXG4gICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbGVtZW50cyA9IFsgZWxlbWVudHMgXVxuICAgICAgfVxuXG4gICAgICBlYWNoLmNhbGwoZWxlbWVudHMsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZSwgY291bnQoZSwgb3B0aW9ucykpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGl2ZUVsZW1lbnRzLnB1c2goeyBlbGVtZW50OiBlLCBoYW5kbGVyOiBoYW5kbGVyIH0pXG5cbiAgICAgICAgICBoYW5kbGVyKClcblxuICAgICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVyKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGhlIGBvZmZgIG1ldGhvZCByZW1vdmVzIHRoZSBDb3VudGFibGUgZnVuY3Rpb25hbGl0eSBmcm9tIGFsbCBnaXZlblxuICAgICAqIGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtICAge05vZGVzfSAgIGVsZW1lbnRzICBBbGwgZWxlbWVudHMgd2hvc2UgQ291bnRhYmxlIGZ1bmN0aW9uYWxpdHlcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZCBiZSB1bmJvdW5kLlxuICAgICAqXG4gICAgICogQHJldHVybiAge09iamVjdH0gIFJldHVybnMgdGhlIENvdW50YWJsZSBvYmplY3QgdG8gYWxsb3cgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuXG4gICAgb2ZmOiBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgIGlmICghdmFsaWRhdGVBcmd1bWVudHMoZWxlbWVudHMsIGZ1bmN0aW9uICgpIHt9KSkgcmV0dXJuXG5cbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVsZW1lbnRzID0gWyBlbGVtZW50cyBdXG4gICAgICB9XG5cbiAgICAgIGxpdmVFbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudHMuaW5kZXhPZihlLmVsZW1lbnQpICE9PSAtMVxuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIGUuaGFuZGxlcilcbiAgICAgIH0pXG5cbiAgICAgIGxpdmVFbGVtZW50cyA9IGxpdmVFbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudHMuaW5kZXhPZihlLmVsZW1lbnQpID09PSAtMVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGhlIGBjb3VudGAgbWV0aG9kIHdvcmtzIG1vc3RseSBsaWtlIHRoZSBgbGl2ZWAgbWV0aG9kLCBidXQgbm8gZXZlbnRzIGFyZVxuICAgICAqIGJvdW5kLCB0aGUgZnVuY3Rpb25hbGl0eSBpcyBvbmx5IGV4ZWN1dGVkIG9uY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7Tm9kZXN9ICAgICBlbGVtZW50cyAgIEFsbCBlbGVtZW50cyB0aGF0IHNob3VsZCBiZSBjb3VudGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgY2FsbGJhY2sgICBUaGUgY2FsbGJhY2sgdG8gZmlyZSB3aGVuZXZlciB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQncyB2YWx1ZSBjaGFuZ2VzLiBUaGUgY2FsbGJhY2sgaXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxlZCB3aXRoIHRoZSByZWxldmFudCBlbGVtZW50IGJvdW5kXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBgdGhpc2AgYW5kIHRoZSBjb3VudGVkIHZhbHVlcyBhcyB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZSBwYXJhbWV0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICBbb3B0aW9uc10gIEFuIG9iamVjdCB0byBtb2RpZnkgQ291bnRhYmxlJ3NcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW91ci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtPYmplY3R9ICAgIFJldHVybnMgdGhlIENvdW50YWJsZSBvYmplY3QgdG8gYWxsb3cgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuXG4gICAgY291bnQ6IGZ1bmN0aW9uIChlbGVtZW50cywgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgIGlmICghdmFsaWRhdGVBcmd1bWVudHMoZWxlbWVudHMsIGNhbGxiYWNrKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVsZW1lbnRzID0gWyBlbGVtZW50cyBdXG4gICAgICB9XG5cbiAgICAgIGVhY2guY2FsbChlbGVtZW50cywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKGUsIGNvdW50KGUsIG9wdGlvbnMpKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGhlIGBlbmFibGVkYCBtZXRob2QgY2hlY2tzIGlmIHRoZSBsaXZlLWNvdW50aW5nIGZ1bmN0aW9uYWxpdHkgaXMgYm91bmRcbiAgICAgKiB0byBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtICAge0VsZW1lbnR9ICBlbGVtZW50ICBBbGwgZWxlbWVudHMgdGhhdCBzaG91bGQgYmUgY2hlY2tlZCBmb3IgdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb3VudGFibGUgZnVuY3Rpb25hbGl0eS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtCb29sZWFufSAgQSBib29sZWFuIHZhbHVlIHJlcHJlc2VudGluZyB3aGV0aGVyIENvdW50YWJsZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25hbGl0eSBpcyBib3VuZCB0byBhbGwgZ2l2ZW4gZWxlbWVudHMuXG4gICAgICovXG5cbiAgICBlbmFibGVkOiBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbGVtZW50cyA9IFsgZWxlbWVudHMgXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGl2ZUVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50cy5pbmRleE9mKGUuZWxlbWVudCkgIT09IC0xXG4gICAgICB9KS5sZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aFxuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBDb3VudGFibGUgZGVwZW5kaW5nIG9uIHRoZSBtb2R1bGUgc3lzdGVtIHVzZWQgYWNyb3NzIHRoZVxuICAgKiBhcHBsaWNhdGlvbi4gKE5vZGUgLyBDb21tb25KUywgQU1ELCBnbG9iYWwpXG4gICAqL1xuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENvdW50YWJsZVxuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBDb3VudGFibGUgfSlcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuQ291bnRhYmxlID0gQ291bnRhYmxlXG4gIH1cbn0odGhpcykpO1xuIl19
},{}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsb3Nlc3QuanMiXSwibmFtZXMiOlsiRE9DVU1FTlRfTk9ERV9UWVBFIiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJwcm90byIsIm1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsImNsb3Nlc3QiLCJlbGVtZW50Iiwic2VsZWN0b3IiLCJub2RlVHlwZSIsInBhcmVudE5vZGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxxQkFBcUIsQ0FBekI7O0FBRUE7OztBQUdBLElBQUksT0FBT0MsT0FBUCxLQUFtQixXQUFuQixJQUFrQyxDQUFDQSxRQUFRQyxTQUFSLENBQWtCQyxPQUF6RCxFQUFrRTtBQUM5RCxRQUFJQyxRQUFRSCxRQUFRQyxTQUFwQjs7QUFFQUUsVUFBTUQsT0FBTixHQUFnQkMsTUFBTUMsZUFBTixJQUNBRCxNQUFNRSxrQkFETixJQUVBRixNQUFNRyxpQkFGTixJQUdBSCxNQUFNSSxnQkFITixJQUlBSixNQUFNSyxxQkFKdEI7QUFLSDs7QUFFRDs7Ozs7OztBQU9BLFNBQVNDLE9BQVQsQ0FBa0JDLE9BQWxCLEVBQTJCQyxRQUEzQixFQUFxQztBQUNqQyxXQUFPRCxXQUFXQSxRQUFRRSxRQUFSLEtBQXFCYixrQkFBdkMsRUFBMkQ7QUFDdkQsWUFBSSxPQUFPVyxRQUFRUixPQUFmLEtBQTJCLFVBQTNCLElBQ0FRLFFBQVFSLE9BQVIsQ0FBZ0JTLFFBQWhCLENBREosRUFDK0I7QUFDN0IsbUJBQU9ELE9BQVA7QUFDRDtBQUNEQSxrQkFBVUEsUUFBUUcsVUFBbEI7QUFDSDtBQUNKOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCTixPQUFqQiIsImZpbGUiOiJjbG9zZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIERPQ1VNRU5UX05PREVfVFlQRSA9IDk7XG5cbi8qKlxuICogQSBwb2x5ZmlsbCBmb3IgRWxlbWVudC5tYXRjaGVzKClcbiAqL1xuaWYgKHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICAgIHZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG4gICAgcHJvdG8ubWF0Y2hlcyA9IHByb3RvLm1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8ub01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNsb3Nlc3QgcGFyZW50IHRoYXQgbWF0Y2hlcyBhIHNlbGVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY2xvc2VzdCAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSBET0NVTUVOVF9OT0RFX1RZUEUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50Lm1hdGNoZXMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgIGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9zZXN0O1xuIl19
},{}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbGVnYXRlLmpzIl0sIm5hbWVzIjpbImNsb3Nlc3QiLCJyZXF1aXJlIiwiX2RlbGVnYXRlIiwiZWxlbWVudCIsInNlbGVjdG9yIiwidHlwZSIsImNhbGxiYWNrIiwidXNlQ2FwdHVyZSIsImxpc3RlbmVyRm4iLCJsaXN0ZW5lciIsImFwcGx5IiwiYXJndW1lbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlc3Ryb3kiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGVsZWdhdGUiLCJlbGVtZW50cyIsImJpbmQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJBcnJheSIsInByb3RvdHlwZSIsIm1hcCIsImNhbGwiLCJlIiwiZGVsZWdhdGVUYXJnZXQiLCJ0YXJnZXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxVQUFVQyxRQUFRLFdBQVIsQ0FBZDs7QUFFQTs7Ozs7Ozs7OztBQVVBLFNBQVNDLFNBQVQsQ0FBbUJDLE9BQW5CLEVBQTRCQyxRQUE1QixFQUFzQ0MsSUFBdEMsRUFBNENDLFFBQTVDLEVBQXNEQyxVQUF0RCxFQUFrRTtBQUM5RCxRQUFJQyxhQUFhQyxTQUFTQyxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckIsQ0FBakI7O0FBRUFSLFlBQVFTLGdCQUFSLENBQXlCUCxJQUF6QixFQUErQkcsVUFBL0IsRUFBMkNELFVBQTNDOztBQUVBLFdBQU87QUFDSE0saUJBQVMsWUFBVztBQUNoQlYsb0JBQVFXLG1CQUFSLENBQTRCVCxJQUE1QixFQUFrQ0csVUFBbEMsRUFBOENELFVBQTlDO0FBQ0g7QUFIRSxLQUFQO0FBS0g7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTUSxRQUFULENBQWtCQyxRQUFsQixFQUE0QlosUUFBNUIsRUFBc0NDLElBQXRDLEVBQTRDQyxRQUE1QyxFQUFzREMsVUFBdEQsRUFBa0U7QUFDOUQ7QUFDQSxRQUFJLE9BQU9TLFNBQVNKLGdCQUFoQixLQUFxQyxVQUF6QyxFQUFxRDtBQUNqRCxlQUFPVixVQUFVUSxLQUFWLENBQWdCLElBQWhCLEVBQXNCQyxTQUF0QixDQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLE9BQU9OLElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDNUI7QUFDQTtBQUNBLGVBQU9ILFVBQVVlLElBQVYsQ0FBZSxJQUFmLEVBQXFCQyxRQUFyQixFQUErQlIsS0FBL0IsQ0FBcUMsSUFBckMsRUFBMkNDLFNBQTNDLENBQVA7QUFDSDs7QUFFRDtBQUNBLFFBQUksT0FBT0ssUUFBUCxLQUFvQixRQUF4QixFQUFrQztBQUM5QkEsbUJBQVdFLFNBQVNDLGdCQUFULENBQTBCSCxRQUExQixDQUFYO0FBQ0g7O0FBRUQ7QUFDQSxXQUFPSSxNQUFNQyxTQUFOLENBQWdCQyxHQUFoQixDQUFvQkMsSUFBcEIsQ0FBeUJQLFFBQXpCLEVBQW1DLFVBQVViLE9BQVYsRUFBbUI7QUFDekQsZUFBT0QsVUFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkJDLElBQTdCLEVBQW1DQyxRQUFuQyxFQUE2Q0MsVUFBN0MsQ0FBUDtBQUNILEtBRk0sQ0FBUDtBQUdIOztBQUVEOzs7Ozs7Ozs7QUFTQSxTQUFTRSxRQUFULENBQWtCTixPQUFsQixFQUEyQkMsUUFBM0IsRUFBcUNDLElBQXJDLEVBQTJDQyxRQUEzQyxFQUFxRDtBQUNqRCxXQUFPLFVBQVNrQixDQUFULEVBQVk7QUFDZkEsVUFBRUMsY0FBRixHQUFtQnpCLFFBQVF3QixFQUFFRSxNQUFWLEVBQWtCdEIsUUFBbEIsQ0FBbkI7O0FBRUEsWUFBSW9CLEVBQUVDLGNBQU4sRUFBc0I7QUFDbEJuQixxQkFBU2lCLElBQVQsQ0FBY3BCLE9BQWQsRUFBdUJxQixDQUF2QjtBQUNIO0FBQ0osS0FORDtBQU9IOztBQUVERyxPQUFPQyxPQUFQLEdBQWlCYixRQUFqQiIsImZpbGUiOiJkZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbi8qKlxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIF9kZWxlZ2F0ZShlbGVtZW50LCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJGbiA9IGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBEZWxlZ2F0ZXMgZXZlbnQgdG8gYSBzZWxlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8U3RyaW5nfEFycmF5fSBbZWxlbWVudHNdXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnRzLCBzZWxlY3RvciwgdHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpIHtcbiAgICAvLyBIYW5kbGUgdGhlIHJlZ3VsYXIgRWxlbWVudCB1c2FnZVxuICAgIGlmICh0eXBlb2YgZWxlbWVudHMuYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gX2RlbGVnYXRlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIEVsZW1lbnQtbGVzcyB1c2FnZSwgaXQgZGVmYXVsdHMgdG8gZ2xvYmFsIGRlbGVnYXRpb25cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gVXNlIGBkb2N1bWVudGAgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciwgdGhlbiBhcHBseSBhcmd1bWVudHNcbiAgICAgICAgLy8gVGhpcyBpcyBhIHNob3J0IHdheSB0byAudW5zaGlmdCBgYXJndW1lbnRzYCB3aXRob3V0IHJ1bm5pbmcgaW50byBkZW9wdGltaXphdGlvbnNcbiAgICAgICAgcmV0dXJuIF9kZWxlZ2F0ZS5iaW5kKG51bGwsIGRvY3VtZW50KS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBTZWxlY3Rvci1iYXNlZCB1c2FnZVxuICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIEFycmF5LWxpa2UgYmFzZWQgdXNhZ2VcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gX2RlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuZXIoZWxlbWVudCwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5kZWxlZ2F0ZVRhcmdldCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yKTtcblxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbGVtZW50LCBlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcbiJdfQ==
},{"./closest":6}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVqcy5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJwYXRoIiwidXRpbHMiLCJzY29wZU9wdGlvbldhcm5lZCIsIl9WRVJTSU9OX1NUUklORyIsInZlcnNpb24iLCJfREVGQVVMVF9ERUxJTUlURVIiLCJfREVGQVVMVF9MT0NBTFNfTkFNRSIsIl9OQU1FIiwiX1JFR0VYX1NUUklORyIsIl9PUFRTIiwiX09QVFNfRVhQUkVTUyIsImNvbmNhdCIsIl9CT00iLCJleHBvcnRzIiwiY2FjaGUiLCJmaWxlTG9hZGVyIiwicmVhZEZpbGVTeW5jIiwibG9jYWxzTmFtZSIsInJlc29sdmVJbmNsdWRlIiwibmFtZSIsImZpbGVuYW1lIiwiaXNEaXIiLCJkaXJuYW1lIiwiZXh0bmFtZSIsInJlc29sdmUiLCJpbmNsdWRlUGF0aCIsImV4dCIsImdldEluY2x1ZGVQYXRoIiwib3B0aW9ucyIsImZpbGVQYXRoIiwidmlld3MiLCJjaGFyQXQiLCJyZXBsYWNlIiwicm9vdCIsImV4aXN0c1N5bmMiLCJBcnJheSIsImlzQXJyYXkiLCJzb21lIiwidiIsIkVycm9yIiwiaGFuZGxlQ2FjaGUiLCJ0ZW1wbGF0ZSIsImZ1bmMiLCJoYXNUZW1wbGF0ZSIsImFyZ3VtZW50cyIsImxlbmd0aCIsImdldCIsInRvU3RyaW5nIiwiY29tcGlsZSIsInNldCIsInRyeUhhbmRsZUNhY2hlIiwiZGF0YSIsImNiIiwicmVzdWx0IiwiZXJyIiwiaW5jbHVkZUZpbGUiLCJvcHRzIiwic2hhbGxvd0NvcHkiLCJpbmNsdWRlU291cmNlIiwidGVtcGwiLCJUZW1wbGF0ZSIsImdlbmVyYXRlU291cmNlIiwic291cmNlIiwicmV0aHJvdyIsInN0ciIsImZsbm0iLCJsaW5lbm8iLCJlc2MiLCJsaW5lcyIsInNwbGl0Iiwic3RhcnQiLCJNYXRoIiwibWF4IiwiZW5kIiwibWluIiwiY29udGV4dCIsInNsaWNlIiwibWFwIiwibGluZSIsImkiLCJjdXJyIiwiam9pbiIsIm1lc3NhZ2UiLCJzdHJpcFNlbWkiLCJzY29wZSIsImNvbnNvbGUiLCJ3YXJuIiwicmVuZGVyIiwiZCIsIm8iLCJzaGFsbG93Q29weUZyb21MaXN0IiwicmVuZGVyRmlsZSIsInNldHRpbmdzIiwiY2xlYXJDYWNoZSIsInJlc2V0IiwidGV4dCIsInRlbXBsYXRlVGV4dCIsIm1vZGUiLCJ0cnVuY2F0ZSIsImN1cnJlbnRMaW5lIiwiZGVwZW5kZW5jaWVzIiwiY2xpZW50IiwiZXNjYXBlRnVuY3Rpb24iLCJlc2NhcGUiLCJlc2NhcGVYTUwiLCJjb21waWxlRGVidWciLCJkZWJ1ZyIsImRlbGltaXRlciIsInN0cmljdCIsInJtV2hpdGVzcGFjZSIsIl93aXRoIiwicmVnZXgiLCJjcmVhdGVSZWdleCIsIm1vZGVzIiwiRVZBTCIsIkVTQ0FQRUQiLCJSQVciLCJDT01NRU5UIiwiTElURVJBTCIsInByb3RvdHlwZSIsImRlbGltIiwiZXNjYXBlUmVnRXhwQ2hhcnMiLCJSZWdFeHAiLCJzcmMiLCJmbiIsInByZXBlbmRlZCIsImFwcGVuZGVkIiwiZXNjYXBlRm4iLCJKU09OIiwic3RyaW5naWZ5IiwibG9nIiwiRnVuY3Rpb24iLCJlIiwiU3ludGF4RXJyb3IiLCJyZXR1cm5lZEZuIiwiaW5jbHVkZSIsImluY2x1ZGVEYXRhIiwiYXBwbHkiLCJzZWxmIiwibWF0Y2hlcyIsInBhcnNlVGVtcGxhdGVUZXh0IiwiZm9yRWFjaCIsImluZGV4Iiwib3BlbmluZyIsImNsb3NpbmciLCJpbmNsdWRlT3B0cyIsImluY2x1ZGVPYmoiLCJpbmNsdWRlU3JjIiwiaW5kZXhPZiIsIm1hdGNoIiwicHVzaCIsInNjYW5MaW5lIiwicGF0IiwiZXhlYyIsImFyciIsImZpcnN0UG9zIiwic3Vic3RyaW5nIiwiX2FkZE91dHB1dCIsIm5ld0xpbmVDb3VudCIsImxhc3RJbmRleE9mIiwiX19leHByZXNzIiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsIl9jb21waWxlIiwiVkVSU0lPTiIsIndpbmRvdyIsImVqcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7OztBQU9BLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJRSxRQUFRRixRQUFRLFNBQVIsQ0FBWjs7QUFFQSxJQUFJRyxvQkFBb0IsS0FBeEI7QUFDQSxJQUFJQyxrQkFBa0JKLFFBQVEsaUJBQVIsRUFBMkJLLE9BQWpEO0FBQ0EsSUFBSUMscUJBQXFCLEdBQXpCO0FBQ0EsSUFBSUMsdUJBQXVCLFFBQTNCO0FBQ0EsSUFBSUMsUUFBUSxLQUFaO0FBQ0EsSUFBSUMsZ0JBQWdCLHlDQUFwQjtBQUNBLElBQUlDLFFBQVEsQ0FBQyxXQUFELEVBQWMsT0FBZCxFQUF1QixTQUF2QixFQUFrQyxPQUFsQyxFQUEyQyxjQUEzQyxFQUNWLFFBRFUsRUFDQSxPQURBLEVBQ1MsY0FEVCxFQUN5QixRQUR6QixFQUNtQyxVQURuQyxDQUFaO0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSUMsZ0JBQWdCRCxNQUFNRSxNQUFOLENBQWEsT0FBYixDQUFwQjtBQUNBLElBQUlDLE9BQU8sU0FBWDs7QUFFQTs7Ozs7Ozs7QUFRQUMsUUFBUUMsS0FBUixHQUFnQmIsTUFBTWEsS0FBdEI7O0FBRUE7Ozs7Ozs7QUFPQUQsUUFBUUUsVUFBUixHQUFxQmpCLEdBQUdrQixZQUF4Qjs7QUFFQTs7Ozs7Ozs7OztBQVVBSCxRQUFRSSxVQUFSLEdBQXFCWCxvQkFBckI7O0FBRUE7Ozs7Ozs7OztBQVNBTyxRQUFRSyxjQUFSLEdBQXlCLFVBQVNDLElBQVQsRUFBZUMsUUFBZixFQUF5QkMsS0FBekIsRUFBZ0M7QUFDdkQsTUFBSUMsVUFBVXRCLEtBQUtzQixPQUFuQjtBQUNBLE1BQUlDLFVBQVV2QixLQUFLdUIsT0FBbkI7QUFDQSxNQUFJQyxVQUFVeEIsS0FBS3dCLE9BQW5CO0FBQ0EsTUFBSUMsY0FBY0QsUUFBUUgsUUFBUUQsUUFBUixHQUFtQkUsUUFBUUYsUUFBUixDQUEzQixFQUE4Q0QsSUFBOUMsQ0FBbEI7QUFDQSxNQUFJTyxNQUFNSCxRQUFRSixJQUFSLENBQVY7QUFDQSxNQUFJLENBQUNPLEdBQUwsRUFBVTtBQUNSRCxtQkFBZSxNQUFmO0FBQ0Q7QUFDRCxTQUFPQSxXQUFQO0FBQ0QsQ0FWRDs7QUFZQTs7Ozs7OztBQU9BLFNBQVNFLGNBQVQsQ0FBd0IzQixJQUF4QixFQUE4QjRCLE9BQTlCLEVBQXVDO0FBQ3JDLE1BQUlILFdBQUo7QUFDQSxNQUFJSSxRQUFKO0FBQ0EsTUFBSUMsUUFBUUYsUUFBUUUsS0FBcEI7O0FBRUE7QUFDQSxNQUFJOUIsS0FBSytCLE1BQUwsQ0FBWSxDQUFaLEtBQWtCLEdBQXRCLEVBQTJCO0FBQ3pCTixrQkFBY1osUUFBUUssY0FBUixDQUF1QmxCLEtBQUtnQyxPQUFMLENBQWEsTUFBYixFQUFvQixFQUFwQixDQUF2QixFQUFnREosUUFBUUssSUFBUixJQUFnQixHQUFoRSxFQUFxRSxJQUFyRSxDQUFkO0FBQ0Q7QUFDRDtBQUhBLE9BSUs7QUFDSDtBQUNBLFVBQUlMLFFBQVFSLFFBQVosRUFBc0I7QUFDcEJTLG1CQUFXaEIsUUFBUUssY0FBUixDQUF1QmxCLElBQXZCLEVBQTZCNEIsUUFBUVIsUUFBckMsQ0FBWDtBQUNBLFlBQUl0QixHQUFHb0MsVUFBSCxDQUFjTCxRQUFkLENBQUosRUFBNkI7QUFDM0JKLHdCQUFjSSxRQUFkO0FBQ0Q7QUFDRjtBQUNEO0FBQ0EsVUFBSSxDQUFDSixXQUFMLEVBQWtCO0FBQ2hCLFlBQUlVLE1BQU1DLE9BQU4sQ0FBY04sS0FBZCxLQUF3QkEsTUFBTU8sSUFBTixDQUFXLFVBQVVDLENBQVYsRUFBYTtBQUNsRFQscUJBQVdoQixRQUFRSyxjQUFSLENBQXVCbEIsSUFBdkIsRUFBNkJzQyxDQUE3QixFQUFnQyxJQUFoQyxDQUFYO0FBQ0EsaUJBQU94QyxHQUFHb0MsVUFBSCxDQUFjTCxRQUFkLENBQVA7QUFDRCxTQUgyQixDQUE1QixFQUdJO0FBQ0ZKLHdCQUFjSSxRQUFkO0FBQ0Q7QUFDRjtBQUNELFVBQUksQ0FBQ0osV0FBTCxFQUFrQjtBQUNoQixjQUFNLElBQUljLEtBQUosQ0FBVSxzQ0FBVixDQUFOO0FBQ0Q7QUFDRjtBQUNELFNBQU9kLFdBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVNlLFdBQVQsQ0FBcUJaLE9BQXJCLEVBQThCYSxRQUE5QixFQUF3QztBQUN0QyxNQUFJQyxJQUFKO0FBQ0EsTUFBSXRCLFdBQVdRLFFBQVFSLFFBQXZCO0FBQ0EsTUFBSXVCLGNBQWNDLFVBQVVDLE1BQVYsR0FBbUIsQ0FBckM7O0FBRUEsTUFBSWpCLFFBQVFkLEtBQVosRUFBbUI7QUFDakIsUUFBSSxDQUFDTSxRQUFMLEVBQWU7QUFDYixZQUFNLElBQUltQixLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNEO0FBQ0RHLFdBQU83QixRQUFRQyxLQUFSLENBQWNnQyxHQUFkLENBQWtCMUIsUUFBbEIsQ0FBUDtBQUNBLFFBQUlzQixJQUFKLEVBQVU7QUFDUixhQUFPQSxJQUFQO0FBQ0Q7QUFDRCxRQUFJLENBQUNDLFdBQUwsRUFBa0I7QUFDaEJGLGlCQUFXMUIsV0FBV0ssUUFBWCxFQUFxQjJCLFFBQXJCLEdBQWdDZixPQUFoQyxDQUF3Q3BCLElBQXhDLEVBQThDLEVBQTlDLENBQVg7QUFDRDtBQUNGLEdBWEQsTUFZSyxJQUFJLENBQUMrQixXQUFMLEVBQWtCO0FBQ3JCO0FBQ0EsUUFBSSxDQUFDdkIsUUFBTCxFQUFlO0FBQ2IsWUFBTSxJQUFJbUIsS0FBSixDQUFVLGtEQUNBLFVBRFYsQ0FBTjtBQUVEO0FBQ0RFLGVBQVcxQixXQUFXSyxRQUFYLEVBQXFCMkIsUUFBckIsR0FBZ0NmLE9BQWhDLENBQXdDcEIsSUFBeEMsRUFBOEMsRUFBOUMsQ0FBWDtBQUNEO0FBQ0Q4QixTQUFPN0IsUUFBUW1DLE9BQVIsQ0FBZ0JQLFFBQWhCLEVBQTBCYixPQUExQixDQUFQO0FBQ0EsTUFBSUEsUUFBUWQsS0FBWixFQUFtQjtBQUNqQkQsWUFBUUMsS0FBUixDQUFjbUMsR0FBZCxDQUFrQjdCLFFBQWxCLEVBQTRCc0IsSUFBNUI7QUFDRDtBQUNELFNBQU9BLElBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O0FBWUEsU0FBU1EsY0FBVCxDQUF3QnRCLE9BQXhCLEVBQWlDdUIsSUFBakMsRUFBdUNDLEVBQXZDLEVBQTJDO0FBQ3pDLE1BQUlDLE1BQUo7QUFDQSxNQUFJO0FBQ0ZBLGFBQVNiLFlBQVlaLE9BQVosRUFBcUJ1QixJQUFyQixDQUFUO0FBQ0QsR0FGRCxDQUdBLE9BQU9HLEdBQVAsRUFBWTtBQUNWLFdBQU9GLEdBQUdFLEdBQUgsQ0FBUDtBQUNEO0FBQ0QsU0FBT0YsR0FBRyxJQUFILEVBQVNDLE1BQVQsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFNBQVN0QyxVQUFULENBQW9CYyxRQUFwQixFQUE2QjtBQUMzQixTQUFPaEIsUUFBUUUsVUFBUixDQUFtQmMsUUFBbkIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUzBCLFdBQVQsQ0FBcUJ2RCxJQUFyQixFQUEyQjRCLE9BQTNCLEVBQW9DO0FBQ2xDLE1BQUk0QixPQUFPdkQsTUFBTXdELFdBQU4sQ0FBa0IsRUFBbEIsRUFBc0I3QixPQUF0QixDQUFYO0FBQ0E0QixPQUFLcEMsUUFBTCxHQUFnQk8sZUFBZTNCLElBQWYsRUFBcUJ3RCxJQUFyQixDQUFoQjtBQUNBLFNBQU9oQixZQUFZZ0IsSUFBWixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTRSxhQUFULENBQXVCMUQsSUFBdkIsRUFBNkI0QixPQUE3QixFQUFzQztBQUNwQyxNQUFJNEIsT0FBT3ZELE1BQU13RCxXQUFOLENBQWtCLEVBQWxCLEVBQXNCN0IsT0FBdEIsQ0FBWDtBQUNBLE1BQUlILFdBQUo7QUFDQSxNQUFJZ0IsUUFBSjtBQUNBaEIsZ0JBQWNFLGVBQWUzQixJQUFmLEVBQXFCd0QsSUFBckIsQ0FBZDtBQUNBZixhQUFXMUIsV0FBV1UsV0FBWCxFQUF3QnNCLFFBQXhCLEdBQW1DZixPQUFuQyxDQUEyQ3BCLElBQTNDLEVBQWlELEVBQWpELENBQVg7QUFDQTRDLE9BQUtwQyxRQUFMLEdBQWdCSyxXQUFoQjtBQUNBLE1BQUlrQyxRQUFRLElBQUlDLFFBQUosQ0FBYW5CLFFBQWIsRUFBdUJlLElBQXZCLENBQVo7QUFDQUcsUUFBTUUsY0FBTjtBQUNBLFNBQU87QUFDTEMsWUFBUUgsTUFBTUcsTUFEVDtBQUVMMUMsY0FBVUssV0FGTDtBQUdMZ0IsY0FBVUE7QUFITCxHQUFQO0FBS0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFTc0IsT0FBVCxDQUFpQlQsR0FBakIsRUFBc0JVLEdBQXRCLEVBQTJCQyxJQUEzQixFQUFpQ0MsTUFBakMsRUFBeUNDLEdBQXpDLEVBQTZDO0FBQzNDLE1BQUlDLFFBQVFKLElBQUlLLEtBQUosQ0FBVSxJQUFWLENBQVo7QUFDQSxNQUFJQyxRQUFRQyxLQUFLQyxHQUFMLENBQVNOLFNBQVMsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBWjtBQUNBLE1BQUlPLE1BQU1GLEtBQUtHLEdBQUwsQ0FBU04sTUFBTXZCLE1BQWYsRUFBdUJxQixTQUFTLENBQWhDLENBQVY7QUFDQSxNQUFJOUMsV0FBVytDLElBQUlGLElBQUosQ0FBZixDQUoyQyxDQUlqQjtBQUMxQjtBQUNBLE1BQUlVLFVBQVVQLE1BQU1RLEtBQU4sQ0FBWU4sS0FBWixFQUFtQkcsR0FBbkIsRUFBd0JJLEdBQXhCLENBQTRCLFVBQVVDLElBQVYsRUFBZ0JDLENBQWhCLEVBQWtCO0FBQzFELFFBQUlDLE9BQU9ELElBQUlULEtBQUosR0FBWSxDQUF2QjtBQUNBLFdBQU8sQ0FBQ1UsUUFBUWQsTUFBUixHQUFpQixNQUFqQixHQUEwQixNQUEzQixJQUNIYyxJQURHLEdBRUgsSUFGRyxHQUdIRixJQUhKO0FBSUQsR0FOYSxFQU1YRyxJQU5XLENBTU4sSUFOTSxDQUFkOztBQVFBO0FBQ0EzQixNQUFJdEQsSUFBSixHQUFXb0IsUUFBWDtBQUNBa0MsTUFBSTRCLE9BQUosR0FBYyxDQUFDOUQsWUFBWSxLQUFiLElBQXNCLEdBQXRCLEdBQ1Y4QyxNQURVLEdBQ0QsSUFEQyxHQUVWUyxPQUZVLEdBRUEsTUFGQSxHQUdWckIsSUFBSTRCLE9BSFI7O0FBS0EsUUFBTTVCLEdBQU47QUFDRDs7QUFFRCxTQUFTNkIsU0FBVCxDQUFtQm5CLEdBQW5CLEVBQXVCO0FBQ3JCLFNBQU9BLElBQUloQyxPQUFKLENBQVksU0FBWixFQUF1QixJQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OztBQVlBbkIsUUFBUW1DLE9BQVIsR0FBa0IsU0FBU0EsT0FBVCxDQUFpQlAsUUFBakIsRUFBMkJlLElBQTNCLEVBQWlDO0FBQ2pELE1BQUlHLEtBQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSUgsUUFBUUEsS0FBSzRCLEtBQWpCLEVBQXdCO0FBQ3RCLFFBQUksQ0FBQ2xGLGlCQUFMLEVBQXVCO0FBQ3JCbUYsY0FBUUMsSUFBUixDQUFhLDJEQUFiO0FBQ0FwRiwwQkFBb0IsSUFBcEI7QUFDRDtBQUNELFFBQUksQ0FBQ3NELEtBQUttQixPQUFWLEVBQW1CO0FBQ2pCbkIsV0FBS21CLE9BQUwsR0FBZW5CLEtBQUs0QixLQUFwQjtBQUNEO0FBQ0QsV0FBTzVCLEtBQUs0QixLQUFaO0FBQ0Q7QUFDRHpCLFVBQVEsSUFBSUMsUUFBSixDQUFhbkIsUUFBYixFQUF1QmUsSUFBdkIsQ0FBUjtBQUNBLFNBQU9HLE1BQU1YLE9BQU4sRUFBUDtBQUNELENBbEJEOztBQW9CQTs7Ozs7Ozs7Ozs7OztBQWFBbkMsUUFBUTBFLE1BQVIsR0FBaUIsVUFBVTlDLFFBQVYsRUFBb0IrQyxDQUFwQixFQUF1QkMsQ0FBdkIsRUFBMEI7QUFDekMsTUFBSXRDLE9BQU9xQyxLQUFLLEVBQWhCO0FBQ0EsTUFBSWhDLE9BQU9pQyxLQUFLLEVBQWhCOztBQUVBO0FBQ0E7QUFDQSxNQUFJN0MsVUFBVUMsTUFBVixJQUFvQixDQUF4QixFQUEyQjtBQUN6QjVDLFVBQU15RixtQkFBTixDQUEwQmxDLElBQTFCLEVBQWdDTCxJQUFoQyxFQUFzQzFDLEtBQXRDO0FBQ0Q7O0FBRUQsU0FBTytCLFlBQVlnQixJQUFaLEVBQWtCZixRQUFsQixFQUE0QlUsSUFBNUIsQ0FBUDtBQUNELENBWEQ7O0FBYUE7Ozs7Ozs7Ozs7Ozs7QUFhQXRDLFFBQVE4RSxVQUFSLEdBQXFCLFlBQVk7QUFDL0IsTUFBSXZFLFdBQVd3QixVQUFVLENBQVYsQ0FBZjtBQUNBLE1BQUlRLEtBQUtSLFVBQVVBLFVBQVVDLE1BQVYsR0FBbUIsQ0FBN0IsQ0FBVDtBQUNBLE1BQUlXLE9BQU8sRUFBQ3BDLFVBQVVBLFFBQVgsRUFBWDtBQUNBLE1BQUkrQixJQUFKOztBQUVBLE1BQUlQLFVBQVVDLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEJNLFdBQU9QLFVBQVUsQ0FBVixDQUFQOztBQUVBO0FBQ0E7QUFDQSxRQUFJQSxVQUFVQyxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCO0FBQ0EsVUFBSU0sS0FBS3lDLFFBQVQsRUFBbUI7QUFDakIsWUFBSXpDLEtBQUt5QyxRQUFMLENBQWMsY0FBZCxDQUFKLEVBQW1DO0FBQ2pDM0YsZ0JBQU15RixtQkFBTixDQUEwQmxDLElBQTFCLEVBQWdDTCxLQUFLeUMsUUFBTCxDQUFjLGNBQWQsQ0FBaEMsRUFBK0RsRixhQUEvRDtBQUNEO0FBQ0QsWUFBSXlDLEtBQUt5QyxRQUFMLENBQWM5RCxLQUFsQixFQUF5QjtBQUN2QjBCLGVBQUsxQixLQUFMLEdBQWFxQixLQUFLeUMsUUFBTCxDQUFjOUQsS0FBM0I7QUFDRDtBQUNGO0FBQ0Q7QUFSQSxXQVNLO0FBQ0g3QixnQkFBTXlGLG1CQUFOLENBQTBCbEMsSUFBMUIsRUFBZ0NMLElBQWhDLEVBQXNDekMsYUFBdEM7QUFDRDtBQUNGLEtBZEQsTUFlSztBQUNIO0FBQ0FULFlBQU13RCxXQUFOLENBQWtCRCxJQUFsQixFQUF3QlosVUFBVSxDQUFWLENBQXhCO0FBQ0Q7O0FBRURZLFNBQUtwQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNELEdBMUJELE1BMkJLO0FBQ0grQixXQUFPLEVBQVA7QUFDRDs7QUFFRCxTQUFPRCxlQUFlTSxJQUFmLEVBQXFCTCxJQUFyQixFQUEyQkMsRUFBM0IsQ0FBUDtBQUNELENBdENEOztBQXdDQTs7Ozs7QUFLQXZDLFFBQVFnRixVQUFSLEdBQXFCLFlBQVk7QUFDL0JoRixVQUFRQyxLQUFSLENBQWNnRixLQUFkO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTbEMsUUFBVCxDQUFrQm1DLElBQWxCLEVBQXdCdkMsSUFBeEIsRUFBOEI7QUFDNUJBLFNBQU9BLFFBQVEsRUFBZjtBQUNBLE1BQUk1QixVQUFVLEVBQWQ7QUFDQSxPQUFLb0UsWUFBTCxHQUFvQkQsSUFBcEI7QUFDQSxPQUFLRSxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxPQUFLQyxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsT0FBS3JDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsT0FBS3NDLFlBQUwsR0FBb0IsRUFBcEI7QUFDQXhFLFVBQVF5RSxNQUFSLEdBQWlCN0MsS0FBSzZDLE1BQUwsSUFBZSxLQUFoQztBQUNBekUsVUFBUTBFLGNBQVIsR0FBeUI5QyxLQUFLK0MsTUFBTCxJQUFldEcsTUFBTXVHLFNBQTlDO0FBQ0E1RSxVQUFRNkUsWUFBUixHQUF1QmpELEtBQUtpRCxZQUFMLEtBQXNCLEtBQTdDO0FBQ0E3RSxVQUFROEUsS0FBUixHQUFnQixDQUFDLENBQUNsRCxLQUFLa0QsS0FBdkI7QUFDQTlFLFVBQVFSLFFBQVIsR0FBbUJvQyxLQUFLcEMsUUFBeEI7QUFDQVEsVUFBUStFLFNBQVIsR0FBb0JuRCxLQUFLbUQsU0FBTCxJQUFrQjlGLFFBQVE4RixTQUExQixJQUF1Q3RHLGtCQUEzRDtBQUNBdUIsVUFBUWdGLE1BQVIsR0FBaUJwRCxLQUFLb0QsTUFBTCxJQUFlLEtBQWhDO0FBQ0FoRixVQUFRK0MsT0FBUixHQUFrQm5CLEtBQUttQixPQUF2QjtBQUNBL0MsVUFBUWQsS0FBUixHQUFnQjBDLEtBQUsxQyxLQUFMLElBQWMsS0FBOUI7QUFDQWMsVUFBUWlGLFlBQVIsR0FBdUJyRCxLQUFLcUQsWUFBNUI7QUFDQWpGLFVBQVFLLElBQVIsR0FBZXVCLEtBQUt2QixJQUFwQjtBQUNBTCxVQUFRWCxVQUFSLEdBQXFCdUMsS0FBS3ZDLFVBQUwsSUFBbUJKLFFBQVFJLFVBQTNCLElBQXlDWCxvQkFBOUQ7QUFDQXNCLFVBQVFFLEtBQVIsR0FBZ0IwQixLQUFLMUIsS0FBckI7O0FBRUEsTUFBSUYsUUFBUWdGLE1BQVosRUFBb0I7QUFDbEJoRixZQUFRa0YsS0FBUixHQUFnQixLQUFoQjtBQUNELEdBRkQsTUFHSztBQUNIbEYsWUFBUWtGLEtBQVIsR0FBZ0IsT0FBT3RELEtBQUtzRCxLQUFaLElBQXFCLFdBQXJCLEdBQW1DdEQsS0FBS3NELEtBQXhDLEdBQWdELElBQWhFO0FBQ0Q7O0FBRUQsT0FBS3RELElBQUwsR0FBWTVCLE9BQVo7O0FBRUEsT0FBS21GLEtBQUwsR0FBYSxLQUFLQyxXQUFMLEVBQWI7QUFDRDs7QUFFRHBELFNBQVNxRCxLQUFULEdBQWlCO0FBQ2ZDLFFBQU0sTUFEUztBQUVmQyxXQUFTLFNBRk07QUFHZkMsT0FBSyxLQUhVO0FBSWZDLFdBQVMsU0FKTTtBQUtmQyxXQUFTO0FBTE0sQ0FBakI7O0FBUUExRCxTQUFTMkQsU0FBVCxHQUFxQjtBQUNuQlAsZUFBYSxZQUFZO0FBQ3ZCLFFBQUloRCxNQUFNeEQsYUFBVjtBQUNBLFFBQUlnSCxRQUFRdkgsTUFBTXdILGlCQUFOLENBQXdCLEtBQUtqRSxJQUFMLENBQVVtRCxTQUFsQyxDQUFaO0FBQ0EzQyxVQUFNQSxJQUFJaEMsT0FBSixDQUFZLElBQVosRUFBa0J3RixLQUFsQixDQUFOO0FBQ0EsV0FBTyxJQUFJRSxNQUFKLENBQVcxRCxHQUFYLENBQVA7QUFDRCxHQU5rQjs7QUFRbkJoQixXQUFTLFlBQVk7QUFDbkIsUUFBSTJFLEdBQUo7QUFDQSxRQUFJQyxFQUFKO0FBQ0EsUUFBSXBFLE9BQU8sS0FBS0EsSUFBaEI7QUFDQSxRQUFJcUUsWUFBWSxFQUFoQjtBQUNBLFFBQUlDLFdBQVcsRUFBZjtBQUNBLFFBQUlDLFdBQVd2RSxLQUFLOEMsY0FBcEI7O0FBRUEsUUFBSSxDQUFDLEtBQUt4QyxNQUFWLEVBQWtCO0FBQ2hCLFdBQUtELGNBQUw7QUFDQWdFLG1CQUFhLGtFQUFrRSxJQUEvRTtBQUNBLFVBQUlyRSxLQUFLc0QsS0FBTCxLQUFlLEtBQW5CLEVBQTBCO0FBQ3hCZSxxQkFBYyxhQUFhckUsS0FBS3ZDLFVBQWxCLEdBQStCLFdBQS9CLEdBQTZDLElBQTNEO0FBQ0E2RyxvQkFBWSxRQUFRLElBQXBCO0FBQ0Q7QUFDREEsa0JBQVksZ0NBQWdDLElBQTVDO0FBQ0EsV0FBS2hFLE1BQUwsR0FBYytELFlBQVksS0FBSy9ELE1BQWpCLEdBQTBCZ0UsUUFBeEM7QUFDRDs7QUFFRCxRQUFJdEUsS0FBS2lELFlBQVQsRUFBdUI7QUFDckJrQixZQUFNLG1CQUFtQixJQUFuQixHQUNBLGdCQURBLEdBQ21CSyxLQUFLQyxTQUFMLENBQWUsS0FBS2pDLFlBQXBCLENBRG5CLEdBQ3VELElBRHZELEdBRUEsbUJBRkEsSUFFdUJ4QyxLQUFLcEMsUUFBTCxHQUNuQjRHLEtBQUtDLFNBQUwsQ0FBZXpFLEtBQUtwQyxRQUFwQixDQURtQixHQUNhLFdBSHBDLElBR21ELEdBSG5ELEdBR3lELElBSHpELEdBSUEsT0FKQSxHQUlVLElBSlYsR0FLQSxLQUFLMEMsTUFMTCxHQU1BLGVBTkEsR0FNa0IsSUFObEIsR0FPQSxzREFQQSxHQU95RCxJQVB6RCxHQVFBLEdBUkEsR0FRTSxJQVJaO0FBU0QsS0FWRCxNQVdLO0FBQ0g2RCxZQUFNLEtBQUs3RCxNQUFYO0FBQ0Q7O0FBRUQsUUFBSU4sS0FBSzZDLE1BQVQsRUFBaUI7QUFDZnNCLFlBQU0sNEJBQTRCSSxTQUFTaEYsUUFBVCxFQUE1QixHQUFrRCxHQUFsRCxHQUF3RCxJQUF4RCxHQUErRDRFLEdBQXJFO0FBQ0EsVUFBSW5FLEtBQUtpRCxZQUFULEVBQXVCO0FBQ3JCa0IsY0FBTSwwQkFBMEI1RCxRQUFRaEIsUUFBUixFQUExQixHQUErQyxHQUEvQyxHQUFxRCxJQUFyRCxHQUE0RDRFLEdBQWxFO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJbkUsS0FBS29ELE1BQVQsRUFBaUI7QUFDZmUsWUFBTSxvQkFBb0JBLEdBQTFCO0FBQ0Q7QUFDRCxRQUFJbkUsS0FBS2tELEtBQVQsRUFBZ0I7QUFDZHJCLGNBQVE2QyxHQUFSLENBQVlQLEdBQVo7QUFDRDs7QUFFRCxRQUFJO0FBQ0ZDLFdBQUssSUFBSU8sUUFBSixDQUFhM0UsS0FBS3ZDLFVBQUwsR0FBa0IsOEJBQS9CLEVBQStEMEcsR0FBL0QsQ0FBTDtBQUNELEtBRkQsQ0FHQSxPQUFNUyxDQUFOLEVBQVM7QUFDUDtBQUNBLFVBQUlBLGFBQWFDLFdBQWpCLEVBQThCO0FBQzVCLFlBQUk3RSxLQUFLcEMsUUFBVCxFQUFtQjtBQUNqQmdILFlBQUVsRCxPQUFGLElBQWEsU0FBUzFCLEtBQUtwQyxRQUEzQjtBQUNEO0FBQ0RnSCxVQUFFbEQsT0FBRixJQUFhLDBCQUFiO0FBQ0FrRCxVQUFFbEQsT0FBRixJQUFhLG9FQUFiO0FBQ0FrRCxVQUFFbEQsT0FBRixJQUFhLHFDQUFiO0FBQ0Q7QUFDRCxZQUFNa0QsQ0FBTjtBQUNEOztBQUVELFFBQUk1RSxLQUFLNkMsTUFBVCxFQUFpQjtBQUNmdUIsU0FBR3hCLFlBQUgsR0FBa0IsS0FBS0EsWUFBdkI7QUFDQSxhQUFPd0IsRUFBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFFBQUlVLGFBQWEsVUFBVW5GLElBQVYsRUFBZ0I7QUFDL0IsVUFBSW9GLFVBQVUsVUFBVXZJLElBQVYsRUFBZ0J3SSxXQUFoQixFQUE2QjtBQUN6QyxZQUFJaEQsSUFBSXZGLE1BQU13RCxXQUFOLENBQWtCLEVBQWxCLEVBQXNCTixJQUF0QixDQUFSO0FBQ0EsWUFBSXFGLFdBQUosRUFBaUI7QUFDZmhELGNBQUl2RixNQUFNd0QsV0FBTixDQUFrQitCLENBQWxCLEVBQXFCZ0QsV0FBckIsQ0FBSjtBQUNEO0FBQ0QsZUFBT2pGLFlBQVl2RCxJQUFaLEVBQWtCd0QsSUFBbEIsRUFBd0JnQyxDQUF4QixDQUFQO0FBQ0QsT0FORDtBQU9BLGFBQU9vQyxHQUFHYSxLQUFILENBQVNqRixLQUFLbUIsT0FBZCxFQUF1QixDQUFDeEIsUUFBUSxFQUFULEVBQWE0RSxRQUFiLEVBQXVCUSxPQUF2QixFQUFnQ3hFLE9BQWhDLENBQXZCLENBQVA7QUFDRCxLQVREO0FBVUF1RSxlQUFXbEMsWUFBWCxHQUEwQixLQUFLQSxZQUEvQjtBQUNBLFdBQU9rQyxVQUFQO0FBQ0QsR0E1RmtCOztBQThGbkJ6RSxrQkFBZ0IsWUFBWTtBQUMxQixRQUFJTCxPQUFPLEtBQUtBLElBQWhCOztBQUVBLFFBQUlBLEtBQUtxRCxZQUFULEVBQXVCO0FBQ3JCO0FBQ0E7QUFDQSxXQUFLYixZQUFMLEdBQ0UsS0FBS0EsWUFBTCxDQUFrQmhFLE9BQWxCLENBQTBCLEtBQTFCLEVBQWlDLEVBQWpDLEVBQXFDQSxPQUFyQyxDQUE2QyxhQUE3QyxFQUE0RCxFQUE1RCxDQURGO0FBRUQ7O0FBRUQ7QUFDQSxTQUFLZ0UsWUFBTCxHQUNFLEtBQUtBLFlBQUwsQ0FBa0JoRSxPQUFsQixDQUEwQixhQUExQixFQUF5QyxLQUF6QyxFQUFnREEsT0FBaEQsQ0FBd0QsYUFBeEQsRUFBdUUsS0FBdkUsQ0FERjs7QUFHQSxRQUFJMEcsT0FBTyxJQUFYO0FBQ0EsUUFBSUMsVUFBVSxLQUFLQyxpQkFBTCxFQUFkO0FBQ0EsUUFBSXBELElBQUksS0FBS2hDLElBQUwsQ0FBVW1ELFNBQWxCOztBQUVBLFFBQUlnQyxXQUFXQSxRQUFROUYsTUFBdkIsRUFBK0I7QUFDN0I4RixjQUFRRSxPQUFSLENBQWdCLFVBQVUvRCxJQUFWLEVBQWdCZ0UsS0FBaEIsRUFBdUI7QUFDckMsWUFBSUMsT0FBSjtBQUNBLFlBQUlDLE9BQUo7QUFDQSxZQUFJVCxPQUFKO0FBQ0EsWUFBSVUsV0FBSjtBQUNBLFlBQUlDLFVBQUo7QUFDQSxZQUFJQyxVQUFKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFLckUsS0FBS3NFLE9BQUwsQ0FBYSxNQUFNNUQsQ0FBbkIsTUFBMEIsQ0FBMUIsQ0FBbUM7QUFBbkMsV0FDQVYsS0FBS3NFLE9BQUwsQ0FBYSxNQUFNNUQsQ0FBTixHQUFVQSxDQUF2QixNQUE4QixDQURuQyxFQUNzQztBQUFFO0FBQ3RDd0Qsb0JBQVVMLFFBQVFHLFFBQVEsQ0FBaEIsQ0FBVjtBQUNBLGNBQUksRUFBRUUsV0FBV3hELElBQUksR0FBZixJQUFzQndELFdBQVcsTUFBTXhELENBQU4sR0FBVSxHQUEzQyxJQUFrRHdELFdBQVcsTUFBTXhELENBQU4sR0FBVSxHQUF6RSxDQUFKLEVBQW1GO0FBQ2pGLGtCQUFNLElBQUlqRCxLQUFKLENBQVUsNENBQTRDdUMsSUFBNUMsR0FBbUQsSUFBN0QsQ0FBTjtBQUNEO0FBQ0Y7QUFDRDtBQUNBLFlBQUt5RCxVQUFVekQsS0FBS3VFLEtBQUwsQ0FBVyxxQkFBWCxDQUFmLEVBQW1EO0FBQ2pETixvQkFBVUosUUFBUUcsUUFBUSxDQUFoQixDQUFWO0FBQ0E7QUFDQSxjQUFJQyxZQUFZQSxXQUFXLE1BQU12RCxDQUFqQixJQUFzQnVELFdBQVcsTUFBTXZELENBQU4sR0FBVSxHQUEzQyxJQUFrRHVELFdBQVcsTUFBTXZELENBQU4sR0FBVSxHQUFuRixDQUFKLEVBQTZGO0FBQzNGeUQsMEJBQWNoSixNQUFNd0QsV0FBTixDQUFrQixFQUFsQixFQUFzQmlGLEtBQUtsRixJQUEzQixDQUFkO0FBQ0EwRix5QkFBYXhGLGNBQWM2RSxRQUFRLENBQVIsQ0FBZCxFQUEwQlUsV0FBMUIsQ0FBYjtBQUNBLGdCQUFJUCxLQUFLbEYsSUFBTCxDQUFVaUQsWUFBZCxFQUE0QjtBQUMxQjBDLDJCQUNJLHVCQUF1QixJQUF2QixHQUNFLHNCQURGLEdBQzJCLElBRDNCLEdBRUUsb0JBRkYsR0FFeUJuQixLQUFLQyxTQUFMLENBQWVpQixXQUFXekcsUUFBMUIsQ0FGekIsR0FFK0QsSUFGL0QsR0FHRSx1QkFIRixHQUc0QnVGLEtBQUtDLFNBQUwsQ0FBZWlCLFdBQVc5SCxRQUExQixDQUg1QixHQUdrRSxHQUhsRSxHQUd3RSxJQUh4RSxHQUlFLGFBSkYsR0FJa0IsSUFKbEIsR0FLRThILFdBQVdwRixNQUxiLEdBTUUscUJBTkYsR0FNMEIsSUFOMUIsR0FPRSw0REFQRixHQU9pRSxJQVBqRSxHQVFFLFNBUkYsR0FRYyxJQVJkLEdBU0UscUJBVEYsR0FTMEIsSUFWOUI7QUFXRCxhQVpELE1BWUs7QUFDSHFGLDJCQUFhLHVCQUF1QixJQUF2QixHQUE4QkQsV0FBV3BGLE1BQXpDLEdBQ1QscUJBRFMsR0FDZSxJQUQ1QjtBQUVEO0FBQ0Q0RSxpQkFBSzVFLE1BQUwsSUFBZXFGLFVBQWY7QUFDQVQsaUJBQUt0QyxZQUFMLENBQWtCa0QsSUFBbEIsQ0FBdUJ6SSxRQUFRSyxjQUFSLENBQXVCcUgsUUFBUSxDQUFSLENBQXZCLEVBQ25CVSxZQUFZN0gsUUFETyxDQUF2QjtBQUVBO0FBQ0Q7QUFDRjtBQUNEc0gsYUFBS2EsUUFBTCxDQUFjekUsSUFBZDtBQUNELE9BaEREO0FBaUREO0FBRUYsR0FwS2tCOztBQXNLbkI4RCxxQkFBbUIsWUFBWTtBQUM3QixRQUFJNUUsTUFBTSxLQUFLZ0MsWUFBZjtBQUNBLFFBQUl3RCxNQUFNLEtBQUt6QyxLQUFmO0FBQ0EsUUFBSTFELFNBQVNtRyxJQUFJQyxJQUFKLENBQVN6RixHQUFULENBQWI7QUFDQSxRQUFJMEYsTUFBTSxFQUFWO0FBQ0EsUUFBSUMsUUFBSjs7QUFFQSxXQUFPdEcsTUFBUCxFQUFlO0FBQ2JzRyxpQkFBV3RHLE9BQU95RixLQUFsQjs7QUFFQSxVQUFJYSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCRCxZQUFJSixJQUFKLENBQVN0RixJQUFJNEYsU0FBSixDQUFjLENBQWQsRUFBaUJELFFBQWpCLENBQVQ7QUFDQTNGLGNBQU1BLElBQUlZLEtBQUosQ0FBVStFLFFBQVYsQ0FBTjtBQUNEOztBQUVERCxVQUFJSixJQUFKLENBQVNqRyxPQUFPLENBQVAsQ0FBVDtBQUNBVyxZQUFNQSxJQUFJWSxLQUFKLENBQVV2QixPQUFPLENBQVAsRUFBVVIsTUFBcEIsQ0FBTjtBQUNBUSxlQUFTbUcsSUFBSUMsSUFBSixDQUFTekYsR0FBVCxDQUFUO0FBQ0Q7O0FBRUQsUUFBSUEsR0FBSixFQUFTO0FBQ1AwRixVQUFJSixJQUFKLENBQVN0RixHQUFUO0FBQ0Q7O0FBRUQsV0FBTzBGLEdBQVA7QUFDRCxHQS9Ma0I7O0FBaU1uQkcsY0FBWSxVQUFVL0UsSUFBVixFQUFnQjtBQUMxQixRQUFJLEtBQUtvQixRQUFULEVBQW1CO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQXBCLGFBQU9BLEtBQUs5QyxPQUFMLENBQWEsaUJBQWIsRUFBZ0MsRUFBaEMsQ0FBUDtBQUNBLFdBQUtrRSxRQUFMLEdBQWdCLEtBQWhCO0FBQ0QsS0FSRCxNQVNLLElBQUksS0FBSzFDLElBQUwsQ0FBVXFELFlBQWQsRUFBNEI7QUFDL0I7QUFDQTtBQUNBL0IsYUFBT0EsS0FBSzlDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLENBQVA7QUFDRDtBQUNELFFBQUksQ0FBQzhDLElBQUwsRUFBVztBQUNULGFBQU9BLElBQVA7QUFDRDs7QUFFRDtBQUNBQSxXQUFPQSxLQUFLOUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsTUFBcEIsQ0FBUDs7QUFFQTtBQUNBOEMsV0FBT0EsS0FBSzlDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEtBQXBCLENBQVA7QUFDQThDLFdBQU9BLEtBQUs5QyxPQUFMLENBQWEsS0FBYixFQUFvQixLQUFwQixDQUFQOztBQUVBO0FBQ0E7QUFDQThDLFdBQU9BLEtBQUs5QyxPQUFMLENBQWEsSUFBYixFQUFtQixLQUFuQixDQUFQO0FBQ0EsU0FBSzhCLE1BQUwsSUFBZSxxQkFBcUJnQixJQUFyQixHQUE0QixJQUE1QixHQUFtQyxJQUFsRDtBQUNELEdBL05rQjs7QUFpT25CeUUsWUFBVSxVQUFVekUsSUFBVixFQUFnQjtBQUN4QixRQUFJNEQsT0FBTyxJQUFYO0FBQ0EsUUFBSWxELElBQUksS0FBS2hDLElBQUwsQ0FBVW1ELFNBQWxCO0FBQ0EsUUFBSW1ELGVBQWUsQ0FBbkI7O0FBRUFBLG1CQUFnQmhGLEtBQUtULEtBQUwsQ0FBVyxJQUFYLEVBQWlCeEIsTUFBakIsR0FBMEIsQ0FBMUM7O0FBRUEsWUFBUWlDLElBQVI7QUFDQSxXQUFLLE1BQU1VLENBQVg7QUFDQSxXQUFLLE1BQU1BLENBQU4sR0FBVSxHQUFmO0FBQ0UsYUFBS1MsSUFBTCxHQUFZckMsU0FBU3FELEtBQVQsQ0FBZUMsSUFBM0I7QUFDQTtBQUNGLFdBQUssTUFBTTFCLENBQU4sR0FBVSxHQUFmO0FBQ0UsYUFBS1MsSUFBTCxHQUFZckMsU0FBU3FELEtBQVQsQ0FBZUUsT0FBM0I7QUFDQTtBQUNGLFdBQUssTUFBTTNCLENBQU4sR0FBVSxHQUFmO0FBQ0UsYUFBS1MsSUFBTCxHQUFZckMsU0FBU3FELEtBQVQsQ0FBZUcsR0FBM0I7QUFDQTtBQUNGLFdBQUssTUFBTTVCLENBQU4sR0FBVSxHQUFmO0FBQ0UsYUFBS1MsSUFBTCxHQUFZckMsU0FBU3FELEtBQVQsQ0FBZUksT0FBM0I7QUFDQTtBQUNGLFdBQUssTUFBTTdCLENBQU4sR0FBVUEsQ0FBZjtBQUNFLGFBQUtTLElBQUwsR0FBWXJDLFNBQVNxRCxLQUFULENBQWVLLE9BQTNCO0FBQ0EsYUFBS3hELE1BQUwsSUFBZSxxQkFBcUJnQixLQUFLOUMsT0FBTCxDQUFhLE1BQU13RCxDQUFOLEdBQVVBLENBQXZCLEVBQTBCLE1BQU1BLENBQWhDLENBQXJCLEdBQTBELElBQTFELEdBQWlFLElBQWhGO0FBQ0E7QUFDRixXQUFLQSxJQUFJQSxDQUFKLEdBQVEsR0FBYjtBQUNFLGFBQUtTLElBQUwsR0FBWXJDLFNBQVNxRCxLQUFULENBQWVLLE9BQTNCO0FBQ0EsYUFBS3hELE1BQUwsSUFBZSxxQkFBcUJnQixLQUFLOUMsT0FBTCxDQUFhd0QsSUFBSUEsQ0FBSixHQUFRLEdBQXJCLEVBQTBCQSxJQUFJLEdBQTlCLENBQXJCLEdBQTBELElBQTFELEdBQWlFLElBQWhGO0FBQ0E7QUFDRixXQUFLQSxJQUFJLEdBQVQ7QUFDQSxXQUFLLE1BQU1BLENBQU4sR0FBVSxHQUFmO0FBQ0EsV0FBSyxNQUFNQSxDQUFOLEdBQVUsR0FBZjtBQUNFLFlBQUksS0FBS1MsSUFBTCxJQUFhckMsU0FBU3FELEtBQVQsQ0FBZUssT0FBaEMsRUFBeUM7QUFDdkMsZUFBS3VDLFVBQUwsQ0FBZ0IvRSxJQUFoQjtBQUNEOztBQUVELGFBQUttQixJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0JwQixLQUFLc0UsT0FBTCxDQUFhLEdBQWIsTUFBc0IsQ0FBdEIsSUFBMkJ0RSxLQUFLc0UsT0FBTCxDQUFhLEdBQWIsTUFBc0IsQ0FBakU7QUFDQTtBQUNGO0FBQ0k7QUFDRixZQUFJLEtBQUtuRCxJQUFULEVBQWU7QUFDWDtBQUNGLGtCQUFRLEtBQUtBLElBQWI7QUFDQSxpQkFBS3JDLFNBQVNxRCxLQUFULENBQWVDLElBQXBCO0FBQ0EsaUJBQUt0RCxTQUFTcUQsS0FBVCxDQUFlRSxPQUFwQjtBQUNBLGlCQUFLdkQsU0FBU3FELEtBQVQsQ0FBZUcsR0FBcEI7QUFDRSxrQkFBSXRDLEtBQUtpRixXQUFMLENBQWlCLElBQWpCLElBQXlCakYsS0FBS2lGLFdBQUwsQ0FBaUIsSUFBakIsQ0FBN0IsRUFBcUQ7QUFDbkRqRix3QkFBUSxJQUFSO0FBQ0Q7QUFOSDtBQVFBLGtCQUFRLEtBQUttQixJQUFiO0FBQ0k7QUFDSixpQkFBS3JDLFNBQVNxRCxLQUFULENBQWVDLElBQXBCO0FBQ0UsbUJBQUtwRCxNQUFMLElBQWUsV0FBV2dCLElBQVgsR0FBa0IsSUFBakM7QUFDQTtBQUNFO0FBQ0osaUJBQUtsQixTQUFTcUQsS0FBVCxDQUFlRSxPQUFwQjtBQUNFLG1CQUFLckQsTUFBTCxJQUFlLDZCQUE2QnFCLFVBQVVMLElBQVYsQ0FBN0IsR0FBK0MsSUFBL0MsR0FBc0QsSUFBckU7QUFDQTtBQUNFO0FBQ0osaUJBQUtsQixTQUFTcUQsS0FBVCxDQUFlRyxHQUFwQjtBQUNFLG1CQUFLdEQsTUFBTCxJQUFlLG9CQUFvQnFCLFVBQVVMLElBQVYsQ0FBcEIsR0FBc0MsR0FBdEMsR0FBNEMsSUFBM0Q7QUFDQTtBQUNGLGlCQUFLbEIsU0FBU3FELEtBQVQsQ0FBZUksT0FBcEI7QUFDTTtBQUNKO0FBQ0U7QUFDSixpQkFBS3pELFNBQVNxRCxLQUFULENBQWVLLE9BQXBCO0FBQ0UsbUJBQUt1QyxVQUFMLENBQWdCL0UsSUFBaEI7QUFDQTtBQW5CRjtBQXFCRDtBQUNDO0FBaENGLGFBaUNLO0FBQ0gsaUJBQUsrRSxVQUFMLENBQWdCL0UsSUFBaEI7QUFDRDtBQXJFSDs7QUF3RUEsUUFBSTRELEtBQUtsRixJQUFMLENBQVVpRCxZQUFWLElBQTBCcUQsWUFBOUIsRUFBNEM7QUFDMUMsV0FBSzNELFdBQUwsSUFBb0IyRCxZQUFwQjtBQUNBLFdBQUtoRyxNQUFMLElBQWUsb0JBQW9CLEtBQUtxQyxXQUF6QixHQUF1QyxJQUF0RDtBQUNEO0FBQ0Y7QUFwVGtCLENBQXJCOztBQXVUQTs7Ozs7Ozs7Ozs7O0FBWUF0RixRQUFRMkYsU0FBUixHQUFvQnZHLE1BQU11RyxTQUExQjs7QUFFQTs7Ozs7Ozs7O0FBU0EzRixRQUFRbUosU0FBUixHQUFvQm5KLFFBQVE4RSxVQUE1Qjs7QUFFQTtBQUNBO0FBQ0EsSUFBSTVGLFFBQVFrSyxVQUFaLEVBQXdCO0FBQ3RCbEssVUFBUWtLLFVBQVIsQ0FBbUIsTUFBbkIsSUFBNkIsVUFBVUMsTUFBVixFQUFrQmpHLElBQWxCLEVBQXdCO0FBQ25ELFFBQUk3QyxXQUFXNkMsUUFBUSwwQkFBMkJpRyxPQUFPOUksUUFBekQ7QUFDQSxRQUFJUSxVQUFVO0FBQ1pSLGdCQUFVQSxRQURFO0FBRVppRixjQUFRO0FBRkksS0FBZDtBQUlBLFFBQUk1RCxXQUFXMUIsV0FBV0ssUUFBWCxFQUFxQjJCLFFBQXJCLEVBQWY7QUFDQSxRQUFJNkUsS0FBSy9HLFFBQVFtQyxPQUFSLENBQWdCUCxRQUFoQixFQUEwQmIsT0FBMUIsQ0FBVDtBQUNBc0ksV0FBT0MsUUFBUCxDQUFnQixzQkFBc0J2QyxHQUFHN0UsUUFBSCxFQUF0QixHQUFzQyxHQUF0RCxFQUEyRDNCLFFBQTNEO0FBQ0QsR0FURDtBQVVEOztBQUVEOzs7Ozs7OztBQVFBUCxRQUFRdUosT0FBUixHQUFrQmpLLGVBQWxCOztBQUVBOzs7Ozs7OztBQVFBVSxRQUFRTSxJQUFSLEdBQWVaLEtBQWY7O0FBRUE7QUFDQSxJQUFJLE9BQU84SixNQUFQLElBQWlCLFdBQXJCLEVBQWtDO0FBQ2hDQSxTQUFPQyxHQUFQLEdBQWF6SixPQUFiO0FBQ0QiLCJmaWxlIjoiZWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEVKUyBFbWJlZGRlZCBKYXZhU2NyaXB0IHRlbXBsYXRlc1xuICogQ29weXJpZ2h0IDIxMTIgTWF0dGhldyBFZXJuaXNzZSAobWRlQGZsZWVnaXgub3JnKVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBmaWxlIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGluZyBlbmdpbmUuIHtAbGluayBodHRwOi8vZWpzLmNvfVxuICogQGF1dGhvciBNYXR0aGV3IEVlcm5pc3NlIDxtZGVAZmxlZWdpeC5vcmc+XG4gKiBAYXV0aG9yIFRpYW5jaGVuZyBcIlRpbW90aHlcIiBHdSA8dGltb3RoeWd1OTlAZ21haWwuY29tPlxuICogQHByb2plY3QgRUpTXG4gKiBAbGljZW5zZSB7QGxpbmsgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMH1cbiAqL1xuXG4vKipcbiAqIEVKUyBpbnRlcm5hbCBmdW5jdGlvbnMuXG4gKlxuICogVGVjaG5pY2FsbHkgdGhpcyBcIm1vZHVsZVwiIGxpZXMgaW4gdGhlIHNhbWUgZmlsZSBhcyB7QGxpbmsgbW9kdWxlOmVqc30sIGZvclxuICogdGhlIHNha2Ugb2Ygb3JnYW5pemF0aW9uIGFsbCB0aGUgcHJpdmF0ZSBmdW5jdGlvbnMgcmUgZ3JvdXBlZCBpbnRvIHRoaXNcbiAqIG1vZHVsZS5cbiAqXG4gKiBAbW9kdWxlIGVqcy1pbnRlcm5hbFxuICogQHByaXZhdGVcbiAqL1xuXG4vKipcbiAqIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGluZyBlbmdpbmUuXG4gKlxuICogQG1vZHVsZSBlanNcbiAqIEBwdWJsaWNcbiAqL1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBzY29wZU9wdGlvbldhcm5lZCA9IGZhbHNlO1xudmFyIF9WRVJTSU9OX1NUUklORyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG52YXIgX0RFRkFVTFRfREVMSU1JVEVSID0gJyUnO1xudmFyIF9ERUZBVUxUX0xPQ0FMU19OQU1FID0gJ2xvY2Fscyc7XG52YXIgX05BTUUgPSAnZWpzJztcbnZhciBfUkVHRVhfU1RSSU5HID0gJyg8JSV8JSU+fDwlPXw8JS18PCVffDwlI3w8JXwlPnwtJT58XyU+KSc7XG52YXIgX09QVFMgPSBbJ2RlbGltaXRlcicsICdzY29wZScsICdjb250ZXh0JywgJ2RlYnVnJywgJ2NvbXBpbGVEZWJ1ZycsXG4gICdjbGllbnQnLCAnX3dpdGgnLCAncm1XaGl0ZXNwYWNlJywgJ3N0cmljdCcsICdmaWxlbmFtZSddO1xuLy8gV2UgZG9uJ3QgYWxsb3cgJ2NhY2hlJyBvcHRpb24gdG8gYmUgcGFzc2VkIGluIHRoZSBkYXRhIG9ialxuLy8gZm9yIHRoZSBub3JtYWwgYHJlbmRlcmAgY2FsbCwgYnV0IHRoaXMgaXMgd2hlcmUgRXhwcmVzcyBwdXRzIGl0XG4vLyBzbyB3ZSBtYWtlIGFuIGV4Y2VwdGlvbiBmb3IgYHJlbmRlckZpbGVgXG52YXIgX09QVFNfRVhQUkVTUyA9IF9PUFRTLmNvbmNhdCgnY2FjaGUnKTtcbnZhciBfQk9NID0gL15cXHVGRUZGLztcblxuLyoqXG4gKiBFSlMgdGVtcGxhdGUgZnVuY3Rpb24gY2FjaGUuIFRoaXMgY2FuIGJlIGEgTFJVIG9iamVjdCBmcm9tIGxydS1jYWNoZSBOUE1cbiAqIG1vZHVsZS4gQnkgZGVmYXVsdCwgaXQgaXMge0BsaW5rIG1vZHVsZTp1dGlscy5jYWNoZX0sIGEgc2ltcGxlIGluLXByb2Nlc3NcbiAqIGNhY2hlIHRoYXQgZ3Jvd3MgY29udGludW91c2x5LlxuICpcbiAqIEB0eXBlIHtDYWNoZX1cbiAqL1xuXG5leHBvcnRzLmNhY2hlID0gdXRpbHMuY2FjaGU7XG5cbi8qKlxuICogQ3VzdG9tIGZpbGUgbG9hZGVyLiBVc2VmdWwgZm9yIHRlbXBsYXRlIHByZXByb2Nlc3Npbmcgb3IgcmVzdHJpY3RpbmcgYWNjZXNzXG4gKiB0byBhIGNlcnRhaW4gcGFydCBvZiB0aGUgZmlsZXN5c3RlbS5cbiAqXG4gKiBAdHlwZSB7ZmlsZUxvYWRlcn1cbiAqL1xuXG5leHBvcnRzLmZpbGVMb2FkZXIgPSBmcy5yZWFkRmlsZVN5bmM7XG5cbi8qKlxuICogTmFtZSBvZiB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGxvY2Fscy5cbiAqXG4gKiBUaGlzIHZhcmlhYmxlIGlzIG92ZXJyaWRkZW4gYnkge0BsaW5rIE9wdGlvbnN9YC5sb2NhbHNOYW1lYCBpZiBpdCBpcyBub3RcbiAqIGB1bmRlZmluZWRgLlxuICpcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5sb2NhbHNOYW1lID0gX0RFRkFVTFRfTE9DQUxTX05BTUU7XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIHRvIHRoZSBpbmNsdWRlZCBmaWxlIGZyb20gdGhlIHBhcmVudCBmaWxlIHBhdGggYW5kIHRoZVxuICogc3BlY2lmaWVkIHBhdGguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICBuYW1lICAgICBzcGVjaWZpZWQgcGF0aFxuICogQHBhcmFtIHtTdHJpbmd9ICBmaWxlbmFtZSBwYXJlbnQgZmlsZSBwYXRoXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzRGlyICAgIHBhcmVudCBmaWxlIHBhdGggd2hldGhlciBpcyBkaXJlY3RvcnlcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5yZXNvbHZlSW5jbHVkZSA9IGZ1bmN0aW9uKG5hbWUsIGZpbGVuYW1lLCBpc0Rpcikge1xuICB2YXIgZGlybmFtZSA9IHBhdGguZGlybmFtZTtcbiAgdmFyIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWU7XG4gIHZhciByZXNvbHZlID0gcGF0aC5yZXNvbHZlO1xuICB2YXIgaW5jbHVkZVBhdGggPSByZXNvbHZlKGlzRGlyID8gZmlsZW5hbWUgOiBkaXJuYW1lKGZpbGVuYW1lKSwgbmFtZSk7XG4gIHZhciBleHQgPSBleHRuYW1lKG5hbWUpO1xuICBpZiAoIWV4dCkge1xuICAgIGluY2x1ZGVQYXRoICs9ICcuZWpzJztcbiAgfVxuICByZXR1cm4gaW5jbHVkZVBhdGg7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBieSBPcHRpb25zXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgcGF0aCAgICBzcGVjaWZpZWQgcGF0aFxuICogQHBhcmFtICB7T3B0aW9uc30gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEluY2x1ZGVQYXRoKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGluY2x1ZGVQYXRoO1xuICB2YXIgZmlsZVBhdGg7XG4gIHZhciB2aWV3cyA9IG9wdGlvbnMudmlld3M7XG5cbiAgLy8gQWJzIHBhdGhcbiAgaWYgKHBhdGguY2hhckF0KDApID09ICcvJykge1xuICAgIGluY2x1ZGVQYXRoID0gZXhwb3J0cy5yZXNvbHZlSW5jbHVkZShwYXRoLnJlcGxhY2UoL15cXC8qLywnJyksIG9wdGlvbnMucm9vdCB8fCAnLycsIHRydWUpO1xuICB9XG4gIC8vIFJlbGF0aXZlIHBhdGhzXG4gIGVsc2Uge1xuICAgIC8vIExvb2sgcmVsYXRpdmUgdG8gYSBwYXNzZWQgZmlsZW5hbWUgZmlyc3RcbiAgICBpZiAob3B0aW9ucy5maWxlbmFtZSkge1xuICAgICAgZmlsZVBhdGggPSBleHBvcnRzLnJlc29sdmVJbmNsdWRlKHBhdGgsIG9wdGlvbnMuZmlsZW5hbWUpO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgIGluY2x1ZGVQYXRoID0gZmlsZVBhdGg7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRoZW4gbG9vayBpbiBhbnkgdmlld3MgZGlyZWN0b3JpZXNcbiAgICBpZiAoIWluY2x1ZGVQYXRoKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2aWV3cykgJiYgdmlld3Muc29tZShmdW5jdGlvbiAodikge1xuICAgICAgICBmaWxlUGF0aCA9IGV4cG9ydHMucmVzb2x2ZUluY2x1ZGUocGF0aCwgdiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcbiAgICAgIH0pKSB7XG4gICAgICAgIGluY2x1ZGVQYXRoID0gZmlsZVBhdGg7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghaW5jbHVkZVBhdGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgaW5jbHVkZSBpbmNsdWRlIGZpbGUuJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmNsdWRlUGF0aDtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZyb20gYSBzdHJpbmcgb3IgYSBmaWxlLCBlaXRoZXIgY29tcGlsZWQgb24tdGhlLWZseSBvclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXG4gKlxuICogSWYgYHRlbXBsYXRlYCBpcyBub3Qgc2V0LCB0aGUgZmlsZSBzcGVjaWZpZWQgaW4gYG9wdGlvbnMuZmlsZW5hbWVgIHdpbGwgYmVcbiAqIHJlYWQuXG4gKlxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIHRydWUsIHRoaXMgZnVuY3Rpb24gcmVhZHMgdGhlIGZpbGUgZnJvbVxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmVqcy1pbnRlcm5hbFxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zICAgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFt0ZW1wbGF0ZV0gdGVtcGxhdGUgc291cmNlXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRpb25zLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkLlxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNhY2hlKG9wdGlvbnMsIHRlbXBsYXRlKSB7XG4gIHZhciBmdW5jO1xuICB2YXIgZmlsZW5hbWUgPSBvcHRpb25zLmZpbGVuYW1lO1xuICB2YXIgaGFzVGVtcGxhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMTtcblxuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIGlmICghZmlsZW5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2FjaGUgb3B0aW9uIHJlcXVpcmVzIGEgZmlsZW5hbWUnKTtcbiAgICB9XG4gICAgZnVuYyA9IGV4cG9ydHMuY2FjaGUuZ2V0KGZpbGVuYW1lKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICAgIGlmICghaGFzVGVtcGxhdGUpIHtcbiAgICAgIHRlbXBsYXRlID0gZmlsZUxvYWRlcihmaWxlbmFtZSkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sICcnKTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoIWhhc1RlbXBsYXRlKSB7XG4gICAgLy8gaXN0YW5idWwgaWdub3JlIGlmOiBzaG91bGQgbm90IGhhcHBlbiBhdCBhbGxcbiAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIEVKUyBlcnJvcjogbm8gZmlsZSBuYW1lIG9yIHRlbXBsYXRlICdcbiAgICAgICAgICAgICAgICAgICAgKyAncHJvdmlkZWQnKTtcbiAgICB9XG4gICAgdGVtcGxhdGUgPSBmaWxlTG9hZGVyKGZpbGVuYW1lKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpO1xuICB9XG4gIGZ1bmMgPSBleHBvcnRzLmNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIGV4cG9ydHMuY2FjaGUuc2V0KGZpbGVuYW1lLCBmdW5jKTtcbiAgfVxuICByZXR1cm4gZnVuYztcbn1cblxuLyoqXG4gKiBUcnkgY2FsbGluZyBoYW5kbGVDYWNoZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFuZCBkYXRhIGFuZCBjYWxsIHRoZVxuICogY2FsbGJhY2sgd2l0aCB0aGUgcmVzdWx0LiBJZiBhbiBlcnJvciBvY2N1cnMsIGNhbGwgdGhlIGNhbGxiYWNrIHdpdGhcbiAqIHRoZSBlcnJvci4gVXNlZCBieSByZW5kZXJGaWxlKCkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyAgICBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgICAgdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtSZW5kZXJGaWxlQ2FsbGJhY2t9IGNiIGNhbGxiYWNrXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gdHJ5SGFuZGxlQ2FjaGUob3B0aW9ucywgZGF0YSwgY2IpIHtcbiAgdmFyIHJlc3VsdDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBoYW5kbGVDYWNoZShvcHRpb25zKShkYXRhKTtcbiAgfVxuICBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGNiKGVycik7XG4gIH1cbiAgcmV0dXJuIGNiKG51bGwsIHJlc3VsdCk7XG59XG5cbi8qKlxuICogZmlsZUxvYWRlciBpcyBpbmRlcGVuZGVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aCBlanMgZmlsZSBwYXRoLlxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgY29udGVudHMgb2YgdGhlIHNwZWNpZmllZCBmaWxlLlxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGZpbGVMb2FkZXIoZmlsZVBhdGgpe1xuICByZXR1cm4gZXhwb3J0cy5maWxlTG9hZGVyKGZpbGVQYXRoKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZ1bmN0aW9uLlxuICpcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyBgdHJ1ZWAsIHRoZW4gdGhlIHRlbXBsYXRlIGlzIGNhY2hlZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmVqcy1pbnRlcm5hbFxuICogQHBhcmFtIHtTdHJpbmd9ICBwYXRoICAgIHBhdGggZm9yIHRoZSBzcGVjaWZpZWQgZmlsZVxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcbiAqIEByZXR1cm4geyhUZW1wbGF0ZUZ1bmN0aW9ufENsaWVudEZ1bmN0aW9uKX1cbiAqIERlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYG9wdGlvbnMuY2xpZW50YCwgZWl0aGVyIHR5cGUgbWlnaHQgYmUgcmV0dXJuZWRcbiAqIEBzdGF0aWNcbiAqL1xuXG5mdW5jdGlvbiBpbmNsdWRlRmlsZShwYXRoLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gdXRpbHMuc2hhbGxvd0NvcHkoe30sIG9wdGlvbnMpO1xuICBvcHRzLmZpbGVuYW1lID0gZ2V0SW5jbHVkZVBhdGgocGF0aCwgb3B0cyk7XG4gIHJldHVybiBoYW5kbGVDYWNoZShvcHRzKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIEphdmFTY3JpcHQgc291cmNlIG9mIGFuIGluY2x1ZGVkIGZpbGUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7U3RyaW5nfSAgcGF0aCAgICBwYXRoIGZvciB0aGUgc3BlY2lmaWVkIGZpbGVcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gaW5jbHVkZVNvdXJjZShwYXRoLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gdXRpbHMuc2hhbGxvd0NvcHkoe30sIG9wdGlvbnMpO1xuICB2YXIgaW5jbHVkZVBhdGg7XG4gIHZhciB0ZW1wbGF0ZTtcbiAgaW5jbHVkZVBhdGggPSBnZXRJbmNsdWRlUGF0aChwYXRoLCBvcHRzKTtcbiAgdGVtcGxhdGUgPSBmaWxlTG9hZGVyKGluY2x1ZGVQYXRoKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpO1xuICBvcHRzLmZpbGVuYW1lID0gaW5jbHVkZVBhdGg7XG4gIHZhciB0ZW1wbCA9IG5ldyBUZW1wbGF0ZSh0ZW1wbGF0ZSwgb3B0cyk7XG4gIHRlbXBsLmdlbmVyYXRlU291cmNlKCk7XG4gIHJldHVybiB7XG4gICAgc291cmNlOiB0ZW1wbC5zb3VyY2UsXG4gICAgZmlsZW5hbWU6IGluY2x1ZGVQYXRoLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxuICB9O1xufVxuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZSBgc3RyYCBvZiBlanMsIGBmaWxlbmFtZWAsIGFuZFxuICogYGxpbmVub2AuXG4gKlxuICogQGltcGxlbWVudHMgUmV0aHJvd0NhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmVqcy1pbnRlcm5hbFxuICogQHBhcmFtIHtFcnJvcn0gIGVyciAgICAgIEVycm9yIG9iamVjdFxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciAgICAgIEVKUyBzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZSBmaWxlIG5hbWUgb2YgdGhlIEVKUyBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vICAgbGluZSBudW1iZXIgb2YgdGhlIGVycm9yXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gcmV0aHJvdyhlcnIsIHN0ciwgZmxubSwgbGluZW5vLCBlc2Mpe1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpO1xuICB2YXIgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSAzLCAwKTtcbiAgdmFyIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgMyk7XG4gIHZhciBmaWxlbmFtZSA9IGVzYyhmbG5tKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uIChsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgPj4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdlanMnKSArICc6J1xuICAgICsgbGluZW5vICsgJ1xcbidcbiAgICArIGNvbnRleHQgKyAnXFxuXFxuJ1xuICAgICsgZXJyLm1lc3NhZ2U7XG5cbiAgdGhyb3cgZXJyO1xufVxuXG5mdW5jdGlvbiBzdHJpcFNlbWkoc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC87KFxccyokKS8sICckMScpO1xufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGdpdmVuIGBzdHJgIG9mIGVqcyBpbnRvIGEgdGVtcGxhdGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICB0ZW1wbGF0ZSBFSlMgdGVtcGxhdGVcbiAqXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdHMgICAgIGNvbXBpbGF0aW9uIG9wdGlvbnNcbiAqXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRzLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkLlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY29tcGlsZSA9IGZ1bmN0aW9uIGNvbXBpbGUodGVtcGxhdGUsIG9wdHMpIHtcbiAgdmFyIHRlbXBsO1xuXG4gIC8vIHYxIGNvbXBhdFxuICAvLyAnc2NvcGUnIGlzICdjb250ZXh0J1xuICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgaW4gYSBmdXR1cmUgdmVyc2lvblxuICBpZiAob3B0cyAmJiBvcHRzLnNjb3BlKSB7XG4gICAgaWYgKCFzY29wZU9wdGlvbldhcm5lZCl7XG4gICAgICBjb25zb2xlLndhcm4oJ2BzY29wZWAgb3B0aW9uIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBFSlMgMycpO1xuICAgICAgc2NvcGVPcHRpb25XYXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIW9wdHMuY29udGV4dCkge1xuICAgICAgb3B0cy5jb250ZXh0ID0gb3B0cy5zY29wZTtcbiAgICB9XG4gICAgZGVsZXRlIG9wdHMuc2NvcGU7XG4gIH1cbiAgdGVtcGwgPSBuZXcgVGVtcGxhdGUodGVtcGxhdGUsIG9wdHMpO1xuICByZXR1cm4gdGVtcGwuY29tcGlsZSgpO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgb2YgZWpzLlxuICpcbiAqIElmIHlvdSB3b3VsZCBsaWtlIHRvIGluY2x1ZGUgb3B0aW9ucyBidXQgbm90IGRhdGEsIHlvdSBuZWVkIHRvIGV4cGxpY2l0bHlcbiAqIGNhbGwgdGhpcyBmdW5jdGlvbiB3aXRoIGBkYXRhYCBiZWluZyBhbiBlbXB0eSBvYmplY3Qgb3IgYG51bGxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgIHRlbXBsYXRlIEVKUyB0ZW1wbGF0ZVxuICogQHBhcmFtIHtPYmplY3R9ICBbZGF0YT17fV0gdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtPcHRpb25zfSBbb3B0cz17fV0gY29tcGlsYXRpb24gYW5kIHJlbmRlcmluZyBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5yZW5kZXIgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGQsIG8pIHtcbiAgdmFyIGRhdGEgPSBkIHx8IHt9O1xuICB2YXIgb3B0cyA9IG8gfHwge307XG5cbiAgLy8gTm8gb3B0aW9ucyBvYmplY3QgLS0gaWYgdGhlcmUgYXJlIG9wdGlvbnkgbmFtZXNcbiAgLy8gaW4gdGhlIGRhdGEsIGNvcHkgdGhlbSB0byBvcHRpb25zXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcbiAgICB1dGlscy5zaGFsbG93Q29weUZyb21MaXN0KG9wdHMsIGRhdGEsIF9PUFRTKTtcbiAgfVxuXG4gIHJldHVybiBoYW5kbGVDYWNoZShvcHRzLCB0ZW1wbGF0ZSkoZGF0YSk7XG59O1xuXG4vKipcbiAqIFJlbmRlciBhbiBFSlMgZmlsZSBhdCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBjYWxsYmFjayBgY2IoZXJyLCBzdHIpYC5cbiAqXG4gKiBJZiB5b3Ugd291bGQgbGlrZSB0byBpbmNsdWRlIG9wdGlvbnMgYnV0IG5vdCBkYXRhLCB5b3UgbmVlZCB0byBleHBsaWNpdGx5XG4gKiBjYWxsIHRoaXMgZnVuY3Rpb24gd2l0aCBgZGF0YWAgYmVpbmcgYW4gZW1wdHkgb2JqZWN0IG9yIGBudWxsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgICAgcGF0aCAgICAgcGF0aCB0byB0aGUgRUpTIGZpbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgIFtkYXRhPXt9XSB0ZW1wbGF0ZSBkYXRhXG4gKiBAcGFyYW0ge09wdGlvbnN9ICAgICAgICAgICBbb3B0cz17fV0gY29tcGlsYXRpb24gYW5kIHJlbmRlcmluZyBvcHRpb25zXG4gKiBAcGFyYW0ge1JlbmRlckZpbGVDYWxsYmFja30gY2IgY2FsbGJhY2tcbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbmRlckZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmaWxlbmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgdmFyIGNiID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgdmFyIG9wdHMgPSB7ZmlsZW5hbWU6IGZpbGVuYW1lfTtcbiAgdmFyIGRhdGE7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgZGF0YSA9IGFyZ3VtZW50c1sxXTtcblxuICAgIC8vIE5vIG9wdGlvbnMgb2JqZWN0IC0tIGlmIHRoZXJlIGFyZSBvcHRpb255IG5hbWVzXG4gICAgLy8gaW4gdGhlIGRhdGEsIGNvcHkgdGhlbSB0byBvcHRpb25zXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIC8vIEV4cHJlc3MgNFxuICAgICAgaWYgKGRhdGEuc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3NbJ3ZpZXcgb3B0aW9ucyddKSB7XG4gICAgICAgICAgdXRpbHMuc2hhbGxvd0NvcHlGcm9tTGlzdChvcHRzLCBkYXRhLnNldHRpbmdzWyd2aWV3IG9wdGlvbnMnXSwgX09QVFNfRVhQUkVTUyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Mudmlld3MpIHtcbiAgICAgICAgICBvcHRzLnZpZXdzID0gZGF0YS5zZXR0aW5ncy52aWV3cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRXhwcmVzcyAzIGFuZCBsb3dlclxuICAgICAgZWxzZSB7XG4gICAgICAgIHV0aWxzLnNoYWxsb3dDb3B5RnJvbUxpc3Qob3B0cywgZGF0YSwgX09QVFNfRVhQUkVTUyk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gVXNlIHNoYWxsb3dDb3B5IHNvIHdlIGRvbid0IHBvbGx1dGUgcGFzc2VkIGluIG9wdHMgb2JqIHdpdGggbmV3IHZhbHNcbiAgICAgIHV0aWxzLnNoYWxsb3dDb3B5KG9wdHMsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxuXG4gICAgb3B0cy5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0cnlIYW5kbGVDYWNoZShvcHRzLCBkYXRhLCBjYik7XG59O1xuXG4vKipcbiAqIENsZWFyIGludGVybWVkaWF0ZSBKYXZhU2NyaXB0IGNhY2hlLiBDYWxscyB7QGxpbmsgQ2FjaGUjcmVzZXR9LlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uICgpIHtcbiAgZXhwb3J0cy5jYWNoZS5yZXNldCgpO1xufTtcblxuZnVuY3Rpb24gVGVtcGxhdGUodGV4dCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgdGhpcy50ZW1wbGF0ZVRleHQgPSB0ZXh0O1xuICB0aGlzLm1vZGUgPSBudWxsO1xuICB0aGlzLnRydW5jYXRlID0gZmFsc2U7XG4gIHRoaXMuY3VycmVudExpbmUgPSAxO1xuICB0aGlzLnNvdXJjZSA9ICcnO1xuICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICBvcHRpb25zLmNsaWVudCA9IG9wdHMuY2xpZW50IHx8IGZhbHNlO1xuICBvcHRpb25zLmVzY2FwZUZ1bmN0aW9uID0gb3B0cy5lc2NhcGUgfHwgdXRpbHMuZXNjYXBlWE1MO1xuICBvcHRpb25zLmNvbXBpbGVEZWJ1ZyA9IG9wdHMuY29tcGlsZURlYnVnICE9PSBmYWxzZTtcbiAgb3B0aW9ucy5kZWJ1ZyA9ICEhb3B0cy5kZWJ1ZztcbiAgb3B0aW9ucy5maWxlbmFtZSA9IG9wdHMuZmlsZW5hbWU7XG4gIG9wdGlvbnMuZGVsaW1pdGVyID0gb3B0cy5kZWxpbWl0ZXIgfHwgZXhwb3J0cy5kZWxpbWl0ZXIgfHwgX0RFRkFVTFRfREVMSU1JVEVSO1xuICBvcHRpb25zLnN0cmljdCA9IG9wdHMuc3RyaWN0IHx8IGZhbHNlO1xuICBvcHRpb25zLmNvbnRleHQgPSBvcHRzLmNvbnRleHQ7XG4gIG9wdGlvbnMuY2FjaGUgPSBvcHRzLmNhY2hlIHx8IGZhbHNlO1xuICBvcHRpb25zLnJtV2hpdGVzcGFjZSA9IG9wdHMucm1XaGl0ZXNwYWNlO1xuICBvcHRpb25zLnJvb3QgPSBvcHRzLnJvb3Q7XG4gIG9wdGlvbnMubG9jYWxzTmFtZSA9IG9wdHMubG9jYWxzTmFtZSB8fCBleHBvcnRzLmxvY2Fsc05hbWUgfHwgX0RFRkFVTFRfTE9DQUxTX05BTUU7XG4gIG9wdGlvbnMudmlld3MgPSBvcHRzLnZpZXdzO1xuXG4gIGlmIChvcHRpb25zLnN0cmljdCkge1xuICAgIG9wdGlvbnMuX3dpdGggPSBmYWxzZTtcbiAgfVxuICBlbHNlIHtcbiAgICBvcHRpb25zLl93aXRoID0gdHlwZW9mIG9wdHMuX3dpdGggIT0gJ3VuZGVmaW5lZCcgPyBvcHRzLl93aXRoIDogdHJ1ZTtcbiAgfVxuXG4gIHRoaXMub3B0cyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5yZWdleCA9IHRoaXMuY3JlYXRlUmVnZXgoKTtcbn1cblxuVGVtcGxhdGUubW9kZXMgPSB7XG4gIEVWQUw6ICdldmFsJyxcbiAgRVNDQVBFRDogJ2VzY2FwZWQnLFxuICBSQVc6ICdyYXcnLFxuICBDT01NRU5UOiAnY29tbWVudCcsXG4gIExJVEVSQUw6ICdsaXRlcmFsJ1xufTtcblxuVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICBjcmVhdGVSZWdleDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdHIgPSBfUkVHRVhfU1RSSU5HO1xuICAgIHZhciBkZWxpbSA9IHV0aWxzLmVzY2FwZVJlZ0V4cENoYXJzKHRoaXMub3B0cy5kZWxpbWl0ZXIpO1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8lL2csIGRlbGltKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChzdHIpO1xuICB9LFxuXG4gIGNvbXBpbGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3JjO1xuICAgIHZhciBmbjtcbiAgICB2YXIgb3B0cyA9IHRoaXMub3B0cztcbiAgICB2YXIgcHJlcGVuZGVkID0gJyc7XG4gICAgdmFyIGFwcGVuZGVkID0gJyc7XG4gICAgdmFyIGVzY2FwZUZuID0gb3B0cy5lc2NhcGVGdW5jdGlvbjtcblxuICAgIGlmICghdGhpcy5zb3VyY2UpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVTb3VyY2UoKTtcbiAgICAgIHByZXBlbmRlZCArPSAnICB2YXIgX19vdXRwdXQgPSBbXSwgX19hcHBlbmQgPSBfX291dHB1dC5wdXNoLmJpbmQoX19vdXRwdXQpOycgKyAnXFxuJztcbiAgICAgIGlmIChvcHRzLl93aXRoICE9PSBmYWxzZSkge1xuICAgICAgICBwcmVwZW5kZWQgKz0gICcgIHdpdGggKCcgKyBvcHRzLmxvY2Fsc05hbWUgKyAnIHx8IHt9KSB7JyArICdcXG4nO1xuICAgICAgICBhcHBlbmRlZCArPSAnICB9JyArICdcXG4nO1xuICAgICAgfVxuICAgICAgYXBwZW5kZWQgKz0gJyAgcmV0dXJuIF9fb3V0cHV0LmpvaW4oXCJcIik7JyArICdcXG4nO1xuICAgICAgdGhpcy5zb3VyY2UgPSBwcmVwZW5kZWQgKyB0aGlzLnNvdXJjZSArIGFwcGVuZGVkO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBpbGVEZWJ1Zykge1xuICAgICAgc3JjID0gJ3ZhciBfX2xpbmUgPSAxJyArICdcXG4nXG4gICAgICAgICAgKyAnICAsIF9fbGluZXMgPSAnICsgSlNPTi5zdHJpbmdpZnkodGhpcy50ZW1wbGF0ZVRleHQpICsgJ1xcbidcbiAgICAgICAgICArICcgICwgX19maWxlbmFtZSA9ICcgKyAob3B0cy5maWxlbmFtZSA/XG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkob3B0cy5maWxlbmFtZSkgOiAndW5kZWZpbmVkJykgKyAnOycgKyAnXFxuJ1xuICAgICAgICAgICsgJ3RyeSB7JyArICdcXG4nXG4gICAgICAgICAgKyB0aGlzLnNvdXJjZVxuICAgICAgICAgICsgJ30gY2F0Y2ggKGUpIHsnICsgJ1xcbidcbiAgICAgICAgICArICcgIHJldGhyb3coZSwgX19saW5lcywgX19maWxlbmFtZSwgX19saW5lLCBlc2NhcGVGbik7JyArICdcXG4nXG4gICAgICAgICAgKyAnfScgKyAnXFxuJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzcmMgPSB0aGlzLnNvdXJjZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5jbGllbnQpIHtcbiAgICAgIHNyYyA9ICdlc2NhcGVGbiA9IGVzY2FwZUZuIHx8ICcgKyBlc2NhcGVGbi50b1N0cmluZygpICsgJzsnICsgJ1xcbicgKyBzcmM7XG4gICAgICBpZiAob3B0cy5jb21waWxlRGVidWcpIHtcbiAgICAgICAgc3JjID0gJ3JldGhyb3cgPSByZXRocm93IHx8ICcgKyByZXRocm93LnRvU3RyaW5nKCkgKyAnOycgKyAnXFxuJyArIHNyYztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cy5zdHJpY3QpIHtcbiAgICAgIHNyYyA9ICdcInVzZSBzdHJpY3RcIjtcXG4nICsgc3JjO1xuICAgIH1cbiAgICBpZiAob3B0cy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coc3JjKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm4gPSBuZXcgRnVuY3Rpb24ob3B0cy5sb2NhbHNOYW1lICsgJywgZXNjYXBlRm4sIGluY2x1ZGUsIHJldGhyb3cnLCBzcmMpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgZWxzZVxuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICBpZiAob3B0cy5maWxlbmFtZSkge1xuICAgICAgICAgIGUubWVzc2FnZSArPSAnIGluICcgKyBvcHRzLmZpbGVuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGUubWVzc2FnZSArPSAnIHdoaWxlIGNvbXBpbGluZyBlanNcXG5cXG4nO1xuICAgICAgICBlLm1lc3NhZ2UgKz0gJ0lmIHRoZSBhYm92ZSBlcnJvciBpcyBub3QgaGVscGZ1bCwgeW91IG1heSB3YW50IHRvIHRyeSBFSlMtTGludDpcXG4nO1xuICAgICAgICBlLm1lc3NhZ2UgKz0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9SeWFuWmltL0VKUy1MaW50JztcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuY2xpZW50KSB7XG4gICAgICBmbi5kZXBlbmRlbmNpZXMgPSB0aGlzLmRlcGVuZGVuY2llcztcbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBjYWxsYWJsZSBmdW5jdGlvbiB3aGljaCB3aWxsIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uXG4gICAgLy8gY3JlYXRlZCBieSB0aGUgc291cmNlLWNvZGUsIHdpdGggdGhlIHBhc3NlZCBkYXRhIGFzIGxvY2Fsc1xuICAgIC8vIEFkZHMgYSBsb2NhbCBgaW5jbHVkZWAgZnVuY3Rpb24gd2hpY2ggYWxsb3dzIGZ1bGwgcmVjdXJzaXZlIGluY2x1ZGVcbiAgICB2YXIgcmV0dXJuZWRGbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB2YXIgaW5jbHVkZSA9IGZ1bmN0aW9uIChwYXRoLCBpbmNsdWRlRGF0YSkge1xuICAgICAgICB2YXIgZCA9IHV0aWxzLnNoYWxsb3dDb3B5KHt9LCBkYXRhKTtcbiAgICAgICAgaWYgKGluY2x1ZGVEYXRhKSB7XG4gICAgICAgICAgZCA9IHV0aWxzLnNoYWxsb3dDb3B5KGQsIGluY2x1ZGVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5jbHVkZUZpbGUocGF0aCwgb3B0cykoZCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KG9wdHMuY29udGV4dCwgW2RhdGEgfHwge30sIGVzY2FwZUZuLCBpbmNsdWRlLCByZXRocm93XSk7XG4gICAgfTtcbiAgICByZXR1cm5lZEZuLmRlcGVuZGVuY2llcyA9IHRoaXMuZGVwZW5kZW5jaWVzO1xuICAgIHJldHVybiByZXR1cm5lZEZuO1xuICB9LFxuXG4gIGdlbmVyYXRlU291cmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdHMgPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAob3B0cy5ybVdoaXRlc3BhY2UpIHtcbiAgICAgIC8vIEhhdmUgdG8gdXNlIHR3byBzZXBhcmF0ZSByZXBsYWNlIGhlcmUgYXMgYF5gIGFuZCBgJGAgb3BlcmF0b3JzIGRvbid0XG4gICAgICAvLyB3b3JrIHdlbGwgd2l0aCBgXFxyYC5cbiAgICAgIHRoaXMudGVtcGxhdGVUZXh0ID1cbiAgICAgICAgdGhpcy50ZW1wbGF0ZVRleHQucmVwbGFjZSgvXFxyL2csICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xuICAgIH1cblxuICAgIC8vIFNsdXJwIHNwYWNlcyBhbmQgdGFicyBiZWZvcmUgPCVfIGFuZCBhZnRlciBfJT5cbiAgICB0aGlzLnRlbXBsYXRlVGV4dCA9XG4gICAgICB0aGlzLnRlbXBsYXRlVGV4dC5yZXBsYWNlKC9bIFxcdF0qPCVfL2dtLCAnPCVfJykucmVwbGFjZSgvXyU+WyBcXHRdKi9nbSwgJ18lPicpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtYXRjaGVzID0gdGhpcy5wYXJzZVRlbXBsYXRlVGV4dCgpO1xuICAgIHZhciBkID0gdGhpcy5vcHRzLmRlbGltaXRlcjtcblxuICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUsIGluZGV4KSB7XG4gICAgICAgIHZhciBvcGVuaW5nO1xuICAgICAgICB2YXIgY2xvc2luZztcbiAgICAgICAgdmFyIGluY2x1ZGU7XG4gICAgICAgIHZhciBpbmNsdWRlT3B0cztcbiAgICAgICAgdmFyIGluY2x1ZGVPYmo7XG4gICAgICAgIHZhciBpbmNsdWRlU3JjO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIG9wZW5pbmcgdGFnLCBjaGVjayBmb3IgY2xvc2luZyB0YWdzXG4gICAgICAgIC8vIEZJWE1FOiBNYXkgZW5kIHVwIHdpdGggc29tZSBmYWxzZSBwb3NpdGl2ZXMgaGVyZVxuICAgICAgICAvLyBCZXR0ZXIgdG8gc3RvcmUgbW9kZXMgYXMgay92IHdpdGggJzwnICsgZGVsaW1pdGVyIGFzIGtleVxuICAgICAgICAvLyBUaGVuIHRoaXMgY2FuIHNpbXBseSBjaGVjayBhZ2FpbnN0IHRoZSBtYXBcbiAgICAgICAgaWYgKCBsaW5lLmluZGV4T2YoJzwnICsgZCkgPT09IDAgICAgICAgIC8vIElmIGl0IGlzIGEgdGFnXG4gICAgICAgICAgJiYgbGluZS5pbmRleE9mKCc8JyArIGQgKyBkKSAhPT0gMCkgeyAvLyBhbmQgaXMgbm90IGVzY2FwZWRcbiAgICAgICAgICBjbG9zaW5nID0gbWF0Y2hlc1tpbmRleCArIDJdO1xuICAgICAgICAgIGlmICghKGNsb3NpbmcgPT0gZCArICc+JyB8fCBjbG9zaW5nID09ICctJyArIGQgKyAnPicgfHwgY2xvc2luZyA9PSAnXycgKyBkICsgJz4nKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBtYXRjaGluZyBjbG9zZSB0YWcgZm9yIFwiJyArIGxpbmUgKyAnXCIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEhBQ0s6IGJhY2t3YXJkLWNvbXBhdCBgaW5jbHVkZWAgcHJlcHJvY2Vzc29yIGRpcmVjdGl2ZXNcbiAgICAgICAgaWYgKChpbmNsdWRlID0gbGluZS5tYXRjaCgvXlxccyppbmNsdWRlXFxzKyhcXFMrKS8pKSkge1xuICAgICAgICAgIG9wZW5pbmcgPSBtYXRjaGVzW2luZGV4IC0gMV07XG4gICAgICAgICAgLy8gTXVzdCBiZSBpbiBFVkFMIG9yIFJBVyBtb2RlXG4gICAgICAgICAgaWYgKG9wZW5pbmcgJiYgKG9wZW5pbmcgPT0gJzwnICsgZCB8fCBvcGVuaW5nID09ICc8JyArIGQgKyAnLScgfHwgb3BlbmluZyA9PSAnPCcgKyBkICsgJ18nKSkge1xuICAgICAgICAgICAgaW5jbHVkZU9wdHMgPSB1dGlscy5zaGFsbG93Q29weSh7fSwgc2VsZi5vcHRzKTtcbiAgICAgICAgICAgIGluY2x1ZGVPYmogPSBpbmNsdWRlU291cmNlKGluY2x1ZGVbMV0sIGluY2x1ZGVPcHRzKTtcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdHMuY29tcGlsZURlYnVnKSB7XG4gICAgICAgICAgICAgIGluY2x1ZGVTcmMgPVxuICAgICAgICAgICAgICAgICAgJyAgICA7IChmdW5jdGlvbigpeycgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgKyAnICAgICAgdmFyIF9fbGluZSA9IDEnICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgJyAgICAgICwgX19saW5lcyA9ICcgKyBKU09OLnN0cmluZ2lmeShpbmNsdWRlT2JqLnRlbXBsYXRlKSArICdcXG4nXG4gICAgICAgICAgICAgICAgICArICcgICAgICAsIF9fZmlsZW5hbWUgPSAnICsgSlNPTi5zdHJpbmdpZnkoaW5jbHVkZU9iai5maWxlbmFtZSkgKyAnOycgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgKyAnICAgICAgdHJ5IHsnICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgaW5jbHVkZU9iai5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICsgJyAgICAgIH0gY2F0Y2ggKGUpIHsnICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgJyAgICAgICAgcmV0aHJvdyhlLCBfX2xpbmVzLCBfX2ZpbGVuYW1lLCBfX2xpbmUsIGVzY2FwZUZuKTsnICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgJyAgICAgIH0nICsgJ1xcbidcbiAgICAgICAgICAgICAgICAgICsgJyAgICA7IH0pLmNhbGwodGhpcyknICsgJ1xcbic7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgaW5jbHVkZVNyYyA9ICcgICAgOyAoZnVuY3Rpb24oKXsnICsgJ1xcbicgKyBpbmNsdWRlT2JqLnNvdXJjZSArXG4gICAgICAgICAgICAgICAgICAnICAgIDsgfSkuY2FsbCh0aGlzKScgKyAnXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuc291cmNlICs9IGluY2x1ZGVTcmM7XG4gICAgICAgICAgICBzZWxmLmRlcGVuZGVuY2llcy5wdXNoKGV4cG9ydHMucmVzb2x2ZUluY2x1ZGUoaW5jbHVkZVsxXSxcbiAgICAgICAgICAgICAgICBpbmNsdWRlT3B0cy5maWxlbmFtZSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLnNjYW5MaW5lKGxpbmUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gIH0sXG5cbiAgcGFyc2VUZW1wbGF0ZVRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RyID0gdGhpcy50ZW1wbGF0ZVRleHQ7XG4gICAgdmFyIHBhdCA9IHRoaXMucmVnZXg7XG4gICAgdmFyIHJlc3VsdCA9IHBhdC5leGVjKHN0cik7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIHZhciBmaXJzdFBvcztcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGZpcnN0UG9zID0gcmVzdWx0LmluZGV4O1xuXG4gICAgICBpZiAoZmlyc3RQb3MgIT09IDApIHtcbiAgICAgICAgYXJyLnB1c2goc3RyLnN1YnN0cmluZygwLCBmaXJzdFBvcykpO1xuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoZmlyc3RQb3MpO1xuICAgICAgfVxuXG4gICAgICBhcnIucHVzaChyZXN1bHRbMF0pO1xuICAgICAgc3RyID0gc3RyLnNsaWNlKHJlc3VsdFswXS5sZW5ndGgpO1xuICAgICAgcmVzdWx0ID0gcGF0LmV4ZWMoc3RyKTtcbiAgICB9XG5cbiAgICBpZiAoc3RyKSB7XG4gICAgICBhcnIucHVzaChzdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnI7XG4gIH0sXG5cbiAgX2FkZE91dHB1dDogZnVuY3Rpb24gKGxpbmUpIHtcbiAgICBpZiAodGhpcy50cnVuY2F0ZSkge1xuICAgICAgLy8gT25seSByZXBsYWNlIHNpbmdsZSBsZWFkaW5nIGxpbmVicmVhayBpbiB0aGUgbGluZSBhZnRlclxuICAgICAgLy8gLSU+IHRhZyAtLSB0aGlzIGlzIHRoZSBzaW5nbGUsIHRyYWlsaW5nIGxpbmVicmVha1xuICAgICAgLy8gYWZ0ZXIgdGhlIHRhZyB0aGF0IHRoZSB0cnVuY2F0aW9uIG1vZGUgcmVwbGFjZXNcbiAgICAgIC8vIEhhbmRsZSBXaW4gLyBVbml4IC8gb2xkIE1hYyBsaW5lYnJlYWtzIC0tIGRvIHRoZSBcXHJcXG5cbiAgICAgIC8vIGNvbWJvIGZpcnN0IGluIHRoZSByZWdleC1vclxuICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXig/OlxcclxcbnxcXHJ8XFxuKS8sICcnKTtcbiAgICAgIHRoaXMudHJ1bmNhdGUgPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5vcHRzLnJtV2hpdGVzcGFjZSkge1xuICAgICAgLy8gcm1XaGl0ZXNwYWNlIGhhcyBhbHJlYWR5IHJlbW92ZWQgdHJhaWxpbmcgc3BhY2VzLCBqdXN0IG5lZWRcbiAgICAgIC8vIHRvIHJlbW92ZSBsaW5lYnJlYWtzXG4gICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9eXFxuLywgJycpO1xuICAgIH1cbiAgICBpZiAoIWxpbmUpIHtcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cblxuICAgIC8vIFByZXNlcnZlIGxpdGVyYWwgc2xhc2hlc1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJyk7XG5cbiAgICAvLyBDb252ZXJ0IGxpbmVicmVha3NcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyk7XG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxyL2csICdcXFxccicpO1xuXG4gICAgLy8gRXNjYXBlIGRvdWJsZS1xdW90ZXNcbiAgICAvLyAtIHRoaXMgd2lsbCBiZSB0aGUgZGVsaW1pdGVyIGR1cmluZyBleGVjdXRpb25cbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyk7XG4gICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUgKyAnXCIpJyArICdcXG4nO1xuICB9LFxuXG4gIHNjYW5MaW5lOiBmdW5jdGlvbiAobGluZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZCA9IHRoaXMub3B0cy5kZWxpbWl0ZXI7XG4gICAgdmFyIG5ld0xpbmVDb3VudCA9IDA7XG5cbiAgICBuZXdMaW5lQ291bnQgPSAobGluZS5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMSk7XG5cbiAgICBzd2l0Y2ggKGxpbmUpIHtcbiAgICBjYXNlICc8JyArIGQ6XG4gICAgY2FzZSAnPCcgKyBkICsgJ18nOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuRVZBTDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzwnICsgZCArICc9JzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICc8JyArIGQgKyAnLSc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5SQVc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICc8JyArIGQgKyAnIyc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5DT01NRU5UO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnPCcgKyBkICsgZDpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkxJVEVSQUw7XG4gICAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgX19hcHBlbmQoXCInICsgbGluZS5yZXBsYWNlKCc8JyArIGQgKyBkLCAnPCcgKyBkKSArICdcIiknICsgJ1xcbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGQgKyBkICsgJz4nOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuTElURVJBTDtcbiAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZChcIicgKyBsaW5lLnJlcGxhY2UoZCArIGQgKyAnPicsIGQgKyAnPicpICsgJ1wiKScgKyAnXFxuJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZCArICc+JzpcbiAgICBjYXNlICctJyArIGQgKyAnPic6XG4gICAgY2FzZSAnXycgKyBkICsgJz4nOlxuICAgICAgaWYgKHRoaXMubW9kZSA9PSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMKSB7XG4gICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb2RlID0gbnVsbDtcbiAgICAgIHRoaXMudHJ1bmNhdGUgPSBsaW5lLmluZGV4T2YoJy0nKSA9PT0gMCB8fCBsaW5lLmluZGV4T2YoJ18nKSA9PT0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEluIHNjcmlwdCBtb2RlLCBkZXBlbmRzIG9uIHR5cGUgb2YgdGFnXG4gICAgICBpZiAodGhpcy5tb2RlKSB7XG4gICAgICAgICAgLy8gSWYgJy8vJyBpcyBmb3VuZCB3aXRob3V0IGEgbGluZSBicmVhaywgYWRkIGEgbGluZSBicmVhay5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FVkFMOlxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ6XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuUkFXOlxuICAgICAgICAgIGlmIChsaW5lLmxhc3RJbmRleE9mKCcvLycpID4gbGluZS5sYXN0SW5kZXhPZignXFxuJykpIHtcbiAgICAgICAgICAgIGxpbmUgKz0gJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgICAgICAvLyBKdXN0IGV4ZWN1dGluZyBjb2RlXG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuRVZBTDpcbiAgICAgICAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgJyArIGxpbmUgKyAnXFxuJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIEV4ZWMsIGVzYywgYW5kIG91dHB1dFxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKGVzY2FwZUZuKCcgKyBzdHJpcFNlbWkobGluZSkgKyAnKSknICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBFeGVjIGFuZCBvdXRwdXRcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5SQVc6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKCcgKyBzdHJpcFNlbWkobGluZSkgKyAnKScgKyAnXFxuJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5DT01NRU5UOlxuICAgICAgICAgICAgICAvLyBEbyBub3RoaW5nXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBMaXRlcmFsIDwlJSBtb2RlLCBhcHBlbmQgYXMgcmF3IG91dHB1dFxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkxJVEVSQUw6XG4gICAgICAgICAgdGhpcy5fYWRkT3V0cHV0KGxpbmUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAgIC8vIEluIHN0cmluZyBtb2RlLCBqdXN0IGFkZCB0aGUgb3V0cHV0XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWRkT3V0cHV0KGxpbmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLm9wdHMuY29tcGlsZURlYnVnICYmIG5ld0xpbmVDb3VudCkge1xuICAgICAgdGhpcy5jdXJyZW50TGluZSArPSBuZXdMaW5lQ291bnQ7XG4gICAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgX19saW5lID0gJyArIHRoaXMuY3VycmVudExpbmUgKyAnXFxuJztcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRXNjYXBlIGNoYXJhY3RlcnMgcmVzZXJ2ZWQgaW4gWE1MLlxuICpcbiAqIFRoaXMgaXMgc2ltcGx5IGFuIGV4cG9ydCBvZiB7QGxpbmsgbW9kdWxlOnV0aWxzLmVzY2FwZVhNTH0uXG4gKlxuICogSWYgYG1hcmt1cGAgaXMgYHVuZGVmaW5lZGAgb3IgYG51bGxgLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtYXJrdXAgSW5wdXQgc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9IEVzY2FwZWQgc3RyaW5nXG4gKiBAcHVibGljXG4gKiBAZnVuY1xuICogKi9cbmV4cG9ydHMuZXNjYXBlWE1MID0gdXRpbHMuZXNjYXBlWE1MO1xuXG4vKipcbiAqIEV4cHJlc3MuanMgc3VwcG9ydC5cbiAqXG4gKiBUaGlzIGlzIGFuIGFsaWFzIGZvciB7QGxpbmsgbW9kdWxlOmVqcy5yZW5kZXJGaWxlfSwgaW4gb3JkZXIgdG8gc3VwcG9ydFxuICogRXhwcmVzcy5qcyBvdXQtb2YtdGhlLWJveC5cbiAqXG4gKiBAZnVuY1xuICovXG5cbmV4cG9ydHMuX19leHByZXNzID0gZXhwb3J0cy5yZW5kZXJGaWxlO1xuXG4vLyBBZGQgcmVxdWlyZSBzdXBwb3J0XG4vKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuaWYgKHJlcXVpcmUuZXh0ZW5zaW9ucykge1xuICByZXF1aXJlLmV4dGVuc2lvbnNbJy5lanMnXSA9IGZ1bmN0aW9uIChtb2R1bGUsIGZsbm0pIHtcbiAgICB2YXIgZmlsZW5hbWUgPSBmbG5tIHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG1vZHVsZS5maWxlbmFtZTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZSxcbiAgICAgIGNsaWVudDogdHJ1ZVxuICAgIH07XG4gICAgdmFyIHRlbXBsYXRlID0gZmlsZUxvYWRlcihmaWxlbmFtZSkudG9TdHJpbmcoKTtcbiAgICB2YXIgZm4gPSBleHBvcnRzLmNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xuICAgIG1vZHVsZS5fY29tcGlsZSgnbW9kdWxlLmV4cG9ydHMgPSAnICsgZm4udG9TdHJpbmcoKSArICc7JywgZmlsZW5hbWUpO1xuICB9O1xufVxuXG4vKipcbiAqIFZlcnNpb24gb2YgRUpTLlxuICpcbiAqIEByZWFkb25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLlZFUlNJT04gPSBfVkVSU0lPTl9TVFJJTkc7XG5cbi8qKlxuICogTmFtZSBmb3IgZGV0ZWN0aW9uIG9mIEVKUy5cbiAqXG4gKiBAcmVhZG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5uYW1lID0gX05BTUU7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuaWYgKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93LmVqcyA9IGV4cG9ydHM7XG59XG4iXX0=
},{"../package.json":10,"./utils":9,"fs":2,"path":13}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbInJlZ0V4cENoYXJzIiwiZXhwb3J0cyIsImVzY2FwZVJlZ0V4cENoYXJzIiwic3RyaW5nIiwiU3RyaW5nIiwicmVwbGFjZSIsIl9FTkNPREVfSFRNTF9SVUxFUyIsIl9NQVRDSF9IVE1MIiwiZW5jb2RlX2NoYXIiLCJjIiwiZXNjYXBlRnVuY1N0ciIsImVzY2FwZVhNTCIsIm1hcmt1cCIsInVuZGVmaW5lZCIsInRvU3RyaW5nIiwiRnVuY3Rpb24iLCJwcm90b3R5cGUiLCJjYWxsIiwic2hhbGxvd0NvcHkiLCJ0byIsImZyb20iLCJwIiwic2hhbGxvd0NvcHlGcm9tTGlzdCIsImxpc3QiLCJpIiwibGVuZ3RoIiwiY2FjaGUiLCJfZGF0YSIsInNldCIsImtleSIsInZhbCIsImdldCIsInJlc2V0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBOzs7Ozs7QUFNQTs7QUFFQSxJQUFJQSxjQUFjLHFCQUFsQjs7QUFFQTs7Ozs7Ozs7OztBQVVBQyxRQUFRQyxpQkFBUixHQUE0QixVQUFVQyxNQUFWLEVBQWtCO0FBQzVDO0FBQ0EsTUFBSSxDQUFDQSxNQUFMLEVBQWE7QUFDWCxXQUFPLEVBQVA7QUFDRDtBQUNELFNBQU9DLE9BQU9ELE1BQVAsRUFBZUUsT0FBZixDQUF1QkwsV0FBdkIsRUFBb0MsTUFBcEMsQ0FBUDtBQUNELENBTkQ7O0FBUUEsSUFBSU0scUJBQXFCO0FBQ3ZCLE9BQUssT0FEa0I7QUFFdkIsT0FBSyxNQUZrQjtBQUd2QixPQUFLLE1BSGtCO0FBSXZCLE9BQUssT0FKa0I7QUFLdkIsT0FBSztBQUxrQixDQUF6QjtBQU9BLElBQUlDLGNBQWMsV0FBbEI7O0FBRUEsU0FBU0MsV0FBVCxDQUFxQkMsQ0FBckIsRUFBd0I7QUFDdEIsU0FBT0gsbUJBQW1CRyxDQUFuQixLQUF5QkEsQ0FBaEM7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsSUFBSUMsZ0JBQ0YsaUNBQ0Esc0JBREEsR0FFQSxxQkFGQSxHQUdBLHFCQUhBLEdBSUEsd0JBSkEsR0FLQSx1QkFMQSxHQU1BLFNBTkEsR0FPQSxrQ0FQQSxHQVFBLDZCQVJBLEdBU0Esd0NBVEEsR0FVQSxNQVhGOztBQWFBOzs7Ozs7Ozs7Ozs7QUFZQVQsUUFBUVUsU0FBUixHQUFvQixVQUFVQyxNQUFWLEVBQWtCO0FBQ3BDLFNBQU9BLFVBQVVDLFNBQVYsR0FDSCxFQURHLEdBRUhULE9BQU9RLE1BQVAsRUFDR1AsT0FESCxDQUNXRSxXQURYLEVBQ3dCQyxXQUR4QixDQUZKO0FBSUQsQ0FMRDtBQU1BUCxRQUFRVSxTQUFSLENBQWtCRyxRQUFsQixHQUE2QixZQUFZO0FBQ3ZDLFNBQU9DLFNBQVNDLFNBQVQsQ0FBbUJGLFFBQW5CLENBQTRCRyxJQUE1QixDQUFpQyxJQUFqQyxJQUF5QyxLQUF6QyxHQUFpRFAsYUFBeEQ7QUFDRCxDQUZEOztBQUlBOzs7Ozs7Ozs7OztBQVdBVCxRQUFRaUIsV0FBUixHQUFzQixVQUFVQyxFQUFWLEVBQWNDLElBQWQsRUFBb0I7QUFDeENBLFNBQU9BLFFBQVEsRUFBZjtBQUNBLE9BQUssSUFBSUMsQ0FBVCxJQUFjRCxJQUFkLEVBQW9CO0FBQ2xCRCxPQUFHRSxDQUFILElBQVFELEtBQUtDLENBQUwsQ0FBUjtBQUNEO0FBQ0QsU0FBT0YsRUFBUDtBQUNELENBTkQ7O0FBUUE7Ozs7Ozs7Ozs7OztBQVlBbEIsUUFBUXFCLG1CQUFSLEdBQThCLFVBQVVILEVBQVYsRUFBY0MsSUFBZCxFQUFvQkcsSUFBcEIsRUFBMEI7QUFDdEQsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlELEtBQUtFLE1BQXpCLEVBQWlDRCxHQUFqQyxFQUFzQztBQUNwQyxRQUFJSCxJQUFJRSxLQUFLQyxDQUFMLENBQVI7QUFDQSxRQUFJLE9BQU9KLEtBQUtDLENBQUwsQ0FBUCxJQUFrQixXQUF0QixFQUFtQztBQUNqQ0YsU0FBR0UsQ0FBSCxJQUFRRCxLQUFLQyxDQUFMLENBQVI7QUFDRDtBQUNGO0FBQ0QsU0FBT0YsRUFBUDtBQUNELENBUkQ7O0FBVUE7Ozs7Ozs7O0FBUUFsQixRQUFReUIsS0FBUixHQUFnQjtBQUNkQyxTQUFPLEVBRE87QUFFZEMsT0FBSyxVQUFVQyxHQUFWLEVBQWVDLEdBQWYsRUFBb0I7QUFDdkIsU0FBS0gsS0FBTCxDQUFXRSxHQUFYLElBQWtCQyxHQUFsQjtBQUNELEdBSmE7QUFLZEMsT0FBSyxVQUFVRixHQUFWLEVBQWU7QUFDbEIsV0FBTyxLQUFLRixLQUFMLENBQVdFLEdBQVgsQ0FBUDtBQUNELEdBUGE7QUFRZEcsU0FBTyxZQUFZO0FBQ2pCLFNBQUtMLEtBQUwsR0FBYSxFQUFiO0FBQ0Q7QUFWYSxDQUFoQiIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBFSlMgRW1iZWRkZWQgSmF2YVNjcmlwdCB0ZW1wbGF0ZXNcbiAqIENvcHlyaWdodCAyMTEyIE1hdHRoZXcgRWVybmlzc2UgKG1kZUBmbGVlZ2l4Lm9yZylcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiovXG5cbi8qKlxuICogUHJpdmF0ZSB1dGlsaXR5IGZ1bmN0aW9uc1xuICogQG1vZHVsZSB1dGlsc1xuICogQHByaXZhdGVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciByZWdFeHBDaGFycyA9IC9bfFxcXFx7fSgpW1xcXV4kKyo/Ll0vZztcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiByZWd1bGFyIGV4cHJlc3Npb25zLlxuICpcbiAqIElmIGBzdHJpbmdgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5lc2NhcGVSZWdFeHBDaGFycyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmICghc3RyaW5nKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlZ0V4cENoYXJzLCAnXFxcXCQmJyk7XG59O1xuXG52YXIgX0VOQ09ERV9IVE1MX1JVTEVTID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyYjMzQ7JyxcbiAgXCInXCI6ICcmIzM5Oydcbn07XG52YXIgX01BVENIX0hUTUwgPSAvWyY8PlxcJ1wiXS9nO1xuXG5mdW5jdGlvbiBlbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBfRU5DT0RFX0hUTUxfUlVMRVNbY10gfHwgYztcbn1cblxuLyoqXG4gKiBTdHJpbmdpZmllZCB2ZXJzaW9uIG9mIGNvbnN0YW50cyB1c2VkIGJ5IHtAbGluayBtb2R1bGU6dXRpbHMuZXNjYXBlWE1MfS5cbiAqXG4gKiBJdCBpcyB1c2VkIGluIHRoZSBwcm9jZXNzIG9mIGdlbmVyYXRpbmcge0BsaW5rIENsaWVudEZ1bmN0aW9ufXMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5cbnZhciBlc2NhcGVGdW5jU3RyID1cbiAgJ3ZhciBfRU5DT0RFX0hUTUxfUlVMRVMgPSB7XFxuJ1xuKyAnICAgICAgXCImXCI6IFwiJmFtcDtcIlxcbidcbisgJyAgICAsIFwiPFwiOiBcIiZsdDtcIlxcbidcbisgJyAgICAsIFwiPlwiOiBcIiZndDtcIlxcbidcbisgJyAgICAsIFxcJ1wiXFwnOiBcIiYjMzQ7XCJcXG4nXG4rICcgICAgLCBcIlxcJ1wiOiBcIiYjMzk7XCJcXG4nXG4rICcgICAgfVxcbidcbisgJyAgLCBfTUFUQ0hfSFRNTCA9IC9bJjw+XFwnXCJdL2c7XFxuJ1xuKyAnZnVuY3Rpb24gZW5jb2RlX2NoYXIoYykge1xcbidcbisgJyAgcmV0dXJuIF9FTkNPREVfSFRNTF9SVUxFU1tjXSB8fCBjO1xcbidcbisgJ307XFxuJztcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiBYTUwuXG4gKlxuICogSWYgYG1hcmt1cGAgaXMgYHVuZGVmaW5lZGAgb3IgYG51bGxgLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICpcbiAqIEBpbXBsZW1lbnRzIHtFc2NhcGVDYWxsYmFja31cbiAqIEBwYXJhbSB7U3RyaW5nfSBtYXJrdXAgSW5wdXQgc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9IEVzY2FwZWQgc3RyaW5nXG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlWE1MID0gZnVuY3Rpb24gKG1hcmt1cCkge1xuICByZXR1cm4gbWFya3VwID09IHVuZGVmaW5lZFxuICAgID8gJydcbiAgICA6IFN0cmluZyhtYXJrdXApXG4gICAgICAgIC5yZXBsYWNlKF9NQVRDSF9IVE1MLCBlbmNvZGVfY2hhcik7XG59O1xuZXhwb3J0cy5lc2NhcGVYTUwudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKSArICc7XFxuJyArIGVzY2FwZUZ1bmNTdHI7XG59O1xuXG4vKipcbiAqIE5haXZlIGNvcHkgb2YgcHJvcGVydGllcyBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cbiAqIERvZXMgbm90IHJlY3Vyc2UgaW50byBub24tc2NhbGFyIHByb3BlcnRpZXNcbiAqIERvZXMgbm90IGNoZWNrIHRvIHNlZSBpZiB0aGUgcHJvcGVydHkgaGFzIGEgdmFsdWUgYmVmb3JlIGNvcHlpbmdcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRvICAgRGVzdGluYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZyb20gU291cmNlIG9iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSAgICAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5zaGFsbG93Q29weSA9IGZ1bmN0aW9uICh0bywgZnJvbSkge1xuICBmcm9tID0gZnJvbSB8fCB7fTtcbiAgZm9yICh2YXIgcCBpbiBmcm9tKSB7XG4gICAgdG9bcF0gPSBmcm9tW3BdO1xuICB9XG4gIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogTmFpdmUgY29weSBvZiBhIGxpc3Qgb2Yga2V5IG5hbWVzLCBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cbiAqIE9ubHkgY29waWVzIHByb3BlcnR5IGlmIGl0IGlzIGFjdHVhbGx5IGRlZmluZWRcbiAqIERvZXMgbm90IHJlY3Vyc2UgaW50byBub24tc2NhbGFyIHByb3BlcnRpZXNcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRvICAgRGVzdGluYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZyb20gU291cmNlIG9iamVjdFxuICogQHBhcmFtICB7QXJyYXl9IGxpc3QgTGlzdCBvZiBwcm9wZXJ0aWVzIHRvIGNvcHlcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuc2hhbGxvd0NvcHlGcm9tTGlzdCA9IGZ1bmN0aW9uICh0bywgZnJvbSwgbGlzdCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcCA9IGxpc3RbaV07XG4gICAgaWYgKHR5cGVvZiBmcm9tW3BdICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0b1twXSA9IGZyb21bcF07XG4gICAgfVxuICB9XG4gIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogU2ltcGxlIGluLXByb2Nlc3MgY2FjaGUgaW1wbGVtZW50YXRpb24uIERvZXMgbm90IGltcGxlbWVudCBsaW1pdHMgb2YgYW55XG4gKiBzb3J0LlxuICpcbiAqIEBpbXBsZW1lbnRzIENhY2hlXG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLmNhY2hlID0ge1xuICBfZGF0YToge30sXG4gIHNldDogZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgdGhpcy5fZGF0YVtrZXldID0gdmFsO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldO1xuICB9LFxuICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgfVxufTtcbiJdfQ==
},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlzLmpzIl0sIm5hbWVzIjpbImV4cG9ydHMiLCJub2RlIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJIVE1MRWxlbWVudCIsIm5vZGVUeXBlIiwibm9kZUxpc3QiLCJ0eXBlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwibGVuZ3RoIiwic3RyaW5nIiwiU3RyaW5nIiwiZm4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFNQUEsUUFBUUMsSUFBUixHQUFlLFVBQVNDLEtBQVQsRUFBZ0I7QUFDM0IsU0FBT0EsVUFBVUMsU0FBVixJQUNBRCxpQkFBaUJFLFdBRGpCLElBRUFGLE1BQU1HLFFBQU4sS0FBbUIsQ0FGMUI7QUFHSCxDQUpEOztBQU1BOzs7Ozs7QUFNQUwsUUFBUU0sUUFBUixHQUFtQixVQUFTSixLQUFULEVBQWdCO0FBQy9CLE1BQUlLLE9BQU9DLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQlQsS0FBL0IsQ0FBWDs7QUFFQSxTQUFPQSxVQUFVQyxTQUFWLEtBQ0NJLFNBQVMsbUJBQVQsSUFBZ0NBLFNBQVMseUJBRDFDLEtBRUMsWUFBWUwsS0FGYixLQUdDQSxNQUFNVSxNQUFOLEtBQWlCLENBQWpCLElBQXNCWixRQUFRQyxJQUFSLENBQWFDLE1BQU0sQ0FBTixDQUFiLENBSHZCLENBQVA7QUFJSCxDQVBEOztBQVNBOzs7Ozs7QUFNQUYsUUFBUWEsTUFBUixHQUFpQixVQUFTWCxLQUFULEVBQWdCO0FBQzdCLFNBQU8sT0FBT0EsS0FBUCxLQUFpQixRQUFqQixJQUNBQSxpQkFBaUJZLE1BRHhCO0FBRUgsQ0FIRDs7QUFLQTs7Ozs7O0FBTUFkLFFBQVFlLEVBQVIsR0FBYSxVQUFTYixLQUFULEVBQWdCO0FBQ3pCLE1BQUlLLE9BQU9DLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQlQsS0FBL0IsQ0FBWDs7QUFFQSxTQUFPSyxTQUFTLG1CQUFoQjtBQUNILENBSkQiLCJmaWxlIjoiaXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENoZWNrIGlmIGFyZ3VtZW50IGlzIGEgSFRNTCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0cy5ub2RlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAmJiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gICAgICAgICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhcmd1bWVudCBpcyBhIGxpc3Qgb2YgSFRNTCBlbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydHMubm9kZUxpc3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcblxuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICYmICh0eXBlID09PSAnW29iamVjdCBOb2RlTGlzdF0nIHx8IHR5cGUgPT09ICdbb2JqZWN0IEhUTUxDb2xsZWN0aW9uXScpXG4gICAgICAgICYmICgnbGVuZ3RoJyBpbiB2YWx1ZSlcbiAgICAgICAgJiYgKHZhbHVlLmxlbmd0aCA9PT0gMCB8fCBleHBvcnRzLm5vZGUodmFsdWVbMF0pKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYXJndW1lbnQgaXMgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnRzLnN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcbiAgICAgICAgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGFyZ3VtZW50IGlzIGEgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnRzLmZuID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cbiAgICByZXR1cm4gdHlwZSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn07XG4iXX0=
},{}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpc3Rlbi5qcyJdLCJuYW1lcyI6WyJpcyIsInJlcXVpcmUiLCJkZWxlZ2F0ZSIsImxpc3RlbiIsInRhcmdldCIsInR5cGUiLCJjYWxsYmFjayIsIkVycm9yIiwic3RyaW5nIiwiVHlwZUVycm9yIiwiZm4iLCJub2RlIiwibGlzdGVuTm9kZSIsIm5vZGVMaXN0IiwibGlzdGVuTm9kZUxpc3QiLCJsaXN0ZW5TZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZXN0cm95IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkFycmF5IiwicHJvdG90eXBlIiwiZm9yRWFjaCIsImNhbGwiLCJzZWxlY3RvciIsImRvY3VtZW50IiwiYm9keSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEtBQUtDLFFBQVEsTUFBUixDQUFUO0FBQ0EsSUFBSUMsV0FBV0QsUUFBUSxVQUFSLENBQWY7O0FBRUE7Ozs7Ozs7OztBQVNBLFNBQVNFLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxJQUF4QixFQUE4QkMsUUFBOUIsRUFBd0M7QUFDcEMsUUFBSSxDQUFDRixNQUFELElBQVcsQ0FBQ0MsSUFBWixJQUFvQixDQUFDQyxRQUF6QixFQUFtQztBQUMvQixjQUFNLElBQUlDLEtBQUosQ0FBVSw0QkFBVixDQUFOO0FBQ0g7O0FBRUQsUUFBSSxDQUFDUCxHQUFHUSxNQUFILENBQVVILElBQVYsQ0FBTCxFQUFzQjtBQUNsQixjQUFNLElBQUlJLFNBQUosQ0FBYyxrQ0FBZCxDQUFOO0FBQ0g7O0FBRUQsUUFBSSxDQUFDVCxHQUFHVSxFQUFILENBQU1KLFFBQU4sQ0FBTCxFQUFzQjtBQUNsQixjQUFNLElBQUlHLFNBQUosQ0FBYyxtQ0FBZCxDQUFOO0FBQ0g7O0FBRUQsUUFBSVQsR0FBR1csSUFBSCxDQUFRUCxNQUFSLENBQUosRUFBcUI7QUFDakIsZUFBT1EsV0FBV1IsTUFBWCxFQUFtQkMsSUFBbkIsRUFBeUJDLFFBQXpCLENBQVA7QUFDSCxLQUZELE1BR0ssSUFBSU4sR0FBR2EsUUFBSCxDQUFZVCxNQUFaLENBQUosRUFBeUI7QUFDMUIsZUFBT1UsZUFBZVYsTUFBZixFQUF1QkMsSUFBdkIsRUFBNkJDLFFBQTdCLENBQVA7QUFDSCxLQUZJLE1BR0EsSUFBSU4sR0FBR1EsTUFBSCxDQUFVSixNQUFWLENBQUosRUFBdUI7QUFDeEIsZUFBT1csZUFBZVgsTUFBZixFQUF1QkMsSUFBdkIsRUFBNkJDLFFBQTdCLENBQVA7QUFDSCxLQUZJLE1BR0E7QUFDRCxjQUFNLElBQUlHLFNBQUosQ0FBYywyRUFBZCxDQUFOO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU0csVUFBVCxDQUFvQkQsSUFBcEIsRUFBMEJOLElBQTFCLEVBQWdDQyxRQUFoQyxFQUEwQztBQUN0Q0ssU0FBS0ssZ0JBQUwsQ0FBc0JYLElBQXRCLEVBQTRCQyxRQUE1Qjs7QUFFQSxXQUFPO0FBQ0hXLGlCQUFTLFlBQVc7QUFDaEJOLGlCQUFLTyxtQkFBTCxDQUF5QmIsSUFBekIsRUFBK0JDLFFBQS9CO0FBQ0g7QUFIRSxLQUFQO0FBS0g7O0FBRUQ7Ozs7Ozs7OztBQVNBLFNBQVNRLGNBQVQsQ0FBd0JELFFBQXhCLEVBQWtDUixJQUFsQyxFQUF3Q0MsUUFBeEMsRUFBa0Q7QUFDOUNhLFVBQU1DLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCQyxJQUF4QixDQUE2QlQsUUFBN0IsRUFBdUMsVUFBU0YsSUFBVCxFQUFlO0FBQ2xEQSxhQUFLSyxnQkFBTCxDQUFzQlgsSUFBdEIsRUFBNEJDLFFBQTVCO0FBQ0gsS0FGRDs7QUFJQSxXQUFPO0FBQ0hXLGlCQUFTLFlBQVc7QUFDaEJFLGtCQUFNQyxTQUFOLENBQWdCQyxPQUFoQixDQUF3QkMsSUFBeEIsQ0FBNkJULFFBQTdCLEVBQXVDLFVBQVNGLElBQVQsRUFBZTtBQUNsREEscUJBQUtPLG1CQUFMLENBQXlCYixJQUF6QixFQUErQkMsUUFBL0I7QUFDSCxhQUZEO0FBR0g7QUFMRSxLQUFQO0FBT0g7O0FBRUQ7Ozs7Ozs7OztBQVNBLFNBQVNTLGNBQVQsQ0FBd0JRLFFBQXhCLEVBQWtDbEIsSUFBbEMsRUFBd0NDLFFBQXhDLEVBQWtEO0FBQzlDLFdBQU9KLFNBQVNzQixTQUFTQyxJQUFsQixFQUF3QkYsUUFBeEIsRUFBa0NsQixJQUFsQyxFQUF3Q0MsUUFBeEMsQ0FBUDtBQUNIOztBQUVEb0IsT0FBT0MsT0FBUCxHQUFpQnhCLE1BQWpCIiwiZmlsZSI6Imxpc3Rlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcbnZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoJ2RlbGVnYXRlJyk7XG5cbi8qKlxuICogVmFsaWRhdGVzIGFsbCBwYXJhbXMgYW5kIGNhbGxzIHRoZSByaWdodFxuICogbGlzdGVuZXIgZnVuY3Rpb24gYmFzZWQgb24gaXRzIHRhcmdldCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEhUTUxFbGVtZW50fEhUTUxDb2xsZWN0aW9ufE5vZGVMaXN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBsaXN0ZW4odGFyZ2V0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgIGlmICghdGFyZ2V0ICYmICF0eXBlICYmICFjYWxsYmFjaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcmVxdWlyZWQgYXJndW1lbnRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFpcy5zdHJpbmcodHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBTdHJpbmcnKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzLmZuKGNhbGxiYWNrKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlyZCBhcmd1bWVudCBtdXN0IGJlIGEgRnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAoaXMubm9kZSh0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5Ob2RlKHRhcmdldCwgdHlwZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBlbHNlIGlmIChpcy5ub2RlTGlzdCh0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5Ob2RlTGlzdCh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXMuc3RyaW5nKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlblNlbGVjdG9yKHRhcmdldCwgdHlwZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIFN0cmluZywgSFRNTEVsZW1lbnQsIEhUTUxDb2xsZWN0aW9uLCBvciBOb2RlTGlzdCcpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGEgSFRNTCBlbGVtZW50XG4gKiBhbmQgcmV0dXJucyBhIHJlbW92ZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuTm9kZShub2RlLCB0eXBlLCBjYWxsYmFjaykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjayk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGEgbGlzdCBvZiBIVE1MIGVsZW1lbnRzXG4gKiBhbmQgcmV0dXJucyBhIHJlbW92ZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge05vZGVMaXN0fEhUTUxDb2xsZWN0aW9ufSBub2RlTGlzdFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGxpc3Rlbk5vZGVMaXN0KG5vZGVMaXN0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwobm9kZUxpc3QsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChub2RlTGlzdCwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYSBzZWxlY3RvclxuICogYW5kIHJldHVybnMgYSByZW1vdmUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gbGlzdGVuU2VsZWN0b3Ioc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGRlbGVnYXRlKGRvY3VtZW50LmJvZHksIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdGVuO1xuIl19
},{"./is":11,"delegate":7}],13:[function(require,module,exports){
(function (process){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIm5vcm1hbGl6ZUFycmF5IiwicGFydHMiLCJhbGxvd0Fib3ZlUm9vdCIsInVwIiwiaSIsImxlbmd0aCIsImxhc3QiLCJzcGxpY2UiLCJ1bnNoaWZ0Iiwic3BsaXRQYXRoUmUiLCJzcGxpdFBhdGgiLCJmaWxlbmFtZSIsImV4ZWMiLCJzbGljZSIsImV4cG9ydHMiLCJyZXNvbHZlIiwicmVzb2x2ZWRQYXRoIiwicmVzb2x2ZWRBYnNvbHV0ZSIsImFyZ3VtZW50cyIsInBhdGgiLCJwcm9jZXNzIiwiY3dkIiwiVHlwZUVycm9yIiwiY2hhckF0IiwiZmlsdGVyIiwic3BsaXQiLCJwIiwiam9pbiIsIm5vcm1hbGl6ZSIsImlzQWJzb2x1dGUiLCJ0cmFpbGluZ1NsYXNoIiwic3Vic3RyIiwicGF0aHMiLCJBcnJheSIsInByb3RvdHlwZSIsImNhbGwiLCJpbmRleCIsInJlbGF0aXZlIiwiZnJvbSIsInRvIiwidHJpbSIsImFyciIsInN0YXJ0IiwiZW5kIiwiZnJvbVBhcnRzIiwidG9QYXJ0cyIsIk1hdGgiLCJtaW4iLCJzYW1lUGFydHNMZW5ndGgiLCJvdXRwdXRQYXJ0cyIsInB1c2giLCJjb25jYXQiLCJzZXAiLCJkZWxpbWl0ZXIiLCJkaXJuYW1lIiwicmVzdWx0Iiwicm9vdCIsImRpciIsImJhc2VuYW1lIiwiZXh0IiwiZiIsImV4dG5hbWUiLCJ4cyIsInJlcyIsInN0ciIsImxlbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNBLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQStCQyxjQUEvQixFQUErQztBQUM3QztBQUNBLE1BQUlDLEtBQUssQ0FBVDtBQUNBLE9BQUssSUFBSUMsSUFBSUgsTUFBTUksTUFBTixHQUFlLENB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QS9CLEVBQW9DO0FBQ2hDLFFBQUl3RCxFQUFFRSxHQUFHMUQsQ0FBSCxDQUFGLEVBQVNBLENBQVQsRUFBWTBELEVBQVosQ0FBSixFQUFxQkMsSUFBSWIsSUFBSixDQUFTWSxHQUFHMUQsQ0FBSCxDQUFUO0FBQ3hCO0FBQ0QsU0FBTzJELEdBQVA7QUFDSDs7QUFFRDtBQUNBLElBQUloQyxTQUFTLEtBQUtBLE1BQUwsQ0FBWSxDQUFDLENBQWIsTUFBb0IsR0FBcEIsR0FDUCxVQUFVaUMsR0FBVixFQUFldEIsS0FBZixFQUFzQnVCLEdBQXRCLEVBQTJCO0FBQUUsU0FBT0QsSUFBSWpDLE1BQUosQ0FBV1csS0FBWCxFQUFrQnVCLEdBQWxCLENBQVA7QUFBK0IsQ0FEckQsR0FFUCxVQUFVRCxHQUFWLEVBQWV0QixLQUFmLEVBQXNCdUIsR0FBdEIsRUFBMkI7QUFDekIsTUFBSXZCLFFBQVEsQ0FBWixFQUFlQSxRQUFRc0IsSUFBSTNELE1BQUosR0FBYXFDLEtBQXJCO0FBQ2YsU0FBT3NCLElBQUlqQyxNQUFKLENBQVdXLEtBQVgsRUFBa0J1QixHQUFsQixDQUFQO0FBQ0gsQ0FMTCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIl19
}).call(this,require("9FoBSB"))
},{"9FoBSB":14}],14:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyb3dzZXIuanMiXSwibmFtZXMiOlsicHJvY2VzcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJuZXh0VGljayIsImNhblNldEltbWVkaWF0ZSIsIndpbmRvdyIsInNldEltbWVkaWF0ZSIsImNhblBvc3QiLCJwb3N0TWVzc2FnZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJmIiwicXVldWUiLCJldiIsInNvdXJjZSIsImRhdGEiLCJzdG9wUHJvcGFnYXRpb24iLCJsZW5ndGgiLCJmbiIsInNoaWZ0IiwicHVzaCIsInNldFRpbWVvdXQiLCJ0aXRsZSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2Iiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwiYmluZGluZyIsIm5hbWUiLCJFcnJvciIsImN3ZCIsImNoZGlyIiwiZGlyIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJQSxVQUFVQyxPQUFPQyxPQUFQLEdBQWlCLEVBQS9COztBQUVBRixRQUFRRyxRQUFSLEdBQW9CLFlBQVk7QUFDNUIsUUFBSUMsa0JBQWtCLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFDbkJBLE9BQU9DLFlBRFY7QUFFQSxRQUFJQyxVQUFVLE9BQU9GLE1BQVAsS0FBa0IsV0FBbEIsSUFDWEEsT0FBT0csV0FESSxJQUNXSCxPQUFPSSxnQkFEaEM7O0FBSUEsUUFBSUwsZUFBSixFQUFxQjtBQUNqQixlQUFPLFVBQVVNLENBQVYsRUFBYTtBQUFFLG1CQUFPTCxPQUFPQyxZQUFQLENBQW9CSSxDQUFwQixDQUFQO0FBQStCLFNBQXJEO0FBQ0g7O0FBRUQsUUFBSUgsT0FBSixFQUFhO0FBQ1QsWUFBSUksUUFBUSxFQUFaO0FBQ0FOLGVBQU9JLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQVVHLEVBQVYsRUFBYztBQUM3QyxnQkFBSUMsU0FBU0QsR0FBR0MsTUFBaEI7QUFDQSxnQkFBSSxDQUFDQSxXQUFXUixNQUFYLElBQXFCUSxXQUFXLElBQWpDLEtBQTBDRCxHQUFHRSxJQUFILEtBQVksY0FBMUQsRUFBMEU7QUFDdEVGLG1CQUFHRyxlQUFIO0FBQ0Esb0JBQUlKLE1BQU1LLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNsQix3QkFBSUMsS0FBS04sTUFBTU8sS0FBTixFQUFUO0FBQ0FEO0FBQ0g7QUFDSjtBQUNKLFNBVEQsRUFTRyxJQVRIOztBQVdBLGVBQU8sU0FBU2QsUUFBVCxDQUFrQmMsRUFBbEIsRUFBc0I7QUFDekJOLGtCQUFNUSxJQUFOLENBQVdGLEVBQVg7QUFDQVosbUJBQU9HLFdBQVAsQ0FBbUIsY0FBbkIsRUFBbUMsR0FBbkM7QUFDSCxTQUhEO0FBSUg7O0FBRUQsV0FBTyxTQUFTTCxRQUFULENBQWtCYyxFQUFsQixFQUFzQjtBQUN6QkcsbUJBQVdILEVBQVgsRUFBZSxDQUFmO0FBQ0gsS0FGRDtBQUdILENBakNrQixFQUFuQjs7QUFtQ0FqQixRQUFRcUIsS0FBUixHQUFnQixTQUFoQjtBQUNBckIsUUFBUXNCLE9BQVIsR0FBa0IsSUFBbEI7QUFDQXRCLFFBQVF1QixHQUFSLEdBQWMsRUFBZDtBQUNBdkIsUUFBUXdCLElBQVIsR0FBZSxFQUFmOztBQUVBLFNBQVNDLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEJ6QixRQUFRMEIsRUFBUixHQUFhRCxJQUFiO0FBQ0F6QixRQUFRMkIsV0FBUixHQUFzQkYsSUFBdEI7QUFDQXpCLFFBQVE0QixJQUFSLEdBQWVILElBQWY7QUFDQXpCLFFBQVE2QixHQUFSLEdBQWNKLElBQWQ7QUFDQXpCLFFBQVE4QixjQUFSLEdBQXlCTCxJQUF6QjtBQUNBekIsUUFBUStCLGtCQUFSLEdBQTZCTixJQUE3QjtBQUNBekIsUUFBUWdDLElBQVIsR0FBZVAsSUFBZjs7QUFFQXpCLFFBQVFpQyxPQUFSLEdBQWtCLFVBQVVDLElBQVYsRUFBZ0I7QUFDOUIsVUFBTSxJQUFJQyxLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNILENBRkQ7O0FBSUE7QUFDQW5DLFFBQVFvQyxHQUFSLEdBQWMsWUFBWTtBQUFFLFdBQU8sR0FBUDtBQUFZLENBQXhDO0FBQ0FwQyxRQUFRcUMsS0FBUixHQUFnQixVQUFVQyxHQUFWLEVBQWU7QUFDM0IsVUFBTSxJQUFJSCxLQUFKLENBQVUsZ0NBQVYsQ0FBTjtBQUNILENBRkQiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIl19
},{}],15:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdC5qcyJdLCJuYW1lcyI6WyJzZWxlY3QiLCJlbGVtZW50Iiwic2VsZWN0ZWRUZXh0Iiwibm9kZU5hbWUiLCJmb2N1cyIsInZhbHVlIiwiaXNSZWFkT25seSIsImhhc0F0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInNldFNlbGVjdGlvblJhbmdlIiwibGVuZ3RoIiwicmVtb3ZlQXR0cmlidXRlIiwic2VsZWN0aW9uIiwid2luZG93IiwiZ2V0U2VsZWN0aW9uIiwicmFuZ2UiLCJkb2N1bWVudCIsImNyZWF0ZVJhbmdlIiwic2VsZWN0Tm9kZUNvbnRlbnRzIiwicmVtb3ZlQWxsUmFuZ2VzIiwiYWRkUmFuZ2UiLCJ0b1N0cmluZyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLE1BQVQsQ0FBZ0JDLE9BQWhCLEVBQXlCO0FBQ3JCLFFBQUlDLFlBQUo7O0FBRUEsUUFBSUQsUUFBUUUsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUMvQkYsZ0JBQVFHLEtBQVI7O0FBRUFGLHVCQUFlRCxRQUFRSSxLQUF2QjtBQUNILEtBSkQsTUFLSyxJQUFJSixRQUFRRSxRQUFSLEtBQXFCLE9BQXJCLElBQWdDRixRQUFRRSxRQUFSLEtBQXFCLFVBQXpELEVBQXFFO0FBQ3RFLFlBQUlHLGFBQWFMLFFBQVFNLFlBQVIsQ0FBcUIsVUFBckIsQ0FBakI7O0FBRUEsWUFBSSxDQUFDRCxVQUFMLEVBQWlCO0FBQ2JMLG9CQUFRTyxZQUFSLENBQXFCLFVBQXJCLEVBQWlDLEVBQWpDO0FBQ0g7O0FBRURQLGdCQUFRRCxNQUFSO0FBQ0FDLGdCQUFRUSxpQkFBUixDQUEwQixDQUExQixFQUE2QlIsUUFBUUksS0FBUixDQUFjSyxNQUEzQzs7QUFFQSxZQUFJLENBQUNKLFVBQUwsRUFBaUI7QUFDYkwsb0JBQVFVLGVBQVIsQ0FBd0IsVUFBeEI7QUFDSDs7QUFFRFQsdUJBQWVELFFBQVFJLEtBQXZCO0FBQ0gsS0FmSSxNQWdCQTtBQUNELFlBQUlKLFFBQVFNLFlBQVIsQ0FBcUIsaUJBQXJCLENBQUosRUFBNkM7QUFDekNOLG9CQUFRRyxLQUFSO0FBQ0g7O0FBRUQsWUFBSVEsWUFBWUMsT0FBT0MsWUFBUCxFQUFoQjtBQUNBLFlBQUlDLFFBQVFDLFNBQVNDLFdBQVQsRUFBWjs7QUFFQUYsY0FBTUcsa0JBQU4sQ0FBeUJqQixPQUF6QjtBQUNBVyxrQkFBVU8sZUFBVjtBQUNBUCxrQkFBVVEsUUFBVixDQUFtQkwsS0FBbkI7O0FBRUFiLHVCQUFlVSxVQUFVUyxRQUFWLEVBQWY7QUFDSDs7QUFFRCxXQUFPbkIsWUFBUDtBQUNIOztBQUVEb0IsT0FBT0MsT0FBUCxHQUFpQnZCLE1BQWpCIiwiZmlsZSI6InNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNlbGVjdChlbGVtZW50KSB7XG4gICAgdmFyIHNlbGVjdGVkVGV4dDtcblxuICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnU0VMRUNUJykge1xuICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgICAgc2VsZWN0ZWRUZXh0ID0gZWxlbWVudC52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0lOUFVUJyB8fCBlbGVtZW50Lm5vZGVOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIHZhciBpc1JlYWRPbmx5ID0gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3JlYWRvbmx5Jyk7XG5cbiAgICAgICAgaWYgKCFpc1JlYWRPbmx5KSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncmVhZG9ubHknLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnNlbGVjdCgpO1xuICAgICAgICBlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKDAsIGVsZW1lbnQudmFsdWUubGVuZ3RoKTtcblxuICAgICAgICBpZiAoIWlzUmVhZE9ubHkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdyZWFkb25seScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0ZWRUZXh0ID0gZWxlbWVudC52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG5cbiAgICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsZW1lbnQpO1xuICAgICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG5cbiAgICAgICAgc2VsZWN0ZWRUZXh0ID0gc2VsZWN0aW9uLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGVkVGV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZWxlY3Q7XG4iXX0=
},{}],16:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkUiLCJwcm90b3R5cGUiLCJvbiIsIm5hbWUiLCJjYWxsYmFjayIsImN0eCIsImUiLCJwdXNoIiwiZm4iLCJvbmNlIiwic2VsZiIsImxpc3RlbmVyIiwib2ZmIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJfIiwiZW1pdCIsImRhdGEiLCJzbGljZSIsImNhbGwiLCJldnRBcnIiLCJpIiwibGVuIiwibGVuZ3RoIiwiZXZ0cyIsImxpdmVFdmVudHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTQSxDQUFULEdBQWM7QUFDWjtBQUNBO0FBQ0Q7O0FBRURBLEVBQUVDLFNBQUYsR0FBYztBQUNaQyxNQUFJLFVBQVVDLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCQyxHQUExQixFQUErQjtBQUNqQyxRQUFJQyxJQUFJLEtBQUtBLENBQUwsS0FBVyxLQUFLQSxDQUFMLEdBQVMsRUFBcEIsQ0FBUjs7QUFFQSxLQUFDQSxFQUFFSCxJQUFGLE1BQVlHLEVBQUVILElBQUYsSUFBVSxFQUF0QixDQUFELEVBQTRCSSxJQUE1QixDQUFpQztBQUMvQkMsVUFBSUosUUFEMkI7QUFFL0JDLFdBQUtBO0FBRjBCLEtBQWpDOztBQUtBLFdBQU8sSUFBUDtBQUNELEdBVlc7O0FBWVpJLFFBQU0sVUFBVU4sSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLEdBQTFCLEVBQStCO0FBQ25DLFFBQUlLLE9BQU8sSUFBWDtBQUNBLGFBQVNDLFFBQVQsR0FBcUI7QUFDbkJELFdBQUtFLEdBQUwsQ0FBU1QsSUFBVCxFQUFlUSxRQUFmO0FBQ0FQLGVBQVNTLEtBQVQsQ0FBZVIsR0FBZixFQUFvQlMsU0FBcEI7QUFDRDs7QUFFREgsYUFBU0ksQ0FBVCxHQUFhWCxRQUFiO0FBQ0EsV0FBTyxLQUFLRixFQUFMLENBQVFDLElBQVIsRUFBY1EsUUFBZCxFQUF3Qk4sR0FBeEIsQ0FBUDtBQUNELEdBckJXOztBQXVCWlcsUUFBTSxVQUFVYixJQUFWLEVBQWdCO0FBQ3BCLFFBQUljLE9BQU8sR0FBR0MsS0FBSCxDQUFTQyxJQUFULENBQWNMLFNBQWQsRUFBeUIsQ0FBekIsQ0FBWDtBQUNBLFFBQUlNLFNBQVMsQ0FBQyxDQUFDLEtBQUtkLENBQUwsS0FBVyxLQUFLQSxDQUFMLEdBQVMsRUFBcEIsQ0FBRCxFQUEwQkgsSUFBMUIsS0FBbUMsRUFBcEMsRUFBd0NlLEtBQXhDLEVBQWI7QUFDQSxRQUFJRyxJQUFJLENBQVI7QUFDQSxRQUFJQyxNQUFNRixPQUFPRyxNQUFqQjs7QUFFQSxTQUFLRixDQUFMLEVBQVFBLElBQUlDLEdBQVosRUFBaUJELEdBQWpCLEVBQXNCO0FBQ3BCRCxhQUFPQyxDQUFQLEVBQVViLEVBQVYsQ0FBYUssS0FBYixDQUFtQk8sT0FBT0MsQ0FBUCxFQUFVaEIsR0FBN0IsRUFBa0NZLElBQWxDO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0QsR0FsQ1c7O0FBb0NaTCxPQUFLLFVBQVVULElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCO0FBQzdCLFFBQUlFLElBQUksS0FBS0EsQ0FBTCxLQUFXLEtBQUtBLENBQUwsR0FBUyxFQUFwQixDQUFSO0FBQ0EsUUFBSWtCLE9BQU9sQixFQUFFSCxJQUFGLENBQVg7QUFDQSxRQUFJc0IsYUFBYSxFQUFqQjs7QUFFQSxRQUFJRCxRQUFRcEIsUUFBWixFQUFzQjtBQUNwQixXQUFLLElBQUlpQixJQUFJLENBQVIsRUFBV0MsTUFBTUUsS0FBS0QsTUFBM0IsRUFBbUNGLElBQUlDLEdBQXZDLEVBQTRDRCxHQUE1QyxFQUFpRDtBQUMvQyxZQUFJRyxLQUFLSCxDQUFMLEVBQVFiLEVBQVIsS0FBZUosUUFBZixJQUEyQm9CLEtBQUtILENBQUwsRUFBUWIsRUFBUixDQUFXTyxDQUFYLEtBQWlCWCxRQUFoRCxFQUNFcUIsV0FBV2xCLElBQVgsQ0FBZ0JpQixLQUFLSCxDQUFMLENBQWhCO0FBQ0g7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUNJLGVBQVdGLE1BQVosR0FDSWpCLEVBQUVILElBQUYsSUFBVXNCLFVBRGQsR0FFSSxPQUFPbkIsRUFBRUgsSUFBRixDQUZYOztBQUlBLFdBQU8sSUFBUDtBQUNEO0FBekRXLENBQWQ7O0FBNERBdUIsT0FBT0MsT0FBUCxHQUFpQjNCLENBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iXX0=
},{}]},{},[1])