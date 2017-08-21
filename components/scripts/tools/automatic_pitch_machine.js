/*
 * Automatic Pitch Machine
 */

require('../global/script.js');

Clipboard = require('clipboard');

// VARIABLES

// Checkboxes List
var pitch_check = [
    "pitch_cb_1",
    "pitch_cb_2",
    "pitch_cb_3",
    "pitch_cb_4"
];

// Inputs List
// ID_of_input : Text_of_input
var pitch_inputs = {
    "customername": "",
    "scennario_pt": "",
    "scennario_pst": "",
    "scennario_comp": "",
    "trigger_pt": "",
    "trigger_pst": "",
    "statusquo_sol": "",
    "productname": "",
    "producttag": "",
    "ben1": "",
    "ben2": "",
    "ben3": "",
    "altben1": "",
    "altben2": "",
    "altben3": "",
    "ben_pst": "",
    "ben_imp": "",
    "alt_should": "",
    "alt_hap": "",
    "alt_cons": "",
    "alt_nocons": "",
    "exp": "",
    "dist": "",
    "relev": "",
    "qpain": "",
    "apain": "",
    "qdiff": ""
};

var pitch_variables = {
    "pitch_cb_1": [
        "scennario_comp",
        "relev",
        "qpain",
        "apain",
        "productname",
        "producttag",
        "ben1",
        "ben2",
        "ben3",
        "alt_should",
        "altben1",
        "altben2",
        "altben3",
        "ben_imp"
    ],
    "pitch_cb_2": [
        "scennario_pst",
        "trigger_pst",
        "statusquo_sol",
        "qdiff",
        "altben1",
        "altben2",
        "altben3",
        "productname",
        "ben1",
        "ben2",
        "ben3"
    ],
    "pitch_cb_3": [
        "scennario_pst",
        "alt_hap",
        "alt_cons",
        "alt_nocons",
        "productname",
        "ben1",
        "ben2",
        "ben3",
        "altben1",
        "altben2",
        "altben3",
        "dist",
        "ben_pst",
        "exp",
        "producttag"
    ],
    "pitch_cb_4": [
        "customername",
        "scennario_pt",
        "trigger_pt",
        "dist",
        "ben_pst",
        "exp"
    ]
};

var seclvl_pgroups = {
    "customername_div": "customername_div",
    "scennario_pt_div": "scennario",
    "scennario_pst_div": "scennario",
    "scennario_comp_div": "scennario_comp_div",
    "statusquo_sol_div": "statusquo_sol_div",
    "trigger_pt_div": "trigger",
    "trigger_pst_div": "trigger",
    "productname_div": "productname_div",
    "producttag_div": "producttag_div",
    "ben1_div": "benefit_table",
    "ben2_div": "benefit_table",
    "ben3_div": "benefit_table",
    "altben1_div": "benefit_table",
    "altben2_div": "benefit_table",
    "altben3_div": "benefit_table",
    "ben_pst_div": "sum_ben",
    "ben_imp_div": "sum_ben",
    "alt_should_div": "alt_should_div",
    "alt_hap_div": "alt_hap_div",
    "alt_cons_div": "alt_cons_div",
    "alt_nocons_div": "alt_nocons_div",
    "exp_div": "exp_div",
    "dist_div": "dist_div",
    "relev_div": "relev_div",
    "qpain_div": "qpain_div",
    "apain_div": "apain_div",
    "qdiff_div": "qdiff_div"
};

var firstlvl_pgroups = {
    "customername_div": "0",
    "scennario": "1",
    "scennario_comp_div": "1",
    "trigger": "1",
    "statusquo_sol_div": "1",
    "productname_div": "2",
    "producttag_div": "2",
    "benefit_table": "2",
    "sum_ben": "2",
    "alt_should_div": "2",
    "alt_hap_div": "2",
    "alt_cons_div": "2",
    "alt_nocons_div": "2",
    "exp_div": "2",
    "dist_div": "2",
    "relev_div": "3",
    "qpain_div": "3",
    "apain_div": "3",
    "qdiff_div": "3"
};

