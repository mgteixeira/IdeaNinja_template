(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * Business Idea
 */

/* --- VARIABLES --- */

// inputs (to get information) : id ; value
var inputs = {
    "#m-1": 0,
    "#m-2": 0,
    "#m-3": 0,
    "#m-4": 0,
    "#m-5": 0,

    "#f-6-1a": 0,
    "#f-6-2a": 0,
    "#f-6-3a": 0,
    "#f-6-4a": 0,
    "#f-6-5a": 0,

    "#c-7-1a": 0,
    "#c-7-2a": 0,
    "#c-7-3a": 0,
    "#c-7-4a": 0,
    "#c-7-5a": 0,
    "#c-7-6a": 0,

    "#c-9": 0,

    "#g-1": 0,
    "#g-2": 0,
    "#g-3": 0,

    "#b-12": 0
};
// array of input keys

var inputsa = ["#m-1", "#m-2", "#m-3", "#m-4", "#m-5", "#f-6-1a", "#f-6-2a", "#f-6-3a", "#f-6-4a", "#f-6-5a", "#c-7-1a", "#c-7-2a", "#c-7-3a", "#c-7-4a", "#c-7-5a", "#c-7-6a", "#c-9", "#g-1", "#g-2", "#g-3", "#b-12"];

// outputs (to show information) : id ; value
var outputs = {
    "#f-2": inputs["#m-2"],

    "#f-6-1q": inputs["#m-2"] * 0.5,
    "#f-6-2q": inputs["#m-2"] * 0.7,
    "#f-6-3q": inputs["#m-2"],
    "#f-6-4q": inputs["#m-2"] * 1.3,
    "#f-6-5q": inputs["#m-2"] * 1.5,

    "#c-6-1a": inputs["#f-6-1a"],
    "#c-6-2a": inputs["#f-6-2a"],
    "#c-6-3a": inputs["#f-6-3a"],
    "#c-6-4a": inputs["#f-6-4a"],
    "#c-6-5a": inputs["#f-6-5a"],

    "#c-6-1q": inputs["#m-2"] * 0.5,
    "#c-6-2q": inputs["#m-2"] * 0.7,
    "#c-6-3q": inputs["#m-2"],
    "#c-6-4q": inputs["#m-2"] * 1.3,
    "#c-6-5q": inputs["#m-2"] * 1.5,

    "#c-7-1q": inputs["#m-2"] / (1 + inputs["#m-5"]) * 0.5,
    "#c-7-2q": inputs["#m-2"] / (1 + inputs["#m-5"]) * 0.7,
    "#c-7-3q": inputs["#m-2"] / (1 + inputs["#m-5"]) * 0.9,
    "#c-7-4q": inputs["#m-2"] / (1 + inputs["#m-5"]) * 1.2,
    "#c-7-5q": inputs["#m-2"] / (1 + inputs["#m-5"]) * 1.5

    //   "#c-7-1": document.querySelector('input[name="c7"]:checked').value,
};

var scores = {
    "m-s": "0",
    "f-s": "0",
    "c-s": "0",
    "g-s": "0",
    "b-s": "0",
    "t-s": "0"
};

var scores_desc = {
    "a": {
        "desc": "very weak",
        "lower_limit": -2,
        "higher_limit": 2
    },
    "b": {
        "desc": "weak",
        "lower_limit": 2,
        "higher_limit": 3
    },
    "c": {
        "desc": "average",
        "lower_limit": 3,
        "higher_limit": 4
    },
    "d": {
        "desc": "strong",
        "lower_limit": 4,
        "higher_limit": 5
    },
    "e": {
        "desc": "very strong",
        "lower_limit": 4,
        "higher_limit": 150
    }
};

var regex = {
    id: /#(\D)-(\d)-?(\d?)/i
};

/* --- EVENTS --- */

// Ready
$(function () {
    // Get LocalStorage
    // Set the inputs
    // Set the outputs
    // Set the Scores
    // Set the final Score
});

// Change
inputsa.forEach(function (key) {
    //console.log("forEach começou " + key +" = " + inputs[key]); 
    $(key).change(function () {
        //console.log("detectou change na " + key);
        inputs[key] = $(key).val();
        setOutputs();
        showMenu();
        //console.log("I've changed"); 
        //console.log(inputs); 
    });
}); //forach inputsa

//show menus
function showMenu() {
    if (inputs["#m-1"] !== 0 && inputs["#m-2"] !== 0 && inputs["#m-3"] !== 0 && inputs["#m-4"] !== 0 && inputs["#m-5"] !== 0) {
        $("#fit_bar").removeClass("hidden");
        $("#marketnext").removeClass("hidden");
        $("#bi_bar").css("width", "20%");
    }
    if (inputs["#f-6-1a"] !== 0 && inputs["#f-6-2a"] !== 0 && inputs["#f-6-3a"] !== 0 && inputs["#f-6-4a"] !== 0 && inputs["#f-6-5a"] !== 0) {
        $("#competitive_bar").removeClass("hidden");
        $("#fitnext").removeClass("hidden");
        $("#bi_bar").css("width", "40%");
    }
    if (inputs["#c-9"] !== 0 && typeof document.querySelector("input[name='c-7']:checked") !== undefined) {
        $("#growth_bar").removeClass("hidden");
        $("#competitivenext").removeClass("hidden");
        $("#bi_bar").css("width", "60%");
    }
    if (inputs["#g-1"] !== 0 && inputs["#g-2"] !== 0 && inputs["#g-3"] !== 0) {
        $("#barriers_bar").removeClass("hidden");
        $("#grownext").removeClass("hidden");
        $("#bi_bar").css("width", "80%");
    }

    if (inputs["#b-12"] !== 0) {
        $("#score_bar").removeClass("hidden");
        $("#barriersnext").removeClass("hidden");
        $("#bi_bar").css("width", "100%");
    }
};

//set outputs
function setOutputs() {
    if (inputs["#m-2"] != 0) {
        outputs["#f-2"] = inputs["#m-2"];
        $("#f-2").text(inputs["#m-2"]);

        outputs["#f-6-1q"] = inputs["#m-2"] * 0.5;
        f61q = Math.round(outputs["#f-6-1q"] * 100);
        $("#f-6-1q").text(f61q / 100);

        outputs["#f-6-2q"] = inputs["#m-2"] * 0.7;
        f62q = Math.round(outputs["#f-6-2q"] * 100);
        $("#f-6-2q").text(f62q / 100);

        outputs["#f-6-3q"] = inputs["#m-2"];
        f63q = Math.round(outputs["#f-6-3q"] * 100);
        $("#f-6-3q").text(f63q / 100);

        outputs["#f-6-4q"] = inputs["#m-2"] * 1.3;
        f64q = Math.round(outputs["#f-6-4q"] * 100);
        $("#f-6-4q").text(f64q / 100);

        outputs["#f-6-5q"] = inputs["#m-2"] * 1.5;
        f65q = Math.round(outputs["#f-6-5q"] * 100);
        $("#f-6-5q").text(f65q / 100);

        /* $("#g-1").change(
         function()
             {
             $("#g9v").text(inputs["#g-1"]);
         }); 
           $("#g-2").change(
         function()
             {
             $("#g10v").text(inputs["#g-2"]); 
         }); 
             $("#g-3").change(
         function()
             {
             $("#g11v").text(inputs["#g-3"]);
         }); 
         */
        outputs["#c-6-1q"] = inputs["#m-2"] * 0.5;
        c61q = Math.round(outputs["#c-6-1q"] * 100);
        $("#c-6-1q").text(c61q / 100);

        outputs["#c-6-2q"] = inputs["#m-2"] * 0.7;
        c62q = Math.round(outputs["#c-6-2q"] * 100);
        $("#c-6-2q").text(c62q / 100);

        outputs["#c-6-3q"] = inputs["#m-2"];
        c63q = Math.round(outputs["#c-6-3q"] * 100);
        $("#c-6-3q").text(c63q / 100);

        outputs["#c-6-4q"] = inputs["#m-2"] * 1.3;
        c64q = Math.round(outputs["#c-6-4q"] * 100);
        $("#c-6-4q").text(c64q / 100);

        outputs["#c-6-5q"] = inputs["#m-2"] * 1.5;
        c65q = Math.round(outputs["#c-6-5q"] * 100);
        $("#c-6-5q").text(c65q / 100);

        if (inputs["#m-5"] != 0) {
            outputs["#c-7-1q"] = inputs["#m-2"] / (1 + inputs["#m-5"]) * 50;
            a1 = Math.round(outputs["#c-7-1q"] * 100);
            $("#c-7-1q").text(a1 / 100);

            outputs["#c-7-2q"] = inputs["#m-2"] / (1 + inputs["#m-5"]) * 70;
            a2 = Math.round(outputs["#c-7-2q"] * 100);
            $("#c-7-2q").text(a2 / 100);

            outputs["#c-7-3q"] = inputs["#m-2"] / (1 + inputs["#m-5"]) * 100;
            a3 = Math.round(outputs["#c-7-3q"] * 100);
            $("#c-7-3q").text(a3 / 100);

            outputs["#c-7-4q"] = inputs["#m-2"] / (1 + inputs["#m-5"]) * 130;
            a4 = Math.round(outputs["#c-7-4q"] * 100);
            $("#c-7-4q").text(a4 / 100);

            outputs["#c-7-5q"] = inputs["#m-2"] / (1 + inputs["#m-5"]) * 150;
            a5 = Math.round(outputs["#c-7-5q"] * 100);
            $("#c-7-5q").text(a5 / 100);
        }
    };
    if (inputs["#f-6-1a"] != 0) {
        outputs["#c-6-1a"] = inputs["#f-6-1a"];
        a10 = Math.round(inputs["#f-6-1a"] * 100);
        $("#c-6-1a").text(a10 / 100);
    };
    if (inputs["#f-6-2a"] != 0) {
        outputs["#c-6-2a"] = inputs["#f-6-2a"];
        a10 = Math.round(inputs["#f-6-2a"] * 100);
        $("#c-6-2a").text(a10 / 100);
    };

    if (inputs["#f-6-3a"] != 0) {
        outputs["#c-6-3a"] = inputs["#f-6-3a"];
        a10 = Math.round(inputs["#f-6-3a"] * 100);
        $("#c-6-3a").text(a10 / 100);
    };
    if (inputs["#f-6-4a"] != 0) {
        outputs["#c-6-4a"] = inputs["#f-6-4a"];
        a10 = Math.round(inputs["#f-6-4a"] * 100);
        $("#c-6-4a").text(a10 / 100);
    };
    if (inputs["#f-6-5a"] != 0) {
        outputs["#c-6-5a"] = inputs["#f-6-5a"];
        a10 = Math.round(inputs["#f-6-5a"] * 100);
        $("#c-6-5a").text(a10 / 100);
    };

    if (inputs["#m-1"] !== 0 && inputs["#m-2"] !== 0 && inputs["#m-3"] !== 0 && inputs["#m-4"] !== 0 && inputs["#m-5"] !== 0) {
        ms = valuemarketScore();
        //$("#m-s").text(ms) ;
        scores["m-s"] = ms;
        //console.log(scores); 
    };

    if (inputs["f-6-1a"] !== 0 && inputs["f-6-2a"] !== 0 && inputs["f-6-3a"] !== 0 && inputs["f-6-4a"] !== 0 && inputs["f-6-5a"] !== 0) {
        fs = fitScore();
        //$("#f-s").text(fs); 
        scores["f-s"] = fs;
        //console.log(scores); 
    };

    if (inputs["#c-9"] !== 0 && typeof document.querySelector("input[name='c-7']:checked") !== undefined) {
        cs = competitiveScore();
        //$("#c-s").text(cs); 
        scores["c-s"] = cs;
        //console.log(scores); 
    };

    if (inputs["#g-1"] !== 0 && inputs["#g-2"] !== 0 && inputs["#g-3"] !== 0) {
        gs = growthScore();
        //$("#g-s").text(gs); 
        scores["g-s"] = gs;
        //console.log(scores); 
    };

    if (inputs["#b-12"] !== 0) {
        bs = barriersScore();
        //console.log(bs); 
        //$("#b-s").text(bs);
        scores["b-s"] = bs;
        //console.log(scores);
    };

    if (scores["m-s"] !== "0" && scores["f-s"] !== "0" && scores["c-s"] !== "0" && scores["g-s"] !== "0" && scores["b-s"] !== "0") {
        ts = finalScore();
        $("#t-s").html("<p>Your business opportunity is <strong>" + ts + "</strong>.</p> <ul><li> The Market you chose to operate in is " + findDesc(ms) + "</li>" + "<li> Customer has a " + findDesc(fs) + " interest in your product or service</li><li> You have a " + findDesc(cs) + " competitive advantage</li><li>Your Growth opportunities are " + findDesc(gs) + "</li><li> The barriers to enter are " + findDesc(Math.pow(bs, 1 / 4)) + "</li></ul>");
        //console.log(scores);
    };
}

/* --- SYSTEMS --- */
// Score System

function valuemarketScore() {
    return Math.pow(inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"] * (1 + inputs["#m-4"]) * inputs["#m-5"] / 20000, 1 / 10) / 2;
}

function fitScore() {
    return (inputs["#f-6-3a"] / 100 * 5 + inputs["#f-6-1a"] / 100 * 5 + inputs["#f-6-5a"] / 100 * 5) / 2.5 + 1;
}

function competitiveScore() {
    //console.log("competitive score inicio de cálculo")
    switch (document.querySelector("input[name='c-7']:checked").value) {
        case "1":
            a = inputs["#f-6-1a"] / 100; //willingness to pay in marginal cost
            b = inputs["#c-9"] / (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]); // Cost structure vs Market size
            c = outputs["#c-7-1q"] / (inputs["#m-2"] * (1 - inputs["#m-5"] / 100));
            //console.log("a= " + a + " b = " + b + " c= " + c)
            return Math.max(Math.log10(Math.pow(Math.pow(a, 2) * (1 / b) + c * 3, 4)), 0);
        case "2":
            a = inputs["#f-6-2a"] / 100; //willingness to pay in marginal cost
            b = inputs["#c-9"] / (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]); // Cost structure vs Market size
            c = outputs["#c-7-2q"] / (inputs["#m-2"] * (1 - inputs["#m-5"] / 100));
            return Math.max(Math.log10(Math.pow(Math.pow(a, 2) * (1 / b) + c * 3, 4)), 0);
        case "3":
            a = inputs["#f-6-3a"] / 100; //willingness to pay in marginal cost
            b = inputs["#c-9"] / (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]); // Cost structure vs Market size
            c = outputs["#c-7-3q"] / (inputs["#m-2"] * (1 - inputs["#m-5"] / 100));
            return Math.max(Math.log10(Math.pow(Math.pow(a, 2) * (1 / b) + c * 3, 4)), 0);
        case "4":
            a = inputs["#f-6-4a"] / 100; //willingness to pay in marginal cost
            b = inputs["#c-9"] / (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]); // Cost structure vs Market size
            c = outputs["#c-7-4q"] / (inputs["#m-2"] * (1 - inputs["#m-5"] / 100));
            return Math.max(Math.log10(Math.pow(Math.pow(a, 2) * (1 / b) + c * 3, 4)), 0);
        case "5":
            a = inputs["#f-6-5a"] / 100; //willingness to pay in marginal cost
            b = inputs["#c-9"] / (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]); // Cost structure vs Market size
            c = outputs["#c-7-5q"] / (inputs["#m-2"] * (1 - inputs["#m-5"] / 100));
            return Math.max(Math.log10(Math.pow(Math.pow(a, 2) * (1 / b) + c * 3, 4)), 0);
    } //fim de switch 
}

