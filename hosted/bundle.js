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
    loadImagesFromServer();
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

var handleUpgrade = function handleUpgrade(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#preForm").attr("action"), $("#preForm").serialize(), redirect);
  return false;
};

var visitImage = function visitImage(name) {
  window.location = "/image?image=".concat(name);
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

var PremiumForm = function PremiumForm(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Upgrade to Premium Account"), /*#__PURE__*/React.createElement("form", {
    id: "preForm",
    onSubmit: handleUpgrade,
    name: "preForm",
    action: "/upgrade",
    method: "post",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "nameDomoSubmit",
    type: "submit",
    value: "Upgrade!"
  })));
};

var Advertisement = function Advertisement() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/ad.png",
    alt: "a wonderful advertisement :)"
  })));
};

var EmptySpace = function EmptySpace() {
  return /*#__PURE__*/React.createElement("div", null);
};

var ImageList = function ImageList(props) {
  if (props.images.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, " No Images yet"));
  }

  ;
  var imageNodes = props.images.map(function (image) {
    return /*#__PURE__*/React.createElement("div", {
      key: image._id,
      className: "domo",
      onClick: function onClick() {
        return visitImage(image.name);
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "img",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", image.name, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, imageNodes);
};

var createUpdateWindow = function createUpdateWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UpdateWindow, {
    csrf: csrf
  }), document.querySelector("#domos"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#makeDomo"));
};

var loadImagesFromServer = function loadImagesFromServer() {
  sendAjax('GET', '/getImages', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ImageList, {
      images: data.images
    }), document.querySelector("#domos"));
  });
};

var createDisplayWindow = function createDisplayWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ImgForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ImageList, {
    images: []
  }), document.querySelector("#domos"));
  loadImagesFromServer();
};

var createUpgradeWindow = function createUpgradeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PremiumForm, {
    csrf: csrf
  }), document.querySelector("#domos"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#makeDomo"));
};

var handleAds = function handleAds() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Advertisement, null), document.querySelector("#ads"));
};

var setup = function setup(csrf) {
  var updateButton = document.querySelector("#updateButton");
  var displayButton = document.querySelector("#domoButton");
  var upgradeButton = document.querySelector("#upgradeButton");
  updateButton.addEventListener("click", function (e) {
    e.preventDefault();
    createUpdateWindow(csrf);
    return false;
  });
  displayButton.addEventListener("click", function (e) {
    e.preventDefault();
    createDisplayWindow(csrf);
    return false;
  });
  upgradeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createUpgradeWindow(csrf);
    return false;
  });
  createDisplayWindow(csrf);
  handleAds();
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