var esconde = [
    "customername_div",
    "scennario",
    "scennario_comp_div",
    "trigger",
    "statusquo_sol_div",
    "productname_div",
    "producttag_div",
    "benefit_table",
    "sum_ben",
    "alt_should_div",
    "alt_hap_div",
    "alt_cons_div",
    "alt_nocons_div",
    "exp_div",
    "dist_div",
    "relev_div",
    "qpain_div",
    "apain_div",
    "qdiff_div"
];

var esconde_collapsable = ["0", "1", "2", "3"];

var mostra_collapsable = [];

var mostra = [];

// ----------------------------

// Clipboard System
var clip = new Clipboard('.clip');

clip.on('success', function(e) {
    e.trigger.innerHTML = 'Copied!';
    e.clearSelection();
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

// --------------------------

// Populate the pitches in document start
// Write the text (value) of all inputs (key) into the span texts.
$.each(pitch_inputs, function(key, value) {
    // Verify if inputs have something writed.
    if ($("#" + key).val() !== "") {
        value = $("#" + key).val();
        // Write the text of input into the span tags in the pitches
        $('.' + key + "_span").text(value);
    }
    // Event on keyup
    $("#" + key).keyup(function() {
        value = $("#" + key).val();
        $('.' + key + "_span").text(value);
    });
});

// Esconde todas as questões
pitch_check.forEach(
    function(id) {
        $('.pitch_cb').change(function() {
            //console.log("evento registado");
            pitch_variables[id].forEach(
                function(b) {
                    //console.log(b);
                    if ($("#" + id).not(':checked')) {
                        $("#" + b + "_div").hide();
                        mostra.splice(mostra.indexOf(b + "_div"));

                        s = seclvl_pgroups[b + "_div"];
                        v = firstlvl_pgroups[s];
                        mostra_collapsable.splice(mostra_collapsable.indexOf(v));
                        //console.log("splice para mostra_collapsable de " + v);
                    }
                }
            ); //forEach pitch Inputs
        }); //event
    } //function(id)
); //forEach

//apresenta apenas as questões necessárias
pitch_check.forEach(
    function(id) {
        $('.pitch_cb').change(function() {
            //console.log("evento registado");
            //console.log(id);
            pitch_variables[id].forEach(function(a) {
                //console.log(a);
                if (
                    $("#" + id).is(':checked')
                ) {
                    //console.log("show " + a);
                    $("#" + a + "_div").show();
                    mostra.push(a + "_div");

                    w = seclvl_pgroups[a + "_div"];
                    t = firstlvl_pgroups[w];
                    mostra_collapsable.push(t);
                    //console.log("push para mostra_collapsable de " + t);
                }
            }); //pitchvariable_forEach
            // Mudar texto antes dos collapsables.
            if (mostra_collapsable.length === 0) {
                $("#p_yes").hide();
                $("#p_no").show();
            } else {
                $("#p_yes").show();
                $("#p_no").hide();
            }
        }); //event
    } //function(id)
); //forEach

$(document).ready(function() {
    $("#p_no").hide();
});

// vê quais das questões estão com display=none e faz desaparecer texto e collapsables acessórios.
$('.pitch_cb').change(function() {
    esconde.forEach(
        function(g) {
            //console.log("hide " + g);
            $("." + g).hide();
        }
    ); //esconde forEach

    esconde_collapsable.forEach(
        function(nr_collapsable) {
            $("#panel" + nr_collapsable).hide();
        }
    ); //esconde_collapsable

    mostra.forEach(
        function(id) {
            a = seclvl_pgroups[id];
            //console.log("show " + a);
            $("." + a).show();
        }
    ); //mostra foreach

    mostra_collapsable.forEach(
        function(nr_collapsable) {
            $("#panel" + nr_collapsable).show();
        }
    ); //mostra_collapsable

}); //event
