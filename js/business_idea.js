(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1c2luZXNzX2lkZWEuanMiXSwibmFtZXMiOlsiaW5wdXRzIiwiaW5wdXRzYSIsIm91dHB1dHMiLCJzY29yZXMiLCJzY29yZXNfZGVzYyIsInJlZ2V4IiwiaWQiLCIkIiwiZm9yRWFjaCIsImtleSIsImNoYW5nZSIsInZhbCIsInNldE91dHB1dHMiLCJzaG93TWVudSIsInJlbW92ZUNsYXNzIiwiY3NzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwidW5kZWZpbmVkIiwidGV4dCIsImY2MXEiLCJNYXRoIiwicm91bmQiLCJmNjJxIiwiZjYzcSIsImY2NHEiLCJmNjVxIiwiYzYxcSIsImM2MnEiLCJjNjNxIiwiYzY0cSIsImM2NXEiLCJhMSIsImEyIiwiYTMiLCJhNCIsImE1IiwiYTEwIiwibXMiLCJ2YWx1ZW1hcmtldFNjb3JlIiwiZnMiLCJmaXRTY29yZSIsImNzIiwiY29tcGV0aXRpdmVTY29yZSIsImdzIiwiZ3Jvd3RoU2NvcmUiLCJicyIsImJhcnJpZXJzU2NvcmUiLCJ0cyIsImZpbmFsU2NvcmUiLCJodG1sIiwiZmluZERlc2MiLCJwb3ciLCJ2YWx1ZSIsImEiLCJiIiwiYyIsIm1heCIsImxvZzEwIiwiTnVtYmVyIiwieCIsImkiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiaGlnaGVyX2xpbWl0IiwibG93ZXJfbGltaXQiLCJkZXNjIiwidmVyaWZ5IiwibnIiLCJjb252ZXJ0VG9OdW1iZXIiLCJpc0ludCIsIm51bWJlckJldHdlZW4iLCJpc0Zsb2F0IiwiY2xlYW4iLCJpbnB1dCIsInNwYWNlcyIsInRyaW0iLCJzcGxpdCIsImpvaW4iLCJuIiwibWluIiwib24iLCJjbGljayJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFLQTs7QUFFQTtBQUNBLElBQUlBLFNBQVM7QUFDVCxZQUFRLENBREM7QUFFVCxZQUFRLENBRkM7QUFHVCxZQUFRLENBSEM7QUFJVCxZQUFRLENBSkM7QUFLVCxZQUFRLENBTEM7O0FBT1QsZUFBVyxDQVBGO0FBUVQsZUFB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QkFBRixFQUF5QjRFLEtBQXpCO0FBQ0MsQ0FGTDs7QUFJQTVFLEVBQUUsTUFBRixFQUFVMkUsRUFBVixDQUFhLE9BQWIsRUFBc0IsZUFBdEIsRUFBdUMsWUFBVTtBQUM3QzNFLE1BQUUsa0JBQUYsRUFBc0I0RSxLQUF0QjtBQUNDLENBRkw7QUFHQSIsImZpbGUiOiJidXNpbmVzc19pZGVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQnVzaW5lc3MgSWRlYVxyXG4gKi9cclxuXHJcblxyXG4vKiAtLS0gVkFSSUFCTEVTIC0tLSAqL1xyXG5cclxuLy8gaW5wdXRzICh0byBnZXQgaW5mb3JtYXRpb24pIDogaWQgOyB2YWx1ZVxyXG52YXIgaW5wdXRzID0ge1xyXG4gICAgXCIjbS0xXCI6IDAsXHJcbiAgICBcIiNtLTJcIjogMCxcclxuICAgIFwiI20tM1wiOiAwLFxyXG4gICAgXCIjbS00XCI6IDAsXHJcbiAgICBcIiNtLTVcIjogMCxcclxuXHJcbiAgICBcIiNmLTYtMWFcIjogMCxcclxuICAgIFwiI2YtNi0yYVwiOiAwLFxyXG4gICAgXCIjZi02LTNhXCI6IDAsXHJcbiAgICBcIiNmLTYtNGFcIjogMCxcclxuICAgIFwiI2YtNi01YVwiOiAwLFxyXG5cclxuICAgIFwiI2MtNy0xYVwiOiAwLFxyXG4gICAgXCIjYy03LTJhXCI6IDAsXHJcbiAgICBcIiNjLTctM2FcIjogMCxcclxuICAgIFwiI2MtNy00YVwiOiAwLFxyXG4gICAgXCIjYy03LTVhXCI6IDAsXHJcbiAgICBcIiNjLTctNmFcIjogMCxcclxuXHJcbiAgICBcIiNjLTlcIjogMCxcclxuXHJcbiAgICBcIiNnLTFcIjogMCxcclxuICAgIFwiI2ctMlwiOiAwLFxyXG4gICAgXCIjZy0zXCI6IDAsXHJcblxyXG4gICAgXCIjYi0xMlwiOiAwXHJcbn07XHJcbi8vIGFycmF5IG9mIGlucHV0IGtleXNcclxuXHJcbnZhciBpbnB1dHNhID0gW1xyXG4gICAgXCIjbS0xXCIsXHJcbiAgICBcIiNtLTJcIixcclxuICAgIFwiI20tM1wiLFxyXG4gICAgXCIjbS00XCIsXHJcbiAgICBcIiNtLTVcIixcclxuXHJcbiAgICBcIiNmLTYtMWFcIixcclxuICAgIFwiI2YtNi0yYVwiLFxyXG4gICAgXCIjZi02LTNhXCIsXHJcbiAgICBcIiNmLTYtNGFcIixcclxuICAgIFwiI2YtNi01YVwiLFxyXG5cclxuICAgIFwiI2MtNy0xYVwiLFxyXG4gICAgXCIjYy03LTJhXCIsXHJcbiAgICBcIiNjLTctM2FcIixcclxuICAgIFwiI2MtNy00YVwiLFxyXG4gICAgXCIjYy03LTVhXCIsXHJcbiAgICBcIiNjLTctNmFcIixcclxuXHJcbiAgICBcIiNjLTlcIixcclxuXHJcbiAgICBcIiNnLTFcIixcclxuICAgIFwiI2ctMlwiLFxyXG4gICAgXCIjZy0zXCIsXHJcblxyXG4gICAgXCIjYi0xMlwiXHJcbl07XHJcblxyXG5cclxuXHJcbi8vIG91dHB1dHMgKHRvIHNob3cgaW5mb3JtYXRpb24pIDogaWQgOyB2YWx1ZVxyXG52YXIgb3V0cHV0cyA9IHtcclxuICAgIFwiI2YtMlwiOiBpbnB1dHNbXCIjbS0yXCJdLFxyXG5cclxuICAgIFwiI2YtNi0xcVwiOiBpbnB1dHNbXCIjbS0yXCJdKjAuNSxcclxuICAgIFwiI2YtNi0ycVwiOiBpbnB1dHNbXCIjbS0yXCJdKjAuNyxcclxuICAgIFwiI2YtNi0zcVwiOiBpbnB1dHNbXCIjbS0yXCJdLFxyXG4gICAgXCIjZi02LTRxXCI6IGlucHV0c1tcIiNtLTJcIl0qMS4zLFxyXG4gICAgXCIjZi02LTVxXCI6IGlucHV0c1tcIiNtLTJcIl0qMS41LFxyXG4gXHJcbiAgICBcIiNjLTYtMWFcIjogaW5wdXRzW1wiI2YtNi0xYVwiXSxcclxuICAgIFwiI2MtNi0yYVwiOiBpbnB1dHNbXCIjZi02LTJhXCJdLFxyXG4gICAgXCIjYy02LTNhXCI6IGlucHV0c1tcIiNmLTYtM2FcIl0sXHJcbiAgICBcIiNjLTYtNGFcIjogaW5wdXRzW1wiI2YtNi00YVwiXSxcclxuICAgIFwiI2MtNi01YVwiOiBpbnB1dHNbXCIjZi02LTVhXCJdLFxyXG4gICAgXHJcbiAgICBcIiNjLTYtMXFcIjogaW5wdXRzW1wiI20tMlwiXSowLjUsXHJcbiAgICBcIiNjLTYtMnFcIjogaW5wdXRzW1wiI20tMlwiXSowLjcsXHJcbiAgICBcIiNjLTYtM3FcIjogaW5wdXRzW1wiI20tMlwiXSxcclxuICAgIFwiI2MtNi00cVwiOiBpbnB1dHNbXCIjbS0yXCJdKjEuMyxcclxuICAgIFwiI2MtNi01cVwiOiBpbnB1dHNbXCIjbS0yXCJdKjEuNSxcclxuICAgIFxyXG4gICAgXCIjYy03LTFxXCI6IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMC41LFxyXG4gICAgXCIjYy03LTJxXCI6IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMC43LFxyXG4gICAgXCIjYy03LTNxXCI6IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMC45LFxyXG4gICAgXCIjYy03LTRxXCI6IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMS4yLFxyXG4gICAgXCIjYy03LTVxXCI6IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMS41XHJcblxyXG4gLy8gICBcIiNjLTctMVwiOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiYzdcIl06Y2hlY2tlZCcpLnZhbHVlLFxyXG59O1xyXG5cclxuXHJcbnZhciBzY29yZXMgPSB7XHJcbiAgICBcIm0tc1wiOiBcIjBcIixcclxuICAgIFwiZi1zXCI6IFwiMFwiLFxyXG4gICAgXCJjLXNcIjogXCIwXCIsXHJcbiAgICBcImctc1wiOiBcIjBcIiwgXHJcbiAgICBcImItc1wiOiBcIjBcIiwgXHJcbiAgICBcInQtc1wiOiBcIjBcIlxyXG59XHJcblxyXG52YXIgc2NvcmVzX2Rlc2MgPSB7XHJcbiAgICBcImFcIjoge1xyXG4gICAgICAgIFwiZGVzY1wiOlwidmVyeSB3ZWFrXCIsXHJcbiAgICAgICAgXCJsb3dlcl9saW1pdFwiOiAtMiwgXHJcbiAgICAgICAgXCJoaWdoZXJfbGltaXRcIjogMlxyXG4gICAgICAgIH0gLCBcclxuICAgIFwiYlwiOiB7XHJcbiAgICAgICAgXCJkZXNjXCI6XCJ3ZWFrXCIsXHJcbiAgICAgICAgXCJsb3dlcl9saW1pdFwiOiAyLCBcclxuICAgICAgICBcImhpZ2hlcl9saW1pdFwiOiAzXHJcbiAgICAgICAgfSwgXHJcbiAgICBcImNcIjoge1xyXG4gICAgICAgIFwiZGVzY1wiOiBcImF2ZXJhZ2VcIiwgXHJcbiAgICAgICAgXCJsb3dlcl9saW1pdFwiOiAzLCBcclxuICAgICAgICBcImhpZ2hlcl9saW1pdFwiOiA0XHJcbiAgICAgICAgfSwgXHJcbiAgICBcImRcIjoge1xyXG4gICAgICAgIFwiZGVzY1wiOiBcInN0cm9uZ1wiLCBcclxuICAgICAgICBcImxvd2VyX2xpbWl0XCI6ICA0LCBcclxuICAgICAgICBcImhpZ2hlcl9saW1pdFwiOiA1XHJcbiAgICAgICAgfSwgXHJcbiAgICBcImVcIjoge1xyXG4gICAgICAgIFwiZGVzY1wiOiBcInZlcnkgc3Ryb25nXCIsXHJcbiAgICAgICAgXCJsb3dlcl9saW1pdFwiOiA0LCBcclxuICAgICAgICBcImhpZ2hlcl9saW1pdFwiOiAxNTBcclxuICAgICAgICB9XHJcbn1cclxuXHJcblxyXG52YXIgcmVnZXggPSB7XHJcbiAgICBpZDogLyMoXFxEKS0oXFxkKS0/KFxcZD8pL2ksXHJcbn07XHJcblxyXG5cclxuLyogLS0tIEVWRU5UUyAtLS0gKi9cclxuXHJcbi8vIFJlYWR5XHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBHZXQgTG9jYWxTdG9yYWdlXHJcbiAgICAvLyBTZXQgdGhlIGlucHV0c1xyXG4gICAgLy8gU2V0IHRoZSBvdXRwdXRzXHJcbiAgICAvLyBTZXQgdGhlIFNjb3Jlc1xyXG4gICAgLy8gU2V0IHRoZSBmaW5hbCBTY29yZVxyXG59KTtcclxuXHJcbi8vIENoYW5nZVxyXG5pbnB1dHNhLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcclxuICAgIC8vY29uc29sZS5sb2coXCJmb3JFYWNoIGNvbWXDp291IFwiICsga2V5ICtcIiA9IFwiICsgaW5wdXRzW2tleV0pOyBcclxuICAgICQoa2V5KS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiZGV0ZWN0b3UgY2hhbmdlIG5hIFwiICsga2V5KTtcclxuICAgICAgICBpbnB1dHNba2V5XSA9ICQoa2V5KS52YWwoKTsgXHJcbiAgICAgICAgc2V0T3V0cHV0cygpO1xyXG4gICAgICAgIHNob3dNZW51KCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkkndmUgY2hhbmdlZFwiKTsgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpbnB1dHMpOyBcclxuICAgIH0pO1xyXG59KTsgLy9mb3JhY2ggaW5wdXRzYVxyXG5cclxuLy9zaG93IG1lbnVzXHJcbmZ1bmN0aW9uIHNob3dNZW51KCl7XHJcbiAgICBpZihpbnB1dHNbXCIjbS0xXCJdICE9PSAwICYmIGlucHV0c1tcIiNtLTJcIl0gIT09IDAgJiYgaW5wdXRzW1wiI20tM1wiXSAhPT0gMCAmJiBpbnB1dHNbXCIjbS00XCJdICE9PSAwICYmIGlucHV0c1tcIiNtLTVcIl0gIT09IDApIHtcclxuICAgICAgICAkKFwiI2ZpdF9iYXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7IFxyXG4gICAgICAgICQoXCIjbWFya2V0bmV4dFwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICAgICAkKFwiI2JpX2JhclwiKS5jc3MoXCJ3aWR0aFwiLCBcIjIwJVwiKTtcclxuICAgIH1cclxuICAgIGlmKGlucHV0c1tcIiNmLTYtMWFcIl0gIT09IDAgJiYgaW5wdXRzW1wiI2YtNi0yYVwiXSAhPT0gMCAmJiBpbnB1dHNbXCIjZi02LTNhXCJdICE9PSAwICYmIGlucHV0c1tcIiNmLTYtNGFcIl0gIT09MCAmJiBpbnB1dHNbXCIjZi02LTVhXCJdICE9PSAwKSB7XHJcbiAgICAgICAgJChcIiNjb21wZXRpdGl2ZV9iYXJcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgJChcIiNmaXRuZXh0XCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQoXCIjYmlfYmFyXCIpLmNzcyhcIndpZHRoXCIsIFwiNDAlXCIpO1xyXG4gICAgfVxyXG4gICAgaWYoaW5wdXRzW1wiI2MtOVwiXSAhPT0gMCAmJiB0eXBlb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9J2MtNyddOmNoZWNrZWRcIikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICQoXCIjZ3Jvd3RoX2JhclwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTsgXHJcbiAgICAgICAgJChcIiNjb21wZXRpdGl2ZW5leHRcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgJChcIiNiaV9iYXJcIikuY3NzKFwid2lkdGhcIiwgXCI2MCVcIik7XHJcbiAgICB9XHJcbiAgICBpZiggKGlucHV0c1tcIiNnLTFcIl0gIT09IDApICYmIChpbnB1dHNbXCIjZy0yXCJdICE9PSAwKSAmJiAoaW5wdXRzW1wiI2ctM1wiXSAhPT0gMCkpIHtcclxuICAgICAgICAkKFwiI2JhcnJpZXJzX2JhclwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTsgXHJcbiAgICAgICAgJChcIiNncm93bmV4dFwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgICAgICAkKFwiI2JpX2JhclwiKS5jc3MoXCJ3aWR0aFwiLCBcIjgwJVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5wdXRzW1wiI2ItMTJcIl0gIT09IDApe1xyXG4gICAgICAgICQoXCIjc2NvcmVfYmFyXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQoXCIjYmFycmllcnNuZXh0XCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQoXCIjYmlfYmFyXCIpLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgIH1cclxufTsgXHJcblxyXG4vL3NldCBvdXRwdXRzXHJcbmZ1bmN0aW9uIHNldE91dHB1dHMgKCl7XHJcbiAgICBpZihpbnB1dHNbXCIjbS0yXCJdICE9IDAgKSB7XHJcbiAgICAgICAgb3V0cHV0c1tcIiNmLTJcIl0gPSBpbnB1dHNbXCIjbS0yXCJdOyBcclxuICAgICAgICAkKFwiI2YtMlwiKS50ZXh0KGlucHV0c1tcIiNtLTJcIl0pOyBcclxuXHJcbiAgICAgICAgb3V0cHV0c1tcIiNmLTYtMXFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdKjAuNTtcclxuICAgICAgICBmNjFxPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjZi02LTFxXCJdKjEwMClcclxuICAgICAgICAkKFwiI2YtNi0xcVwiKS50ZXh0KGY2MXEvMTAwKTtcclxuXHJcbiAgICAgICAgb3V0cHV0c1tcIiNmLTYtMnFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdKjAuNztcclxuICAgICAgICBmNjJxPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjZi02LTJxXCJdKjEwMClcclxuICAgICAgICAkKFwiI2YtNi0ycVwiKS50ZXh0KGY2MnEvMTAwKTtcclxuXHJcbiAgICAgICAgb3V0cHV0c1tcIiNmLTYtM3FcIl0gPSBpbnB1dHNbXCIjbS0yXCJdO1xyXG4gICAgICAgIGY2M3E9IE1hdGgucm91bmQob3V0cHV0c1tcIiNmLTYtM3FcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjZi02LTNxXCIpLnRleHQoZjYzcS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2YtNi00cVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMS4zO1xyXG4gICAgICAgIGY2NHE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNmLTYtNHFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjZi02LTRxXCIpLnRleHQoZjY0cS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2YtNi01cVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMS41O1xyXG4gICAgICAgIGY2NXE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNmLTYtNXFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjZi02LTVxXCIpLnRleHQoZjY1cS8xMDApO1xyXG5cclxuICAgICAgIC8qICQoXCIjZy0xXCIpLmNoYW5nZShcclxuICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgJChcIiNnOXZcIikudGV4dChpbnB1dHNbXCIjZy0xXCJdKTtcclxuICAgICAgICB9KTsgXHJcblxyXG4gICAgICAgICQoXCIjZy0yXCIpLmNoYW5nZShcclxuICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgJChcIiNnMTB2XCIpLnRleHQoaW5wdXRzW1wiI2ctMlwiXSk7IFxyXG4gICAgICAgIH0pOyBcclxuXHJcblxyXG4gICAgICAgICQoXCIjZy0zXCIpLmNoYW5nZShcclxuICAgICAgICBmdW5jdGlvbigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgJChcIiNnMTF2XCIpLnRleHQoaW5wdXRzW1wiI2ctM1wiXSk7XHJcbiAgICAgICAgfSk7IFxyXG4gICAgICAgICovXHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtMXFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdKjAuNTtcclxuICAgICAgICBjNjFxPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjYy02LTFxXCJdKjEwMClcclxuICAgICAgICAkKFwiI2MtNi0xcVwiKS50ZXh0KGM2MXEvMTAwKTtcclxuXHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtMnFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdKjAuNztcclxuICAgICAgICBjNjJxPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjYy02LTJxXCJdKjEwMClcclxuICAgICAgICAkKFwiI2MtNi0ycVwiKS50ZXh0KGM2MnEvMTAwKTtcclxuXHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtM3FcIl0gPSBpbnB1dHNbXCIjbS0yXCJdO1xyXG4gICAgICAgIGM2M3E9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTYtM3FcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjYy02LTNxXCIpLnRleHQoYzYzcS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi00cVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMS4zO1xyXG4gICAgICAgIGM2NHE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTYtNHFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjYy02LTRxXCIpLnRleHQoYzY0cS8xMDApO1xyXG5cclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi01cVwiXSA9IGlucHV0c1tcIiNtLTJcIl0qMS41O1xyXG4gICAgICAgIGM2NXE9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTYtNXFcIl0qMTAwKVxyXG4gICAgICAgICQoXCIjYy02LTVxXCIpLnRleHQoYzY1cS8xMDApO1xyXG5cclxuICAgICAgICBpZihpbnB1dHNbXCIjbS01XCJdICE9IDApIHtcclxuICAgICAgICAgICAgICAgICBvdXRwdXRzW1wiI2MtNy0xcVwiXSA9IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqNTA7IFxyXG4gICAgICAgICAgICAgICAgIGExID0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2MtNy0xcVwiXSoxMDApOyBcclxuICAgICAgICAgICAgICAgICQoXCIjYy03LTFxXCIpLnRleHQoYTEvMTAwKTsgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG91dHB1dHNbXCIjYy03LTJxXCJdID0gaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSo3MDsgXHJcbiAgICAgICAgICAgICAgICBhMj0gTWF0aC5yb3VuZChvdXRwdXRzW1wiI2MtNy0ycVwiXSAqIDEwMClcclxuICAgICAgICAgICAgICAgICQoXCIjYy03LTJxXCIpLnRleHQoYTIvMTAwKTsgXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRzW1wiI2MtNy0zcVwiXSA9IGlucHV0c1tcIiNtLTJcIl0vKDEraW5wdXRzW1wiI20tNVwiXSkqMTAwO1xyXG4gICAgICAgICAgICAgICAgYTMgPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjYy03LTNxXCJdKjEwMCk7IFxyXG4gICAgICAgICAgICAgICAgJChcIiNjLTctM3FcIikudGV4dChhMy8xMDApOyBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG91dHB1dHNbXCIjYy03LTRxXCJdID0gaW5wdXRzW1wiI20tMlwiXS8oMStpbnB1dHNbXCIjbS01XCJdKSoxMzA7IFxyXG4gICAgICAgICAgICAgICAgYTQgPSBNYXRoLnJvdW5kKG91dHB1dHNbXCIjYy03LTRxXCJdKjEwMCk7IFxyXG4gICAgICAgICAgICAgICAgJChcIiNjLTctNHFcIikudGV4dChhNC8xMDApOyBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0c1tcIiNjLTctNXFcIl0gPSBpbnB1dHNbXCIjbS0yXCJdLygxK2lucHV0c1tcIiNtLTVcIl0pKjE1MDsgXHJcbiAgICAgICAgICAgICAgICBhNSA9IE1hdGgucm91bmQob3V0cHV0c1tcIiNjLTctNXFcIl0qMTAwKTsgXHJcbiAgICAgICAgICAgICAgICAkKFwiI2MtNy01cVwiKS50ZXh0KGE1LzEwMCk7IFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBcclxuICAgIH07IFxyXG4gICAgaWYoaW5wdXRzW1wiI2YtNi0xYVwiXSAhPSAwICkge1xyXG4gICAgICAgIG91dHB1dHNbXCIjYy02LTFhXCJdID0gaW5wdXRzW1wiI2YtNi0xYVwiXTtcclxuICAgICAgICBhMTAgPSBNYXRoLnJvdW5kKCBpbnB1dHNbXCIjZi02LTFhXCJdKjEwMCk7IFxyXG4gICAgICAgICQoXCIjYy02LTFhXCIpLnRleHQoYTEwLzEwMCk7IFxyXG4gICAgICAgIFxyXG4gICAgfTsgXHJcbiAgICBpZihpbnB1dHNbXCIjZi02LTJhXCJdICE9IDAgKSB7XHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtMmFcIl0gPSBpbnB1dHNbXCIjZi02LTJhXCJdO1xyXG4gICAgICAgIGExMCA9IE1hdGgucm91bmQoIGlucHV0c1tcIiNmLTYtMmFcIl0qMTAwKTsgXHJcbiAgICAgICAgJChcIiNjLTYtMmFcIikudGV4dChhMTAvMTAwKTsgXHJcbiAgICB9OyBcclxuXHJcbiAgICBpZihpbnB1dHNbXCIjZi02LTNhXCJdICE9IDAgKSB7XHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtM2FcIl0gPSBpbnB1dHNbXCIjZi02LTNhXCJdO1xyXG4gICAgICAgIGExMCA9IE1hdGgucm91bmQoIGlucHV0c1tcIiNmLTYtM2FcIl0qMTAwKTsgXHJcbiAgICAgICAgJChcIiNjLTYtM2FcIikudGV4dChhMTAvMTAwKTsgXHJcbiAgICB9OyBcclxuICAgIGlmKGlucHV0c1tcIiNmLTYtNGFcIl0gIT0gMCApIHtcclxuICAgICAgICBvdXRwdXRzW1wiI2MtNi00YVwiXSA9IGlucHV0c1tcIiNmLTYtNGFcIl07XHJcbiAgICAgICAgYTEwID0gTWF0aC5yb3VuZCggaW5wdXRzW1wiI2YtNi00YVwiXSoxMDApOyBcclxuICAgICAgICAkKFwiI2MtNi00YVwiKS50ZXh0KGExMC8xMDApOyBcclxuICAgIH07XHJcbiAgICBpZihpbnB1dHNbXCIjZi02LTVhXCJdICE9IDAgKSB7XHJcbiAgICAgICAgb3V0cHV0c1tcIiNjLTYtNWFcIl0gPSBpbnB1dHNbXCIjZi02LTVhXCJdO1xyXG4gICAgICAgIGExMCA9IE1hdGgucm91bmQoIGlucHV0c1tcIiNmLTYtNWFcIl0qMTAwKTsgXHJcbiAgICAgICAgJChcIiNjLTYtNWFcIikudGV4dChhMTAvMTAwKTsgXHJcbiAgICB9OyBcclxuXHJcbiAgICBcclxuXHJcbiAgICBpZiggKGlucHV0c1tcIiNtLTFcIl0gIT09IDApICYmIChpbnB1dHNbXCIjbS0yXCJdICE9PSAwKSAmJiAoaW5wdXRzW1wiI20tM1wiXSAhPT0gMCkgJiYgKGlucHV0c1tcIiNtLTRcIl0gIT09IDApICYmIChpbnB1dHNbXCIjbS01XCJdICE9PSAwKSl7XHJcbiAgICAgICAgbXMgPSB2YWx1ZW1hcmtldFNjb3JlKCk7IFxyXG4gICAgICAgIC8vJChcIiNtLXNcIikudGV4dChtcykgO1xyXG4gICAgICAgIHNjb3Jlc1tcIm0tc1wiXSA9IG1zOyBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgfTsgXHJcbiAgICBcclxuICAgIGlmKCAoaW5wdXRzW1wiZi02LTFhXCJdICE9PTApICYmIChpbnB1dHNbXCJmLTYtMmFcIl0gIT09MCkgJiYgKGlucHV0c1tcImYtNi0zYVwiXSAhPT0wKSAmJiAoaW5wdXRzW1wiZi02LTRhXCJdICE9PTApICYmIChpbnB1dHNbXCJmLTYtNWFcIl0gIT09MCkpIHtcclxuICAgICAgICBmcyA9IGZpdFNjb3JlKCk7IFxyXG4gICAgICAgIC8vJChcIiNmLXNcIikudGV4dChmcyk7IFxyXG4gICAgICAgIHNjb3Jlc1tcImYtc1wiXSA9IGZzOyBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgfTsgXHJcbiAgICBcclxuICAgIGlmKCAoaW5wdXRzW1wiI2MtOVwiXSAhPT0gMCkgJiYgKHR5cGVvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT0nYy03J106Y2hlY2tlZFwiKSAhPT0gdW5kZWZpbmVkKSl7XHJcbiAgICAgICAgICAgY3MgPSBjb21wZXRpdGl2ZVNjb3JlKCk7IFxyXG4gICAgICAgICAgIC8vJChcIiNjLXNcIikudGV4dChjcyk7IFxyXG4gICAgICAgICAgIHNjb3Jlc1tcImMtc1wiXSA9IGNzOyBcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgICAgIH07IFxyXG5cclxuICAgIGlmKCAoaW5wdXRzW1wiI2ctMVwiXSAhPT0gMCkgJiYgKGlucHV0c1tcIiNnLTJcIl0gIT09IDApICYmIChpbnB1dHNbXCIjZy0zXCJdICE9PSAwKSkge1xyXG4gICAgICAgICBncyA9IGdyb3d0aFNjb3JlKCk7IFxyXG4gICAgICAgICAvLyQoXCIjZy1zXCIpLnRleHQoZ3MpOyBcclxuICAgICAgICAgc2NvcmVzW1wiZy1zXCJdID0gZ3M7IFxyXG4gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgfTsgXHJcblxyXG5cclxuICAgIGlmIChpbnB1dHNbXCIjYi0xMlwiXSAhPT0gMCl7XHJcbiAgICAgICAgYnMgPSBiYXJyaWVyc1Njb3JlKCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhicyk7IFxyXG4gICAgICAgIC8vJChcIiNiLXNcIikudGV4dChicyk7XHJcbiAgICAgICAgc2NvcmVzW1wiYi1zXCJdID0gYnM7IFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzKTtcclxuICAgIH07IFxyXG5cclxuICAgIGlmKCAoc2NvcmVzW1wibS1zXCJdICE9PSBcIjBcIikgJiYgKHNjb3Jlc1tcImYtc1wiXSAhPT0gXCIwXCIpICYmIChzY29yZXNbXCJjLXNcIl0gIT09IFwiMFwiKSAmJiAoc2NvcmVzW1wiZy1zXCJdICE9PSBcIjBcIikgJiYoc2NvcmVzW1wiYi1zXCJdICE9PSBcIjBcIikgKXtcclxuICAgICAgICB0cyA9IGZpbmFsU2NvcmUoKTsgXHJcbiAgICAgICAgJChcIiN0LXNcIikuaHRtbChcIjxwPllvdXIgYnVzaW5lc3Mgb3Bwb3J0dW5pdHkgaXMgPHN0cm9uZz5cIiArIHRzICsgXHJcbiAgICAgICAgICAgIFwiPC9zdHJvbmc+LjwvcD4gPHVsPjxsaT4gVGhlIE1hcmtldCB5b3UgY2hvc2UgdG8gb3BlcmF0ZSBpbiBpcyBcIiArIGZpbmREZXNjKG1zKSArIFwiPC9saT5cIitcclxuICAgICAgICAgICAgXCI8bGk+IEN1c3RvbWVyIGhhcyBhIFwiICsgZmluZERlc2MoZnMpICsgXCIgaW50ZXJlc3QgaW4geW91ciBwcm9kdWN0IG9yIHNlcnZpY2U8L2xpPjxsaT4gWW91IGhhdmUgYSBcIiArIGZpbmREZXNjKGNzKSArIFwiIGNvbXBldGl0aXZlIGFkdmFudGFnZTwvbGk+PGxpPllvdXIgR3Jvd3RoIG9wcG9ydHVuaXRpZXMgYXJlIFwiICsgZmluZERlc2MoZ3MpICsgXHJcbiAgICAgICAgICAgIFwiPC9saT48bGk+IFRoZSBiYXJyaWVycyB0byBlbnRlciBhcmUgXCIgKyBmaW5kRGVzYyggTWF0aC5wb3coYnMsMS80KSkgKyBcclxuICAgICAgICAgICAgXCI8L2xpPjwvdWw+XCIpOyAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzY29yZXMpO1xyXG4gICAgfTsgXHJcbn1cclxuXHJcbi8qIC0tLSBTWVNURU1TIC0tLSAqL1xyXG4vLyBTY29yZSBTeXN0ZW1cclxuXHJcbmZ1bmN0aW9uIHZhbHVlbWFya2V0U2NvcmUoKSB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3coXHJcbiAgICAgICAgKGlucHV0c1tcIiNtLTFcIl0gKiBpbnB1dHNbXCIjbS0yXCJdICogaW5wdXRzW1wiI20tM1wiXSAqIFxyXG4gICAgICAgICAgICAoMSArIGlucHV0c1tcIiNtLTRcIl0pXHJcbiAgICAgICAgICogaW5wdXRzW1wiI20tNVwiXSkvIDIwMDAwLCAxLzEwXHJcbiAgICAgICAgKS8yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaXRTY29yZSgpIHtcclxuICAgIHJldHVybiAoaW5wdXRzW1wiI2YtNi0zYVwiXS8xMDAqNSArIGlucHV0c1tcIiNmLTYtMWFcIl0vMTAwKjUgKyBpbnB1dHNbXCIjZi02LTVhXCJdLzEwMCo1KS8yLjUgKyAxO1xyXG4gICAgfVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbXBldGl0aXZlU2NvcmUoKXtcclxuICAgIC8vY29uc29sZS5sb2coXCJjb21wZXRpdGl2ZSBzY29yZSBpbmljaW8gZGUgY8OhbGN1bG9cIilcclxuICAgIHN3aXRjaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT0nYy03J106Y2hlY2tlZFwiKS52YWx1ZSkge1xyXG4gICAgICAgIGNhc2UgXCIxXCIgOlxyXG4gICAgICAgICAgICBhID0gaW5wdXRzW1wiI2YtNi0xYVwiXS8xMDA7ICAgLy93aWxsaW5nbmVzcyB0byBwYXkgaW4gbWFyZ2luYWwgY29zdFxyXG4gICAgICAgICAgICBiID0gaW5wdXRzW1wiI2MtOVwiXS8gKGlucHV0c1tcIiNtLTFcIl0gKiBpbnB1dHNbXCIjbS0yXCJdICogaW5wdXRzW1wiI20tM1wiXSk7ICAgLy8gQ29zdCBzdHJ1Y3R1cmUgdnMgTWFya2V0IHNpemVcclxuICAgICAgICAgICAgYyA9IChvdXRwdXRzW1wiI2MtNy0xcVwiXS8oaW5wdXRzW1wiI20tMlwiXSAqICgxIC0gaW5wdXRzW1wiI20tNVwiXS8xMDApKSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhPSBcIiArIGEgKyBcIiBiID0gXCIgKyBiICsgXCIgYz0gXCIgKyBjKVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubG9nMTAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLnBvdyhhLDIpKigxL2IpK2MqM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksNClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICwwKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY2FzZSBcIjJcIiA6XHJcbiAgICAgICAgICAgIGEgPSBpbnB1dHNbXCIjZi02LTJhXCJdLzEwMDsgICAvL3dpbGxpbmduZXNzIHRvIHBheSBpbiBtYXJnaW5hbCBjb3N0XHJcbiAgICAgICAgICAgIGIgPSBpbnB1dHNbXCIjYy05XCJdLyAoaW5wdXRzW1wiI20tMVwiXSAqIGlucHV0c1tcIiNtLTJcIl0gKiBpbnB1dHNbXCIjbS0zXCJdKTsgICAvLyBDb3N0IHN0cnVjdHVyZSB2cyBNYXJrZXQgc2l6ZVxyXG4gICAgICAgICAgICBjID0gb3V0cHV0c1tcIiNjLTctMnFcIl0vKGlucHV0c1tcIiNtLTJcIl0gKiAoMSAtIGlucHV0c1tcIiNtLTVcIl0vMTAwKSk7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5sb2cxMChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucG93KGEsMikqKDEvYikrYyozXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSw0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLDApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjYXNlIFwiM1wiIDpcclxuICAgICAgICAgICAgYSA9IGlucHV0c1tcIiNmLTYtM2FcIl0vMTAwOyAgIC8vd2lsbGluZ25lc3MgdG8gcGF5IGluIG1hcmdpbmFsIGNvc3RcclxuICAgICAgICAgICAgYiA9IGlucHV0c1tcIiNjLTlcIl0vIChpbnB1dHNbXCIjbS0xXCJdICogaW5wdXRzW1wiI20tMlwiXSAqIGlucHV0c1tcIiNtLTNcIl0pOyAgIC8vIENvc3Qgc3RydWN0dXJlIHZzIE1hcmtldCBzaXplXHJcbiAgICAgICAgICAgIGMgPSBvdXRwdXRzW1wiI2MtNy0zcVwiXS8oaW5wdXRzW1wiI20tMlwiXSAqICgxIC0gaW5wdXRzW1wiI20tNVwiXS8xMDApKTtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmxvZzEwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoTWF0aC5wb3coYSwyKSooMS9iKStjKjNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsMClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGNhc2UgXCI0XCIgOlxyXG4gICAgICAgICAgICBhID0gaW5wdXRzW1wiI2YtNi00YVwiXS8xMDA7ICAgLy93aWxsaW5nbmVzcyB0byBwYXkgaW4gbWFyZ2luYWwgY29zdFxyXG4gICAgICAgICAgICBiID0gaW5wdXRzW1wiI2MtOVwiXS8gKGlucHV0c1tcIiNtLTFcIl0gKiBpbnB1dHNbXCIjbS0yXCJdICogaW5wdXRzW1wiI20tM1wiXSk7ICAgLy8gQ29zdCBzdHJ1Y3R1cmUgdnMgTWFya2V0IHNpemVcclxuICAgICAgICAgICAgYyA9IG91dHB1dHNbXCIjYy03LTRxXCJdLyhpbnB1dHNbXCIjbS0yXCJdICogKDEgLSBpbnB1dHNbXCIjbS01XCJdLzEwMCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubG9nMTAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLnBvdyhhLDIpKigxL2IpK2MqM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksNClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICwwKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY2FzZSBcIjVcIiA6XHJcbiAgICAgICAgICAgICBhID0gaW5wdXRzW1wiI2YtNi01YVwiXS8xMDA7ICAgLy93aWxsaW5nbmVzcyB0byBwYXkgaW4gbWFyZ2luYWwgY29zdFxyXG4gICAgICAgICAgICBiID0gaW5wdXRzW1wiI2MtOVwiXS8gKGlucHV0c1tcIiNtLTFcIl0gKiBpbnB1dHNbXCIjbS0yXCJdICogaW5wdXRzW1wiI20tM1wiXSk7ICAgLy8gQ29zdCBzdHJ1Y3R1cmUgdnMgTWFya2V0IHNpemVcclxuICAgICAgICAgICAgYyA9IG91dHB1dHNbXCIjYy03LTVxXCJdLyhpbnB1dHNbXCIjbS0yXCJdICogKDEgLSBpbnB1dHNbXCIjbS01XCJdLzEwMCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubG9nMTAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLnBvdyhhLDIpKigxL2IpK2MqM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksNClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICwwKVxyXG4gICAgICAgICAgICAgICAgICAgICk7ICAgICAgIFxyXG4gICAgfS8vZmltIGRlIHN3aXRjaCBcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdyb3d0aFNjb3JlKCkge1xyXG4gICAgYSA9ICBNYXRoLnBvdyhNYXRoLnBvdyhNYXRoLnBvdyhpbnB1dHNbXCIjZy0xXCJdLGlucHV0c1tcIiNnLTJcIl0pLGlucHV0c1tcIiNnLTNcIl0pLCgxLzcwKSk7IFxyXG4gICAgYiA9IE51bWJlcihpbnB1dHNbXCIjZy0xXCJdKSArIE51bWJlcihpbnB1dHNbXCIjZy0yXCJdKSArIE51bWJlcihpbnB1dHNbXCIjZy0zXCJdKTsgXHJcbiAgICAvL2NvbnNvbGUubG9nKFwiYSA9IFwiICsgYSk7IFxyXG4gICAgLy9jb25zb2xlLmxvZyhcImIgPSBcIiArIGIpOyBcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgTWF0aC5wb3coKGEqYiksKDEvNCkpXHJcbiAgICAgICAgKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYmFycmllcnNTY29yZSgpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJsYW7Dp2FkYSBhIGZ1bsOnw6NvIGRlIGPDoWxjdWxvIGRlIGJzIGNvbSBhIHZhciBkZSBpbnB1dCA9IFwiICsgaW5wdXRzW1wiI2ItMTJcIl0gK1wiIHF1ZSDDqSB1bSBcIiArIHR5cGVvZiBOdW1iZXIoaW5wdXRzW1wiI2ItMTJcIl0pICk7IFxyXG4gICAgYSA9IChNYXRoLmxvZzEwKE51bWJlcihpbnB1dHNbXCIjYi0xMlwiXSkpLTIpOyBcclxuICAgIGI9IDI1XHJcbiAgICBjID0gTWF0aC5wb3coYSwyKSpiXHJcbiAgICAvL2NvbnNvbGUubG9nKFwiIGEgPSBcIiArIGEgKyBcIiBiID0gXCIgKyBiICArIFwiIGMgPSBcIiArYyApOyBcclxuICAgIHJldHVybiBjXHJcbiAgICAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmFsU2NvcmUoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwiaW5pY2lvIGRlIGZpbmFsU2NvcmVcIik7IFxyXG4gICAgLy9jb25zb2xlLmxvZyhzY29yZXMpOyBcclxuICAgIGEgPSAodmFsdWVtYXJrZXRTY29yZSgpICogZml0U2NvcmUoKSAqIGNvbXBldGl0aXZlU2NvcmUoKSAqIGdyb3d0aFNjb3JlKCkpIC8gYmFycmllcnNTY29yZSgpOyBcclxuICAgIHNjb3Jlc1tcInQtc1wiXSA9IGE7XHJcbiAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgcmV0dXJuIGZpbmREZXNjKGEpXHJcbn1cclxuXHJcbi8vIERlc2NyaXB0aW9uXHJcbmZ1bmN0aW9uIGZpbmREZXNjICh4KXtcclxuICAgIGZvciAoaT0wOyBpPE9iamVjdC5rZXlzKHNjb3Jlc19kZXNjKS5sZW5ndGg7ICBpKysgKXtcclxuICAgICAgICBrZXk9IChPYmplY3Qua2V5cyhzY29yZXNfZGVzYylbaV0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJrZXk9XCIgKyBrZXkpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzX2Rlc2MuYS5sb3dlcl9saW1pdCk7IFxyXG4gICAgICAgIGlmICgoeCA8PSBzY29yZXNfZGVzY1trZXldLmhpZ2hlcl9saW1pdCkgJiYgKHggPj0gc2NvcmVzX2Rlc2Nba2V5XS5sb3dlcl9saW1pdCkpe1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3Jlcyk7IFxyXG4gICAgICAgICAgICByZXR1cm4gc2NvcmVzX2Rlc2Nba2V5XS5kZXNjXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gVmFsaWRhdGlvbiBTeXN0ZW1cclxuXHJcbi8vIHZlcmlmeSA6IGlkIC0gaW5wdXQgaWRcclxuZnVuY3Rpb24gdmVyaWZ5KGlkKXtcclxuICB2YXIgbnIgPSBjb252ZXJ0VG9OdW1iZXIoJChpZCkudmFsKCkpO1xyXG4gIGlmKG5yID09PSBmYWxzZSl7XHJcbiAgICByZXR1cm4gZmFsc2U7IFxyXG4gIH1cclxuXHJcbiAgc3dpdGNoIChpZCkge1xyXG4gICAgLy8gSW50ZWdlclxyXG4gICAgY2FzZSBcIiNtLTFcIjpcclxuICAgIGNhc2UgXCIjbS0yXCI6XHJcbiAgICBjYXNlIFwiI2MtOVwiOlxyXG4gICAgY2FzZSBcIiNnLTFcIjpcclxuICAgIGNhc2UgXCIjZy0yXCI6XHJcbiAgICBjYXNlIFwiI2ItMTJcIjpcclxuICAgICAgcmV0dXJuIGlzSW50KG5yKSAmJiBudW1iZXJCZXR3ZWVuKG5yLCAtMSk7XHJcblxyXG4gICAgLy8gRmxvYXRcclxuICAgIGNhc2UgXCIjbS0zXCI6XHJcbiAgICAgIHJldHVybiBpc0Zsb2F0KG5yKSAmJiBudW1iZXJCZXR3ZWVuKG5yLCAtMSk7XHJcblxyXG4gICAgLy8gUGVyY2VudGFnZVxyXG4gICAgY2FzZSBcIiNtLTRcIjpcclxuICAgIGNhc2UgXCIjbS01XCI6XHJcbiAgICBjYXNlIFwiI2YtNi0xYVwiOlxyXG4gICAgY2FzZSBcIiNmLTYtMmFcIjpcclxuICAgIGNhc2UgXCIjZi02LTNhXCI6XHJcbiAgICBjYXNlIFwiI2YtNi00YVwiOlxyXG4gICAgY2FzZSBcIiNmLTYtNWFcIjpcclxuICAgIFxyXG4gICAgICByZXR1cm4gaXNJbnQobnIpICYmIG51bWJlckJldHdlZW4obnIsIC0xLCAxMDEpO1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGNsZWFuIDogaW5wdXQgLSBqUXVlcnkgb2JqIDsgc3BhY2VzIC0gYm9vbGVhbiwgZGVmYXVsdCBmYWxzZSwgUmV0dXJuIHdpdGggb3Igd2l0aG91dCBzcGFjZXMuXHJcbmZ1bmN0aW9uIGNsZWFuKGlucHV0LCBzcGFjZXMpIHtcclxuICAgIGlmICh0eXBlb2Ygc3BhY2VzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgc3BhY2VzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpbnB1dC52YWwoZnVuY3Rpb24oaSwgdmFsKSB7XHJcbiAgICAgICAgaWYgKHNwYWNlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsLnRyaW0oKS5zcGxpdCgvXFxzKy9nKS5qb2luKFwiIFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsLnRyaW0oKS5zcGxpdCgvXFxzKy9nKS5qb2luKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBjb252ZXJ0VG9OdW1iZXIgOiBpZCAtIGlucHV0IGlkIDogcmV0dXJuIGEgbnVtYmVyIG9yIGZhbHNlXHJcbmZ1bmN0aW9uIGNvbnZlcnRUb051bWJlcihpZCl7XHJcbiAgdmFyIG5yO1xyXG4gICQoaWQpLnZhbChmdW5jdGlvbihpLCB2YWwpe1xyXG4gICAgbnIgPSBOdW1iZXIodmFsKTtcclxuICAgIGlmKE51bWJlcih2YWwpICE9IG5yKXtcclxuICAgICAgbnIgPSBmYWxzZTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gbnI7XHJcbn1cclxuXHJcbi8vIG51bWJlckJldHdlZW4gOiBuIC0gTnVtYmVyIG9iaiA7IG1pbiAvIG1heCAtIG51bWJlciwgb3B0aW9uYWxcclxuZnVuY3Rpb24gbnVtYmVyQmV0d2VlbihuLCBtaW4sIG1heCkge1xyXG4gICAgaWYgKE51bWJlcihuKSAhPT0gbikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtaW4gPT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG1heCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtaW4gIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG1heCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnIgPiBtaW47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbWluID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBtYXggIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5yIDwgbWF4O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuciA+IG1pbiAmJiBuciA8IG1heDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGlzSW50IDogbiAtIE51bWJlciBvYmpcclxuZnVuY3Rpb24gaXNJbnQobikge1xyXG4gICAgcmV0dXJuIE51bWJlcihuKSA9PT0gbiAmJiBuICUgMSA9PT0gMDtcclxufVxyXG5cclxuLy8gaXNGbG9hdCA6IG4gLSBOdW1iZXIgb2JqXHJcbmZ1bmN0aW9uIGlzRmxvYXQobikge1xyXG4gICAgcmV0dXJuIE51bWJlcihuKSA9PT0gbiAmJiBuICUgMSAhPT0gMDtcclxufVxyXG5cclxuLy9uZXh0IGJ1dHRvbnNcclxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIiNtYXJrZXRuZXh0XCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAkKCdhW2hyZWY9XCIjZml0XCJdJykuY2xpY2soKVxyXG4gICAgfSk7XHJcblxyXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiI2ZpdG5leHRcIiwgZnVuY3Rpb24oKXtcclxuICAgICQoJ2FbaHJlZj1cIiNjb21wZXRpdGl2ZVwiXScpLmNsaWNrKClcclxuICAgIH0pO1xyXG5cclxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIiNjb21wZXRpdGl2ZW5leHRcIiwgZnVuY3Rpb24oKXtcclxuICAgICQoJ2FbaHJlZj1cIiNncm93dGhcIl0nKS5jbGljaygpXHJcbiAgICB9KTtcclxuXHJcbiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIjZ3Jvd25leHRcIiwgZnVuY3Rpb24oKXtcclxuICAgICQoJ2FbaHJlZj1cIiNiYXJyaWVyc1wiXScpLmNsaWNrKClcclxuICAgIH0pO1xyXG5cclxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIiNiYXJyaWVyc25leHRcIiwgZnVuY3Rpb24oKXtcclxuICAgICQoJ2FbaHJlZj1cIiNzY29yZVwiXScpLmNsaWNrKClcclxuICAgIH0pO1xyXG4vKiAtLS0gVE9PTFMgLS0tICovXHJcbiJdfQ==
},{}]},{},[1])