function growthScore() {
    a = Math.pow(Math.pow(Math.pow(inputs["#g-1"], inputs["#g-2"]), inputs["#g-3"]), 1 / 70);
    b = Number(inputs["#g-1"]) + Number(inputs["#g-2"]) + Number(inputs["#g-3"]);
    //console.log("a = " + a); 
    //console.log("b = " + b); 
    return Math.pow(a * b, 1 / 4);
}

function barriersScore() {
    //console.log("lançada a função de cálculo de bs com a var de input = " + inputs["#b-12"] +" que é um " + typeof Number(inputs["#b-12"]) ); 
    a = Math.log10(Number(inputs["#b-12"])) - 2;
    b = 25;
    c = Math.pow(a, 2) * b;
    //console.log(" a = " + a + " b = " + b  + " c = " +c ); 
    return c;
}

function finalScore() {
    //console.log("inicio de finalScore"); 
    //console.log(scores); 
    a = valuemarketScore() * fitScore() * competitiveScore() * growthScore() / barriersScore();
    scores["t-s"] = a;
    //console.log(scores); 
    return findDesc(a);
}

// Description
function findDesc(x) {
    for (i = 0; i < Object.keys(scores_desc).length; i++) {
        key = Object.keys(scores_desc)[i];
        //console.log("key=" + key);
        //console.log(scores_desc.a.lower_limit); 
        if (x <= scores_desc[key].higher_limit && x >= scores_desc[key].lower_limit) {
            //console.log(scores); 
            return scores_desc[key].desc;
        }
    }
}

// Validation System

