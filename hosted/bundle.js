"use strict";

//upload an imange
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
}; //upgrade to premium account


var handleUpgrade = function handleUpgrade(e) {
  e.preventDefault();
  $("#serverMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#preForm").attr("action"), $("#preForm").serialize(), redirect);
  return false;
}; //go the the images hosted URL


var visitImage = function visitImage(name) {
  window.location = "/image?image=".concat(name);
}; //remove a hosted image from a user's account/ the database


var removeImage = function removeImage(e, formId, csrf) {
  e.preventDefault();
  $("#serverMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#".concat(formId)).attr("action"), $("#".concat(formId)).serialize(), function () {
    loadImagesFromServer(csrf);
    updateSlots();
  });
}; //copy an hosted url to clipboard


var copyUrl = function copyUrl(imgname, callbutton) {
  var copyurl = $("#".concat(imgname));
  copyurl.select();
  document.execCommand("copy");
  ReactDOM.render("Copied!", document.querySelector("#".concat(callbutton)));
}; //JSX form to allow password updates


var UpdateWindow = function UpdateWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "updateForm",
    name: "updateForm",
    onSubmit: handleUpdate,
    action: "/updatePass",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("h2", null, "Change your password"), /*#__PURE__*/React.createElement("label", {
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
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
}; //JSX form to submit images


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
}; //JSX form to upgrade to premium


var PremiumForm = function PremiumForm(props) {
  if (!props.isPremium) {
    return /*#__PURE__*/React.createElement("form", {
      id: "preForm",
      onSubmit: handleUpgrade,
      name: "preForm",
      action: "/upgrade",
      method: "post",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("h2", null, "Upgrade to a Premium Account"), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Upgrade!"
    }));
  } else {
    return /*#__PURE__*/React.createElement("h2", {
      className: "notice"
    }, "Your account is already premium!");
  }
}; //display how many image slots a user has left


var SlotStatus = function SlotStatus(props) {
  return /*#__PURE__*/React.createElement("span", null, "Slots Remaining: ", props.slots);
}; //JSX advertisement


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
}; //when something previously filled needs to not be shown


var EmptySpace = function EmptySpace() {
  return /*#__PURE__*/React.createElement("div", null);
}; //display the images a user has uploaded


var ImageList = function ImageList(props) {
  if (props.images.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "imgList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyBlock"
    }, " Use the form at the top of the page to host your first image!"));
  }

  ; //big block for image display
  //throws in a preview of each image, name, and puts the url in a textbox so users can copy it
  //also provides a mini-form to allow the user to remove images
  //image preview is linked to the image's hosted URL

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
    }), /*#__PURE__*/React.createElement("div", {
      className: "info"
    }, /*#__PURE__*/React.createElement("h3", {
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
      className: "cpyBtn",
      onClick: function onClick() {
        return copyUrl("U".concat(image._id), "C".concat(image._id));
      }
    }, "Copy URL!"), /*#__PURE__*/React.createElement("form", {
      id: "R".concat(image._id),
      className: "removeForm",
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
      className: "removeSubmit",
      type: "submit",
      value: "Remove"
    }))));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "imgList"
  }, imageNodes);
}; //render password update window


var createUpdateWindow = function createUpdateWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UpdateWindow, {
    csrf: csrf
  }), document.querySelector("#imgDisplay"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#uploader"));
}; //grabs a user's images for display


var loadImagesFromServer = function loadImagesFromServer(csrf) {
  sendAjax('GET', '/getImages', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ImageList, {
      images: data.images,
      csrf: csrf
    }), document.querySelector("#imgDisplay"));
  });
}; //renders the window where users can see their images and upload new ones


var createDisplayWindow = function createDisplayWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ImgForm, {
    csrf: csrf
  }), document.querySelector("#uploader"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ImageList, {
    images: [],
    csrf: csrf
  }), document.querySelector("#imgDisplay"));
  loadImagesFromServer(csrf);
}; //render the window to upgrade your account


var createUpgradeWindow = function createUpgradeWindow(csrf) {
  sendAjax('GET', '/user', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PremiumForm, {
      csrf: csrf,
      isPremium: data.isPremium
    }), document.querySelector("#imgDisplay"));
    ReactDOM.render( /*#__PURE__*/React.createElement(EmptySpace, null), document.querySelector("#uploader"));
  });
}; //render ads


var handleAds = function handleAds() {
  sendAjax('GET', '/user', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Advertisement, {
      isPremium: data.isPremium
    }), document.querySelector("#ads"));
  });
}; //display to the user the number of slots they currently have for images


var updateSlots = function updateSlots() {
  sendAjax('GET', '/user', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SlotStatus, {
      slots: data.slots
    }), document.querySelector("#slots"));
  });
}; //setup hub display


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
}; //retriece csrf token


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
}; //send ajax request


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
}; //ajax request for submitting images


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
