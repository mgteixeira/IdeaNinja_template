(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * Automatic Pitch Machine
 */

// VARIABLES
Clipboard = require('clipboard');

// Checkboxes List
var pitch_check = ["pitch_cb_1", "pitch_cb_2", "pitch_cb_3", "pitch_cb_4"];

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
    "pitch_cb_1": ["scennario_comp", "relev", "qpain", "apain", "productname", "producttag", "ben1", "ben2", "ben3", "alt_should", "altben1", "altben2", "altben3", "ben_imp"],
    "pitch_cb_2": ["scennario_pst", "trigger_pst", "statusquo_sol", "qdiff", "altben1", "altben2", "altben3", "productname", "ben1", "ben2", "ben3"],
    "pitch_cb_3": ["scennario_pst", "alt_hap", "alt_cons", "alt_nocons", "productname", "ben1", "ben2", "ben3", "altben1", "altben2", "altben3", "dist", "ben_pst", "exp", "producttag"],
    "pitch_cb_4": ["customername", "scennario_pt", "trigger_pt", "dist", "ben_pst", "exp"]
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

var esconde = ["customername_div", "scennario", "scennario_comp_div", "trigger", "statusquo_sol_div", "productname_div", "producttag_div", "benefit_table", "sum_ben", "alt_should_div", "alt_hap_div", "alt_cons_div", "alt_nocons_div", "exp_div", "dist_div", "relev_div", "qpain_div", "apain_div", "qdiff_div"];

var esconde_collapsable = ["0", "1", "2", "3"];

var mostra_collapsable = [];

var mostra = [];

// ----------------------------

// Clipboard System

var clip = new Clipboard('.clip');

clip.on('success', function (e) {
    e.trigger.innerHTML = 'Copied!';
    e.clearSelection();
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

// --------------------------

// Populate the pitches in document start
// Write the text (value) of all inputs (key) into the span texts.
$.each(pitch_inputs, function (key, value) {
    // Verify if inputs have something writed.
    if ($("#" + key).val() !== "") {
        value = $("#" + key).val();
        // Write the text of input into the span tags in the pitches
        $('.' + key + "_span").text(value);
    }
    // Event on keyup
    $("#" + key).keyup(function () {
        value = $("#" + key).val();
        $('.' + key + "_span").text(value);
    });
});

// Esconde todas as questões
pitch_check.forEach(function (id) {
    $('.pitch_cb').change(function () {
        //console.log("evento registado");
        pitch_variables[id].forEach(function (b) {
            //console.log(b);
            if ($("#" + id).not(':checked')) {
                $("#" + b + "_div").hide();
                mostra.splice(mostra.indexOf(b + "_div"));

                s = seclvl_pgroups[b + "_div"];
                v = firstlvl_pgroups[s];
                mostra_collapsable.splice(mostra_collapsable.indexOf(v));
                //console.log("splice para mostra_collapsable de " + v);
            }
        }); //forEach pitch Inputs
    }); //event
} //function(id)
); //forEach

//apresenta apenas as questões necessárias
pitch_check.forEach(function (id) {
    $('.pitch_cb').change(function () {
        //console.log("evento registado");
        //console.log(id);
        pitch_variables[id].forEach(function (a) {
            //console.log(a);
            if ($("#" + id).is(':checked')) {
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

$(document).ready(function () {
    $("#p_no").hide();
});

// vê quais das questões estão com display=none e faz desaparecer texto e collapsables acessórios.
$('.pitch_cb').change(function () {
    esconde.forEach(function (g) {
        //console.log("hide " + g);
        $("." + g).hide();
    }); //esconde forEach

    esconde_collapsable.forEach(function (nr_collapsable) {
        $("#panel" + nr_collapsable).hide();
    }); //esconde_collapsable

    mostra.forEach(function (id) {
        a = seclvl_pgroups[id];
        //console.log("show " + a);
        $("." + a).show();
    }); //mostra foreach

    mostra_collapsable.forEach(function (nr_collapsable) {
        $("#panel" + nr_collapsable).show();
    }); //mostra_collapsable
}); //event
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxjb21wb25lbnRzXFxzY3JpcHRzXFx0b29sc1xcYXV0b21hdGljX3BpdGNoX21hY2hpbmUuanMiXSwibmFtZXMiOlsiQ2xpcGJvYXJkIiwicmVxdWlyZSIsInBpdGNoX2NoZWNrIiwicGl0Y2hfaW5wdXRzIiwicGl0Y2hfdmFyaWFibGVzIiwic2VjbHZsX3Bncm91cHMiLCJmaXJzdGx2bF9wZ3JvdXBzIiwiZXNjb25kZSIsImVzY29uZGVfY29sbGFwc2FibGUiLCJtb3N0cmFfY29sbGFwc2FibGUiLCJtb3N0cmEiLCJjbGlwIiwib24iLCJlIiwidHJpZ2dlciIsImlubmVySFRNTCIsImNsZWFyU2VsZWN0aW9uIiwiZmFsbGJhY2tNZXNzYWdlIiwiYWN0aW9uIiwiYWN0aW9uTXNnIiwiYWN0aW9uS2V5IiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIiQiLCJlYWNoIiwia2V5IiwidmFsdWUiLCJ2YWwiLCJ0ZXh0Iiwia2V5dXAiLCJmb3JFYWNoIiwiaWQiLCJjaGFuZ2UiLCJiIiwibm90IiwiaGlkZSIsInNwbGljZSIsImluZGV4T2YiLCJzIiwidiIsImEiLCJpcyIsInNob3ciLCJwdXNoIiwidyIsInQiLCJsZW5ndGgiLCJkb2N1bWVudCIsInJlYWR5IiwiZyIsIm5yX2NvbGxhcHNhYmxlIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUlBO0FBQ0FBLFlBQVlDLFFBQVEsV0FBUixDQUFaOztBQUdBO0FBQ0EsSUFBSUMsY0FBYyxDQUNkLFlBRGMsRUFFZCxZQUZjLEVBR2QsWUFIYyxFQUlkLFlBSmMsQ0FBbEI7O0FBT0E7QUFDQTtBQUNBLElBQUlDLGVBQWU7QUFDZixvQkFBZ0IsRUFERDtBQUVmLG9CQUFnQixFQUZEO0FBR2YscUJBQWlCLEVBSEY7QUFJZixzQkFBa0IsRUFKSDtBQUtmLGtCQUFjLEVBTEM7QUFNZixtQkFBZSxFQU5BO0FBT2YscUJBQWlC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QUYsRUFBWUMsS0FBWixDQUFrQixZQUFXO0FBQ3pCekIsTUFBRSxPQUFGLEVBQVdZLElBQVg7QUFDSCxDQUZEOztBQUlBO0FBQ0FaLEVBQUUsV0FBRixFQUFlUyxNQUFmLENBQXNCLFlBQVc7QUFDN0IxQixZQUFRd0IsT0FBUixDQUNJLFVBQVNtQixDQUFULEVBQVk7QUFDUjtBQUNBMUIsVUFBRSxNQUFNMEIsQ0FBUixFQUFXZCxJQUFYO0FBQ0gsS0FKTCxFQUQ2QixDQU0xQjs7QUFFSDVCLHdCQUFvQnVCLE9BQXBCLENBQ0ksVUFBU29CLGNBQVQsRUFBeUI7QUFDckIzQixVQUFFLFdBQVcyQixjQUFiLEVBQTZCZixJQUE3QjtBQUNILEtBSEwsRUFSNkIsQ0FZMUI7O0FBRUgxQixXQUFPcUIsT0FBUCxDQUNJLFVBQVNDLEVBQVQsRUFBYTtBQUNUUyxZQUFJcEMsZUFBZTJCLEVBQWYsQ0FBSjtBQUNBO0FBQ0FSLFVBQUUsTUFBTWlCLENBQVIsRUFBV0UsSUFBWDtBQUNILEtBTEwsRUFkNkIsQ0FvQjFCOztBQUVIbEMsdUJBQW1Cc0IsT0FBbkIsQ0FDSSxVQUFTb0IsY0FBVCxFQUF5QjtBQUNyQjNCLFVBQUUsV0FBVzJCLGNBQWIsRUFBNkJSLElBQTdCO0FBQ0gsS0FITCxFQXRCNkIsQ0EwQjFCO0FBRU4sQ0E1QkQsRSxDQTRCSSIsImZpbGUiOiJhdXRvbWF0aWNfcGl0Y2hfbWFjaGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEF1dG9tYXRpYyBQaXRjaCBNYWNoaW5lXHJcbiAqL1xyXG5cclxuLy8gVkFSSUFCTEVTXHJcbkNsaXBib2FyZCA9IHJlcXVpcmUoJ2NsaXBib2FyZCcpO1xyXG5cclxuXHJcbi8vIENoZWNrYm94ZXMgTGlzdFxyXG52YXIgcGl0Y2hfY2hlY2sgPSBbXHJcbiAgICBcInBpdGNoX2NiXzFcIixcclxuICAgIFwicGl0Y2hfY2JfMlwiLFxyXG4gICAgXCJwaXRjaF9jYl8zXCIsXHJcbiAgICBcInBpdGNoX2NiXzRcIlxyXG5dO1xyXG5cclxuLy8gSW5wdXRzIExpc3RcclxuLy8gSURfb2ZfaW5wdXQgOiBUZXh0X29mX2lucHV0XHJcbnZhciBwaXRjaF9pbnB1dHMgPSB7XHJcbiAgICBcImN1c3RvbWVybmFtZVwiOiBcIlwiLFxyXG4gICAgXCJzY2VubmFyaW9fcHRcIjogXCJcIixcclxuICAgIFwic2Nlbm5hcmlvX3BzdFwiOiBcIlwiLFxyXG4gICAgXCJzY2VubmFyaW9fY29tcFwiOiBcIlwiLFxyXG4gICAgXCJ0cmlnZ2VyX3B0XCI6IFwiXCIsXHJcbiAgICBcInRyaWdnZXJfcHN0XCI6IFwiXCIsXHJcbiAgICBcInN0YXR1c3F1b19zb2xcIjogXCJcIixcclxuICAgIFwicHJvZHVjdG5hbWVcIjogXCJcIixcclxuICAgIFwicHJvZHVjdHRhZ1wiOiBcIlwiLFxyXG4gICAgXCJiZW4xXCI6IFwiXCIsXHJcbiAgICBcImJlbjJcIjogXCJcIixcclxuICAgIFwiYmVuM1wiOiBcIlwiLFxyXG4gICAgXCJhbHRiZW4xXCI6IFwiXCIsXHJcbiAgICBcImFsdGJlbjJcIjogXCJcIixcclxuICAgIFwiYWx0YmVuM1wiOiBcIlwiLFxyXG4gICAgXCJiZW5fcHN0XCI6IFwiXCIsXHJcbiAgICBcImJlbl9pbXBcIjogXCJcIixcclxuICAgIFwiYWx0X3Nob3VsZFwiOiBcIlwiLFxyXG4gICAgXCJhbHRfaGFwXCI6IFwiXCIsXHJcbiAgICBcImFsdF9jb25zXCI6IFwiXCIsXHJcbiAgICBcImFsdF9ub2NvbnNcIjogXCJcIixcclxuICAgIFwiZXhwXCI6IFwiXCIsXHJcbiAgICBcImRpc3RcIjogXCJcIixcclxuICAgIFwicmVsZXZcIjogXCJcIixcclxuICAgIFwicXBhaW5cIjogXCJcIixcclxuICAgIFwiYXBhaW5cIjogXCJcIixcclxuICAgIFwicWRpZmZcIjogXCJcIlxyXG59O1xyXG5cclxudmFyIHBpdGNoX3ZhcmlhYmxlcyA9IHtcclxuICAgIFwicGl0Y2hfY2JfMVwiOiBbXHJcbiAgICAgICAgXCJzY2VubmFyaW9fY29tcFwiLFxyXG4gICAgICAgIFwicmVsZXZcIixcclxuICAgICAgICBcInFwYWluXCIsXHJcbiAgICAgICAgXCJhcGFpblwiLFxyXG4gICAgICAgIFwicHJvZHVjdG5hbWVcIixcclxuICAgICAgICBcInByb2R1Y3R0YWdcIixcclxuICAgICAgICBcImJlbjFcIixcclxuICAgICAgICBcImJlbjJcIixcclxuICAgICAgICBcImJlbjNcIixcclxuICAgICAgICBcImFsdF9zaG91bGRcIixcclxuICAgICAgICBcImFsdGJlbjFcIixcclxuICAgICAgICBcImFsdGJlbjJcIixcclxuICAgICAgICBcImFsdGJlbjNcIixcclxuICAgICAgICBcImJlbl9pbXBcIlxyXG4gICAgXSxcclxuICAgIFwicGl0Y2hfY2JfMlwiOiBbXHJcbiAgICAgICAgXCJzY2VubmFyaW9fcHN0XCIsXHJcbiAgICAgICAgXCJ0cmlnZ2VyX3BzdFwiLFxyXG4gICAgICAgIFwic3RhdHVzcXVvX3NvbFwiLFxyXG4gICAgICAgIFwicWRpZmZcIixcclxuICAgICAgICBcImFsdGJlbjFcIixcclxuICAgICAgICBcImFsdGJlbjJcIixcclxuICAgICAgICBcImFsdGJlbjNcIixcclxuICAgICAgICBcInByb2R1Y3RuYW1lXCIsXHJcbiAgICAgICAgXCJiZW4xXCIsXHJcbiAgICAgICAgXCJiZW4yXCIsXHJcbiAgICAgICAgXCJiZW4zXCJcclxuICAgIF0sXHJcbiAgICBcInBpdGNoX2NiXzNcIjogW1xyXG4gICAgICAgIFwic2Nlbm5hcmlvX3BzdFwiLFxyXG4gICAgICAgIFwiYWx0X2hhcFwiLFxyXG4gICAgICAgIFwiYWx0X2NvbnNcIixcclxuICAgICAgICBcImFsdF9ub2NvbnNcIixcclxuICAgICAgICBcInByb2R1Y3RuYW1lXCIsXHJcbiAgICAgICAgXCJiZW4xXCIsXHJcbiAgICAgICAgXCJiZW4yXCIsXHJcbiAgICAgICAgXCJiZW4zXCIsXHJcbiAgICAgICAgXCJhbHRiZW4xXCIsXHJcbiAgICAgICAgXCJhbHRiZW4yXCIsXHJcbiAgICAgICAgXCJhbHRiZW4zXCIsXHJcbiAgICAgICAgXCJkaXN0XCIsXHJcbiAgICAgICAgXCJiZW5fcHN0XCIsXHJcbiAgICAgICAgXCJleHBcIixcclxuICAgICAgICBcInByb2R1Y3R0YWdcIlxyXG4gICAgXSxcclxuICAgIFwicGl0Y2hfY2JfNFwiOiBbXHJcbiAgICAgICAgXCJjdXN0b21lcm5hbWVcIixcclxuICAgICAgICBcInNjZW5uYXJpb19wdFwiLFxyXG4gICAgICAgIFwidHJpZ2dlcl9wdFwiLFxyXG4gICAgICAgIFwiZGlzdFwiLFxyXG4gICAgICAgIFwiYmVuX3BzdFwiLFxyXG4gICAgICAgIFwiZXhwXCJcclxuICAgIF1cclxufTtcclxuXHJcbnZhciBzZWNsdmxfcGdyb3VwcyA9IHtcclxuICAgIFwiY3VzdG9tZXJuYW1lX2RpdlwiOiBcImN1c3RvbWVybmFtZV9kaXZcIixcclxuICAgIFwic2Nlbm5hcmlvX3B0X2RpdlwiOiBcInNjZW5uYXJpb1wiLFxyXG4gICAgXCJzY2VubmFyaW9fcHN0X2RpdlwiOiBcInNjZW5uYXJpb1wiLFxyXG4gICAgXCJzY2VubmFyaW9fY29tcF9kaXZcIjogXCJzY2VubmFyaW9fY29tcF9kaXZcIixcclxuICAgIFwic3RhdHVzcXVvX3NvbF9kaXZcIjogXCJzdGF0dXNxdW9fc29sX2RpdlwiLFxyXG4gICAgXCJ0cmlnZ2VyX3B0X2RpdlwiOiBcInRyaWdnZXJcIixcclxuICAgIFwidHJpZ2dlcl9wc3RfZGl2XCI6IFwidHJpZ2dlclwiLFxyXG4gICAgXCJwcm9kdWN0bmFtZV9kaXZcIjogXCJwcm9kdWN0bmFtZV9kaXZcIixcclxuICAgIFwicHJvZHVjdHRhZ19kaXZcIjogXCJwcm9kdWN0dGFnX2RpdlwiLFxyXG4gICAgXCJiZW4xX2RpdlwiOiBcImJlbmVmaXRfdGFibGVcIixcclxuICAgIFwiYmVuMl9kaXZcIjogXCJiZW5lZml0X3RhYmxlXCIsXHJcbiAgICBcImJlbjNfZGl2XCI6IFwiYmVuZWZpdF90YWJsZVwiLFxyXG4gICAgXCJhbHRiZW4xX2RpdlwiOiBcImJlbmVmaXRfdGFibGVcIixcclxuICAgIFwiYWx0YmVuMl9kaXZcIjogXCJiZW5lZml0X3RhYmxlXCIsXHJcbiAgICBcImFsdGJlbjNfZGl2XCI6IFwiYmVuZWZpdF90YWJsZVwiLFxyXG4gICAgXCJiZW5fcHN0X2RpdlwiOiBcInN1bV9iZW5cIixcclxuICAgIFwiYmVuX2ltcF9kaXZcIjogXCJzdW1fYmVuXCIsXHJcbiAgICBcImFsdF9zaG91bGRfZGl2XCI6IFwiYWx0X3Nob3VsZF9kaXZcIixcclxuICAgIFwiYWx0X2hhcF9kaXZcIjogXCJhbHRfaGFwX2RpdlwiLFxyXG4gICAgXCJhbHRfY29uc19kaXZcIjogXCJhbHRfY29uc19kaXZcIixcclxuICAgIFwiYWx0X25vY29uc19kaXZcIjogXCJhbHRfbm9jb25zX2RpdlwiLFxyXG4gICAgXCJleHBfZGl2XCI6IFwiZXhwX2RpdlwiLFxyXG4gICAgXCJkaXN0X2RpdlwiOiBcImRpc3RfZGl2XCIsXHJcbiAgICBcInJlbGV2X2RpdlwiOiBcInJlbGV2X2RpdlwiLFxyXG4gICAgXCJxcGFpbl9kaXZcIjogXCJxcGFpbl9kaXZcIixcclxuICAgIFwiYXBhaW5fZGl2XCI6IFwiYXBhaW5fZGl2XCIsXHJcbiAgICBcInFkaWZmX2RpdlwiOiBcInFkaWZmX2RpdlwiXHJcbn07XHJcblxyXG52YXIgZmlyc3RsdmxfcGdyb3VwcyA9IHtcclxuICAgIFwiY3VzdG9tZXJuYW1lX2RpdlwiOiBcIjBcIixcclxuICAgIFwic2Nlbm5hcmlvXCI6IFwiMVwiLFxyXG4gICAgXCJzY2VubmFyaW9fY29tcF9kaXZcIjogXCIxXCIsXHJcbiAgICBcInRyaWdnZXJcIjogXCIxXCIsXHJcbiAgICBcInN0YXR1c3F1b19zb2xfZGl2XCI6IFwiMVwiLFxyXG4gICAgXCJwcm9kdWN0bmFtZV9kaXZcIjogXCIyXCIsXHJcbiAgICBcInByb2R1Y3R0YWdfZGl2XCI6IFwiMlwiLFxyXG4gICAgXCJiZW5lZml0X3RhYmxlXCI6IFwiMlwiLFxyXG4gICAgXCJzdW1fYmVuXCI6IFwiMlwiLFxyXG4gICAgXCJhbHRfc2hvdWxkX2RpdlwiOiBcIjJcIixcclxuICAgIFwiYWx0X2hhcF9kaXZcIjogXCIyXCIsXHJcbiAgICBcImFsdF9jb25zX2RpdlwiOiBcIjJcIixcclxuICAgIFwiYWx0X25vY29uc19kaXZcIjogXCIyXCIsXHJcbiAgICBcImV4cF9kaXZcIjogXCIyXCIsXHJcbiAgICBcImRpc3RfZGl2XCI6IFwiMlwiLFxyXG4gICAgXCJyZWxldl9kaXZcIjogXCIzXCIsXHJcbiAgICBcInFwYWluX2RpdlwiOiBcIjNcIixcclxuICAgIFwiYXBhaW5fZGl2XCI6IFwiM1wiLFxyXG4gICAgXCJxZGlmZl9kaXZcIjogXCIzXCJcclxufTtcclxuXHJcbnZhciBlc2NvbmRlID0gW1xyXG4gICAgXCJjdXN0b21lcm5hbWVfZGl2XCIsXHJcbiAgICBcInNjZW5uYXJpb1wiLFxyXG4gICAgXCJzY2VubmFyaW9fY29tcF9kaXZcIixcclxuICAgIFwidHJpZ2dlclwiLFxyXG4gICAgXCJzdGF0dXNxdW9fc29sX2RpdlwiLFxyXG4gICAgXCJwcm9kdWN0bmFtZV9kaXZcIixcclxuICAgIFwicHJvZHVjdHRhZ19kaXZcIixcclxuICAgIFwiYmVuZWZpdF90YWJsZVwiLFxyXG4gICAgXCJzdW1fYmVuXCIsXHJcbiAgICBcImFsdF9zaG91bGRfZGl2XCIsXHJcbiAgICBcImFsdF9oYXBfZGl2XCIsXHJcbiAgICBcImFsdF9jb25zX2RpdlwiLFxyXG4gICAgXCJhbHRfbm9jb25zX2RpdlwiLFxyXG4gICAgXCJleHBfZGl2XCIsXHJcbiAgICBcImRpc3RfZGl2XCIsXHJcbiAgICBcInJlbGV2X2RpdlwiLFxyXG4gICAgXCJxcGFpbl9kaXZcIixcclxuICAgIFwiYXBhaW5fZGl2XCIsXHJcbiAgICBcInFkaWZmX2RpdlwiXHJcbl07XHJcblxyXG52YXIgZXNjb25kZV9jb2xsYXBzYWJsZSA9IFtcIjBcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIl07XHJcblxyXG52YXIgbW9zdHJhX2NvbGxhcHNhYmxlID0gW107XHJcblxyXG52YXIgbW9zdHJhID0gW107XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vLyBDbGlwYm9hcmQgU3lzdGVtXHJcblxyXG52YXIgY2xpcCA9IG5ldyBDbGlwYm9hcmQoJy5jbGlwJyk7XHJcblxyXG5jbGlwLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS50cmlnZ2VyLmlubmVySFRNTCA9ICdDb3BpZWQhJztcclxuICAgIGUuY2xlYXJTZWxlY3Rpb24oKTtcclxufSk7XHJcblxyXG5jbGlwLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUudHJpZ2dlci5pbm5lckhUTUwgPSBmYWxsYmFja01lc3NhZ2UoZS5hY3Rpb24pO1xyXG4gICAgZS5jbGVhclNlbGVjdGlvbigpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGZhbGxiYWNrTWVzc2FnZShhY3Rpb24pIHtcclxuICAgIHZhciBhY3Rpb25Nc2cgPSAnJztcclxuICAgIHZhciBhY3Rpb25LZXkgPSAoYWN0aW9uID09PSAnY3V0JyA/ICdYJyA6ICdDJyk7XHJcbiAgICBpZiAoL2lQaG9uZXxpUGFkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgIGFjdGlvbk1zZyA9ICdObyBzdXBwb3J0IDooJztcclxuICAgIH0gZWxzZSBpZiAoL01hYy9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcclxuICAgICAgICBhY3Rpb25Nc2cgPSAnUHJlc3Mg4oyYLScgKyBhY3Rpb25LZXkgKyAnIHRvICcgKyBhY3Rpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFjdGlvbk1zZyA9ICdQcmVzcyBDdHJsLScgKyBhY3Rpb25LZXkgKyAnIHRvICcgKyBhY3Rpb247XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWN0aW9uTXNnO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLy8gUG9wdWxhdGUgdGhlIHBpdGNoZXMgaW4gZG9jdW1lbnQgc3RhcnRcclxuLy8gV3JpdGUgdGhlIHRleHQgKHZhbHVlKSBvZiBhbGwgaW5wdXRzIChrZXkpIGludG8gdGhlIHNwYW4gdGV4dHMuXHJcbiQuZWFjaChwaXRjaF9pbnB1dHMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgIC8vIFZlcmlmeSBpZiBpbnB1dHMgaGF2ZSBzb21ldGhpbmcgd3JpdGVkLlxyXG4gICAgaWYgKCQoXCIjXCIgKyBrZXkpLnZhbCgpICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdmFsdWUgPSAkKFwiI1wiICsga2V5KS52YWwoKTtcclxuICAgICAgICAvLyBXcml0ZSB0aGUgdGV4dCBvZiBpbnB1dCBpbnRvIHRoZSBzcGFuIHRhZ3MgaW4gdGhlIHBpdGNoZXNcclxuICAgICAgICAkKCcuJyArIGtleSArIFwiX3NwYW5cIikudGV4dCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvLyBFdmVudCBvbiBrZXl1cFxyXG4gICAgJChcIiNcIiArIGtleSkua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFsdWUgPSAkKFwiI1wiICsga2V5KS52YWwoKTtcclxuICAgICAgICAkKCcuJyArIGtleSArIFwiX3NwYW5cIikudGV4dCh2YWx1ZSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4vLyBFc2NvbmRlIHRvZGFzIGFzIHF1ZXN0w7Vlc1xyXG5waXRjaF9jaGVjay5mb3JFYWNoKFxyXG4gICAgZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAkKCcucGl0Y2hfY2InKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJldmVudG8gcmVnaXN0YWRvXCIpO1xyXG4gICAgICAgICAgICBwaXRjaF92YXJpYWJsZXNbaWRdLmZvckVhY2goXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJChcIiNcIiArIGlkKS5ub3QoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIGIgKyBcIl9kaXZcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3N0cmEuc3BsaWNlKG1vc3RyYS5pbmRleE9mKGIgKyBcIl9kaXZcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IHNlY2x2bF9wZ3JvdXBzW2IgKyBcIl9kaXZcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBmaXJzdGx2bF9wZ3JvdXBzW3NdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3N0cmFfY29sbGFwc2FibGUuc3BsaWNlKG1vc3RyYV9jb2xsYXBzYWJsZS5pbmRleE9mKHYpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNwbGljZSBwYXJhIG1vc3RyYV9jb2xsYXBzYWJsZSBkZSBcIiArIHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTsgLy9mb3JFYWNoIHBpdGNoIElucHV0c1xyXG4gICAgICAgIH0pOyAvL2V2ZW50XHJcbiAgICB9IC8vZnVuY3Rpb24oaWQpXHJcbik7IC8vZm9yRWFjaFxyXG5cclxuLy9hcHJlc2VudGEgYXBlbmFzIGFzIHF1ZXN0w7VlcyBuZWNlc3PDoXJpYXNcclxucGl0Y2hfY2hlY2suZm9yRWFjaChcclxuICAgIGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgJCgnLnBpdGNoX2NiJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZXZlbnRvIHJlZ2lzdGFkb1wiKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIHBpdGNoX3ZhcmlhYmxlc1tpZF0uZm9yRWFjaChmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICQoXCIjXCIgKyBpZCkuaXMoJzpjaGVja2VkJylcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzaG93IFwiICsgYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIGEgKyBcIl9kaXZcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RyYS5wdXNoKGEgKyBcIl9kaXZcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHcgPSBzZWNsdmxfcGdyb3Vwc1thICsgXCJfZGl2XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHQgPSBmaXJzdGx2bF9wZ3JvdXBzW3ddO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vc3RyYV9jb2xsYXBzYWJsZS5wdXNoKHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoIHBhcmEgbW9zdHJhX2NvbGxhcHNhYmxlIGRlIFwiICsgdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAvL3BpdGNodmFyaWFibGVfZm9yRWFjaFxyXG4gICAgICAgICAgICAvLyBNdWRhciB0ZXh0byBhbnRlcyBkb3MgY29sbGFwc2FibGVzLlxyXG4gICAgICAgICAgICBpZiAobW9zdHJhX2NvbGxhcHNhYmxlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNwX3llc1wiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3Bfbm9cIikuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNwX3llc1wiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3Bfbm9cIikuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IC8vZXZlbnRcclxuICAgIH0gLy9mdW5jdGlvbihpZClcclxuKTsgLy9mb3JFYWNoXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQoXCIjcF9ub1wiKS5oaWRlKCk7XHJcbn0pO1xyXG5cclxuLy8gdsOqIHF1YWlzIGRhcyBxdWVzdMO1ZXMgZXN0w6NvIGNvbSBkaXNwbGF5PW5vbmUgZSBmYXogZGVzYXBhcmVjZXIgdGV4dG8gZSBjb2xsYXBzYWJsZXMgYWNlc3PDs3Jpb3MuXHJcbiQoJy5waXRjaF9jYicpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgIGVzY29uZGUuZm9yRWFjaChcclxuICAgICAgICBmdW5jdGlvbihnKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJoaWRlIFwiICsgZyk7XHJcbiAgICAgICAgICAgICQoXCIuXCIgKyBnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTsgLy9lc2NvbmRlIGZvckVhY2hcclxuXHJcbiAgICBlc2NvbmRlX2NvbGxhcHNhYmxlLmZvckVhY2goXHJcbiAgICAgICAgZnVuY3Rpb24obnJfY29sbGFwc2FibGUpIHtcclxuICAgICAgICAgICAgJChcIiNwYW5lbFwiICsgbnJfY29sbGFwc2FibGUpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICApOyAvL2VzY29uZGVfY29sbGFwc2FibGVcclxuXHJcbiAgICBtb3N0cmEuZm9yRWFjaChcclxuICAgICAgICBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICBhID0gc2VjbHZsX3Bncm91cHNbaWRdO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2hvdyBcIiArIGEpO1xyXG4gICAgICAgICAgICAkKFwiLlwiICsgYSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICk7IC8vbW9zdHJhIGZvcmVhY2hcclxuXHJcbiAgICBtb3N0cmFfY29sbGFwc2FibGUuZm9yRWFjaChcclxuICAgICAgICBmdW5jdGlvbihucl9jb2xsYXBzYWJsZSkge1xyXG4gICAgICAgICAgICAkKFwiI3BhbmVsXCIgKyBucl9jb2xsYXBzYWJsZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICk7IC8vbW9zdHJhX2NvbGxhcHNhYmxlXHJcblxyXG59KTsgLy9ldmVudCJdfQ==
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/automatic_pitch_machine.js","/")
},{"9FoBSB":11,"buffer":3,"clipboard":5}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGJhc2U2NC1qc1xcbGliXFxiNjQuanMiXSwibmFtZXMiOlsibG9va3VwIiwiZXhwb3J0cyIsIkFyciIsIlVpbnQ4QXJyYXkiLCJBcnJheSIsIlBMVVMiLCJjaGFyQ29kZUF0IiwiU0xBU0giLCJOVU1CRVIiLCJMT1dFUiIsIlVQUEVSIiwiUExVU19VUkxfU0FGRSIsIlNMQVNIX1VSTF9TQUZFIiwiZGVjb2RlIiwiZWx0IiwiY29kZSIsImI2NFRvQnl0ZUFycmF5IiwiYjY0IiwiaSIsImoiLCJsIiwidG1wIiwicGxhY2VIb2xkZXJzIiwiYXJyIiwibGVuZ3RoIiwiRXJyb3IiLCJsZW4iLCJjaGFyQXQiLCJMIiwicHVzaCIsInYiLCJ1aW50OFRvQmFzZTY0IiwidWludDgiLCJleHRyYUJ5dGVzIiwib3V0cHV0IiwidGVtcCIsImVuY29kZSIsIm51bSIsInRyaXBsZXRUb0Jhc2U2NCIsInRvQnl0ZUFycmF5IiwiZnJvbUJ5dGVBcnJheSIsImJhc2U2NGpzIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxTQUFTLGtFQUFiOztBQUVBLENBQUUsV0FBVUMsT0FBVixFQUFtQjtBQUNwQjs7QUFFQyxLQUFJQyxNQUFPLE9BQU9DLFVBQVAsS0FBc0IsV0FBdkIsR0FDTkEsVUFETSxHQUVOQyxLQUZKOztBQUlELEtBQUlDLE9BQVMsSUFBSUMsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlDLFFBQVMsSUFBSUQsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlFLFNBQVMsSUFBSUYsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlHLFFBQVMsSUFBSUgsVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlJLFFBQVMsSUFBSUosVUFBSixDQUFlLENBQWYsQ0FBYjtBQUNBLEtBQUlLLGdCQUFnQixJQUFJTCxVQUFKLENBQWUsQ0FBZixDQUFwQjtBQUNBLEtBQUlNLGlCQUFpQixJQUFJTixVQUFKLENBQWUsQ0FBZixDQUFyQjs7QUFFQSxVQUFTTyxNQUFULENBQWlCQyxHQUFqQixFQUFzQjtBQUNyQixNQUFJQyxPQUFPRCxJQUFJUixVQUFKLENBQWUsQ0FBZixDQUFYO0FBQ0EsTUFBSVMsU0FBU1YsSUFBVCxJQUNBVSxTQUFTSixhQURiLEVBRUMsT0FBTyxFQUFQLENBSm9CLENBSVY7QUFDWCxNQUFJSSxTQUFTUixLQUFULElBQ0FRLFNBQVNILGNBRGIsRUFFQyxPQUFPLEVBQVAsQ0FQb0IsQ0FPVjtBQUNYLE1BQUlHLE9BQU9QLE1BQVgsRUFDQyxPQUFPLENBQUMsQ0FBUixDQVRvQixDQVNWO0FBQ1gsTUFBSU8sT0FBT1AsU0FBUyxFQUFwQixFQUNDLE9BQU9PLE9BQU9QLE1BQVAsR0FBZ0IsRUFBaEIsR0FBcUIsRUFBNUI7QUFDRCxNQUFJTyxPQUFPTCxRQUFRLEVBQW5CLEVBQ0MsT0FBT0ssT0FBT0wsS0FBZDtBQUNELE1BQUlLLE9BQU9OLFFBQVEsRUFBbkIsRUFDQyxPQUFPTSxPQUFPTixLQUFQLEdBQWUsRUFBdEI7QUFDRDs7QUFFRCxVQUFTTyxjQUFULENBQXlCQyxHQUF6QixFQUE4QjtBQUM3QixNQUFJQyxDQUFKLEVBQU9DLENBQVAsRUFBVUMsQ0FBVixFQUFhQyxHQUFiLEVBQWtCQyxZQUFsQixFQUFnQ0MsR0FBaEM7O0FBRUEsTUFBSU4sSUFBSU8sTUFBSixHQUFhLENBQWIsR0FBaUIsQ0FBckIsRUFBd0I7QUFDdkIsU0FBTSxJQUFJQyxLQUFKLENBQVUsZ0RBQVYsQ0FBTjtBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJQyxNQUFNVCxJQUFJTyxNQUFkO0FBQ0FGLGlCQUFlLFFBQVFMLElBQUlVLE1BQUosQ0FBV0QsTUFBTSxDQUFqQixDQUFSLEdBQThCLENBQTlCLEdBQWtDLFFBQVFULElBQUlVLE1BQUosQ0FBV0QsTUFBTSxDQUFqQixDQUFSLEdBQThCLENBQTlCLEdBQWtDLENBQW5GOztBQUVBO0FBQ0FILFFBQU0sSUFBSXJCLEdBQUosQ0FBUWUsSUFBSU8sTUFBSixHQUFhLENBQWIsR0FBaUIsQ0FBakIsR0FBcUJGLFlBQTdCLENBQU47O0FBRUE7QUFDQUYsTUFBSUUsZUFBZSxDQUFmLEdBQW1CTCxJQUFJTyxNQUFKLEdBQWEsQ0FBaEMsR0FBb0NQLElBQUlPLE1BQTVDOztBQUVBLE1BQUlJLElBQUksQ0FBUjs7QUFFQSxXQUFTQyxJQUFULENBQWVDLENBQWYsRUFBa0I7QUFDakJQLE9BQUlLLEdBQUosSUFBV0UsQ0FBWDtBQUNBOztBQUVELE9BQUtaLElBQUksQ0FBSixFQUFPQyxJQUFJLENBQWhCLEVBQW1CRCxJQUFJRSxDQUF2QixFQUEwQkYsS0FBSyxDQUFMLEVBQVFDLEtBQUssQ0FBdkMsRUFBMEM7QUFDekNFLFNBQU9SLE9BQU9JLElBQUlVLE1BQUosQ0FBV1QsQ0FBWCxDQUFQLEtBQXlCLEVBQTFCLEdBQWlDTCxPQUFPSSxJQUFJVSxNQUFKLENBQVdULElBQUksQ0FBZixDQUFQLEtBQTZCLEVBQTlELEdBQXFFTCxPQUFPSSxJQUFJVSxNQUFKLENBQVdULElBQUksQ0FBZixDQUFQLEtBQTZCLENBQWxHLEdBQXVHTCxPQUFPSSxJQUFJVSxNQUFKLENBQVdULElBQUksQ0FBZixDQUFQLENBQTdHO0FBQ0FXLFFBQUssQ0FBQ1IsTUFBTSxRQUFQLEtBQW9CLEVBQXpCO0FBQ0FRLFFBQUssQ0FBQ1IsTUFBTSxNQUFQLEtBQWtCLENBQXZCO0FBQ0FRLFFBQUtSLE1BQU0sSUFBWDtBQUNBOztBQUVELE1BQUlDLGlCQUFpQixDQUFyQixFQUF3QjtBQUN2QkQsU0FBT1IsT0FBT0ksSUFBSVUsTUFBSixDQUFXVCxDQUFYLENBQVAsS0FBeUIsQ0FBMUIsR0FBZ0NMLE9BQU9JLElBQUlVLE1BQUosQ0FBV1QsSUFBSSxDQUFmLENBQVAsS0FBNkIsQ0FBbkU7QUFDQVcsUUFBS1IsTUFBTSxJQUFYO0FBQ0EsR0FIRCxNQUdPLElBQUlDLGlCQUFpQixDQUFyQixFQUF3QjtBQUM5QkQsU0FBT1IsT0FBT0ksSUFBSVUsTUFBSixDQUFXVCxDQUFYLENBQVAsS0FBeUIsRUFBMUIsR0FBaUNMLE9BQU9JLElBQUlVLE1BQUosQ0FBV1QsSUFBSSxDQUFmLENBQVAsS0FBNkIsQ0FBOUQsR0FBb0VMLE9BQU9JLElBQUlVLE1BQUosQ0FBV1QsSUFBSSxDQUFmLENBQVAsS0FBNkIsQ0FBdkc7QUFDQVcsUUFBTVIsT0FBTyxDQUFSLEdBQWEsSUFBbEI7QUFDQVEsUUFBS1IsTUFBTSxJQUFYO0FBQ0E7O0FBRUQsU0FBT0UsR0FBUDtBQUNBOztBQUVELFVBQVNRLGFBQVQsQ0FBd0JDLEtBQXhCLEVBQStCO0FBQzlCLE1BQUlkLENBQUo7QUFBQSxNQUNDZSxhQUFhRCxNQUFNUixNQUFOLEdBQWUsQ0FEN0I7QUFBQSxNQUNnQztBQUMvQlUsV0FBUyxFQUZWO0FBQUEsTUFHQ0MsSUFIRDtBQUFBLE1BR09YLE1BSFA7O0FBS0EsV0FBU1ksTUFBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDckIsVUFBT3JDLE9BQU8yQixNQUFQLENBQWNVLEdBQWQsQ0FBUDtBQUNBOztBQUVELFdBQVNDLGVBQVQsQ0FBMEJELEdBQTFCLEVBQStCO0FBQzlCLFVBQU9ELE9BQU9DLE9BQU8sRUFBUCxHQUFZLElBQW5CLElBQTJCRCxPQUFPQyxPQUFPLEVBQVAsR0FBWSxJQUFuQixDQUEzQixHQUFzREQsT0FBT0MsT0FBTyxDQUFQLEdBQVcsSUFBbEIsQ0FBdEQsR0FBZ0ZELE9BQU9DLE1BQU0sSUFBYixDQUF2RjtBQUNBOztBQUVEO0FBQ0EsT0FBS25CLElBQUksQ0FBSixFQUFPTSxTQUFTUSxNQUFNUixNQUFOLEdBQWVTLFVBQXBDLEVBQWdEZixJQUFJTSxNQUFwRCxFQUE0RE4sS0FBSyxDQUFqRSxFQUFvRTtBQUNuRWlCLFVBQU8sQ0FBQ0gsTUFBTWQsQ0FBTixLQUFZLEVBQWIsS0FBb0JjLE1BQU1kLElBQUksQ0FBVixLQUFnQixDQUFwQyxJQUEwQ2MsTUFBTWQsSUFBSSxDQUFWLENBQWpEO0FBQ0FnQixhQUFVSSxnQkFBZ0JILElBQWhCLENBQVY7QUFDQTs7QUFFRDtBQUNBLFVBQVFGLFVBQVI7QUFDQyxRQUFLLENBQUw7QUFDQ0UsV0FBT0gsTUFBTUEsTUFBTVIsTUFBTixHQUFlLENBQXJCLENBQVA7QUFDQVUsY0FBVUUsT0FBT0QsUUFBUSxDQUFmLENBQVY7QUFDQUQsY0FBVUUsT0FBUUQsUUFBUSxDQUFULEdBQWMsSUFBckIsQ0FBVjtBQUNBRCxjQUFVLElBQVY7QUFDQTtBQUNELFFBQUssQ0FBTDtBQUNDQyxXQUFPLENBQUNILE1BQU1BLE1BQU1SLE1BQU4sR0FBZSxDQUFyQixLQUEyQixDQUE1QixJQUFrQ1EsTUFBTUEsTUFBTVIsTUFBTixHQUFlLENBQXJCLENBQXpDO0FBQ0FVLGNBQVVFLE9BQU9ELFFBQVEsRUFBZixDQUFWO0FBQ0FELGNBQVVFLE9BQVFELFFBQVEsQ0FBVCxHQUFjLElBQXJCLENBQVY7QUFDQUQsY0FBVUUsT0FBUUQsUUFBUSxDQUFULEdBQWMsSUFBckIsQ0FBVjtBQUNBRCxjQUFVLEdBQVY7QUFDQTtBQWJGOztBQWdCQSxTQUFPQSxNQUFQO0FBQ0E7O0FBRURqQyxTQUFRc0MsV0FBUixHQUFzQnZCLGNBQXRCO0FBQ0FmLFNBQVF1QyxhQUFSLEdBQXdCVCxhQUF4QjtBQUNBLENBekhDLEVBeUhBLE9BQU85QixPQUFQLEtBQW1CLFdBQW5CLEdBQWtDLEtBQUt3QyxRQUFMLEdBQWdCLEVBQWxELEdBQXdEeEMsT0F6SHhELENBQUQiLCJmaWxlIjoiYjY0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\base64-js\\lib\\b64.js","/..\\..\\..\\node_modules\\base64-js\\lib")
},{"9FoBSB":11,"buffer":3}],3:[function(require,module,exports){
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
},{"9FoBSB":11,"base64-js":2,"buffer":3,"ieee754":10}],4:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3,"select":12}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWd0ZWlcXERvY3VtZW50c1xcZ2l0aHViXFxpZGVhbmluamFfZGV2XFxub2RlX21vZHVsZXNcXGNsaXBib2FyZFxcbGliXFxjbGlwYm9hcmQuanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwibW9kIiwiY2xpcGJvYXJkQWN0aW9uIiwidGlueUVtaXR0ZXIiLCJnb29kTGlzdGVuZXIiLCJjbGlwYm9hcmQiLCJfY2xpcGJvYXJkQWN0aW9uIiwiX3RpbnlFbWl0dGVyIiwiX2dvb2RMaXN0ZW5lciIsIl9jbGlwYm9hcmRBY3Rpb24yIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl90aW55RW1pdHRlcjIiLCJfZ29vZExpc3RlbmVyMiIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX3R5cGVvZiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJpbnN0YW5jZSIsIkNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuIiwic2VsZiIsImNhbGwiLCJSZWZlcmVuY2VFcnJvciIsIl9pbmhlcml0cyIsInN1YkNsYXNzIiwic3VwZXJDbGFzcyIsImNyZWF0ZSIsInZhbHVlIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJDbGlwYm9hcmQiLCJfRW1pdHRlciIsInRyaWdnZXIiLCJvcHRpb25zIiwiX3RoaXMiLCJnZXRQcm90b3R5cGVPZiIsInJlc29sdmVPcHRpb25zIiwibGlzdGVuQ2xpY2siLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJhY3Rpb24iLCJkZWZhdWx0QWN0aW9uIiwiZGVmYXVsdFRhcmdldCIsInRleHQiLCJkZWZhdWx0VGV4dCIsImNvbnRhaW5lciIsImRvY3VtZW50IiwiYm9keSIsIl90aGlzMiIsImxpc3RlbmVyIiwiZSIsIm9uQ2xpY2siLCJkZWxlZ2F0ZVRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJlbWl0dGVyIiwiZ2V0QXR0cmlidXRlVmFsdWUiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3IiLCJkZXN0cm95IiwiaXNTdXBwb3J0ZWQiLCJhY3Rpb25zIiwic3VwcG9ydCIsInF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCIsImZvckVhY2giLCJzdWZmaXgiLCJlbGVtZW50IiwiYXR0cmlidXRlIiwiaGFzQXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVVBLE1BQVYsRUFBa0JDLE9BQWxCLEVBQTJCO0FBQ3hCLFFBQUksT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBM0MsRUFBZ0Q7QUFDNUNELGVBQU8sQ0FBQyxRQUFELEVBQVcsb0JBQVgsRUFBaUMsY0FBakMsRUFBaUQsZUFBakQsQ0FBUCxFQUEwRUQsT0FBMUU7QUFDSCxLQUZELE1BRU8sSUFBSSxPQUFPRyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ3ZDSCxnQkFBUUksTUFBUixFQUFnQkMsUUFBUSxvQkFBUixDQUFoQixFQUErQ0EsUUFBUSxjQUFSLENBQS9DLEVBQXdFQSxRQUFRLGVBQVIsQ0FBeEU7QUFDSCxLQUZNLE1BRUE7QUFDSCxZQUFJQyxNQUFNO0FBQ05ILHFCQUFTO0FBREgsU0FBVjtBQUdBSCxnQkFBUU0sR0FBUixFQUFhUCxPQUFPUSxlQUFwQixFQUFxQ1IsT0FBT1MsV0FBNUMsRUFBeURULE9BQU9VLFlBQWhFO0FBQ0FWLGVBQU9XLFNBQVAsR0FBbUJKLElBQUlILE9BQXZCO0FBQ0g7QUFDSixDQVpELEVBWUcsSUFaSCxFQVlTLFVBQVVDLE1BQVYsRUFBa0JPLGdCQUFsQixFQUFvQ0MsWUFBcEMsRUFBa0RDLGFBQWxELEVBQWlFO0FBQ3RFOztBQUVBLFFBQUlDLG9CQUFvQkMsdUJBQXVCSixnQkFBdkIsQ0FBeEI7O0FBRUEsUUFBSUssZ0JBQWdCRCx1QkFBdUJILFlBQXZCLENBQXBCOztBQUVBLFFBQUlLLGlCQUFpQkYsdUJBQXVCRixhQUF2QixDQUFyQjs7QUFFQSxhQUFTRSxzQkFBVCxDQUFnQ0csR0FBaEMsRUFBcUM7QUFDakMsZUFBT0EsT0FBT0EsSUFBSUMsVUFBWCxHQUF3QkQsR0FBeEIsR0FBOEI7QUFDakNFLHFCQUFTRjtBQUR3QixTQUFyQztBQUdIOztBQUVELFFBQUlHLFVBQVUsT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPQSxPQUFPQyxRQUFkLEtBQTJCLFFBQTNELEdBQXNFLFVBQVVMLEdBQVYsRUFBZTtBQUMvRixlQUFPLE9BQU9BLEdBQWQ7QUFDSCxLQUZhLEdBRVYsVUFBVUEsR0FBVixFQUFlO0FBQ2YsZUFBT0EsT0FBTyxPQUFPSSxNQUFQLEtBQWtCLFVBQXpCLElBQXVDSixJQUFJTSxXQUFKLEtBQW9CRixNQUEzRCxJQUFxRUosUUFBUUksT0FBT0csU0FBcEYsR0FBZ0csUUFBaEcsR0FBMkcsT0FBT1AsR0FBekg7QUFDSCxLQUpEOztBQU1BLGFBQVNRLGVBQVQsQ0FBeUJDLFFBQXpCLEVBQW1DQyxXQUFuQyxFQUFnRDtBQUM1QyxZQUFJLEVBQUVELG9CQUFvQkMsV0FBdEIsQ0FBSixFQUF3QztBQUNwQyxrQkFBTSxJQUFJQyxTQUFKLENBQWMsbUNBQWQsQ0FBTjtBQUNIO0FBQ0o7O0FBRUQsUUFBSUMsZUFBZSxZQUFZO0FBQzNCLGlCQUFTQyxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLEVBQXlDO0FBQ3JDLGlCQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsTUFBTUUsTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDO0FBQ25DLG9CQUFJRSxhQUFhSCxNQUFNQyxDQUFOLENBQWpCO0FBQ0FFLDJCQUFXQyxVQUFYLEdBQXdCRCxXQUFXQyxVQUFYLElBQXlCLEtBQWpEO0FBQ0FELDJCQUFXRSxZQUFYLEdBQTBCLElBQTFCO0FBQ0Esb0JBQUksV0FBV0YsVUFBZixFQUEyQkEsV0FBV0csUUFBWCxHQUFzQixJQUF0QjtBQUMzQkMsdUJBQU9DLGNBQVAsQ0FBc0JULE1BQXRCLEVBQThCSSxXQUFXTSxHQUF6QyxFQUE4Q04sVUFBOUM7QUFDSDtBQUNKOztBQUVELGVBQU8sVUFBVVIsV0FBVixFQUF1QmUsVUFBdkIsRUFBbUNDLFdBQW5DLEVBQWdEO0FBQ25ELGdCQUFJRCxVQUFKLEVBQWdCWixpQkFBaUJILFlBQVlILFNBQTdCLEVBQXdDa0IsVUFBeEM7QUFDaEIsZ0JBQUlDLFdBQUosRUFBaUJiLGlCQUFpQkgsV0FBakIsRUFBOEJnQixXQUE5QjtBQUNqQixtQkFBT2hCLFdBQVA7QUFDSCxTQUpEO0FBS0gsS0FoQmtCLEVBQW5COztBQWtCQSxhQUFTaUIsMEJBQVQsQ0FBb0NDLElBQXBDLEVBQTBDQyxJQUExQyxFQUFnRDtBQUM1QyxZQUFJLENBQUNELElBQUwsRUFBVztBQUNQLGtCQUFNLElBQUlFLGNBQUosQ0FBbUIsMkRBQW5CLENBQU47QUFDSDs7QUFFRCxlQUFPRCxTQUFTLE9BQU9BLElBQVAsS0FBZ0IsUUFBaEIsSUFBNEIsT0FBT0EsSUFBUCxLQUFnQixVQUFyRCxJQUFtRUEsSUFBbkUsR0FBMEVELElBQWpGO0FBQ0g7O0FBRUQsYUFBU0csU0FBVCxDQUFtQkMsUUFBbkIsRUFBNkJDLFVBQTdCLEVBQXlDO0FBQ3JDLFlBQUksT0FBT0EsVUFBUCxLQUFzQixVQUF0QixJQUFvQ0EsZUFBZSxJQUF2RCxFQUE2RDtBQUN6RCxrQkFBTSxJQUFJdEIsU0FBSixDQUFjLDZEQUE2RCxPQUFPc0IsVUFBbEYsQ0FBTjtBQUNIOztBQUVERCxpQkFBU3pCLFNBQVQsR0FBcUJlLE9BQU9ZLE1BQVAsQ0FBY0QsY0FBY0EsV0FBVzFCLFNBQXZDLEVBQWtEO0FBQ25FRCx5QkFBYTtBQUNUNkIsdUJBQU9ILFFBREU7QUFFVGIsNEJBQVksS0FGSDtBQUdURSwwQkFBVSxJQUhEO0FBSVRELDhCQUFjO0FBSkw7QUFEc0QsU0FBbEQsQ0FBckI7QUFRQSxZQUFJYSxVQUFKLEVBQWdCWCxPQUFPYyxjQUFQLEdBQXdCZCxPQUFPYyxjQUFQLENBQXNCSixRQUF0QixFQUFnQ0MsVUFBaEMsQ0FBeEIsR0FBc0VELFNBQVNLLFNBQVQsR0FBcUJKLFVBQTNGO0FBQ25COztBQUVELFFBQUlLLFlBQVksVUFBVUMsUUFBVixFQUFvQjtBQUNoQ1Isa0JBQVVPLFNBQVYsRUFBcUJDLFFBQXJCOztBQUVBOzs7O0FBSUEsaUJBQVNELFNBQVQsQ0FBbUJFLE9BQW5CLEVBQTRCQyxPQUE1QixFQUFxQztBQUNqQ2pDLDRCQUFnQixJQUFoQixFQUFzQjhCLFNBQXRCOztBQUVBLGdCQUFJSSxRQUFRZiwyQkFBMkIsSUFBM0IsRUFBaUMsQ0FBQ1csVUFBVUQsU0FBVixJQUF1QmYsT0FBT3FCLGNBQVAsQ0FBc0JMLFNBQXRCLENBQXhCLEVBQTBEVCxJQUExRCxDQUErRCxJQUEvRCxDQUFqQyxDQUFaOztBQUVBYSxrQkFBTUUsY0FBTixDQUFxQkgsT0FBckI7QUFDQUMsa0JBQU1HLFdBQU4sQ0FBa0JMLE9BQWxCO0FBQ0EsbUJBQU9FLEtBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBT0E5QixxQkFBYTBCLFNBQWIsRUFBd0IsQ0FBQztBQUNyQmQsaUJBQUssZ0JBRGdCO0FBRXJCVyxtQkFBTyxTQUFTUyxjQUFULEdBQTBCO0FBQzdCLG9CQUFJSCxVQUFVSyxVQUFVN0IsTUFBVixHQUFtQixDQUFuQixJQUF3QjZCLFVBQVUsQ0FBVixNQUFpQkMsU0FBekMsR0FBcURELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxFQUFsRjs7QUFFQSxxQkFBS0UsTUFBTCxHQUFjLE9BQU9QLFFBQVFPLE1BQWYsS0FBMEIsVUFBMUIsR0FBdUNQLFFBQVFPLE1BQS9DLEdBQXdELEtBQUtDLGFBQTNFO0FBQ0EscUJBQUtuQyxNQUFMLEdBQWMsT0FBTzJCLFFBQVEzQixNQUFmLEtBQTBCLFVBQTFCLEdBQXVDMkIsUUFBUTNCLE1BQS9DLEdBQXdELEtBQUtvQyxhQUEzRTtBQUNBLHFCQUFLQyxJQUFMLEdBQVksT0FBT1YsUUFBUVUsSUFBZixLQUF3QixVQUF4QixHQUFxQ1YsUUFBUVUsSUFBN0MsR0FBb0QsS0FBS0MsV0FBckU7QUFDQSxxQkFBS0MsU0FBTCxHQUFpQmxELFFBQVFzQyxRQUFRWSxTQUFoQixNQUErQixRQUEvQixHQUEwQ1osUUFBUVksU0FBbEQsR0FBOERDLFNBQVNDLElBQXhGO0FBQ0g7QUFUb0IsU0FBRCxFQVVyQjtBQUNDL0IsaUJBQUssYUFETjtBQUVDVyxtQkFBTyxTQUFTVSxXQUFULENBQXFCTCxPQUFyQixFQUE4QjtBQUNqQyxvQkFBSWdCLFNBQVMsSUFBYjs7QUFFQSxxQkFBS0MsUUFBTCxHQUFnQixDQUFDLEdBQUcxRCxlQUFlRyxPQUFuQixFQUE0QnNDLE9BQTVCLEVBQXFDLE9BQXJDLEVBQThDLFVBQVVrQixDQUFWLEVBQWE7QUFDdkUsMkJBQU9GLE9BQU9HLE9BQVAsQ0FBZUQsQ0FBZixDQUFQO0FBQ0gsaUJBRmUsQ0FBaEI7QUFHSDtBQVJGLFNBVnFCLEVBbUJyQjtBQUNDbEMsaUJBQUssU0FETjtBQUVDVyxtQkFBTyxTQUFTd0IsT0FBVCxDQUFpQkQsQ0FBakIsRUFBb0I7QUFDdkIsb0JBQUlsQixVQUFVa0IsRUFBRUUsY0FBRixJQUFvQkYsRUFBRUcsYUFBcEM7O0FBRUEsb0JBQUksS0FBS3hFLGVBQVQsRUFBMEI7QUFDdEIseUJBQUtBLGVBQUwsR0FBdUIsSUFBdkI7QUFDSDs7QUFFRCxxQkFBS0EsZUFBTCxHQUF1QixJQUFJTyxrQkFBa0JNLE9BQXRCLENBQThCO0FBQ2pEOEMsNEJBQVEsS0FBS0EsTUFBTCxDQUFZUixPQUFaLENBRHlDO0FBRWpEMUIsNEJBQVEsS0FBS0EsTUFBTCxDQUFZMEIsT0FBWixDQUZ5QztBQUdqRFcsMEJBQU0sS0FBS0EsSUFBTCxDQUFVWCxPQUFWLENBSDJDO0FBSWpEYSwrQkFBVyxLQUFLQSxTQUppQztBQUtqRGIsNkJBQVNBLE9BTHdDO0FBTWpEc0IsNkJBQVM7QUFOd0MsaUJBQTlCLENBQXZCO0FBUUg7QUFqQkYsU0FuQnFCLEVBcUNyQjtBQUNDdEMsaUJBQUssZUFETjtBQUVDVyxtQkFBTyxTQUFTYyxhQUFULENBQXVCVCxPQUF2QixFQUFnQztBQUNuQyx1QkFBT3VCLGtCQUFrQixRQUFsQixFQUE0QnZCLE9BQTVCLENBQVA7QUFDSDtBQUpGLFNBckNxQixFQTBDckI7QUFDQ2hCLGlCQUFLLGVBRE47QUFFQ1csbUJBQU8sU0FBU2UsYUFBVCxDQUF1QlYsT0FBdkIsRUFBZ0M7QUFDbkMsb0JBQUl3QixXQUFXRCxrQkFBa0IsUUFBbEIsRUFBNEJ2QixPQUE1QixDQUFmOztBQUVBLG9CQUFJd0IsUUFBSixFQUFjO0FBQ1YsMkJBQU9WLFNBQVNXLGFBQVQsQ0FBdUJELFFBQXZCLENBQVA7QUFDSDtBQUNKO0FBUkYsU0ExQ3FCLEVBbURyQjtBQUNDeEMsaUJBQUssYUFETjtBQUVDVyxtQkFBTyxTQUFTaUIsV0FBVCxDQUFxQlosT0FBckIsRUFBOEI7QUFDakMsdUJBQU91QixrQkFBa0IsTUFBbEIsRUFBMEJ2QixPQUExQixDQUFQO0FBQ0g7QUFKRixTQW5EcUIsRUF3RHJCO0FBQ0NoQixpQkFBSyxTQUROO0FBRUNXLG1CQUFPLFNBQVMrQixPQUFULEdBQW1CO0FBQ3RCLHFCQUFLVCxRQUFMLENBQWNTLE9BQWQ7O0FBRUEsb0JBQUksS0FBSzdFLGVBQVQsRUFBMEI7QUFDdEIseUJBQUtBLGVBQUwsQ0FBcUI2RSxPQUFyQjtBQUNBLHlCQUFLN0UsZUFBTCxHQUF1QixJQUF2QjtBQUNIO0FBQ0o7QUFURixTQXhEcUIsQ0FBeEIsRUFrRUksQ0FBQztBQUNEbUMsaUJBQUssYUFESjtBQUVEVyxtQkFBTyxTQUFTZ0MsV0FBVCxHQUF1QjtBQUMxQixvQkFBSW5CLFNBQVNGLFVBQVU3QixNQUFWLEdBQW1CLENBQW5CLElBQXdCNkIsVUFBVSxDQUFWLE1BQWlCQyxTQUF6QyxHQUFxREQsVUFBVSxDQUFWLENBQXJELEdBQW9FLENBQUMsTUFBRCxFQUFTLEtBQVQsQ0FBakY7O0FBRUEsb0JBQUlzQixVQUFVLE9BQU9wQixNQUFQLEtBQWtCLFFBQWxCLEdBQTZCLENBQUNBLE1BQUQsQ0FBN0IsR0FBd0NBLE1BQXREO0FBQ0Esb0JBQUlxQixVQUFVLENBQUMsQ0FBQ2YsU0FBU2dCLHFCQUF6Qjs7QUFFQUYsd0JBQVFHLE9BQVIsQ0FBZ0IsVUFBVXZCLE1BQVYsRUFBa0I7QUFDOUJxQiw4QkFBVUEsV0FBVyxDQUFDLENBQUNmLFNBQVNnQixxQkFBVCxDQUErQnRCLE1BQS9CLENBQXZCO0FBQ0gsaUJBRkQ7O0FBSUEsdUJBQU9xQixPQUFQO0FBQ0g7QUFiQSxTQUFELENBbEVKOztBQWtGQSxlQUFPL0IsU0FBUDtBQUNILEtBM0dlLENBMkdkeEMsY0FBY0ksT0EzR0EsQ0FBaEI7O0FBNkdBOzs7OztBQUtBLGFBQVM2RCxpQkFBVCxDQUEyQlMsTUFBM0IsRUFBbUNDLE9BQW5DLEVBQTRDO0FBQ3hDLFlBQUlDLFlBQVksb0JBQW9CRixNQUFwQzs7QUFFQSxZQUFJLENBQUNDLFFBQVFFLFlBQVIsQ0FBcUJELFNBQXJCLENBQUwsRUFBc0M7QUFDbEM7QUFDSDs7QUFFRCxlQUFPRCxRQUFRRyxZQUFSLENBQXFCRixTQUFyQixDQUFQO0FBQ0g7O0FBRUR4RixXQUFPRCxPQUFQLEdBQWlCcUQsU0FBakI7QUFDSCxDQTlNRCIsImZpbGUiOiJjbGlwYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWydtb2R1bGUnLCAnLi9jbGlwYm9hcmQtYWN0aW9uJywgJ3RpbnktZW1pdHRlcicsICdnb29kLWxpc3RlbmVyJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZmFjdG9yeShtb2R1bGUsIHJlcXVpcmUoJy4vY2xpcGJvYXJkLWFjdGlvbicpLCByZXF1aXJlKCd0aW55LWVtaXR0ZXInKSwgcmVxdWlyZSgnZ29vZC1saXN0ZW5lcicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbW9kID0ge1xuICAgICAgICAgICAgZXhwb3J0czoge31cbiAgICAgICAgfTtcbiAgICAgICAgZmFjdG9yeShtb2QsIGdsb2JhbC5jbGlwYm9hcmRBY3Rpb24sIGdsb2JhbC50aW55RW1pdHRlciwgZ2xvYmFsLmdvb2RMaXN0ZW5lcik7XG4gICAgICAgIGdsb2JhbC5jbGlwYm9hcmQgPSBtb2QuZXhwb3J0cztcbiAgICB9XG59KSh0aGlzLCBmdW5jdGlvbiAobW9kdWxlLCBfY2xpcGJvYXJkQWN0aW9uLCBfdGlueUVtaXR0ZXIsIF9nb29kTGlzdGVuZXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgX2NsaXBib2FyZEFjdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGlwYm9hcmRBY3Rpb24pO1xuXG4gICAgdmFyIF90aW55RW1pdHRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aW55RW1pdHRlcik7XG5cbiAgICB2YXIgX2dvb2RMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nb29kTGlzdGVuZXIpO1xuXG4gICAgZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG9ialxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH0gOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgICAgICAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICBmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gICAgICAgIGlmICghc2VsZikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbiAgICB9XG5cbiAgICB2YXIgQ2xpcGJvYXJkID0gZnVuY3Rpb24gKF9FbWl0dGVyKSB7XG4gICAgICAgIF9pbmhlcml0cyhDbGlwYm9hcmQsIF9FbWl0dGVyKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd8SFRNTEVsZW1lbnR8SFRNTENvbGxlY3Rpb258Tm9kZUxpc3R9IHRyaWdnZXJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIENsaXBib2FyZCh0cmlnZ2VyLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2xpcGJvYXJkKTtcblxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKENsaXBib2FyZC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKENsaXBib2FyZCkpLmNhbGwodGhpcykpO1xuXG4gICAgICAgICAgICBfdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICAgIF90aGlzLmxpc3RlbkNsaWNrKHRyaWdnZXIpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmluZXMgaWYgYXR0cmlidXRlcyB3b3VsZCBiZSByZXNvbHZlZCB1c2luZyBpbnRlcm5hbCBzZXR0ZXIgZnVuY3Rpb25zXG4gICAgICAgICAqIG9yIGN1c3RvbSBmdW5jdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgX2NyZWF0ZUNsYXNzKENsaXBib2FyZCwgW3tcbiAgICAgICAgICAgIGtleTogJ3Jlc29sdmVPcHRpb25zJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlT3B0aW9ucygpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IHR5cGVvZiBvcHRpb25zLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMuYWN0aW9uIDogdGhpcy5kZWZhdWx0QWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdHlwZW9mIG9wdGlvbnMudGFyZ2V0ID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy50YXJnZXQgOiB0aGlzLmRlZmF1bHRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHlwZW9mIG9wdGlvbnMudGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGV4dCA6IHRoaXMuZGVmYXVsdFRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBfdHlwZW9mKG9wdGlvbnMuY29udGFpbmVyKSA9PT0gJ29iamVjdCcgPyBvcHRpb25zLmNvbnRhaW5lciA6IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2xpc3RlbkNsaWNrJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW5DbGljayh0cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyID0gKDAsIF9nb29kTGlzdGVuZXIyLmRlZmF1bHQpKHRyaWdnZXIsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIub25DbGljayhlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnb25DbGljaycsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25DbGljayhlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBlLmRlbGVnYXRlVGFyZ2V0IHx8IGUuY3VycmVudFRhcmdldDtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsaXBib2FyZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaXBib2FyZEFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGlwYm9hcmRBY3Rpb24gPSBuZXcgX2NsaXBib2FyZEFjdGlvbjIuZGVmYXVsdCh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogdGhpcy5hY3Rpb24odHJpZ2dlciksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXQodHJpZ2dlciksXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMudGV4dCh0cmlnZ2VyKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgZW1pdHRlcjogdGhpc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdkZWZhdWx0QWN0aW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZhdWx0QWN0aW9uKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoJ2FjdGlvbicsIHRyaWdnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdkZWZhdWx0VGFyZ2V0JyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZhdWx0VGFyZ2V0KHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBnZXRBdHRyaWJ1dGVWYWx1ZSgndGFyZ2V0JywgdHJpZ2dlcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZGVmYXVsdFRleHQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlZmF1bHRUZXh0KHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoJ3RleHQnLCB0cmlnZ2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZGVzdHJveScsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVyLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsaXBib2FyZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaXBib2FyZEFjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpcGJvYXJkQWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dLCBbe1xuICAgICAgICAgICAga2V5OiAnaXNTdXBwb3J0ZWQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFsnY29weScsICdjdXQnXTtcblxuICAgICAgICAgICAgICAgIHZhciBhY3Rpb25zID0gdHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycgPyBbYWN0aW9uXSA6IGFjdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgc3VwcG9ydCA9ICEhZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkO1xuXG4gICAgICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydCA9IHN1cHBvcnQgJiYgISFkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQoYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzdXBwb3J0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbiAgICAgICAgcmV0dXJuIENsaXBib2FyZDtcbiAgICB9KF90aW55RW1pdHRlcjIuZGVmYXVsdCk7XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gcmV0cmlldmUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVWYWx1ZShzdWZmaXgsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZSA9ICdkYXRhLWNsaXBib2FyZC0nICsgc3VmZml4O1xuXG4gICAgICAgIGlmICghZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBDbGlwYm9hcmQ7XG59KTsiXX0=
}).call(this,require("9FoBSB"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\..\\node_modules\\clipboard\\lib\\clipboard.js","/..\\..\\..\\node_modules\\clipboard\\lib")
},{"./clipboard-action":4,"9FoBSB":11,"buffer":3,"good-listener":9,"tiny-emitter":13}],6:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3}],7:[function(require,module,exports){
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
},{"./closest":6,"9FoBSB":11,"buffer":3}],8:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3}],9:[function(require,module,exports){
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
},{"./is":8,"9FoBSB":11,"buffer":3,"delegate":7}],10:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3}],11:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3}],12:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3}],13:[function(require,module,exports){
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
},{"9FoBSB":11,"buffer":3}]},{},[1])