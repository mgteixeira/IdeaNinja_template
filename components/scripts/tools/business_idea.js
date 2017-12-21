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

var inputsa = [
    "#m-1",
    "#m-2",
    "#m-3",
    "#m-4",
    "#m-5",

    "#f-6-1a",
    "#f-6-2a",
    "#f-6-3a",
    "#f-6-4a",
    "#f-6-5a",

    "#c-7-1a",
    "#c-7-2a",
    "#c-7-3a",
    "#c-7-4a",
    "#c-7-5a",
    "#c-7-6a",

    "#c-9",

    "#g-1",
    "#g-2",
    "#g-3",

    "#b-12"
];



// outputs (to show information) : id ; value
var outputs = {
    "#f-2": inputs["#m-2"],

    "#f-6-1q": inputs["#m-2"]*0.5,
    "#f-6-2q": inputs["#m-2"]*0.7,
    "#f-6-3q": inputs["#m-2"],
    "#f-6-4q": inputs["#m-2"]*1.3,
    "#f-6-5q": inputs["#m-2"]*1.5,
 
    "#c-6-1a": inputs["#f-6-1a"],
    "#c-6-2a": inputs["#f-6-2a"],
    "#c-6-3a": inputs["#f-6-3a"],
    "#c-6-4a": inputs["#f-6-4a"],
    "#c-6-5a": inputs["#f-6-5a"],
    
    "#c-6-1q": inputs["#m-2"]*0.5,
    "#c-6-2q": inputs["#m-2"]*0.7,
    "#c-6-3q": inputs["#m-2"],
    "#c-6-4q": inputs["#m-2"]*1.3,
    "#c-6-5q": inputs["#m-2"]*1.5,
    
    "#c-7-1q": inputs["#m-2"]/(1+inputs["#m-5"])*0.5,
    "#c-7-2q": inputs["#m-2"]/(1+inputs["#m-5"])*0.7,
    "#c-7-3q": inputs["#m-2"]/(1+inputs["#m-5"])*0.9,
    "#c-7-4q": inputs["#m-2"]/(1+inputs["#m-5"])*1.2,
    "#c-7-5q": inputs["#m-2"]/(1+inputs["#m-5"])*1.5

 //   "#c-7-1": document.querySelector('input[name="c7"]:checked').value,
};


var scores = {
    "m-s": "0",
    "f-s": "0",
    "c-s": "0",
    "g-s": "0", 
    "b-s": "0", 
    "t-s": "0"
}

var scores_desc = {
    "a": {
        "desc":"very weak",
        "lower_limit": -2, 
        "higher_limit": 2
        } , 
    "b": {
        "desc":"weak",
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
        "lower_limit":  4, 
        "higher_limit": 5
        }, 
    "e": {
        "desc": "very strong",
        "lower_limit": 4, 
        "higher_limit": 150
        }
}


var regex = {
    id: /#(\D)-(\d)-?(\d?)/i,
};


/* --- EVENTS --- */

// Ready
$(function() {
    // Get LocalStorage
    // Set the inputs
    // Set the outputs
    // Set the Scores
    // Set the final Score
});

// Change
inputsa.forEach(function(key){
    //console.log("forEach começou " + key +" = " + inputs[key]); 
    $(key).change(function(){
        //console.log("detectou change na " + key);
        inputs[key] = $(key).val(); 
        setOutputs();
        showMenu();
        //console.log("I've changed"); 
        //console.log(inputs); 
    });
}); //forach inputsa

//show menus
function showMenu(){
    if(inputs["#m-1"] !== 0 && inputs["#m-2"] !== 0 && inputs["#m-3"] !== 0 && inputs["#m-4"] !== 0 && inputs["#m-5"] !== 0) {
        $("#fit_bar").removeClass("hidden"); 
        $("#marketnext").removeClass("hidden");
        $("#bi_bar").css("width", "20%");
    }
    if(inputs["#f-6-1a"] !== 0 && inputs["#f-6-2a"] !== 0 && inputs["#f-6-3a"] !== 0 && inputs["#f-6-4a"] !==0 && inputs["#f-6-5a"] !== 0) {
        $("#competitive_bar").removeClass("hidden");
        $("#fitnext").removeClass("hidden");
        $("#bi_bar").css("width", "40%");
    }
    if(inputs["#c-9"] !== 0 && typeof document.querySelector("input[name='c-7']:checked") !== undefined) {
        $("#growth_bar").removeClass("hidden"); 
        $("#competitivenext").removeClass("hidden");
        $("#bi_bar").css("width", "60%");
    }
    if( (inputs["#g-1"] !== 0) && (inputs["#g-2"] !== 0) && (inputs["#g-3"] !== 0)) {
        $("#barriers_bar").removeClass("hidden"); 
        $("#grownext").removeClass("hidden");
        $("#bi_bar").css("width", "80%");
    }

    if (inputs["#b-12"] !== 0){
        $("#score_bar").removeClass("hidden");
        $("#barriersnext").removeClass("hidden");
        $("#bi_bar").css("width", "100%");
    }
}; 

