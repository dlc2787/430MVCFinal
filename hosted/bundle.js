"use strict";

var handleUpload = function handleUpload(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if (!$("#domoName").val()) {
    handleError("Please add an image to host!");
    return false;
  }

  var data = new FormData($("#imgForm")[0]);
  sendImageAjax('post', $("#imgForm").attr("action"), data, function () {
    loadDomosFromServer();
  });
  return false;
}; //password update


var handleUpdate = function handleUpdate(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords do not match.");
    return false;
  }

  sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), redirect);
  return false;
};

var UpdateWindow = function UpdateWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "updateForm",
    name: "updateForm",
    onSubmit: handleUpdate,
    action: "/updatePass",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass2"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "retype new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign up"
  }));
};

var ImgForm = function ImgForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "imgForm",
    onSubmit: handleUpload,
    name: "imgForm",
    action: "/upload",
    method: "post",
    encType: "multipart/form-data",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pic"
  }, "Image to Host: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    accept: "image/*",
    type: "file",
    name: "pic"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "nameDomoSubmit",
    type: "submit",
    value: "Upload"
  }));
};

var EmptySpace = function EmptySpace() {
  return /*#__PURE__*/React.createElement("div", null);
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, " No Domos yet"));
  }

  ;
  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Height: ", domo.height, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var createUpdateWindow = function createUpdateWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UpdateWindow, {
    csrf: csrf
  }), document.querySelector("#domos"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#makeDomo"));
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var createDomoWindow = function createDomoWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ImgForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var setup = function setup(csrf) {
  var updateButton = document.querySelector("#updateButton");
  var domoButton = document.querySelector("#domoButton");
  updateButton.addEventListener("click", function (e) {
    e.preventDefault();
    createUpdateWindow(csrf);
    return false;
  });
  domoButton.addEventListener("click", function (e) {
    e.preventDefault();
    createDomoWindow(csrf);
    return false;
  });
  createDomoWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

//handle error
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
}; //redirect


var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //send ajax


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var sendImageAjax = function sendImageAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    contentType: false,
    processData: false,
    success: success,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
