//upload an imange
const handleUpload = (e, csrf) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    if(!$("#imgName").val()){
        handleError("Please add an image to host!");
        return false;
    }

    const data = new FormData($("#imgForm")[0]);

    sendImageAjax('post', $("#imgForm").attr("action"), data, function() {
        loadImagesFromServer(csrf);
        $("#imgform")[0].value = "";
        updateSlots();
    });

    return false;
};

//password update
const handleUpdate = (e) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    if($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    if($("#newPass").val() !== $("#newPass2").val()) {
        handleError("Passwords do not match.");
        return false;
    }

    sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), redirect);

    return false;
}

//upgrade to premium account
const handleUpgrade = (e) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    sendAjax('POST', $("#preForm").attr("action"), $("#preForm").serialize(), redirect);

    return false
}

//go the the images hosted URL
const visitImage = (name) => {
    window.location = `/image?image=${name}`;
}

//remove a hosted image from a user's account/ the database
const removeImage = (e, formId, csrf) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    sendAjax('POST', $(`#${formId}`).attr("action"), $(`#${formId}`).serialize(), function() {
        loadImagesFromServer(csrf);
        updateSlots();
    });
}

//copy an hosted url to clipboard
const copyUrl = (imgname, callbutton) => {
    const copyurl = $(`#${imgname}`);
    copyurl.select();
    document.execCommand("copy");
    ReactDOM.render(
        "Copied!",
        document.querySelector(`#${callbutton}`)
    );
}

//JSX form to allow password updates
const UpdateWindow = (props) => {
    return (
    <form   id="updateForm"
            name="updateForm"
            onSubmit={handleUpdate}
            action="/updatePass"
            method="POST"
            className="mainForm"
    >
        <h2>Change your password</h2>
    <label htmlFor="oldPass">Password: </label>
    <input id="pass" type ="password" name="pass" placeholder="old password"/>
    <label htmlFor="newPass">New Password: </label>
    <input id="newPass" type ="password" name="newPass" placeholder="new password"/>
    <label htmlFor="newPass2">New Password: </label>
    <input id="newPass2" type ="password" name="newPass2" placeholder="retype password"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Change Password" />
    </form>
    );
};

//JSX form to submit images
const ImgForm = (props) => {
    return (
        <form id="imgForm"
            onSubmit={ (e) => handleUpload(e, props.csrf) }
            name="imgForm"
            action="/upload"
            method="post"
            encType="multipart/form-data"
            className="imageForm"
            >
                <label htmlFor="pic">Image to Host: </label>
                <input id="imgName" accept="image/*" type="file" name="pic" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="imageSubmit" type="submit" value="Upload" />
            </form>
    );
};

//JSX form to upgrade to premium
const PremiumForm = (props) => {
    if (!props.isPremium){
    return (
        <form id="preForm"
            onSubmit={handleUpgrade}
            name="preForm"
            action="/upgrade"
            method="post"
            className="mainForm"
            >
                <h2>Upgrade to a Premium Account</h2>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Upgrade!" />
            </form>
    );
}
else {
    return (<h2 className="notice">Your account is already premium!</h2>);
}
};

//display how many image slots a user has left
const SlotStatus = (props) => {
    return (
        <span>
            Slots Remaining: {props.slots}
        </span>
    );
};

//JSX advertisement
const Advertisement = (props) => {
    if (!props.isPremium)
    {
        return (
            <div>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              <img src="/assets/img/ad.png" alt="a wonderful advertisement :)"></img>
              </a>
           </div>
        );
    }
    else
    {
        return (
            <div>
                <img src="/assets/img/premium.png" alt="Thank you!"></img>
            </div>
        );
    }
};

//when something previously filled needs to not be shown
const EmptySpace = () => {
    return (<div></div>);
}

