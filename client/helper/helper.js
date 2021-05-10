//handle error
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#serverMessage").animate({width:'toggle'},350);
};

//redirect
const redirect = (response) => {
    $("#serverMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

//send ajax request
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

//ajax request for submitting images
const sendImageAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        contentType: false,
        processData: false,
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};