//set outputs
function setOutputs (){
    if(inputs["#m-2"] != 0 ) {
        outputs["#f-2"] = inputs["#m-2"]; 
        $("#f-2").text(inputs["#m-2"]); 

        outputs["#f-6-1q"] = inputs["#m-2"]*0.5;
        f61q= Math.round(outputs["#f-6-1q"]*100)
        $("#f-6-1q").text(f61q/100);

        outputs["#f-6-2q"] = inputs["#m-2"]*0.7;
        f62q= Math.round(outputs["#f-6-2q"]*100)
        $("#f-6-2q").text(f62q/100);

        outputs["#f-6-3q"] = inputs["#m-2"];
        f63q= Math.round(outputs["#f-6-3q"]*100)
        $("#f-6-3q").text(f63q/100);

        outputs["#f-6-4q"] = inputs["#m-2"]*1.3;
        f64q= Math.round(outputs["#f-6-4q"]*100)
        $("#f-6-4q").text(f64q/100);

        outputs["#f-6-5q"] = inputs["#m-2"]*1.5;
        f65q= Math.round(outputs["#f-6-5q"]*100)
        $("#f-6-5q").text(f65q/100);

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
        outputs["#c-6-1q"] = inputs["#m-2"]*0.5;
        c61q= Math.round(outputs["#c-6-1q"]*100)
        $("#c-6-1q").text(c61q/100);

        outputs["#c-6-2q"] = inputs["#m-2"]*0.7;
        c62q= Math.round(outputs["#c-6-2q"]*100)
        $("#c-6-2q").text(c62q/100);

        outputs["#c-6-3q"] = inputs["#m-2"];
        c63q= Math.round(outputs["#c-6-3q"]*100)
        $("#c-6-3q").text(c63q/100);

        outputs["#c-6-4q"] = inputs["#m-2"]*1.3;
        c64q= Math.round(outputs["#c-6-4q"]*100)
        $("#c-6-4q").text(c64q/100);

        outputs["#c-6-5q"] = inputs["#m-2"]*1.5;
        c65q= Math.round(outputs["#c-6-5q"]*100)
        $("#c-6-5q").text(c65q/100);

        if(inputs["#m-5"] != 0) {
                 outputs["#c-7-1q"] = inputs["#m-2"]/(1+inputs["#m-5"])*50; 
                 a1 = Math.round(outputs["#c-7-1q"]*100); 
                $("#c-7-1q").text(a1/100); 
                
                outputs["#c-7-2q"] = inputs["#m-2"]/(1+inputs["#m-5"])*70; 
                a2= Math.round(outputs["#c-7-2q"] * 100)
                $("#c-7-2q").text(a2/100); 
                

                outputs["#c-7-3q"] = inputs["#m-2"]/(1+inputs["#m-5"])*100;
                a3 = Math.round(outputs["#c-7-3q"]*100); 
                $("#c-7-3q").text(a3/100); 
                    
                outputs["#c-7-4q"] = inputs["#m-2"]/(1+inputs["#m-5"])*130; 
                a4 = Math.round(outputs["#c-7-4q"]*100); 
                $("#c-7-4q").text(a4/100); 
                
                outputs["#c-7-5q"] = inputs["#m-2"]/(1+inputs["#m-5"])*150; 
                a5 = Math.round(outputs["#c-7-5q"]*100); 
                $("#c-7-5q").text(a5/100); 
        }

                
    }; 
    if(inputs["#f-6-1a"] != 0 ) {
        outputs["#c-6-1a"] = inputs["#f-6-1a"];
        a10 = Math.round( inputs["#f-6-1a"]*100); 
        $("#c-6-1a").text(a10/100); 
        
    }; 
    if(inputs["#f-6-2a"] != 0 ) {
        outputs["#c-6-2a"] = inputs["#f-6-2a"];
        a10 = Math.round( inputs["#f-6-2a"]*100); 
        $("#c-6-2a").text(a10/100); 
    }; 

    if(inputs["#f-6-3a"] != 0 ) {
        outputs["#c-6-3a"] = inputs["#f-6-3a"];
        a10 = Math.round( inputs["#f-6-3a"]*100); 
        $("#c-6-3a").text(a10/100); 
    }; 
    if(inputs["#f-6-4a"] != 0 ) {
        outputs["#c-6-4a"] = inputs["#f-6-4a"];
        a10 = Math.round( inputs["#f-6-4a"]*100); 
        $("#c-6-4a").text(a10/100); 
    };
    if(inputs["#f-6-5a"] != 0 ) {
        outputs["#c-6-5a"] = inputs["#f-6-5a"];
        a10 = Math.round( inputs["#f-6-5a"]*100); 
        $("#c-6-5a").text(a10/100); 
    }; 

    

    if( (inputs["#m-1"] !== 0) && (inputs["#m-2"] !== 0) && (inputs["#m-3"] !== 0) && (inputs["#m-4"] !== 0) && (inputs["#m-5"] !== 0)){
        ms = valuemarketScore(); 
        //$("#m-s").text(ms) ;
        scores["m-s"] = ms; 
        //console.log(scores); 
    }; 
    
    if( (inputs["f-6-1a"] !==0) && (inputs["f-6-2a"] !==0) && (inputs["f-6-3a"] !==0) && (inputs["f-6-4a"] !==0) && (inputs["f-6-5a"] !==0)) {
        fs = fitScore(); 
        //$("#f-s").text(fs); 
        scores["f-s"] = fs; 
        //console.log(scores); 
    }; 
    
    if( (inputs["#c-9"] !== 0) && (typeof document.querySelector("input[name='c-7']:checked") !== undefined)){
           cs = competitiveScore(); 
           //$("#c-s").text(cs); 
           scores["c-s"] = cs; 
           //console.log(scores); 
        }; 

    if( (inputs["#g-1"] !== 0) && (inputs["#g-2"] !== 0) && (inputs["#g-3"] !== 0)) {
         gs = growthScore(); 
         //$("#g-s").text(gs); 
         scores["g-s"] = gs; 
         //console.log(scores); 
    }; 


    if (inputs["#b-12"] !== 0){
        bs = barriersScore();
        //console.log(bs); 
        //$("#b-s").text(bs);
        scores["b-s"] = bs; 
        //console.log(scores);
    }; 

    if( (scores["m-s"] !== "0") && (scores["f-s"] !== "0") && (scores["c-s"] !== "0") && (scores["g-s"] !== "0") &&(scores["b-s"] !== "0") ){
        ts = finalScore(); 
        $("#t-s").html("<p>Your business opportunity is <strong>" + ts + 
            "</strong>.</p> <ul><li> The Market you chose to operate in is " + findDesc(ms) + "</li>"+
            "<li> Customer has a " + findDesc(fs) + " interest in your product or service</li><li> You have a " + findDesc(cs) + " competitive advantage</li><li>Your Growth opportunities are " + findDesc(gs) + 
            "</li><li> The barriers to enter are " + findDesc( Math.pow(bs,1/4)) + 
            "</li></ul>");  
        //console.log(scores);
    }; 
}