//display the images a user has uploaded
const ImageList = function(props) {
    if (props.images.length === 0) {
        return (
            <div className="imgList">
                <h3 className="emptyBlock"> Use the form at the top of the page to host your first image!</h3>
            </div>
        );
    };

    //big block for image display
    //throws in a preview of each image, name, and puts the url in a textbox so users can copy it
    //also provides a mini-form to allow the user to remove images
    //image preview is linked to the image's hosted URL
    const imageNodes = props.images.map(function(image) {
        return (
            <div key={image._id} className="imageSpot">
                <img src={`/image?image=${image.name}`} alt="img" className="imgIcon" onClick={() => visitImage(image.name)} />
                <div className="info">
                <h3 className="nameText">Name: {image.name} </h3>
                <label htmlFor="urlbox">Hosted URL:</label>
                <input id={`U${image._id}`} type="text" name="urlbox" className="urlText" value={`${window.location.origin}/image?image=${image.name}`} readOnly />
                <button id={`C${image._id}`} className="cpyBtn" onClick={() => copyUrl(`U${image._id}`, `C${image._id}`)}>Copy URL!</button>
                <form id={`R${image._id}`}
                    className="removeForm"
                    onSubmit={(e) => { removeImage(e, `R${image._id}`, props.csrf) }}
                    name={`R${image._id}`}
                    action="/remove"
                    method="post"
                    >
                <input type="hidden" name="_id" value={image._id} />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="removeSubmit" type="submit" value="Remove" />
                </form>
                </div>
            </div>
        );
    });

    return (
        <div className="imgList">
            {imageNodes}
        </div>
    );
};

//render password update window
const createUpdateWindow = (csrf) => {
        ReactDOM.render(
            <UpdateWindow csrf={csrf} />,
            document.querySelector("#imgDisplay")
        );
        ReactDOM.render(
            <EmptySpace />,
            document.querySelector("#uploader")
        );
};

//grabs a user's images for display
const loadImagesFromServer = (csrf) => {
    sendAjax('GET', '/getImages', null, (data) => {
        ReactDOM.render(
            <ImageList images={data.images} csrf={csrf} />, document.querySelector("#imgDisplay")
        );
    });
};

//renders the window where users can see their images and upload new ones
const createDisplayWindow = (csrf) => {
    ReactDOM.render(
        <ImgForm csrf={csrf} />, document.querySelector("#uploader")
    );

    ReactDOM.render(
        <ImageList images={[]} csrf={csrf} />, document.querySelector("#imgDisplay")
    );

    loadImagesFromServer(csrf);
};

//render the window to upgrade your account
const createUpgradeWindow = (csrf) => {
    sendAjax('GET', '/user', null, (data) => {
        ReactDOM.render(
            <PremiumForm csrf={csrf} isPremium={data.isPremium} />, document.querySelector("#imgDisplay")
        );
        ReactDOM.render(
            <EmptySpace />,
            document.querySelector("#uploader")
        );
    });
};

//render ads
const handleAds = () => {
    sendAjax('GET', '/user', null, (data) => {
        ReactDOM.render(
            <Advertisement isPremium={data.isPremium} />, document.querySelector("#ads")
        );
    });
};

//display to the user the number of slots they currently have for images
const updateSlots = () => {
    sendAjax('GET', '/user', null, (data) => {
        ReactDOM.render(
            <SlotStatus slots={data.slots} />, document.querySelector("#slots")
        );
    });
}

//setup hub display
const setup = function(csrf) {
    const updateButton = document.querySelector("#updateButton");
    const displayButton = document.querySelector("#imgButton");
    const upgradeButton = document.querySelector("#upgradeButton");

    updateButton.addEventListener("click", (e) => {
        e.preventDefault();
        createUpdateWindow(csrf);
        return false;
    });

    displayButton.addEventListener("click", (e) => {
        e.preventDefault();
        createDisplayWindow(csrf);
        return false;
    });

    upgradeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createUpgradeWindow(csrf);
        return false;
    });

    createDisplayWindow(csrf);
    updateSlots();
    handleAds();
};

//retriece csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});