// verify : id - input id
function verify(id) {
    var nr = convertToNumber($(id).val());
    if (nr === false) {
        return false;
    }

    switch (id) {
        // Integer
        case "#m-1":
        case "#m-2":
        case "#c-9":
        case "#g-1":
        case "#g-2":
        case "#b-12":
            return isInt(nr) && numberBetween(nr, -1);

        // Float
        case "#m-3":
            return isFloat(nr) && numberBetween(nr, -1);

        // Percentage
        case "#m-4":
        case "#m-5":
        case "#f-6-1a":
        case "#f-6-2a":
        case "#f-6-3a":
        case "#f-6-4a":
        case "#f-6-5a":

            return isInt(nr) && numberBetween(nr, -1, 101);

        default:
            return false;
    }
}

// clean : input - jQuery obj ; spaces - boolean, default false, Return with or without spaces.
function clean(input, spaces) {
    if (typeof spaces === "undefined") {
        spaces = false;
    }
    input.val(function (i, val) {
        if (spaces) {
            return val.trim().split(/\s+/g).join(" ");
        } else {
            return val.trim().split(/\s+/g).join("");
        }
    });
}

// convertToNumber : id - input id : return a number or false
function convertToNumber(id) {
    var nr;
    $(id).val(function (i, val) {
        nr = Number(val);
        if (Number(val) != nr) {
            nr = false;
        }
    });
    return nr;
}

// numberBetween : n - Number obj ; min / max - number, optional
function numberBetween(n, min, max) {
    if (Number(n) !== n) {
        return false;
    } else {
        if (typeof min === "undefined" && typeof max === "undefined") {
            return true;
        } else if (typeof min !== "undefined" && typeof max === "undefined") {
            return nr > min;
        } else if (typeof min === "undefined" && typeof max !== "undefined") {
            return nr < max;
        } else {
            return nr > min && nr < max;
        }
    }
}

// isInt : n - Number obj
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

// isFloat : n - Number obj
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

//next buttons
$("body").on("click", "#marketnext", function () {
    $('a[href="#fit"]').click();
});

$("body").on("click", "#fitnext", function () {
    $('a[href="#competitive"]').click();
});

$("body").on("click", "#competitivenext", function () {
    $('a[href="#growth"]').click();
});

$("body").on("click", "#grownext", function () {
    $('a[href="#barriers"]').click();
});