/* --- SYSTEMS --- */
// Score System

function valuemarketScore() {
    return Math.pow(
        (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"] * 
            (1 + inputs["#m-4"])
         * inputs["#m-5"])/ 20000, 1/10
        )/2;
}

function fitScore() {
    return (inputs["#f-6-3a"]/100*5 + inputs["#f-6-1a"]/100*5 + inputs["#f-6-5a"]/100*5)/2.5 + 1;
    }


function competitiveScore(){
    //console.log("competitive score inicio de cálculo")
    switch(document.querySelector("input[name='c-7']:checked").value) {
        case "1" :
            a = inputs["#f-6-1a"]/100;   //willingness to pay in marginal cost
            b = inputs["#c-9"]/ (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]);   // Cost structure vs Market size
            c = (outputs["#c-7-1q"]/(inputs["#m-2"] * (1 - inputs["#m-5"]/100)));
            //console.log("a= " + a + " b = " + b + " c= " + c)
            return (
                        Math.max(
                            Math.log10(
                                Math.pow(
                                    (Math.pow(a,2)*(1/b)+c*3
                                ),4)
                            )
                            ,0)
                    );
        case "2" :
            a = inputs["#f-6-2a"]/100;   //willingness to pay in marginal cost
            b = inputs["#c-9"]/ (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]);   // Cost structure vs Market size
            c = outputs["#c-7-2q"]/(inputs["#m-2"] * (1 - inputs["#m-5"]/100));
            return (
                        Math.max(
                            Math.log10(
                                Math.pow(
                                    (Math.pow(a,2)*(1/b)+c*3
                                ),4)
                            )
                            ,0)
                    );
        case "3" :
            a = inputs["#f-6-3a"]/100;   //willingness to pay in marginal cost
            b = inputs["#c-9"]/ (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]);   // Cost structure vs Market size
            c = outputs["#c-7-3q"]/(inputs["#m-2"] * (1 - inputs["#m-5"]/100));
            return (
                        Math.max(
                            Math.log10(
                                Math.pow(
                                    (Math.pow(a,2)*(1/b)+c*3
                                ),4)
                            )
                            ,0)
                    );
        case "4" :
            a = inputs["#f-6-4a"]/100;   //willingness to pay in marginal cost
            b = inputs["#c-9"]/ (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]);   // Cost structure vs Market size
            c = outputs["#c-7-4q"]/(inputs["#m-2"] * (1 - inputs["#m-5"]/100));
            return (
                        Math.max(
                            Math.log10(
                                Math.pow(
                                    (Math.pow(a,2)*(1/b)+c*3
                                ),4)
                            )
                            ,0)
                    );
        case "5" :
             a = inputs["#f-6-5a"]/100;   //willingness to pay in marginal cost
            b = inputs["#c-9"]/ (inputs["#m-1"] * inputs["#m-2"] * inputs["#m-3"]);   // Cost structure vs Market size
            c = outputs["#c-7-5q"]/(inputs["#m-2"] * (1 - inputs["#m-5"]/100));
            return (
                        Math.max(
                            Math.log10(
                                Math.pow(
                                    (Math.pow(a,2)*(1/b)+c*3
                                ),4)
                            )
                            ,0)
                    );       
    }//fim de switch 
}


