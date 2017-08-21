// Contactform
jQuery(function($)
{
    //contact form
    $("#contact_form").submit(function()
    {
        var email = $("#email").val(); // get email field value
        var name = $("#name").val(); // get name field value
        var msg = $("#msg").val(); // get message field value
        var title = $("title").text();//get title of the page to add as tittle
        $.ajax(
        {
            type: "POST",
            url: "https://api.sendgrid.com/api/mail.send.json",
            data: {
                'api_user': 'ideaninja.io',
                'api_key': '817cHY0U5m311Funnyy0u83tterc411',
                'from': email,
                'reply-To': email,
                'subject': title,
                'text': name + " | " + msg,
                'to': 'contactus@ideaninja.io',
                'toname': 'Contact Us - ideaninja.io'
            }
        })
        .done(function(response) {
            alert('Your message has been sent. Thank you!'); // show success message
            $("#name").val(''); // reset field after successful submission
            $("#email").val(''); // reset field after successful submission
            $("#msg").val(''); // reset field after successful submission
        })
        .fail(function(response) {
            alert('Your message has been sent. Thank you!'); // show success message
            $("#name").val(''); // reset field after successful submission
            $("#email").val(''); // reset field after successful submission
            $("#msg").val(''); // reset field after successful submission
        });
        return false; // prevent page refresh
    });// end of contact form

    // service form
    $("#service_form").submit(function()
    {
        var companyname = $("#companyname").val(); 
        var contactname = $("#contactname").val(); 
        var email = $("#email").val();
        var preferedcontacttype = $("#preferedcontacttype").val();
        var servicepackage = $("#servicepackage").val();
        var msg = $("#msg").val(); // get message field value
        var title = $("title").text();//get title of the page to add as tittle
        var emailtext = ("company name: " + companyname +  " contact name: " + contactname  + " prefered contact type: " + preferedcontacttype + "service Package: "+ servicepackage + " Message: " + msg) ; 
        /*msg */


        $.ajax(
        {
            type: "POST",
            url: "https://api.sendgrid.com/api/mail.send.json",
            data: {
                'api_user': 'ideaninja.io',
                'api_key': '817cHY0U5m311Funnyy0u83tterc411',
                'from': email,
                'reply-To': email,
                'subject': title,
                'text': emailtext,
                'to': 'contactus@ideaninja.io',
                'toname': 'Contact Us - ideaninja.io'
            }
        })
        .done(function(response) {
            alert('Your message has been sent. Thank you!'); // show success message
            $("#name").val(''); // reset field after successful submission
            $("#email").val(''); // reset field after successful submission
            $("#msg").val(''); // reset field after successful submission
        })
        .fail(function(response) {
            alert('Your message has been sent. Thank you!'); // show success message
            $("#name").val(''); // reset field after successful submission
            $("#email").val(''); // reset field after successful submission
            $("#msg").val(''); // reset field after successful submission
        });
        return false; // prevent page refresh
    });
});