$("body").on("click", "#barriersnext", function () {
    $('a[href="#score"]').click();
});
/* --- TOOLS --- */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxjb21wb25lbnRzXFxzY3JpcHRzXFx0b29sc1xcYnVzaW5lc3NfaWRlYS5qcyJdLCJuYW1lcyI6WyJpbnB1dHMiLCJpbnB1dHNhIiwib3V0cHV0cyIsInNjb3JlcyIsInNjb3Jlc19kZXNjIiwicmVnZXgiLCJpZCIsIiQiLCJmb3JFYWNoIiwia2V5IiwiY2hhbmdlIiwidmFsIiwic2V0T3V0cHV0cyIsInNob3dNZW51IiwicmVtb3ZlQ2xhc3MiLCJjc3MiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ1bmRlZmluZWQiLCJ0ZXh0IiwiZjYxcSIsIk1hdGgiLCJyb3VuZCIsImY2MnEiLCJmNjNxIiwiZjY0cSIsImY2NXEiLCJjNjFxIiwiYzYycSIsImM2M3EiLCJjNjRxIiwiYzY1cSIsImExIiwiYTIiLCJhMyIsImE0IiwiYTUiLCJhMTAiLCJtcyIsInZhbHVlbWFya2V0U2NvcmUiLCJmcyIsImZpdFNjb3JlIiwiY3MiLCJjb21wZXRpdGl2ZVNjb3JlIiwiZ3MiLCJncm93dGhTY29yZSIsImJzIiwiYmFycmllcnNTY29yZSIsInRzIiwiZmluYWxTY29yZSIsImh0bWwiLCJmaW5kRGVzYyIsInBvdyIsInZhbHVlIiwiYSIsImIiLCJjIiwibWF4IiwibG9nMTAiLCJOdW1iZXIiLCJ4IiwiaSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJoaWdoZXJfbGltaXQiLCJsb3dlcl9saW1pdCIsImRlc2MiLCJ2ZXJpZnkiLCJuciIsImNvbnZlcnRUb051bWJlciIsImlzSW50IiwibnVtYmVyQmV0d2VlbiIsImlzRmxvYXQiLCJjbGVhbiIsImlucHV0Iiwic3BhY2VzIiwidHJpbSIsInNwbGl0Iiwiam9pbiIsIm4iLCJtaW4iLCJvbiIsImNsaWNrIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUtBOztBQUVBO0FBQ0EsSUFBSUEsU0FBUztBQUNULFlBQVEsQ0FEQztBQUVU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Rkw7O0FBSUE1RSxFQUFFLE1BQUYsRUFBVTJFLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFdBQXRCLEVBQW1DLFlBQVU7QUFDekMzRSxNQUFFLHFCQUFGLEVBQXlCNEUsS0FBekI7QUFDQyxDQUZMOztBQUlBNUUsRUFBRSxNQUFGLEVBQVUyRSxFQUFWLENBQWEsT0FBYixFQUFzQixlQUF0QixFQUF1QyxZQUFVO0FBQzdDM0UsTUFBRSxrQkFBRixFQUFzQjRFLEtBQXRCO0FBQ0MsQ0FGTDtBQUdBIiwiZmlsZSI6ImJ1c2luZXNzX2lkZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBCdXNpbmVzcyBJZGVhXHJcbiAqL1xyXG5cclxuXHJcbi8qIC0tLSBWQVJJQUJMRVMgLS0tICovXHJcblxyXG4vLyBpbnB1dHMgKHRvIGdldCBpbmZvcm1hdGlvbikgOiBpZCA7IHZhbHVlXHJcbnZhciBpbnB1dHMgPSB7XHJcbiAgICBcIiNtLTFcIjogMCxcclxuICAgIFwiI20tMlwiOiAwLFxyXG4gICAgXCIjbS0zXCI6IDAsXHJcbiAgICBcIiNtLTRcIjogMCxcclxuICAgIFwiI20tNVwiOiAwLFxyXG5cclxuICAgIFwiI2YtNi0xYVwiOiAwLFxyXG4gICAgXCIjZi02LTJhXCI6IDAsXHJcbiAgICBcIiNmLTYtM2FcIjogMCxcclxuICAgIFwiI2YtNi00YVwiOiAwLFxyXG4gICAgXCIjZi02LTVhXCI6IDAsXHJcblxyXG4gICAgXCIjYy03LTFhXCI6IDAsXHJcbiAgICBcIiNjLTctMmFcIjogMCxcclxuICAgIFwiI2MtNy0zYVwiOiAwLFxyXG4gICAgXCIjYy03LTRhXCI6IDAsXHJcbiAgICBcIiNjLTctNWFcIjogMCxcclxuICAgIFwiI2MtNy02YVwiOiAwLFxyXG5cclxuICAgIFwiI2MtOVwiOiAwLFxyXG5cclxuICAgIFwiI2ctMVwiOiAwLFxyXG4gICAgXCIjZy0yXCI6IDAsXHJcbiAgICBcIiNnLTNcIjogMCxcclxuXHJcbiAgICBcIiNiLTEyXCI6IDBcclxufTtcclxuLy8gYXJyYXkgb2YgaW5wdXQga2V5c1xyXG5cclxudmFyIGlucHV0c2EgPSBbXHJcbiAgICBcIiNtLTFcIixcclxuICAgIFwiI20tMlwiLFxyXG4gICAgXCIjbS0zXCIsXHJcbiAgICBcIiNtLTRcIixcclxuICAgIFwiI20tNVwiLFxyXG5cclxuICAgIFwiI2YtNi0xYVwiLFxyXG4gICAgXCIjZi02LTJhXCIsXHJcbiAgICBcIiNmLTYtM2FcIixcclxuICAgIFwiI2YtNi00YVwiLFxyXG4gICAgXCIjZi02LTVhXCIsXHJcblxyXG4gICAgXCIjYy03LTFhXCIsXHJcbiAgICBcIiNjLTctMmFcIixcclxuICAgIFwiI2MtNy0zYVwiLFxyXG4gICAgXCIjYy03LTRhXCIsXHJcbiAgICBcIiNjLTctNWFcIixcclxuICAgIFwiI2MtNy02YVwiLFxyXG5cclxuICAgIFwiI2MtOVwiLFxyXG5cclxuICAgIFwiI2ctMVwiLFxyXG4gICAgXCIjZy0yXCIsXHJcbiAgICBcIiNnLTNcIixcclxuXHJcbiAgICBcIiNiLTEyXCJcclxuXTtcclxuXHJcblxyXG5cclxuLy8gb3V0cHV0cyAodG8gc2hvdyBpbmZvcm1hdGlvbikgOiBpZCA7IHZhbHVlXHJcbnZhciBvdXRwdXRzID0ge1xyXG4gICAgXCIjZi0yXCI6IGlucHV0c1tcIiNtLTJcIl0sXHJcblxyXG4gICAgXCIjZi02LTFxXCI6IGlucHV0c1tcIiNtLTJcIl0qMC41LFxyXG4gICAgXCIjZi02LTJxXCI6IGlucHV0c1tcIiNtLTJcIl0qMC43LFxyXG4gICAgXCIjZi02LTNxXCI6IGlucHV0c1tcIiNtLTJcIl0sXHJcbiAgICBcIiNmLTYtNHFcIjogaW5wdXRzW1wiI20tMlwiXSoxLjMsXHJcbiAgICBcIiNmLTYtNXFcIjogaW5wdXRzW1wiI20tMlwiXSoxLjUsXHJcbiBcclxuICAgIFwiI2MtNi0xYVwiOiBpbnB1dHNbXCIjZi02LTFhXCJdLFxyXG4gICAgXCIjYy02LTJhXCI6IGlucHV0c1tcIiNmLTYtMmFcIl0sXHJcbiAgICBcIiNjLTYtM2FcIjogaW5wdXRzW1wiI2YtNi0zYVwiXSxcclxuICAgIFwiI2MtNi00YVwiOiBpbnB1dHNbXCIjZi02LTRhXCJdLFxyXG4gICAgXCIjYy02LTVhXCI6IGlucHV0c1tcIiNmLTYtNWFcIl0sXHJcbiAgICBcclxuICAgIFwiI2MtNi0xcVwiOiBpbnB1dHNbXCIjbS0yXCJdKjAuNSxcclxuICAgIFwiI2MtNi0ycVwiOiBpbnB1dHNbXCIjbS0yXCJdKjAuNyxcclxuICAgIFwiI2MtNi0zcVwiOiBpbnB1dHNbXCIjbS0yXCJdLFxyXG4gICAgXCIjYy02LTRxXCI6IGlucHV0c1tcIiNtLTJcIl0qMS4zLFxyXG4gICAgXCIjYy02LTVxXCI6IGlucHV0c1tcIiNtLTJcIl0qMS41LFxyXG4gICAgXHJcbiAgICBcIiNjLTctMXFcIjogaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSowLjUsXHJcbiAgICBcIiNjLTctMnFcIjogaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSowLjcsXHJcbiAgICBcIiNjLTctM3FcIjogaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSowLjksXHJcbiAgICBcIiNjLTctNHFcIjogaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSoxLjIsXHJcbiAgICBcIiNjLTctNXFcIjogaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSoxLjVcclxuXHJcbiAvLyAgIFwiI2MtNy0xXCI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJjN1wiXTpjaGVja2VkJykudmFsdWUsXHJcbn07XHJcblxyXG5cclxudmFyIHNjb3JlcyA9IHtcclxuICAgIFwibS1zXCI6IFwiMFwiLFxyXG4gICAgXCJmLXNcIjogXCIwXCIsXHJcbiAgICBcImMtc1wiOiBcIjBcIixcclxuICAgIFwiZy1zXCI6IFwiMFwiLCBcclxuICAgIFwiYi1zXCI6IFwiMFwiLCBcclxuICAgIFwidC1zXCI6IFwiMFwiXHJcbn1cclxuXHJcbnZhciBzY29yZXNfZGVzYyA9IHtcclxuICAgIFwiYVwiOiB7XHJcbiAgICAgICAgXCJkZXNjXCI6XCJ2ZXJ5IHdlYWtcIixcclxuICAgICAgICBcImxvd2VyX2xpbWl0XCI6IC0yLCBcclxuICAgICAgICBcImhpZ2hlcl9saW1pdFwiOiAyXHJcbiAgICAgICAgfSAsIFxyXG4gICAgXCJiXCI6IHtcclxuICAgICAgICBcImRlc2NcIjpcIndlYWtcIixcclxuICAgICAgICBcImxvd2VyX2xpbWl0XCI6IDIsIFxyXG4gICAgICAgIFwiaGlnaGVyX2xpbWl0XCI6IDNcclxuICAgICAgICB9LCBcclxuICAgIFwiY1wiOiB7XHJcbiAgICAgICAgXCJkZXNjXCI6IFwiYXZlcmFnZVwiLCBcclxuICAgICAgICBcImxvd2VyX2xpbWl0XCI6IDMsIFxyXG4gICAgICAgIFwiaGlnaGVyX2xpbWl0XCI6IDRcclxuICAgICAgICB9LCBcclxuICAgIFwiZFwiOiB7XHJcbiAgICAgICAgXCJkZXNjXCI6IFwic3Ryb25nXCIsIFxyXG4gICAgICAgIFwibG93ZXJfbGltaXRcIjogIDQsIFxyXG4gICAgICAgIFwiaGlnaGVyX2xpbWl0XCI6IDVcclxuICAgICAgICB9LCBcclxuICAgIFwiZVwiOiB7XHJcbiAgICAgICAgXCJkZXNjXCI6IFwidmVyeSBzdHJvbmdcIixcclxuICAgICAgICBcImxvd2VyX2xpbWl0XCI6IDQsIFxyXG4gICAgICAgIFwiaGlnaGVyX2xpbWl0XCI6IDE1MFxyXG4gICAgICAgIH1cclxufVxyXG5cclxuXHJcbnZhciByZWdleCA9IHtcclxuICAgIGlkOiAvIyhcXEQpLShcXGQpLT8oXFxkPykvaSxcclxufTtcclxuXHJcblxyXG4vKiAtLS0gRVZFTlRTIC0tLSAqL1xyXG5cclxuLy8gUmVhZHlcclxuJChmdW5jdGlvbigpIHtcclxuICAgIC8vIEdldCBMb2NhbFN0b3JhZ2VcclxuICAgIC8vIFNldCB0aGUgaW5wdXRzXHJcbiAgICAvLyBTZXQgdGhlIG91dHB1dHNcclxuICAgIC8vIFNldCB0aGUgU2NvcmVzXHJcbiAgICAvLyBTZXQgdGhlIGZpbmFsIFNjb3JlXHJcbn0pO1xyXG5cclxuLy8gQ2hhbmdlXHJcbmlucHV0c2EuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImZvckVhY2ggY29tZcOnb3UgXCIgKyBrZXkgK1wiID0gXCIgKyBpbnB1dHNba2V5XSk7IFxyXG4gICAgJChrZXkpLmNoYW5nZShmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJkZXRlY3RvdSBjaGFuZ2UgbmEgXCIgKyBrZXkpO1xyXG4gICAgICAgIGlucHV0c1trZXldID0gJChrZXkpLnZhbCgpOyBcclxuICAgICAgICBzZXRPdXRwdXRzKCk7XHJcbiAgICAgICAgc2hvd01lbnUoKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiSSd2ZSBjaGFuZ2VkXCIpOyBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGlucHV0cyk7IFxyXG4gICAgfSk7XHJcbn0pOyAvL2ZvcmFjaCBpbnB1dHNhXHJcblxyXG4vL3Nob3cgbWVudXNcclxuZnVuY3Rpb24gc2hvd01lbnUoKXtcclxuICAgIGlmKGlucHV0c1tcIiNtLTFcIl0gIT09IDAgJiYgaW5wdXRzW1wiI20tMlwiXSAhPT0gMCAmJiBpbnB1dHNbXCIjbS0zXCJdICE9PSAwICYmIGlucHV0c1tcIiNtLTRcIl0gIT09IDAgJiYgaW5wdXRzW1wiI20tNVwiXSAhPT0gMCkge1xyXG4gICAgICAgICQoXCIjZml0X2JhclwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTsgXHJcbiAgICAgICAgJChcIiNtYXJrZXRuZXh0XCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQoXCIjYmlfYmFyXCIpLmNzcyhcIndpZHRoXCIsIFwiMjAlXCIpO1xyXG4gICAgfVxyXG4gICAgaWYoaW5wdXRzW1wiI2YtNi0xYVwiXSAhPT0gMCAmJiBpbnB1dHNbXCIjZi02LTJhXCJdICE9PSAwICYmIGlucHV0c1tcIiNmLTYtM2FcIl0gIT09IDAgJiYgaW5wdXRzW1wiI2YtNi00YVwiXSAhPT0wICYmIGlucHV0c1tcIiNmLTYtNWFcIl0gIT09IDApIHtcclxuICAgICAgICAkKFwiI2NvbXBldGl0aXZlX2JhclwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICAgICAkKFwiI2ZpdG5leHRcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgJChcIiNiaV9iYXJcIikuY3NzKFwid2lkdGhcIiwgXCI0MCVcIik7XHJcbiAgICB9XHJcbiAgICBpZihpbnB1dHNbXCIjYy05XCJdICE9PSAwICYmIHR5cGVvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT0nYy03J106Y2hlY2tlZFwiKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgJChcIiNncm93dGhfYmFyXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpOyBcclxuICAgICAgICAkKFwiI2NvbXBldGl0aXZlbmV4dFwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICAgICAkKFwiI2JpX2JhclwiKS5jc3MoXCJ3aWR0aFwiLCBcIjYwJVwiKTtcclxuICAgIH1cclxuICAgIGlmKCAoaW5wdXRzW1wiI2ctMVwiXSAhPT0gMCkgJiYgKGlucHV0c1tcIiNnLTJcIl0gIT09IDApICYmIChpbnB1dHNbXCIjZy0zXCJdICE9PSAwKSkge1xyXG4gICAgICAgICQoXCIjYmFycmllcnNfYmFyXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpOyBcclxuICAgICAgICAkKFwiI2dyb3duZXh0XCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQoXCIjYmlfYmFyXCIpLmNzcyhcIndpZHRoXCIsIFwiODAlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnB1dHNbXCIjYi0xMlwiXSAhPT0gMCl7XHJcbiAgICAgICAgJChcIiNzY29yZV9iYXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgJChcIiNiYXJyaWVyc25leHRcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgJChcIiNiaV9iYXJcIikuY3NzKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xyXG4gICAgfVxyXG59OyBcclxuXHJcbi8vc2V0IG91dHB1dHNcclxuZnVuY3Rpb24gc2V0T3V0cHV0cyAoKXtcclxuICAgIGlmKGlucHV0c1tcIiNtLTJcIl0gIT0gMCApIHtcclxuICAgICAgICBvdXRwdXRzW1wiI2YtMlwiXSA9IGlucHV0c1tcIiNtLTJcIl07IFxyXG4gICAgICAgICQoXCIjZi0yXCIpLnRleHQoaW5wdXRzW1wiI20tMlwiXSk7IFxyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2YtNi0xcVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMC41O1xyXG4gICAgICAgIGY2MXE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNmLTYtMXFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjZi02LTFxXCIpLnRleHQoZjYxcS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2YtNi0ycVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMC43O1xyXG4gICAgICAgIGY2MnE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNmLTYtMnFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjZi02LTJxXCIpLnRleHQoZjYycS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2YtNi0zcVwiXSA9IGlucHV0c1tcIiNtLTJcIl07XHJcbiAgICAgICAgZjYzcT0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2YtNi0zcVwiXSoxMDApXHJcbiAgICAgICAgJChcIiNmLTYtM3FcIikudGV4dChmNjNxLzEwMCk7XHJcblxyXG4gICAgICAgIG91dHB1dHNbXCIjZi02LTRxXCJdID0gaW5wdXRzW1wiI20tMlwiXSoxLjM7XHJcbiAgICAgICAgZjY0cT0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2YtNi00cVwiXSoxMDApXHJcbiAgICAgICAgJChcIiNmLTYtNHFcIikudGV4dChmNjRxLzEwMCk7XHJcblxyXG4gICAgICAgIG91dHB1dHNbXCIjZi02LTVxXCJdID0gaW5wdXRzW1wiI20tMlwiXSoxLjU7XHJcbiAgICAgICAgZjY1cT0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2YtNi01cVwiXSoxMDApXHJcbiAgICAgICAgJChcIiNmLTYtNXFcIikudGV4dChmNjVxLzEwMCk7XHJcblxyXG4gICAgICAgLyogJChcIiNnLTFcIikuY2hhbmdlKFxyXG4gICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAkKFwiI2c5dlwiKS50ZXh0KGlucHV0c1tcIiNnLTFcIl0pO1xyXG4gICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgJChcIiNnLTJcIikuY2hhbmdlKFxyXG4gICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAkKFwiI2cxMHZcIikudGV4dChpbnB1dHNbXCIjZy0yXCJdKTsgXHJcbiAgICAgICAgfSk7IFxyXG5cclxuXHJcbiAgICAgICAgJChcIiNnLTNcIikuY2hhbmdlKFxyXG4gICAgICAgIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAkKFwiI2cxMXZcIikudGV4dChpbnB1dHNbXCIjZy0zXCJdKTtcclxuICAgICAgICB9KTsgXHJcbiAgICAgICAgKi9cclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi0xcVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMC41O1xyXG4gICAgICAgIGM2MXE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTYtMXFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjYy02LTFxXCIpLnRleHQoYzYxcS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi0ycVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMC43O1xyXG4gICAgICAgIGM2MnE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTYtMnFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjYy02LTJxXCIpLnRleHQoYzYycS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi0zcVwiXSA9IGlucHV0c1tcIiNtLTJcIl07XHJcbiAgICAgICAgYzYzcT0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2MtNi0zcVwiXSoxMDApXHJcbiAgICAgICAgJChcIiNjLTYtM3FcIikudGV4dChjNjNxLzEwMCk7XHJcblxyXG4gICAgICAgIG91dHB1dHNbXCIjYy02LTRxXCJdID0gaW5wdXRzW1wiI20tMlwiXSoxLjM7XHJcbiAgICAgICAgYzY0cT0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2MtNi00cVwiXSoxMDApXHJcbiAgICAgICAgJChcIiNjLTYtNHFcIikudGV4dChjNjRxLzEwMCk7XHJcblxyXG4gICAgICAgIG91dHB1dHNbXCIjYy02LTVxXCJdID0gaW5wdXRzW1wiI20tMlwiXSoxLjU7XHJcbiAgICAgICAgYzY1cT0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2MtNi01cVwiXSoxMDApXHJcbiAgICAgICAgJChcIiNjLTYtNXFcIikudGV4dChjNjVxLzEwMCk7XHJcblxyXG4gICAgICAgIGlmKGlucHV0c1tcIiNtLTVcIl0gIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgIG91dHB1dHNbXCIjYy03LTFxXCJdID0gaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSo1MDsgXHJcbiAgICAgICAgICAgICAgICAgYTEgPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjYy03LTFxXCJdKjEwMCk7IFxyXG4gICAgICAgICAgICAgICAgJChcIiNjLTctMXFcIikudGV4dChhMS8xMDApOyBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0c1tcIiNjLTctMnFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdLygxK2lucHV0c1tcIiNtLTVcIl0pKjcwOyBcclxuICAgICAgICAgICAgICAgIGEyPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjYy03LTJxXCJdICogMTAwKVxyXG4gICAgICAgICAgICAgICAgJChcIiNjLTctMnFcIikudGV4dChhMi8xMDApOyBcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIG91dHB1dHNbXCIjYy03LTNxXCJdID0gaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSoxMDA7XHJcbiAgICAgICAgICAgICAgICBhMyA9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTctM3FcIl0qMTAwKTsgXHJcbiAgICAgICAgICAgICAgICAkKFwiI2MtNy0zcVwiKS50ZXh0KGEzLzEwMCk7IFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0c1tcIiNjLTctNHFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdLygxK2lucHV0c1tcIiNtLTVcIl0pKjEzMDsgXHJcbiAgICAgICAgICAgICAgICBhNCA9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTctNHFcIl0qMTAwKTsgXHJcbiAgICAgICAgICAgICAgICAkKFwiI2MtNy00cVwiKS50ZXh0KGE0LzEwMCk7IFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRzW1wiI2MtNy01cVwiXSA9IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMTUwOyBcclxuICAgICAgICAgICAgICAgIGE1ID0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2MtNy01cVwiXSoxMDApOyBcclxuICAgICAgICAgICAgICAgICQoXCIjYy03LTVxXCIpLnRleHQoYTUvMTAwKTsgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgfTsgXHJcbiAgICBpZihpbnB1dHNbXCIjZi02LTFhXCJdICE9IDAgKSB7XHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtMWFcIl0gPSBpbnB1dHNbXCIjZi02LTFhXCJdO1xyXG4gICAgICAgIGExMCA9IE1hdGgucm91bmQoIGlucHV0c1tcIiNmLTYtMWFcIl0qMTAwKTsgXHJcbiAgICAgICAgJChcIiNjLTYtMWFcIikudGV4dChhMTAvMTAwKTsgXHJcbiAgICAgICAgXHJcbiAgICB9OyBcclxuICAgIGlmKGlucHV0c1tcIiNmLTYtMmFcIl0gIT0gMCApIHtcclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi0yYVwiXSA9IGlucHV0c1tcIiNmLTYtMmFcIl07XHJcbiAgICAgICAgYTEwID0gTWF0aC5yb3VuZCggaW5wdXRzW1wiI2YtNi0yYVwiXSoxMDApOyBcclxuICAgICAgICAkKFwiI2MtNi0yYVwiKS50ZXh0KGExMC8xMDApOyBcclxuICAgIH07IFxyXG5cclxuICAgIGlmKGlucHV0c1tcIiNmLTYtM2FcIl0gIT0gMCApIHtcclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi0zYVwiXSA9IGlucHV0c1tcIiNmLTYtM2FcIl07XHJcbiAgICAgICAgYTEwID0gTWF0aC5yb3VuZCggaW5wdXRzW1wiI2YtNi0zYVwiXSoxMDApOyBcclxuICAgICAgICAkKFwiI2MtNi0zYVwiKS50ZXh0KGExMC8xMDApOyBcclxuICAgIH07IFxyXG4gICAgaWYoaW5wdXRzW1wiI2YtNi00YVwiXSAhPSAwICkge1xyXG4gICAgICAgIG91dHB1dHNbXCIjYy02LTRhXCJdID0gaW5wdXRzW1wiI2YtNi00YVwiXTtcclxuICAgICAgICBhMTAgPSBNYXRoLnJvdW5kKCBpbnB1dHNbXCIjZi02LTRhXCJdKjEwMCk7IFxyXG4gICAgICAgICQoXCIjYy02LTRhXCIpLnRleHQoYTEwLzEwMCk7IFxyXG4gICAgfTtcclxuICAgIGlmKGlucHV0c1tcIiNmLTYtNWFcIl0gIT0gMCApIHtcclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi01YVwiXSA9IGlucHV0c1tcIiNmLTYtNWFcIl07XHJcbiAgICAgICAgYTEwID0gTWF0aC5yb3VuZCggaW5wdXRzW1wiI2YtNi01YVwiXSoxMDApOyBcclxuICAgICAgICAkKFwiI2MtNi01YVwiKS50ZXh0KGExMC8xMDApOyBcclxuICAgIH07IFxyXG5cclxuICAgIFxyXG5cclxuICAgIGlmKCAoaW5wdXRzW1wiI20tMVwiXSAhPT0gMCkgJiYgKGlucHV0c1tcIiNtLTJcIl0gIT09IDApICYmIChpbnB1dHNbXCIjbS0zXCJdICE9PSAwKSAmJiAoaW5wdXRzW1wiI20tNFwiXSAhPT0gMCkgJiYgKGlucHV0c1tcIiNtLTVcIl0gIT09IDApKXtcclxuICAgICAgICBtcyA9IHZhbHVlbWFya2V0U2NvcmUoKTsgXHJcbiAgICAgICAgLy8kKFwiI20tc1wiKS50ZXh0KG1zKSA7XHJcbiAgICAgICAgc2NvcmVzW1wibS1zXCJdID0gbXM7IFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTsgXHJcbiAgICB9OyBcclxuICAgIFxyXG4gICAgaWYoIChpbnB1dHNbXCJmLTYtMWFcIl0gIT09MCkgJiYgKGlucHV0c1tcImYtNi0yYVwiXSAhPT0wKSAmJiAoaW5wdXRzW1wiZi02LTNhXCJdICE9PTApICYmIChpbnB1dHNbXCJmLTYtNGFcIl0gIT09MCkgJiYgKGlucHV0c1tcImYtNi01YVwiXSAhPT0wKSkge1xyXG4gICAgICAgIGZzID0gZml0U2NvcmUoKTsgXHJcbiAgICAgICAgLy8kKFwiI2Ytc1wiKS50ZXh0KGZzKTsgXHJcbiAgICAgICAgc2NvcmVzW1wiZi1zXCJdID0gZnM7IFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTsgXHJcbiAgICB9OyBcclxuICAgIFxyXG4gICAgaWYoIChpbnB1dHNbXCIjYy05XCJdICE9PSAwKSAmJiAodHlwZW9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPSdjLTcnXTpjaGVja2VkXCIpICE9PSB1bmRlZmluZWQpKXtcclxuICAgICAgICAgICBjcyA9IGNvbXBldGl0aXZlU2NvcmUoKTsgXHJcbiAgICAgICAgICAgLy8kKFwiI2Mtc1wiKS50ZXh0KGNzKTsgXHJcbiAgICAgICAgICAgc2NvcmVzW1wiYy1zXCJdID0gY3M7IFxyXG4gICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTsgXHJcbiAgICAgICAgfTsgXHJcblxyXG4gICAgaWYoIChpbnB1dHNbXCIjZy0xXCJdICE9PSAwKSAmJiAoaW5wdXRzW1wiI2ctMlwiXSAhPT0gMCkgJiYgKGlucHV0c1tcIiNnLTNcIl0gIT09IDApKSB7XHJcbiAgICAgICAgIGdzID0gZ3Jvd3RoU2NvcmUoKTsgXHJcbiAgICAgICAgIC8vJChcIiNnLXNcIikudGV4dChncyk7IFxyXG4gICAgICAgICBzY29yZXNbXCJnLXNcIl0gPSBnczsgXHJcbiAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTsgXHJcbiAgICB9OyBcclxuXHJcblxyXG4gICAgaWYgKGlucHV0c1tcIiNiLTEyXCJdICE9PSAwKXtcclxuICAgICAgICBicyA9IGJhcnJpZXJzU2NvcmUoKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGJzKTsgXHJcbiAgICAgICAgLy8kKFwiI2Itc1wiKS50ZXh0KGJzKTtcclxuICAgICAgICBzY29yZXNbXCJiLXNcIl0gPSBiczsgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzY29yZXMpO1xyXG4gICAgfTsgXHJcblxyXG4gICAgaWYoIChzY29yZXNbXCJtLXNcIl0gIT09IFwiMFwiKSAmJiAoc2NvcmVzW1wiZi1zXCJdICE9PSBcIjBcIikgJiYgKHNjb3Jlc1tcImMtc1wiXSAhPT0gXCIwXCIpICYmIChzY29yZXNbXCJnLXNcIl0gIT09IFwiMFwiKSAmJihzY29yZXNbXCJiLXNcIl0gIT09IFwiMFwiKSApe1xyXG4gICAgICAgIHRzID0gZmluYWxTY29yZSgpOyBcclxuICAgICAgICAkKFwiI3Qtc1wiKS5odG1sKFwiPHA+WW91ciBidXNpbmVzcyBvcHBvcnR1bml0eSBpcyA8c3Ryb25nPlwiICsgdHMgKyBcclxuICAgICAgICAgICAgXCI8L3N0cm9uZz4uPC9wPiA8dWw+PGxpPiBUaGUgTWFya2V0IHlvdSBjaG9zZSB0byBvcGVyYXRlIGluIGlzIFwiICsgZmluZERlc2MobXMpICsgXCI8L2xpPlwiK1xyXG4gICAgICAgICAgICBcIjxsaT4gQ3VzdG9tZXIgaGFzIGEgXCIgKyBmaW5kRGVzYyhmcykgKyBcIiBpbnRlcmVzdCBpbiB5b3VyIHByb2R1Y3Qgb3Igc2VydmljZTwvbGk+PGxpPiBZb3UgaGF2ZSBhIFwiICsgZmluZERlc2MoY3MpICsgXCIgY29tcGV0aXRpdmUgYWR2YW50YWdlPC9saT48bGk+WW91ciBHcm93dGggb3Bwb3J0dW5pdGllcyBhcmUgXCIgKyBmaW5kRGVzYyhncykgKyBcclxuICAgICAgICAgICAgXCI8L2xpPjxsaT4gVGhlIGJhcnJpZXJzIHRvIGVudGVyIGFyZSBcIiArIGZpbmREZXNjKCBNYXRoLnBvdyhicywxLzQpKSArIFxyXG4gICAgICAgICAgICBcIjwvbGk+PC91bD5cIik7ICBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7XHJcbiAgICB9OyBcclxufVxyXG5cclxuLyogLS0tIFNZU1RFTVMgLS0tICovXHJcbi8vIFNjb3JlIFN5c3RlbVxyXG5cclxuZnVuY3Rpb24gdmFsdWVtYXJrZXRTY29yZSgpIHtcclxuICAgIHJldHVybiBNYXRoLnBvdyhcclxuICAgICAgICAoaW5wdXRzW1wiI20tMVwiXSAqIGlucHV0c1tcIiNtLTJcIl0gKiBpbnB1dHNbXCIjbS0zXCJdICogXHJcbiAgICAgICAgICAgICgxICsgaW5wdXRzW1wiI20tNFwiXSlcclxuICAgICAgICAgKiBpbnB1dHNbXCIjbS01XCJdKS8gMjAwMDAsIDEvMTBcclxuICAgICAgICApLzI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpdFNjb3JlKCkge1xyXG4gICAgcmV0dXJuIChpbnB1dHNbXCIjZi02LTNhXCJdLzEwMCo1ICsgaW5wdXRzW1wiI2YtNi0xYVwiXS8xMDAqNSArIGlucHV0c1tcIiNmLTYtNWFcIl0vMTAwKjUpLzIuNSArIDE7XHJcbiAgICB9XHJcblxyXG5cclxuZnVuY3Rpb24gY29tcGV0aXRpdmVTY29yZSgpe1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImNvbXBldGl0aXZlIHNjb3JlIGluaWNpbyBkZSBjw6FsY3Vsb1wiKVxyXG4gICAgc3dpdGNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPSdjLTcnXTpjaGVja2VkXCIpLnZhbHVlKSB7XHJcbiAgICAgICAgY2FzZSBcIjFcIiA6XHJcbiAgICAgICAgICAgIGEgPSBpbnB1dHNbXCIjZi02LTFhXCJdLzEwMDsgICAvL3dpbGxpbmduZXNzIHRvIHBheSBpbiBtYXJnaW5hbCBjb3N0XHJcbiAgICAgICAgICAgIGIgPSBpbnB1dHNbXCIjYy05XCJdLyAoaW5wdXRzW1wiI20tMVwiXSAqIGlucHV0c1tcIiNtLTJcIl0gKiBpbnB1dHNbXCIjbS0zXCJdKTsgICAvLyBDb3N0IHN0cnVjdHVyZSB2cyBNYXJrZXQgc2l6ZVxyXG4gICAgICAgICAgICBjID0gKG91dHB1dHNbXCIjYy03LTFxXCJdLyhpbnB1dHNbXCIjbS0yXCJdICogKDEgLSBpbnB1dHNbXCIjbS01XCJdLzEwMCkpKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImE9IFwiICsgYSArIFwiIGIgPSBcIiArIGIgKyBcIiBjPSBcIiArIGMpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5sb2cxMChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucG93KGEsMikqKDEvYikrYyozXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSw0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLDApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjYXNlIFwiMlwiIDpcclxuICAgICAgICAgICAgYSA9IGlucHV0c1tcIiNmLTYtMmFcIl0vMTAwOyAgIC8vd2lsbGluZ25lc3MgdG8gcGF5IGluIG1hcmdpbmFsIGNvc3RcclxuICAgICAgICAgICAgYiA9IGlucHV0c1tcIiNjLTlcIl0vIChpbnB1dHNbXCIjbS0xXCJdICogaW5wdXRzW1wiI20tMlwiXSAqIGlucHV0c1tcIiNtLTNcIl0pOyAgIC8vIENvc3Qgc3RydWN0dXJlIHZzIE1hcmtldCBzaXplXHJcbiAgICAgICAgICAgIGMgPSBvdXRwdXRzW1wiI2MtNy0ycVwiXS8oaW5wdXRzW1wiI20tMlwiXSAqICgxIC0gaW5wdXRzW1wiI20tNVwiXS8xMDApKTtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmxvZzEwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoTWF0aC5wb3coYSwyKSooMS9iKStjKjNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsMClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGNhc2UgXCIzXCIgOlxyXG4gICAgICAgICAgICBhID0gaW5wdXRzW1wiI2YtNi0zYVwiXS8xMDA7ICAgLy93aWxsaW5nbmVzcyB0byBwYXkgaW4gbWFyZ2luYWwgY29zdFxyXG4gICAgICAgICAgICBiID0gaW5wdXRzW1wiI2MtOVwiXS8gKGlucHV0c1tcIiNtLTFcIl0gKiBpbnB1dHNbXCIjbS0yXCJdICogaW5wdXRzW1wiI20tM1wiXSk7ICAgLy8gQ29zdCBzdHJ1Y3R1cmUgdnMgTWFya2V0IHNpemVcclxuICAgICAgICAgICAgYyA9IG91dHB1dHNbXCIjYy03LTNxXCJdLyhpbnB1dHNbXCIjbS0yXCJdICogKDEgLSBpbnB1dHNbXCIjbS01XCJdLzEwMCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubG9nMTAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLnBvdyhhLDIpKigxL2IpK2MqM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksNClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICwwKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY2FzZSBcIjRcIiA6XHJcbiAgICAgICAgICAgIGEgPSBpbnB1dHNbXCIjZi02LTRhXCJdLzEwMDsgICAvL3dpbGxpbmduZXNzIHRvIHBheSBpbiBtYXJnaW5hbCBjb3N0XHJcbiAgICAgICAgICAgIGIgPSBpbnB1dHNbXCIjYy05XCJdLyAoaW5wdXRzW1wiI20tMVwiXSAqIGlucHV0c1tcIiNtLTJcIl0gKiBpbnB1dHNbXCIjbS0zXCJdKTsgICAvLyBDb3N0IHN0cnVjdHVyZSB2cyBNYXJrZXQgc2l6ZVxyXG4gICAgICAgICAgICBjID0gb3V0cHV0c1tcIiNjLTctNHFcIl0vKGlucHV0c1tcIiNtLTJcIl0gKiAoMSAtIGlucHV0c1tcIiNtLTVcIl0vMTAwKSk7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5sb2cxMChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucG93KGEsMikqKDEvYikrYyozXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSw0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLDApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjYXNlIFwiNVwiIDpcclxuICAgICAgICAgICAgIGEgPSBpbnB1dHNbXCIjZi02LTVhXCJdLzEwMDsgICAvL3dpbGxpbmduZXNzIHRvIHBheSBpbiBtYXJnaW5hbCBjb3N0XHJcbiAgICAgICAgICAgIGIgPSBpbnB1dHNbXCIjYy05XCJdLyAoaW5wdXRzW1wiI20tMVwiXSAqIGlucHV0c1tcIiNtLTJcIl0gKiBpbnB1dHNbXCIjbS0zXCJdKTsgICAvLyBDb3N0IHN0cnVjdHVyZSB2cyBNYXJrZXQgc2l6ZVxyXG4gICAgICAgICAgICBjID0gb3V0cHV0c1tcIiNjLTctNXFcIl0vKGlucHV0c1tcIiNtLTJcIl0gKiAoMSAtIGlucHV0c1tcIiNtLTVcIl0vMTAwKSk7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5sb2cxMChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucG93KGEsMikqKDEvYikrYyozXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSw0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLDApXHJcbiAgICAgICAgICAgICAgICAgICAgKTsgICAgICAgXHJcbiAgICB9Ly9maW0gZGUgc3dpdGNoIFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ3Jvd3RoU2NvcmUoKSB7XHJcbiAgICBhID0gIE1hdGgucG93KE1hdGgucG93KE1hdGgucG93KGlucHV0c1tcIiNnLTFcIl0saW5wdXRzW1wiI2ctMlwiXSksaW5wdXRzW1wiI2ctM1wiXSksKDEvNzApKTsgXHJcbiAgICBiID0gTnVtYmVyKGlucHV0c1tcIiNnLTFcIl0pICsgTnVtYmVyKGlucHV0c1tcIiNnLTJcIl0pICsgTnVtYmVyKGlucHV0c1tcIiNnLTNcIl0pOyBcclxuICAgIC8vY29uc29sZS5sb2coXCJhID0gXCIgKyBhKTsgXHJcbiAgICAvL2NvbnNvbGUubG9nKFwiYiA9IFwiICsgYik7IFxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBNYXRoLnBvdygoYSpiKSwoMS80KSlcclxuICAgICAgICApXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBiYXJyaWVyc1Njb3JlKCkge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImxhbsOnYWRhIGEgZnVuw6fDo28gZGUgY8OhbGN1bG8gZGUgYnMgY29tIGEgdmFyIGRlIGlucHV0ID0gXCIgKyBpbnB1dHNbXCIjYi0xMlwiXSArXCIgcXVlIMOpIHVtIFwiICsgdHlwZW9mIE51bWJlcihpbnB1dHNbXCIjYi0xMlwiXSkgKTsgXHJcbiAgICBhID0gKE1hdGgubG9nMTAoTnVtYmVyKGlucHV0c1tcIiNiLTEyXCJdKSktMik7IFxyXG4gICAgYj0gMjVcclxuICAgIGMgPSBNYXRoLnBvdyhhLDIpKmJcclxuICAgIC8vY29uc29sZS5sb2coXCIgYSA9IFwiICsgYSArIFwiIGIgPSBcIiArIGIgICsgXCIgYyA9IFwiICtjICk7IFxyXG4gICAgcmV0dXJuIGNcclxuICAgICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gZmluYWxTY29yZSgpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJpbmljaW8gZGUgZmluYWxTY29yZVwiKTsgXHJcbiAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgYSA9ICh2YWx1ZW1hcmtldFNjb3JlKCkgKiBmaXRTY29yZSgpICogY29tcGV0aXRpdmVTY29yZSgpICogZ3Jvd3RoU2NvcmUoKSkgLyBiYXJyaWVyc1Njb3JlKCk7IFxyXG4gICAgc2NvcmVzW1widC1zXCJdID0gYTtcclxuICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTsgXHJcbiAgICByZXR1cm4gZmluZERlc2MoYSlcclxufVxyXG5cclxuLy8gRGVzY3JpcHRpb25cclxuZnVuY3Rpb24gZmluZERlc2MgKHgpe1xyXG4gICAgZm9yIChpPTA7IGk8T2JqZWN0LmtleXMoc2NvcmVzX2Rlc2MpLmxlbmd0aDsgIGkrKyApe1xyXG4gICAgICAgIGtleT0gKE9iamVjdC5rZXlzKHNjb3Jlc19kZXNjKVtpXSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImtleT1cIiArIGtleSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzY29yZXNfZGVzYy5hLmxvd2VyX2xpbWl0KTsgXHJcbiAgICAgICAgaWYgKCh4IDw9IHNjb3Jlc19kZXNjW2tleV0uaGlnaGVyX2xpbWl0KSAmJiAoeCA+PSBzY29yZXNfZGVzY1trZXldLmxvd2VyX2xpbWl0KSl7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTsgXHJcbiAgICAgICAgICAgIHJldHVybiBzY29yZXNfZGVzY1trZXldLmRlc2NcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBWYWxpZGF0aW9uIFN5c3RlbVxyXG5cclxuLy8gdmVyaWZ5IDogaWQgLSBpbnB1dCBpZFxyXG5mdW5jdGlvbiB2ZXJpZnkoaWQpe1xyXG4gIHZhciBuciA9IGNvbnZlcnRUb051bWJlcigkKGlkKS52YWwoKSk7XHJcbiAgaWYobnIgPT09IGZhbHNlKXtcclxuICAgIHJldHVybiBmYWxzZTsgXHJcbiAgfVxyXG5cclxuICBzd2l0Y2ggKGlkKSB7XHJcbiAgICAvLyBJbnRlZ2VyXHJcbiAgICBjYXNlIFwiI20tMVwiOlxyXG4gICAgY2FzZSBcIiNtLTJcIjpcclxuICAgIGNhc2UgXCIjYy05XCI6XHJcbiAgICBjYXNlIFwiI2ctMVwiOlxyXG4gICAgY2FzZSBcIiNnLTJcIjpcclxuICAgIGNhc2UgXCIjYi0xMlwiOlxyXG4gICAgICByZXR1cm4gaXNJbnQobnIpICYmIG51bWJlckJldHdlZW4obnIsIC0xKTtcclxuXHJcbiAgICAvLyBGbG9hdFxyXG4gICAgY2FzZSBcIiNtLTNcIjpcclxuICAgICAgcmV0dXJuIGlzRmxvYXQobnIpICYmIG51bWJlckJldHdlZW4obnIsIC0xKTtcclxuXHJcbiAgICAvLyBQZXJjZW50YWdlXHJcbiAgICBjYXNlIFwiI20tNFwiOlxyXG4gICAgY2FzZSBcIiNtLTVcIjpcclxuICAgIGNhc2UgXCIjZi02LTFhXCI6XHJcbiAgICBjYXNlIFwiI2YtNi0yYVwiOlxyXG4gICAgY2FzZSBcIiNmLTYtM2FcIjpcclxuICAgIGNhc2UgXCIjZi02LTRhXCI6XHJcbiAgICBjYXNlIFwiI2YtNi01YVwiOlxyXG4gICAgXHJcbiAgICAgIHJldHVybiBpc0ludChucikgJiYgbnVtYmVyQmV0d2VlbihuciwgLTEsIDEwMSk7XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gY2xlYW4gOiBpbnB1dCAtIGpRdWVyeSBvYmogOyBzcGFjZXMgLSBib29sZWFuLCBkZWZhdWx0IGZhbHNlLCBSZXR1cm4gd2l0aCBvciB3aXRob3V0IHNwYWNlcy5cclxuZnVuY3Rpb24gY2xlYW4oaW5wdXQsIHNwYWNlcykge1xyXG4gICAgaWYgKHR5cGVvZiBzcGFjZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBzcGFjZXMgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlucHV0LnZhbChmdW5jdGlvbihpLCB2YWwpIHtcclxuICAgICAgICBpZiAoc3BhY2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwudHJpbSgpLnNwbGl0KC9cXHMrL2cpLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwudHJpbSgpLnNwbGl0KC9cXHMrL2cpLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIGNvbnZlcnRUb051bWJlciA6IGlkIC0gaW5wdXQgaWQgOiByZXR1cm4gYSBudW1iZXIgb3IgZmFsc2VcclxuZnVuY3Rpb24gY29udmVydFRvTnVtYmVyKGlkKXtcclxuICB2YXIgbnI7XHJcbiAgJChpZCkudmFsKGZ1bmN0aW9uKGksIHZhbCl7XHJcbiAgICBuciA9IE51bWJlcih2YWwpO1xyXG4gICAgaWYoTnVtYmVyKHZhbCkgIT0gbnIpe1xyXG4gICAgICBuciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBucjtcclxufVxyXG5cclxuLy8gbnVtYmVyQmV0d2VlbiA6IG4gLSBOdW1iZXIgb2JqIDsgbWluIC8gbWF4IC0gbnVtYmVyLCBvcHRpb25hbFxyXG5mdW5jdGlvbiBudW1iZXJCZXR3ZWVuKG4sIG1pbiwgbWF4KSB7XHJcbiAgICBpZiAoTnVtYmVyKG4pICE9PSBuKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodHlwZW9mIG1pbiA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgbWF4ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1pbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgbWF4ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuciA+IG1pbjtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtaW4gPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG1heCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnIgPCBtYXg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5yID4gbWluICYmIG5yIDwgbWF4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gaXNJbnQgOiBuIC0gTnVtYmVyIG9ialxyXG5mdW5jdGlvbiBpc0ludChuKSB7XHJcbiAgICByZXR1cm4gTnVtYmVyKG4pID09PSBuICYmIG4gJSAxID09PSAwO1xyXG59XHJcblxyXG4vLyBpc0Zsb2F0IDogbiAtIE51bWJlciBvYmpcclxuZnVuY3Rpb24gaXNGbG9hdChuKSB7XHJcbiAgICByZXR1cm4gTnVtYmVyKG4pID09PSBuICYmIG4gJSAxICE9PSAwO1xyXG59XHJcblxyXG4vL25leHQgYnV0dG9uc1xyXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiI21hcmtldG5leHRcIiwgZnVuY3Rpb24oKXtcclxuICAgICQoJ2FbaHJlZj1cIiNmaXRcIl0nKS5jbGljaygpXHJcbiAgICB9KTtcclxuXHJcbiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIjZml0bmV4dFwiLCBmdW5jdGlvbigpe1xyXG4gICAgJCgnYVtocmVmPVwiI2NvbXBldGl0aXZlXCJdJykuY2xpY2soKVxyXG4gICAgfSk7XHJcblxyXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiI2NvbXBldGl0aXZlbmV4dFwiLCBmdW5jdGlvbigpe1xyXG4gICAgJCgnYVtocmVmPVwiI2dyb3d0aFwiXScpLmNsaWNrKClcclxuICAgIH0pO1xyXG5cclxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIiNncm93bmV4dFwiLCBmdW5jdGlvbigpe1xyXG4gICAgJCgnYVtocmVmPVwiI2JhcnJpZXJzXCJdJykuY2xpY2soKVxyXG4gICAgfSk7XHJcblxyXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiI2JhcnJpZXJzbmV4dFwiLCBmdW5jdGlvbigpe1xyXG4gICAgJCgnYVtocmVmPVwiI3Njb3JlXCJdJykuY2xpY2soKVxyXG4gICAgfSk7XHJcbi8qIC0tLSBUT09MUyAtLS0gKi9cclxuIl19
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/business_idea.js","/")
},{"9FoBSB":5,"buffer":3}],2:[function(require,module,exports){
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
},{"9FoBSB":5,"buffer":3}],3:[function(require,module,exports){
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
},{"9FoBSB":5,"base64-js":2,"buffer":3,"ieee754":4}],4:[function(require,module,exports){
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
},{"9FoBSB":5,"buffer":3}],5:[function(require,module,exports){
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
},{"9FoBSB":5,"buffer":3}]},{},[1])