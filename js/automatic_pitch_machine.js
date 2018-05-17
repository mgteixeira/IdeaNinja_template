(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dG9tYXRpY19waXRjaF9tYWNoaW5lLmpzIl0sIm5hbWVzIjpbIkNsaXBib2FyZCIsInJlcXVpcmUiLCJwaXRjaF9jaGVjayIsInBpdGNoX2lucHV0cyIsInBpdGNoX3ZhcmlhYmxlcyIsInNlY2x2bF9wZ3JvdXBzIiwiZmlyc3RsdmxfcGdyb3VwcyIsImVzY29uZGUiLCJlc2NvbmRlX2NvbGxhcHNhYmxlIiwibW9zdHJhX2NvbGxhcHNhYmxlIiwibW9zdHJhIiwiY2xpcCIsIm9uIiwiZSIsInRyaWdnZXIiLCJpbm5lckhUTUwiLCJjbGVhclNlbGVjdGlvbiIsImZhbGxiYWNrTWVzc2FnZSIsImFjdGlvbiIsImFjdGlvbk1zZyIsImFjdGlvbktleSIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCIkIiwiZWFjaCIsImtleSIsInZhbHVlIiwidmFsIiwidGV4dCIsImtleXVwIiwiZm9yRWFjaCIsImlkIiwiY2hhbmdlIiwiYiIsIm5vdCIsImhpZGUiLCJzcGxpY2UiLCJpbmRleE9mIiwicyIsInYiLCJhIiwiaXMiLCJzaG93IiwicHVzaCIsInciLCJ0IiwibGVuZ3RoIiwiZG9jdW1lbnQiLCJyZWFkeSIsImciLCJucl9jb2xsYXBzYWJsZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFJQTtBQUNBQSxZQUFZQyxRQUFRLFdBQVIsQ0FBWjs7QUFHQTtBQUNBLElBQUlDLGNBQWMsQ0FDZCxZQURjLEVBRWQsWUFGYyxFQUdkLFlBSGMsRUFJZCxZQUpjLENBQWxCOztBQU9BO0FBQ0E7QUFDQSxJQUFJQyxlQUFlO0FBQ2Ysb0JBQWdCLEVBREQ7QUFFZixvQkFBZ0IsRUFGRDtBQUdmLHFCQUFpQixFQUhGO0FBSWYsc0JBQWtCLEVBSkg7QUFLZixrQkFBYyxFQUxDO0FBTWYsbUJBQWUsRUFOQTtBQU9mLHFCQUFpQixFQVBGO0FBUWYsbUJBQWUsRUFSQTtBQVNmLGtCQUFjLEVBVEM7QUFVZixZQUFRLEVBVk87QUFXZixZQUFRLEVBWE87QUFZZixZQUFRLEVB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LFdBQUYsRUFBZVMsTUFBZixDQUFzQixZQUFXO0FBQzdCMUIsWUFBUXdCLE9BQVIsQ0FDSSxVQUFTbUIsQ0FBVCxFQUFZO0FBQ1I7QUFDQTFCLFVBQUUsTUFBTTBCLENBQVIsRUFBV2QsSUFBWDtBQUNILEtBSkwsRUFENkIsQ0FNMUI7O0FBRUg1Qix3QkFBb0J1QixPQUFwQixDQUNJLFVBQVNvQixjQUFULEVBQXlCO0FBQ3JCM0IsVUFBRSxXQUFXMkIsY0FBYixFQUE2QmYsSUFBN0I7QUFDSCxLQUhMLEVBUjZCLENBWTFCOztBQUVIMUIsV0FBT3FCLE9BQVAsQ0FDSSxVQUFTQyxFQUFULEVBQWE7QUFDVFMsWUFBSXBDLGVBQWUyQixFQUFmLENBQUo7QUFDQTtBQUNBUixVQUFFLE1BQU1pQixDQUFSLEVBQVdFLElBQVg7QUFDSCxLQUxMLEVBZDZCLENBb0IxQjs7QUFFSGxDLHVCQUFtQnNCLE9BQW5CLENBQ0ksVUFBU29CLGNBQVQsRUFBeUI7QUFDckIzQixVQUFFLFdBQVcyQixjQUFiLEVBQTZCUixJQUE3QjtBQUNILEtBSEwsRUF0QjZCLENBMEIxQjtBQUVOLENBNUJELEUsQ0E0QkkiLCJmaWxlIjoiYXV0b21hdGljX3BpdGNoX21hY2hpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBBdXRvbWF0aWMgUGl0Y2ggTWFjaGluZVxyXG4gKi9cclxuXHJcbi8vIFZBUklBQkxFU1xyXG5DbGlwYm9hcmQgPSByZXF1aXJlKCdjbGlwYm9hcmQnKTtcclxuXHJcblxyXG4vLyBDaGVja2JveGVzIExpc3RcclxudmFyIHBpdGNoX2NoZWNrID0gW1xyXG4gICAgXCJwaXRjaF9jYl8xXCIsXHJcbiAgICBcInBpdGNoX2NiXzJcIixcclxuICAgIFwicGl0Y2hfY2JfM1wiLFxyXG4gICAgXCJwaXRjaF9jYl80XCJcclxuXTtcclxuXHJcbi8vIElucHV0cyBMaXN0XHJcbi8vIElEX29mX2lucHV0IDogVGV4dF9vZl9pbnB1dFxyXG52YXIgcGl0Y2hfaW5wdXRzID0ge1xyXG4gICAgXCJjdXN0b21lcm5hbWVcIjogXCJcIixcclxuICAgIFwic2Nlbm5hcmlvX3B0XCI6IFwiXCIsXHJcbiAgICBcInNjZW5uYXJpb19wc3RcIjogXCJcIixcclxuICAgIFwic2Nlbm5hcmlvX2NvbXBcIjogXCJcIixcclxuICAgIFwidHJpZ2dlcl9wdFwiOiBcIlwiLFxyXG4gICAgXCJ0cmlnZ2VyX3BzdFwiOiBcIlwiLFxyXG4gICAgXCJzdGF0dXNxdW9fc29sXCI6IFwiXCIsXHJcbiAgICBcInByb2R1Y3RuYW1lXCI6IFwiXCIsXHJcbiAgICBcInByb2R1Y3R0YWdcIjogXCJcIixcclxuICAgIFwiYmVuMVwiOiBcIlwiLFxyXG4gICAgXCJiZW4yXCI6IFwiXCIsXHJcbiAgICBcImJlbjNcIjogXCJcIixcclxuICAgIFwiYWx0YmVuMVwiOiBcIlwiLFxyXG4gICAgXCJhbHRiZW4yXCI6IFwiXCIsXHJcbiAgICBcImFsdGJlbjNcIjogXCJcIixcclxuICAgIFwiYmVuX3BzdFwiOiBcIlwiLFxyXG4gICAgXCJiZW5faW1wXCI6IFwiXCIsXHJcbiAgICBcImFsdF9zaG91bGRcIjogXCJcIixcclxuICAgIFwiYWx0X2hhcFwiOiBcIlwiLFxyXG4gICAgXCJhbHRfY29uc1wiOiBcIlwiLFxyXG4gICAgXCJhbHRfbm9jb25zXCI6IFwiXCIsXHJcbiAgICBcImV4cFwiOiBcIlwiLFxyXG4gICAgXCJkaXN0XCI6IFwiXCIsXHJcbiAgICBcInJlbGV2XCI6IFwiXCIsXHJcbiAgICBcInFwYWluXCI6IFwiXCIsXHJcbiAgICBcImFwYWluXCI6IFwiXCIsXHJcbiAgICBcInFkaWZmXCI6IFwiXCJcclxufTtcclxuXHJcbnZhciBwaXRjaF92YXJpYWJsZXMgPSB7XHJcbiAgICBcInBpdGNoX2NiXzFcIjogW1xyXG4gICAgICAgIFwic2Nlbm5hcmlvX2NvbXBcIixcclxuICAgICAgICBcInJlbGV2XCIsXHJcbiAgICAgICAgXCJxcGFpblwiLFxyXG4gICAgICAgIFwiYXBhaW5cIixcclxuICAgICAgICBcInByb2R1Y3RuYW1lXCIsXHJcbiAgICAgICAgXCJwcm9kdWN0dGFnXCIsXHJcbiAgICAgICAgXCJiZW4xXCIsXHJcbiAgICAgICAgXCJiZW4yXCIsXHJcbiAgICAgICAgXCJiZW4zXCIsXHJcbiAgICAgICAgXCJhbHRfc2hvdWxkXCIsXHJcbiAgICAgICAgXCJhbHRiZW4xXCIsXHJcbiAgICAgICAgXCJhbHRiZW4yXCIsXHJcbiAgICAgICAgXCJhbHRiZW4zXCIsXHJcbiAgICAgICAgXCJiZW5faW1wXCJcclxuICAgIF0sXHJcbiAgICBcInBpdGNoX2NiXzJcIjogW1xyXG4gICAgICAgIFwic2Nlbm5hcmlvX3BzdFwiLFxyXG4gICAgICAgIFwidHJpZ2dlcl9wc3RcIixcclxuICAgICAgICBcInN0YXR1c3F1b19zb2xcIixcclxuICAgICAgICBcInFkaWZmXCIsXHJcbiAgICAgICAgXCJhbHRiZW4xXCIsXHJcbiAgICAgICAgXCJhbHRiZW4yXCIsXHJcbiAgICAgICAgXCJhbHRiZW4zXCIsXHJcbiAgICAgICAgXCJwcm9kdWN0bmFtZVwiLFxyXG4gICAgICAgIFwiYmVuMVwiLFxyXG4gICAgICAgIFwiYmVuMlwiLFxyXG4gICAgICAgIFwiYmVuM1wiXHJcbiAgICBdLFxyXG4gICAgXCJwaXRjaF9jYl8zXCI6IFtcclxuICAgICAgICBcInNjZW5uYXJpb19wc3RcIixcclxuICAgICAgICBcImFsdF9oYXBcIixcclxuICAgICAgICBcImFsdF9jb25zXCIsXHJcbiAgICAgICAgXCJhbHRfbm9jb25zXCIsXHJcbiAgICAgICAgXCJwcm9kdWN0bmFtZVwiLFxyXG4gICAgICAgIFwiYmVuMVwiLFxyXG4gICAgICAgIFwiYmVuMlwiLFxyXG4gICAgICAgIFwiYmVuM1wiLFxyXG4gICAgICAgIFwiYWx0YmVuMVwiLFxyXG4gICAgICAgIFwiYWx0YmVuMlwiLFxyXG4gICAgICAgIFwiYWx0YmVuM1wiLFxyXG4gICAgICAgIFwiZGlzdFwiLFxyXG4gICAgICAgIFwiYmVuX3BzdFwiLFxyXG4gICAgICAgIFwiZXhwXCIsXHJcbiAgICAgICAgXCJwcm9kdWN0dGFnXCJcclxuICAgIF0sXHJcbiAgICBcInBpdGNoX2NiXzRcIjogW1xyXG4gICAgICAgIFwiY3VzdG9tZXJuYW1lXCIsXHJcbiAgICAgICAgXCJzY2VubmFyaW9fcHRcIixcclxuICAgICAgICBcInRyaWdnZXJfcHRcIixcclxuICAgICAgICBcImRpc3RcIixcclxuICAgICAgICBcImJlbl9wc3RcIixcclxuICAgICAgICBcImV4cFwiXHJcbiAgICBdXHJcbn07XHJcblxyXG52YXIgc2VjbHZsX3Bncm91cHMgPSB7XHJcbiAgICBcImN1c3RvbWVybmFtZV9kaXZcIjogXCJjdXN0b21lcm5hbWVfZGl2XCIsXHJcbiAgICBcInNjZW5uYXJpb19wdF9kaXZcIjogXCJzY2VubmFyaW9cIixcclxuICAgIFwic2Nlbm5hcmlvX3BzdF9kaXZcIjogXCJzY2VubmFyaW9cIixcclxuICAgIFwic2Nlbm5hcmlvX2NvbXBfZGl2XCI6IFwic2Nlbm5hcmlvX2NvbXBfZGl2XCIsXHJcbiAgICBcInN0YXR1c3F1b19zb2xfZGl2XCI6IFwic3RhdHVzcXVvX3NvbF9kaXZcIixcclxuICAgIFwidHJpZ2dlcl9wdF9kaXZcIjogXCJ0cmlnZ2VyXCIsXHJcbiAgICBcInRyaWdnZXJfcHN0X2RpdlwiOiBcInRyaWdnZXJcIixcclxuICAgIFwicHJvZHVjdG5hbWVfZGl2XCI6IFwicHJvZHVjdG5hbWVfZGl2XCIsXHJcbiAgICBcInByb2R1Y3R0YWdfZGl2XCI6IFwicHJvZHVjdHRhZ19kaXZcIixcclxuICAgIFwiYmVuMV9kaXZcIjogXCJiZW5lZml0X3RhYmxlXCIsXHJcbiAgICBcImJlbjJfZGl2XCI6IFwiYmVuZWZpdF90YWJsZVwiLFxyXG4gICAgXCJiZW4zX2RpdlwiOiBcImJlbmVmaXRfdGFibGVcIixcclxuICAgIFwiYWx0YmVuMV9kaXZcIjogXCJiZW5lZml0X3RhYmxlXCIsXHJcbiAgICBcImFsdGJlbjJfZGl2XCI6IFwiYmVuZWZpdF90YWJsZVwiLFxyXG4gICAgXCJhbHRiZW4zX2RpdlwiOiBcImJlbmVmaXRfdGFibGVcIixcclxuICAgIFwiYmVuX3BzdF9kaXZcIjogXCJzdW1fYmVuXCIsXHJcbiAgICBcImJlbl9pbXBfZGl2XCI6IFwic3VtX2JlblwiLFxyXG4gICAgXCJhbHRfc2hvdWxkX2RpdlwiOiBcImFsdF9zaG91bGRfZGl2XCIsXHJcbiAgICBcImFsdF9oYXBfZGl2XCI6IFwiYWx0X2hhcF9kaXZcIixcclxuICAgIFwiYWx0X2NvbnNfZGl2XCI6IFwiYWx0X2NvbnNfZGl2XCIsXHJcbiAgICBcImFsdF9ub2NvbnNfZGl2XCI6IFwiYWx0X25vY29uc19kaXZcIixcclxuICAgIFwiZXhwX2RpdlwiOiBcImV4cF9kaXZcIixcclxuICAgIFwiZGlzdF9kaXZcIjogXCJkaXN0X2RpdlwiLFxyXG4gICAgXCJyZWxldl9kaXZcIjogXCJyZWxldl9kaXZcIixcclxuICAgIFwicXBhaW5fZGl2XCI6IFwicXBhaW5fZGl2XCIsXHJcbiAgICBcImFwYWluX2RpdlwiOiBcImFwYWluX2RpdlwiLFxyXG4gICAgXCJxZGlmZl9kaXZcIjogXCJxZGlmZl9kaXZcIlxyXG59O1xyXG5cclxudmFyIGZpcnN0bHZsX3Bncm91cHMgPSB7XHJcbiAgICBcImN1c3RvbWVybmFtZV9kaXZcIjogXCIwXCIsXHJcbiAgICBcInNjZW5uYXJpb1wiOiBcIjFcIixcclxuICAgIFwic2Nlbm5hcmlvX2NvbXBfZGl2XCI6IFwiMVwiLFxyXG4gICAgXCJ0cmlnZ2VyXCI6IFwiMVwiLFxyXG4gICAgXCJzdGF0dXNxdW9fc29sX2RpdlwiOiBcIjFcIixcclxuICAgIFwicHJvZHVjdG5hbWVfZGl2XCI6IFwiMlwiLFxyXG4gICAgXCJwcm9kdWN0dGFnX2RpdlwiOiBcIjJcIixcclxuICAgIFwiYmVuZWZpdF90YWJsZVwiOiBcIjJcIixcclxuICAgIFwic3VtX2JlblwiOiBcIjJcIixcclxuICAgIFwiYWx0X3Nob3VsZF9kaXZcIjogXCIyXCIsXHJcbiAgICBcImFsdF9oYXBfZGl2XCI6IFwiMlwiLFxyXG4gICAgXCJhbHRfY29uc19kaXZcIjogXCIyXCIsXHJcbiAgICBcImFsdF9ub2NvbnNfZGl2XCI6IFwiMlwiLFxyXG4gICAgXCJleHBfZGl2XCI6IFwiMlwiLFxyXG4gICAgXCJkaXN0X2RpdlwiOiBcIjJcIixcclxuICAgIFwicmVsZXZfZGl2XCI6IFwiM1wiLFxyXG4gICAgXCJxcGFpbl9kaXZcIjogXCIzXCIsXHJcbiAgICBcImFwYWluX2RpdlwiOiBcIjNcIixcclxuICAgIFwicWRpZmZfZGl2XCI6IFwiM1wiXHJcbn07XHJcblxyXG52YXIgZXNjb25kZSA9IFtcclxuICAgIFwiY3VzdG9tZXJuYW1lX2RpdlwiLFxyXG4gICAgXCJzY2VubmFyaW9cIixcclxuICAgIFwic2Nlbm5hcmlvX2NvbXBfZGl2XCIsXHJcbiAgICBcInRyaWdnZXJcIixcclxuICAgIFwic3RhdHVzcXVvX3NvbF9kaXZcIixcclxuICAgIFwicHJvZHVjdG5hbWVfZGl2XCIsXHJcbiAgICBcInByb2R1Y3R0YWdfZGl2XCIsXHJcbiAgICBcImJlbmVmaXRfdGFibGVcIixcclxuICAgIFwic3VtX2JlblwiLFxyXG4gICAgXCJhbHRfc2hvdWxkX2RpdlwiLFxyXG4gICAgXCJhbHRfaGFwX2RpdlwiLFxyXG4gICAgXCJhbHRfY29uc19kaXZcIixcclxuICAgIFwiYWx0X25vY29uc19kaXZcIixcclxuICAgIFwiZXhwX2RpdlwiLFxyXG4gICAgXCJkaXN0X2RpdlwiLFxyXG4gICAgXCJyZWxldl9kaXZcIixcclxuICAgIFwicXBhaW5fZGl2XCIsXHJcbiAgICBcImFwYWluX2RpdlwiLFxyXG4gICAgXCJxZGlmZl9kaXZcIlxyXG5dO1xyXG5cclxudmFyIGVzY29uZGVfY29sbGFwc2FibGUgPSBbXCIwXCIsIFwiMVwiLCBcIjJcIiwgXCIzXCJdO1xyXG5cclxudmFyIG1vc3RyYV9jb2xsYXBzYWJsZSA9IFtdO1xyXG5cclxudmFyIG1vc3RyYSA9IFtdO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLy8gQ2xpcGJvYXJkIFN5c3RlbVxyXG5cclxudmFyIGNsaXAgPSBuZXcgQ2xpcGJvYXJkKCcuY2xpcCcpO1xyXG5cclxuY2xpcC5vbignc3VjY2VzcycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUudHJpZ2dlci5pbm5lckhUTUwgPSAnQ29waWVkISc7XHJcbiAgICBlLmNsZWFyU2VsZWN0aW9uKCk7XHJcbn0pO1xyXG5cclxuY2xpcC5vbignZXJyb3InLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnRyaWdnZXIuaW5uZXJIVE1MID0gZmFsbGJhY2tNZXNzYWdlKGUuYWN0aW9uKTtcclxuICAgIGUuY2xlYXJTZWxlY3Rpb24oKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBmYWxsYmFja01lc3NhZ2UoYWN0aW9uKSB7XHJcbiAgICB2YXIgYWN0aW9uTXNnID0gJyc7XHJcbiAgICB2YXIgYWN0aW9uS2V5ID0gKGFjdGlvbiA9PT0gJ2N1dCcgPyAnWCcgOiAnQycpO1xyXG4gICAgaWYgKC9pUGhvbmV8aVBhZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcclxuICAgICAgICBhY3Rpb25Nc2cgPSAnTm8gc3VwcG9ydCA6KCc7XHJcbiAgICB9IGVsc2UgaWYgKC9NYWMvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICAgICAgYWN0aW9uTXNnID0gJ1ByZXNzIOKMmC0nICsgYWN0aW9uS2V5ICsgJyB0byAnICsgYWN0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhY3Rpb25Nc2cgPSAnUHJlc3MgQ3RybC0nICsgYWN0aW9uS2V5ICsgJyB0byAnICsgYWN0aW9uO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFjdGlvbk1zZztcclxufVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8vIFBvcHVsYXRlIHRoZSBwaXRjaGVzIGluIGRvY3VtZW50IHN0YXJ0XHJcbi8vIFdyaXRlIHRoZSB0ZXh0ICh2YWx1ZSkgb2YgYWxsIGlucHV0cyAoa2V5KSBpbnRvIHRoZSBzcGFuIHRleHRzLlxyXG4kLmVhY2gocGl0Y2hfaW5wdXRzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAvLyBWZXJpZnkgaWYgaW5wdXRzIGhhdmUgc29tZXRoaW5nIHdyaXRlZC5cclxuICAgIGlmICgkKFwiI1wiICsga2V5KS52YWwoKSAhPT0gXCJcIikge1xyXG4gICAgICAgIHZhbHVlID0gJChcIiNcIiArIGtleSkudmFsKCk7XHJcbiAgICAgICAgLy8gV3JpdGUgdGhlIHRleHQgb2YgaW5wdXQgaW50byB0aGUgc3BhbiB0YWdzIGluIHRoZSBwaXRjaGVzXHJcbiAgICAgICAgJCgnLicgKyBrZXkgKyBcIl9zcGFuXCIpLnRleHQodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgLy8gRXZlbnQgb24ga2V5dXBcclxuICAgICQoXCIjXCIgKyBrZXkpLmtleXVwKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhbHVlID0gJChcIiNcIiArIGtleSkudmFsKCk7XHJcbiAgICAgICAgJCgnLicgKyBrZXkgKyBcIl9zcGFuXCIpLnRleHQodmFsdWUpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuLy8gRXNjb25kZSB0b2RhcyBhcyBxdWVzdMO1ZXNcclxucGl0Y2hfY2hlY2suZm9yRWFjaChcclxuICAgIGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgJCgnLnBpdGNoX2NiJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZXZlbnRvIHJlZ2lzdGFkb1wiKTtcclxuICAgICAgICAgICAgcGl0Y2hfdmFyaWFibGVzW2lkXS5mb3JFYWNoKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oYikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoXCIjXCIgKyBpZCkubm90KCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIgKyBiICsgXCJfZGl2XCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9zdHJhLnNwbGljZShtb3N0cmEuaW5kZXhPZihiICsgXCJfZGl2XCIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBzZWNsdmxfcGdyb3Vwc1tiICsgXCJfZGl2XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gZmlyc3RsdmxfcGdyb3Vwc1tzXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9zdHJhX2NvbGxhcHNhYmxlLnNwbGljZShtb3N0cmFfY29sbGFwc2FibGUuaW5kZXhPZih2KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzcGxpY2UgcGFyYSBtb3N0cmFfY29sbGFwc2FibGUgZGUgXCIgKyB2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7IC8vZm9yRWFjaCBwaXRjaCBJbnB1dHNcclxuICAgICAgICB9KTsgLy9ldmVudFxyXG4gICAgfSAvL2Z1bmN0aW9uKGlkKVxyXG4pOyAvL2ZvckVhY2hcclxuXHJcbi8vYXByZXNlbnRhIGFwZW5hcyBhcyBxdWVzdMO1ZXMgbmVjZXNzw6FyaWFzXHJcbnBpdGNoX2NoZWNrLmZvckVhY2goXHJcbiAgICBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICQoJy5waXRjaF9jYicpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImV2ZW50byByZWdpc3RhZG9cIik7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICBwaXRjaF92YXJpYWJsZXNbaWRdLmZvckVhY2goZnVuY3Rpb24oYSkge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhKTtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAkKFwiI1wiICsgaWQpLmlzKCc6Y2hlY2tlZCcpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2hvdyBcIiArIGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIjXCIgKyBhICsgXCJfZGl2XCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICBtb3N0cmEucHVzaChhICsgXCJfZGl2XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB3ID0gc2VjbHZsX3Bncm91cHNbYSArIFwiX2RpdlwiXTtcclxuICAgICAgICAgICAgICAgICAgICB0ID0gZmlyc3RsdmxfcGdyb3Vwc1t3XTtcclxuICAgICAgICAgICAgICAgICAgICBtb3N0cmFfY29sbGFwc2FibGUucHVzaCh0KTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicHVzaCBwYXJhIG1vc3RyYV9jb2xsYXBzYWJsZSBkZSBcIiArIHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTsgLy9waXRjaHZhcmlhYmxlX2ZvckVhY2hcclxuICAgICAgICAgICAgLy8gTXVkYXIgdGV4dG8gYW50ZXMgZG9zIGNvbGxhcHNhYmxlcy5cclxuICAgICAgICAgICAgaWYgKG1vc3RyYV9jb2xsYXBzYWJsZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICQoXCIjcF95ZXNcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNwX25vXCIpLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIjcF95ZXNcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNwX25vXCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvL2V2ZW50XHJcbiAgICB9IC8vZnVuY3Rpb24oaWQpXHJcbik7IC8vZm9yRWFjaFxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwiI3Bfbm9cIikuaGlkZSgpO1xyXG59KTtcclxuXHJcbi8vIHbDqiBxdWFpcyBkYXMgcXVlc3TDtWVzIGVzdMOjbyBjb20gZGlzcGxheT1ub25lIGUgZmF6IGRlc2FwYXJlY2VyIHRleHRvIGUgY29sbGFwc2FibGVzIGFjZXNzw7NyaW9zLlxyXG4kKCcucGl0Y2hfY2InKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICBlc2NvbmRlLmZvckVhY2goXHJcbiAgICAgICAgZnVuY3Rpb24oZykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaGlkZSBcIiArIGcpO1xyXG4gICAgICAgICAgICAkKFwiLlwiICsgZykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICk7IC8vZXNjb25kZSBmb3JFYWNoXHJcblxyXG4gICAgZXNjb25kZV9jb2xsYXBzYWJsZS5mb3JFYWNoKFxyXG4gICAgICAgIGZ1bmN0aW9uKG5yX2NvbGxhcHNhYmxlKSB7XHJcbiAgICAgICAgICAgICQoXCIjcGFuZWxcIiArIG5yX2NvbGxhcHNhYmxlKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTsgLy9lc2NvbmRlX2NvbGxhcHNhYmxlXHJcblxyXG4gICAgbW9zdHJhLmZvckVhY2goXHJcbiAgICAgICAgZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgYSA9IHNlY2x2bF9wZ3JvdXBzW2lkXTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNob3cgXCIgKyBhKTtcclxuICAgICAgICAgICAgJChcIi5cIiArIGEpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICApOyAvL21vc3RyYSBmb3JlYWNoXHJcblxyXG4gICAgbW9zdHJhX2NvbGxhcHNhYmxlLmZvckVhY2goXHJcbiAgICAgICAgZnVuY3Rpb24obnJfY29sbGFwc2FibGUpIHtcclxuICAgICAgICAgICAgJChcIiNwYW5lbFwiICsgbnJfY29sbGFwc2FibGUpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICApOyAvL21vc3RyYV9jb2xsYXBzYWJsZVxyXG5cclxufSk7IC8vZXZlbnQiXX0=
},{"clipboard":3}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaXBib2FyZC1hY3Rpb24uanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwibW9kIiwic2VsZWN0IiwiY2xpcGJvYXJkQWN0aW9uIiwiX3NlbGVjdCIsIl9zZWxlY3QyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX3R5cGVvZiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJpbnN0YW5jZSIsIkNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiX2NyZWF0ZUNsYXNzIiwiZGVmaW5lUHJvcGVydGllcyIsInRhcmdldCIsInByb3BzIiwiaSIsImxlbmd0aCIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsIkNsaXBib2FyZEFjdGlvbiIsIm9wdGlvbnMiLCJyZXNvbHZlT3B0aW9ucyIsImluaXRTZWxlY3Rpb24iLCJ2YWx1ZSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImFjdGlvbiIsImNvbnRhaW5lciIsImVtaXR0ZXIiLCJ0ZXh0IiwidHJpZ2dlciIsInNlbGVjdGVkVGV4dCIsInNlbGVjdEZha2UiLCJzZWxlY3RUYXJnZXQiLCJfdGhpcyIsImlzUlRMIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVGYWtlIiwiZmFrZUhhbmRsZXJDYWxsYmFjayIsImZha2VIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImZha2VFbGVtIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiZm9udFNpemUiLCJib3JkZXIiLCJwYWRkaW5nIiwibWFyZ2luIiwicG9zaXRpb24iLCJ5UG9zaXRpb24iLCJ3aW5kb3ciLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRvcCIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwiY29weVRleHQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJzdWNjZWVkZWQiLCJleGVjQ29tbWFuZCIsImVyciIsImhhbmRsZVJlc3VsdCIsImVtaXQiLCJjbGVhclNlbGVjdGlvbiIsImJpbmQiLCJmb2N1cyIsImdldFNlbGVjdGlvbiIsInJlbW92ZUFsbFJhbmdlcyIsImRlc3Ryb3kiLCJzZXQiLCJfYWN0aW9uIiwiRXJyb3IiLCJnZXQiLCJub2RlVHlwZSIsImhhc0F0dHJpYnV0ZSIsIl90YXJnZXQiXSwibWFwcGluZ3MiOiJBQUFBLENBQUMsVUFBVUEsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7QUFDeEIsUUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM1Q0QsZUFBTyxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQVAsRUFBNkJELE9BQTdCO0FBQ0gsS0FGRCxNQUVPLElBQUksT0FBT0csT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUN2Q0gsZ0JBQVFJLE1BQVIsRUFBZ0JDLFFBQVEsUUFBUixDQUFoQjtBQUNILEtBRk0sTUFFQTtBQUNILFlBQUlDLE1BQU07QUFDTkgscUJBQVM7QUFESCxTQUFWO0FBR0FILGdCQUFRTSxHQUFSLEVBQWFQLE9BQU9RLE1BQXBCO0FBQ0FSLGVBQU9TLGVBQVAsR0FBeUJGLElBQUlILE9BQTdCO0FBQ0g7QUFDSixDQVpELEVBWUcsSUFaSCxFQVlTLFVBQVVDLE1BQVYsRUFBa0JLLE9BQWxCLEVBQTJCO0FBQ2hDOztBQUVBLFFBQUlDLFdBQVdDLHVCQUF1QkYsT0FBdkIsQ0FBZjs7QUFFQSxhQUFTRSxzQkFBVCxDQUFnQ0MsR0FBaEMsRUFBcUM7QUFDakMsZUFBT0EsT0FBT0EsSUFBSUMsVUFBWCxHQUF3QkQsR0FBeEIsR0FBOEI7QUFDakNFLHFCQUFTRjtBQUR3QixTQUFyQztBQUdIOztBQUVELFFBQUlHLFVBQVUsT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPQSxPQUFPQyxRQUFkLEtBQTJCLFFBQTNELEdBQXNFLFVBQVVMLEdBQVYsRUFBZTtBQUMvRixlQUFPLE9BQU9BLEdBQWQ7QUFDSCxLQUZhLEdBRVYsVUFBVUEsR0FBVixFQUFlO0FBQ2YsZUFBT0EsT0FBTyxPQUFPSSxNQUFQLEtBQWtCLFVBQXpCLElBQXVDSixJQUFJTSxXQUFKLEtBQW9CRixNQUEzRCxJQUFxRUosUUFBUUksT0FBT0csU0FBcEYsR0FBZ0csUUFBaEcsR0FBMkcsT0FBT1AsR0FBekg7QUFDSCxLQUpEOztBQU1BLGFBQVNRLGVBQVQsQ0FBeUJDLFFBQXpCLEVBQW1DQyxXQUFuQyxFQUFnRDtBQUM1QyxZQUFJLEVBQUVELG9CQUFvQkMsV0FBdEIsQ0FBSixFQUF3QztBQUNwQyxrQkFBTSxJQUFJQyxTQUFKLENBQWMsbUNBQWQsQ0FBTjtBQUNIO0FBQ0o7O0FBRUQsUUFBSUMsZUFBZSxZQUFZO0FBQzNCLGlCQUFTQyxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLEVBQXlDO0FBQ3JDLGlCQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsTUFBTUUsTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDO0FBQ25DLG9CQUFJRSxhQUFhSCxNQUFNQyxDQUFOLENBQWpCO0FBQ0FFLDJCQUFXQyxVQUFYLEdBQXdCRCxXQUFXQyxVQUFYLElBQXlCLEtBQWpEO0FBQ0FELDJCQUFXRSxZQUFYLEdBQTBCLElBQTFCO0FBQ0Esb0JBQUksV0FBV0YsVUFBZixFQUEyQkEsV0FBV0csUUFBWCxHQUFzQixJQUF0QjtBQUMzQkMsdUJBQU9DLGNBQVAsQ0FBc0JULE1BQXRCLEVBQThCSSxXQUFXTSxHQUF6QyxFQUE4Q04sVUFBOUM7QUFDSDtBQUNKOztBQUVELGVBQU8sVUFBVVIsV0FBVixFQUF1QmUsVUFBdkIsRUFBbUNDLFdBQW5DLEVBQWdEO0FBQ25ELGdCQUFJRCxVQUFKLEVBQWdCWixpQkFBaUJILFlBQVlILFNBQTdCLEVBQXdDa0IsVUFBeEM7QUFDaEIsZ0JBQUlDLFdBQUosRUFBaUJiLGlCQUFpQkgsV0FBakIsRUFBOEJnQixXQUE5QjtBQUNqQixtQkFBT2hCLFdBQVA7QUFDSCxTQUpEO0FBS0gsS0FoQmtCLEVBQW5COztBQWtCQSxRQUFJaUIsa0JBQWtCLFlBQVk7QUFDOUI7OztBQUdBLGlCQUFTQSxlQUFULENBQXlCQyxPQUF6QixFQUFrQztBQUM5QnBCLDRCQUFnQixJQUFoQixFQUFzQm1CLGVBQXRCOztBQUVBLGlCQUFLRSxjQUFMLENBQW9CRCxPQUFwQjtBQUNBLGlCQUFLRSxhQUFMO0FBQ0g7O0FBRUQ7Ozs7O0FBTUFsQixxQkFBYWUsZUFBYixFQUE4QixDQUFDO0FBQzNCSCxpQkFBSyxnQkFEc0I7QUFFM0JPLG1CQUFPLFNBQVNGLGNBQVQsR0FBMEI7QUFDN0Isb0JBQUlELFVBQVVJLFVBQVVmLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JlLFVBQVUsQ0FBVixNQUFpQkMsU0FBekMsR0FBcURELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxFQUFsRjs7QUFFQSxxQkFBS0UsTUFBTCxHQUFjTixRQUFRTSxNQUF0QjtBQUNBLHFCQUFLQyxTQUFMLEdBQWlCUCxRQUFRTyxTQUF6QjtBQUNBLHFCQUFLQyxPQUFMLEdBQWVSLFFBQVFRLE9BQXZCO0FBQ0EscUJBQUt0QixNQUFMLEdBQWNjLFFBQVFkLE1BQXRCO0FBQ0EscUJBQUt1QixJQUFMLEdBQVlULFFBQVFTLElBQXBCO0FBQ0EscUJBQUtDLE9BQUwsR0FBZVYsUUFBUVUsT0FBdkI7O0FBRUEscUJBQUtDLFlBQUwsR0FBb0IsRUFBcEI7QUFDSDtBQWIwQixTQUFELEVBYzNCO0FBQ0NmLGlCQUFLLGVBRE47QUFFQ08sbUJBQU8sU0FBU0QsYUFBVCxHQUF5QjtBQUM1QixvQkFBSSxLQUFLTyxJQUFULEVBQWU7QUFDWCx5QkFBS0csVUFBTDtBQUNILGlCQUZELE1BRU8sSUFBSSxLQUFLMUIsTUFBVCxFQUFpQjtBQUNwQix5QkFBSzJCLFlBQUw7QUFDSDtBQUNKO0FBUkYsU0FkMkIsRUF1QjNCO0FBQ0NqQixpQkFBSyxZQUROO0FBRUNPLG1CQUFPLFNBQVNTLFVBQVQsR0FBc0I7QUFDekIsb0JBQUlFLFFBQVEsSUFBWjs7QUFFQSxvQkFBSUMsUUFBUUMsU0FBU0MsZUFBVCxDQUF5QkMsWUFBekIsQ0FBc0MsS0FBdEMsS0FBZ0QsS0FBNUQ7O0FBRUEscUJBQUtDLFVBQUw7O0FBRUEscUJBQUtDLG1CQUFMLEdBQTJCLFlBQVk7QUFDbkMsMkJBQU9OLE1BQU1LLFVBQU4sRUFBUDtBQUNILGlCQUZEO0FBR0EscUJBQUtFLFdBQUwsR0FBbUIsS0FBS2QsU0FBTCxDQUFlZSxnQkFBZixDQUFnQyxPQUFoQyxFQUF5QyxLQUFLRixtQkFBOUMsS0FBc0UsSUFBekY7O0FBRUEscUJBQUtHLFFBQUwsR0FBZ0JQLFNBQVNRLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBaEI7QUFDQTtBQUNBLHFCQUFLRCxRQUFMLENBQWNFLEtBQWQsQ0FBb0JDLFFBQXBCLEdBQStCLE1BQS9CO0FBQ0E7QUFDQSxxQkFBS0gsUUFBTCxDQUFjRSxLQUFkLENBQW9CRSxNQUFwQixHQUE2QixHQUE3QjtBQUNBLHFCQUFLSixRQUFMLENBQWNFLEtBQWQsQ0FBb0JHLE9BQXBCLEdBQThCLEdBQTlCO0FBQ0EscUJBQUtMLFFBQUwsQ0FBY0UsS0FBZCxDQUFvQkksTUFBcEIsR0FBNkIsR0FBN0I7QUFDQTtBQUNBLHFCQUFLTixRQUFMLENBQWNFLEtBQWQsQ0FBb0JLLFFBQXBCLEdBQStCLFVBQS9CO0FBQ0EscUJBQUtQLFFBQUwsQ0FBY0UsS0FBZCxDQUFvQlYsUUFBUSxPQUFSLEdBQWtCLE1BQXRDLElBQWdELFNBQWhEO0FBQ0E7QUFDQSxvQkFBSWdCLFlBQVlDLE9BQU9DLFdBQVAsSUFBc0JqQixTQUFTQyxlQUFULENBQXlCaUIsU0FBL0Q7QUFDQSxxQkFBS1gsUUFBTCxDQUFjRSxLQUFkLENBQW9CVSxHQUFwQixHQUEwQkosWUFBWSxJQUF0Qzs7QUFFQSxxQkFBS1IsUUFBTCxDQUFjYSxZQUFkLENBQTJCLFVBQTNCLEVBQXVDLEVBQXZDO0FBQ0EscUJBQUtiLFFBQUwsQ0FBY3BCLEtBQWQsR0FBc0IsS0FBS00sSUFBM0I7O0FBRUEscUJBQUtGLFNBQUwsQ0FBZThCLFdBQWYsQ0FBMkIsS0FBS2QsUUFBaEM7O0FBRUEscUJBQUtaLFlBQUwsR0FBb0IsQ0FBQyxHQUFHekMsU0FBU0ksT0FBYixFQUFzQixLQUFLaUQsUUFBM0IsQ0FBcEI7QUFDQSxxQkFBS2UsUUFBTDtBQUNIO0FBbkNGLFNBdkIyQixFQTJEM0I7QUFDQzFDLGlCQUFLLFlBRE47QUFFQ08sbUJBQU8sU0FBU2dCLFVBQVQsR0FBc0I7QUFDekIsb0JBQUksS0FBS0UsV0FBVCxFQUFzQjtBQUNsQix5QkFBS2QsU0FBTCxDQUFlZ0MsbUJBQWYsQ0FBbUMsT0FBbkMsRUFBNEMsS0FBS25CLG1CQUFqRDtBQUNBLHlCQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EseUJBQUtELG1CQUFMLEdBQTJCLElBQTNCO0FBQ0g7O0FBRUQsb0JBQUksS0FBS0csUUFBVCxFQUFtQjtBQUNmLHlCQUFLaEIsU0FBTCxDQUFlaUMsV0FBZixDQUEyQixLQUFLakIsUUFBaEM7QUFDQSx5QkFBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNIO0FBQ0o7QUFiRixTQTNEMkIsRUF5RTNCO0FBQ0MzQixpQkFBSyxjQUROO0FBRUNPLG1CQUFPLFNBQVNVLFlBQVQsR0FBd0I7QUFDM0IscUJBQUtGLFlBQUwsR0FBb0IsQ0FBQyxHQUFHekMsU0FBU0ksT0FBYixFQUFzQixLQUFLWSxNQUEzQixDQUFwQjtBQUNBLHFCQUFLb0QsUUFBTDtBQUNIO0FBTEYsU0F6RTJCLEVBK0UzQjtBQUNDMUMsaUJBQUssVUFETjtBQUVDTyxtQkFBTyxTQUFTbUMsUUFBVCxHQUFvQjtBQUN2QixvQkFBSUcsWUFBWSxLQUFLLENBQXJCOztBQUVBLG9CQUFJO0FBQ0FBLGdDQUFZekIsU0FBUzBCLFdBQVQsQ0FBcUIsS0FBS3BDLE1BQTFCLENBQVo7QUFDSCxpQkFGRCxDQUVFLE9BQU9xQyxHQUFQLEVBQVk7QUFDVkYsZ0NBQVksS0FBWjtBQUNIOztBQUVELHFCQUFLRyxZQUFMLENBQWtCSCxTQUFsQjtBQUNIO0FBWkYsU0EvRTJCLEVBNEYzQjtBQUNDN0MsaUJBQUssY0FETjtBQUVDTyxtQkFBTyxTQUFTeUMsWUFBVCxDQUFzQkgsU0FBdEIsRUFBaUM7QUFDcEMscUJBQUtqQyxPQUFMLENBQWFxQyxJQUFiLENBQWtCSixZQUFZLFNBQVosR0FBd0IsT0FBMUMsRUFBbUQ7QUFDL0NuQyw0QkFBUSxLQUFLQSxNQURrQztBQUUvQ0csMEJBQU0sS0FBS0UsWUFGb0M7QUFHL0NELDZCQUFTLEtBQUtBLE9BSGlDO0FBSS9Db0Msb0NBQWdCLEtBQUtBLGNBQUwsQ0FBb0JDLElBQXBCLENBQXlCLElBQXpCO0FBSitCLGlCQUFuRDtBQU1IO0FBVEYsU0E1RjJCLEVBc0czQjtBQUNDbkQsaUJBQUssZ0JBRE47QUFFQ08sbUJBQU8sU0FBUzJDLGNBQVQsR0FBMEI7QUFDN0Isb0JBQUksS0FBS3BDLE9BQVQsRUFBa0I7QUFDZCx5QkFBS0EsT0FBTCxDQUFhc0MsS0FBYjtBQUNIOztBQUVEaEIsdUJBQU9pQixZQUFQLEdBQXNCQyxlQUF0QjtBQUNIO0FBUkYsU0F0RzJCLEVBK0czQjtBQUNDdEQsaUJBQUssU0FETjtBQUVDTyxtQkFBTyxTQUFTZ0QsT0FBVCxHQUFtQjtBQUN0QixxQkFBS2hDLFVBQUw7QUFDSDtBQUpGLFNBL0cyQixFQW9IM0I7QUFDQ3ZCLGlCQUFLLFFBRE47QUFFQ3dELGlCQUFLLFNBQVNBLEdBQVQsR0FBZTtBQUNoQixvQkFBSTlDLFNBQVNGLFVBQVVmLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JlLFVBQVUsQ0FBVixNQUFpQkMsU0FBekMsR0FBcURELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxNQUFqRjs7QUFFQSxxQkFBS2lELE9BQUwsR0FBZS9DLE1BQWY7O0FBRUEsb0JBQUksS0FBSytDLE9BQUwsS0FBaUIsTUFBakIsSUFBMkIsS0FBS0EsT0FBTCxLQUFpQixLQUFoRCxFQUF1RDtBQUNuRCwwQkFBTSxJQUFJQyxLQUFKLENBQVUsb0RBQVYsQ0FBTjtBQUNIO0FBQ0osYUFWRjtBQVdDQyxpQkFBSyxTQUFTQSxHQUFULEdBQWU7QUFDaEIsdUJBQU8sS0FBS0YsT0FBWjtBQUNIO0FBYkYsU0FwSDJCLEVBa0kzQjtBQUNDekQsaUJBQUssUUFETjtBQUVDd0QsaUJBQUssU0FBU0EsR0FBVCxDQUFhbEUsTUFBYixFQUFxQjtBQUN0QixvQkFBSUEsV0FBV21CLFNBQWYsRUFBMEI7QUFDdEIsd0JBQUluQixVQUFVLENBQUMsT0FBT0EsTUFBUCxLQUFrQixXQUFsQixHQUFnQyxXQUFoQyxHQUE4Q1gsUUFBUVcsTUFBUixDQUEvQyxNQUFvRSxRQUE5RSxJQUEwRkEsT0FBT3NFLFFBQVAsS0FBb0IsQ0FBbEgsRUFBcUg7QUFDakgsNEJBQUksS0FBS2xELE1BQUwsS0FBZ0IsTUFBaEIsSUFBMEJwQixPQUFPdUUsWUFBUCxDQUFvQixVQUFwQixDQUE5QixFQUErRDtBQUMzRCxrQ0FBTSxJQUFJSCxLQUFKLENBQVUsbUZBQVYsQ0FBTjtBQUNIOztBQUVELDRCQUFJLEtBQUtoRCxNQUFMLEtBQWdCLEtBQWhCLEtBQTBCcEIsT0FBT3VFLFlBQVAsQ0FBb0IsVUFBcEIsS0FBbUN2RSxPQUFPdUUsWUFBUCxDQUFvQixVQUFwQixDQUE3RCxDQUFKLEVBQW1HO0FBQy9GLGtDQUFNLElBQUlILEtBQUosQ0FBVSx3R0FBVixDQUFOO0FBQ0g7O0FBRUQsNkJBQUtJLE9BQUwsR0FBZXhFLE1BQWY7QUFDSCxxQkFWRCxNQVVPO0FBQ0gsOEJBQU0sSUFBSW9FLEtBQUosQ0FBVSw2Q0FBVixDQUFOO0FBQ0g7QUFDSjtBQUNKLGFBbEJGO0FBbUJDQyxpQkFBSyxTQUFTQSxHQUFULEdBQWU7QUFDaEIsdUJBQU8sS0FBS0csT0FBWjtBQUNIO0FBckJGLFNBbEkyQixDQUE5Qjs7QUEwSkEsZUFBTzNELGVBQVA7QUFDSCxLQTVLcUIsRUFBdEI7O0FBOEtBbkMsV0FBT0QsT0FBUCxHQUFpQm9DLGVBQWpCO0FBQ0gsQ0FwT0QiLCJmaWxlIjoiY2xpcGJvYXJkLWFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ21vZHVsZScsICdzZWxlY3QnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmYWN0b3J5KG1vZHVsZSwgcmVxdWlyZSgnc2VsZWN0JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBtb2QgPSB7XG4gICAgICAgICAgICBleHBvcnRzOiB7fVxuICAgICAgICB9O1xuICAgICAgICBmYWN0b3J5KG1vZCwgZ2xvYmFsLnNlbGVjdCk7XG4gICAgICAgIGdsb2JhbC5jbGlwYm9hcmRBY3Rpb24gPSBtb2QuZXhwb3J0cztcbiAgICB9XG59KSh0aGlzLCBmdW5jdGlvbiAobW9kdWxlLCBfc2VsZWN0KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIF9zZWxlY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2VsZWN0KTtcblxuICAgIGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBvYmpcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgICAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICAgICAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgICAgIH07XG4gICAgfSgpO1xuXG4gICAgdmFyIENsaXBib2FyZEFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBDbGlwYm9hcmRBY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENsaXBib2FyZEFjdGlvbik7XG5cbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmluaXRTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZpbmVzIGJhc2UgcHJvcGVydGllcyBwYXNzZWQgZnJvbSBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAgICovXG5cblxuICAgICAgICBfY3JlYXRlQ2xhc3MoQ2xpcGJvYXJkQWN0aW9uLCBbe1xuICAgICAgICAgICAga2V5OiAncmVzb2x2ZU9wdGlvbnMnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc29sdmVPcHRpb25zKCkge1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gb3B0aW9ucy5hY3Rpb247XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXIgPSBvcHRpb25zLmVtaXR0ZXI7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBvcHRpb25zLnRhcmdldDtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnaW5pdFNlbGVjdGlvbicsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdFNlbGVjdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0RmFrZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYXJnZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ3NlbGVjdEZha2UnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdEZha2UoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHZhciBpc1JUTCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RpcicpID09ICdydGwnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVGYWtlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZha2VIYW5kbGVyQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZW1vdmVGYWtlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VIYW5kbGVyID0gdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmZha2VIYW5kbGVyQ2FsbGJhY2spIHx8IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHpvb21pbmcgb24gaU9TXG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5mb250U2l6ZSA9ICcxMnB0JztcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBib3ggbW9kZWxcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLmJvcmRlciA9ICcwJztcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgICAgICAgICAgICAgLy8gTW92ZSBlbGVtZW50IG91dCBvZiBzY3JlZW4gaG9yaXpvbnRhbGx5XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZVtpc1JUTCA/ICdyaWdodCcgOiAnbGVmdCddID0gJy05OTk5cHgnO1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgZWxlbWVudCB0byB0aGUgc2FtZSBwb3NpdGlvbiB2ZXJ0aWNhbGx5XG4gICAgICAgICAgICAgICAgdmFyIHlQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc3R5bGUudG9wID0geVBvc2l0aW9uICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIHRoaXMuZmFrZUVsZW0uc2V0QXR0cmlidXRlKCdyZWFkb25seScsICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZha2VFbGVtLnZhbHVlID0gdGhpcy50ZXh0O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5mYWtlRWxlbSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9ICgwLCBfc2VsZWN0Mi5kZWZhdWx0KSh0aGlzLmZha2VFbGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ3JlbW92ZUZha2UnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUZha2UoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmFrZUhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmZha2VIYW5kbGVyQ2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZha2VIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWtlSGFuZGxlckNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mYWtlRWxlbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLmZha2VFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWtlRWxlbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdzZWxlY3RUYXJnZXQnLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdFRhcmdldCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9ICgwLCBfc2VsZWN0Mi5kZWZhdWx0KSh0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5VGV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6ICdjb3B5VGV4dCcsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29weVRleHQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1Y2NlZWRlZCA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2NlZWRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKHRoaXMuYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VlZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVSZXN1bHQoc3VjY2VlZGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnaGFuZGxlUmVzdWx0JyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVSZXN1bHQoc3VjY2VlZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoc3VjY2VlZGVkID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJywge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHRoaXMuYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLnNlbGVjdGVkVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdGhpcy50cmlnZ2VyLFxuICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbjogdGhpcy5jbGVhclNlbGVjdGlvbi5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGtleTogJ2NsZWFyU2VsZWN0aW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclNlbGVjdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlci5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnZGVzdHJveScsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZha2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAnYWN0aW9uJyxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KCkge1xuICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdjb3B5JztcblxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hY3Rpb24gIT09ICdjb3B5JyAmJiB0aGlzLl9hY3Rpb24gIT09ICdjdXQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcImFjdGlvblwiIHZhbHVlLCB1c2UgZWl0aGVyIFwiY29weVwiIG9yIFwiY3V0XCInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiAndGFyZ2V0JyxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHRhcmdldCkge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmICh0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0YXJnZXQpKSA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0Lm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3Rpb24gPT09ICdjb3B5JyAmJiB0YXJnZXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwidGFyZ2V0XCIgYXR0cmlidXRlLiBQbGVhc2UgdXNlIFwicmVhZG9ubHlcIiBpbnN0ZWFkIG9mIFwiZGlzYWJsZWRcIiBhdHRyaWJ1dGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAnY3V0JyAmJiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSgncmVhZG9ubHknKSB8fCB0YXJnZXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcInRhcmdldFwiIGF0dHJpYnV0ZS4gWW91IGNhblxcJ3QgY3V0IHRleHQgZnJvbSBlbGVtZW50cyB3aXRoIFwicmVhZG9ubHlcIiBvciBcImRpc2FibGVkXCIgYXR0cmlidXRlcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJ0YXJnZXRcIiB2YWx1ZSwgdXNlIGEgdmFsaWQgRWxlbWVudCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxuICAgICAgICByZXR1cm4gQ2xpcGJvYXJkQWN0aW9uO1xuICAgIH0oKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gQ2xpcGJvYXJkQWN0aW9uO1xufSk7Il19
},{"select":8}],3:[function(require,module,exports){
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
},{"./clipboard-action":2,"good-listener":7,"tiny-emitter":9}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./closest":4}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{"./is":6,"delegate":5}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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