function growthScore() {
    a =  Math.pow(Math.pow(Math.pow(inputs["#g-1"],inputs["#g-2"]),inputs["#g-3"]),(1/70)); 
    b = Number(inputs["#g-1"]) + Number(inputs["#g-2"]) + Number(inputs["#g-3"]); 
    //console.log("a = " + a); 
    //console.log("b = " + b); 
    return (
        Math.pow((a*b),(1/4))
        )
}


function barriersScore() {
    //console.log("lançada a função de cálculo de bs com a var de input = " + inputs["#b-12"] +" que é um " + typeof Number(inputs["#b-12"]) ); 
    a = (Math.log10(Number(inputs["#b-12"]))-2); 
    b= 25
    c = Math.pow(a,2)*b
    //console.log(" a = " + a + " b = " + b  + " c = " +c ); 
    return c
        
}

function finalScore() {
    //console.log("inicio de finalScore"); 
    //console.log(scores); 
    a = (valuemarketScore() * fitScore() * competitiveScore() * growthScore()) / barriersScore(); 
    scores["t-s"] = a;
    //console.log(scores); 
    return findDesc(a)
}

// Description
function findDesc (x){
    for (i=0; i<Object.keys(scores_desc).length;  i++ ){
        key= (Object.keys(scores_desc)[i]);
        //console.log("key=" + key);
        //console.log(scores_desc.a.lower_limit); 
        if ((x <= scores_desc[key].higher_limit) && (x >= scores_desc[key].lower_limit)){
            //console.log(scores); 
            return scores_desc[key].desc
            
        }
    }
}

// Validation System

// verify : id - input id
function verify(id){
  var nr = convertToNumber($(id).val());
  if(nr === false){
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
    input.val(function(i, val) {
        if (spaces) {
            return val.trim().split(/\s+/g).join(" ");
        } else {
            return val.trim().split(/\s+/g).join("");
        }
    });
}

// convertToNumber : id - input id : return a number or false
function convertToNumber(id){
  var nr;
  $(id).val(function(i, val){
    nr = Number(val);
    if(Number(val) != nr){
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
$("body").on("click", "#marketnext", function(){
    $('a[href="#fit"]').click()
    });

$("body").on("click", "#fitnext", function(){
    $('a[href="#competitive"]').click()
    });

$("body").on("click", "#competitivenext", function(){
    $('a[href="#growth"]').click()
    });

$("body").on("click", "#grownext", function(){
    $('a[href="#barriers"]').click()
    });

$("body").on("click", "#barriersnext", function(){
    $('a[href="#score"]').click()
    });
/* --- TOOLS --- */
