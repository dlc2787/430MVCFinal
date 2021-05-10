"use strict";

var handleUpload = function handleUpload(e, csrf) {
  e.preventDefault();
  $("#serverMessage").animate({
    width: 'hide'
  }, 350);

  if (!$("#imgName").val()) {
    handleError("Please add an image to host!");
    return false;
  }

  var data = new FormData($("#imgForm")[0]);
  sendImageAjax('post', $("#imgForm").attr("action"), data, function () {
    loadImagesFromServer(csrf);
    updateSlots();
  });
  return false;
}; //password update


var handleUpdate = function handleUpdate(e) {
  e.preventDefault();
  $("#serverMessage").animate({
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
  $("#serverMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#preForm").attr("action"), $("#preForm").serialize(), redirect);
  return false;
};

var visitImage = function visitImage(name) {
  window.location = "/image?image=".concat(name);
};

var removeImage = function removeImage(e, formId, csrf) {
  e.preventDefault();
  $("#serverMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#".concat(formId)).attr("action"), $("#".concat(formId)).serialize(), function () {
    loadImagesFromServer(csrf);
    updateSlots();
  });
};

var copyUrl = function copyUrl(imgname, callbutton) {
  var copyurl = $("#".concat(imgname));
  copyurl.select();
  document.execCommand("copy");
  ReactDOM.render("Copied!", document.querySelector("#".concat(callbutton)));
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
    onSubmit: function onSubmit(e) {
      return handleUpload(e, props.csrf);
    },
    name: "imgForm",
    action: "/upload",
    method: "post",
    encType: "multipart/form-data",
    className: "imageForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pic"
  }, "Image to Host: "), /*#__PURE__*/React.createElement("input", {
    id: "imgName",
    accept: "image/*",
    type: "file",
    name: "pic"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "imageSubmit",
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
    className: "imageForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "imageSubmit",
    type: "submit",
    value: "Upgrade!"
  })));
};

var SlotStatus = function SlotStatus(props) {
  return /*#__PURE__*/React.createElement("span", null, "Slots Remaining: ", props.slots);
};

var Advertisement = function Advertisement(props) {
  if (!props.isPremium) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/ad.png",
      alt: "a wonderful advertisement :)"
    })));
  } else {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/premium.png",
      alt: "Thank you!"
    }));
  }
};

var EmptySpace = function EmptySpace() {
  return /*#__PURE__*/React.createElement("div", null);
};

var ImageList = function ImageList(props) {
  if (props.images.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "imgList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyBlock"
    }, " Use the form at the top of the page to host your first image!"));
  }

  ; //big block for image display

  var imageNodes = props.images.map(function (image) {
    return /*#__PURE__*/React.createElement("div", {
      key: image._id,
      className: "imageSpot"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/image?image=".concat(image.name),
      alt: "img",
      className: "imgIcon",
      onClick: function onClick() {
        return visitImage(image.name);
      }
    }), /*#__PURE__*/React.createElement("h3", {
      className: "nameText"
    }, "Name: ", image.name, " "), /*#__PURE__*/React.createElement("label", {
      htmlFor: "urlbox"
    }, "Hosted URL:"), /*#__PURE__*/React.createElement("input", {
      id: "U".concat(image._id),
      type: "text",
      name: "urlbox",
      className: "urlText",
      value: "".concat(window.location.origin, "/image?image=").concat(image.name),
      readOnly: true
    }), /*#__PURE__*/React.createElement("button", {
      id: "C".concat(image._id),
      onClick: function onClick() {
        return copyUrl("U".concat(image._id), "C".concat(image._id));
      }
    }, "Copy URL!"), /*#__PURE__*/React.createElement("form", {
      id: "R".concat(image._id),
      onSubmit: function onSubmit(e) {
        removeImage(e, "R".concat(image._id), props.csrf);
      },
      name: "R".concat(image._id),
      action: "/remove",
      method: "post"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_id",
      value: image._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "imageSubmit",
      type: "submit",
      value: "Remove"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "imgList"
  }, imageNodes);
};

var createUpdateWindow = function createUpdateWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UpdateWindow, {
    csrf: csrf
  }), document.querySelector("#imgDisplay"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#uploader"));
};

var loadImagesFromServer = function loadImagesFromServer(csrf) {
  sendAjax('GET', '/getImages', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ImageList, {
      images: data.images,
      csrf: csrf
    }), document.querySelector("#imgDisplay"));
  });
};

var createDisplayWindow = function createDisplayWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ImgForm, {
    csrf: csrf
  }), document.querySelector("#uploader"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ImageList, {
    images: [],
    csrf: csrf
  }), document.querySelector("#imgDisplay"));
  loadImagesFromServer(csrf);
};

var createUpgradeWindow = function createUpgradeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PremiumForm, {
    csrf: csrf
  }), document.querySelector("#imgDisplay"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#uploader"));
};

var handleAds = function handleAds() {
  sendAjax('GET', '/user', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Advertisement, {
      isPremium: data.isPremium
    }), document.querySelector("#ads"));
  });
};

var updateSlots = function updateSlots() {
  sendAjax('GET', '/user', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SlotStatus, {
      slots: data.slots
    }), document.querySelector("#slots"));
  });
};

var setup = function setup(csrf) {
  var updateButton = document.querySelector("#updateButton");
  var displayButton = document.querySelector("#imgButton");
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
  updateSlots();
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
  $("#serverMessage").animate({
    width: 'toggle'
  }, 350);
}; //redirect


var redirect = function redirect(response) {
  $("#serverMessage").animate({
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
