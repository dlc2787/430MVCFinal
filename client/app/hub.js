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

const handleUpgrade = (e) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    sendAjax('POST', $("#preForm").attr("action"), $("#preForm").serialize(), redirect);

    return false
}

const visitImage = (name) => {
    window.location = `/image?image=${name}`;
}

const removeImage = (e, formId, csrf) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    sendAjax('POST', $(`#${formId}`).attr("action"), $(`#${formId}`).serialize(), function() {
        loadImagesFromServer(csrf);
        updateSlots();
    });
}

const copyUrl = (imgname, callbutton) => {
    const copyurl = $(`#${imgname}`);
    copyurl.select();
    document.execCommand("copy");
    ReactDOM.render(
        "Copied!",
        document.querySelector(`#${callbutton}`)
    );
}

const UpdateWindow = (props) => {
    return (
    <form   id="updateForm"
            name="updateForm"
            onSubmit={handleUpdate}
            action="/updatePass"
            method="POST"
            className="mainForm"
    >
    <label htmlFor="oldPass">Password: </label>
    <input id="pass" type ="password" name="pass" placeholder="old password"/>
    <label htmlFor="newPass">New Password: </label>
    <input id="newPass" type ="password" name="newPass" placeholder="new password"/>
    <label htmlFor="newPass2">New Password: </label>
    <input id="newPass2" type ="password" name="newPass2" placeholder="retype new password"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Sign up" />
    </form>
    );
};

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

const PremiumForm = (props) => {
    return (
        <div>
        <h2>Upgrade to Premium Account</h2>
        <form id="preForm"
            onSubmit={handleUpgrade}
            name="preForm"
            action="/upgrade"
            method="post"
            className="imageForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="imageSubmit" type="submit" value="Upgrade!" />
            </form>
        </div>
    );
};

const SlotStatus = (props) => {
    return (
        <span>
            Slots Remaining: {props.slots}
        </span>
    );
};

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

const EmptySpace = () => {
    return (<div></div>);
}

const ImageList = function(props) {
    if (props.images.length === 0) {
        return (
            <div className="imgList">
                <h3 className="emptyBlock"> Use the form at the top of the page to host your first image!</h3>
            </div>
        );
    };

    //big block for image display
    const imageNodes = props.images.map(function(image) {
        return (
            <div key={image._id} className="imageSpot">
                <img src={`/image?image=${image.name}`} alt="img" className="imgIcon" onClick={() => visitImage(image.name)} />
                <h3 className="nameText">Name: {image.name} </h3>
                <label htmlFor="urlbox">Hosted URL:</label>
                <input id={`U${image._id}`} type="text" name="urlbox" className="urlText" value={`${window.location.origin}/image?image=${image.name}`} readOnly />
                <button id={`C${image._id}`} onClick={() => copyUrl(`U${image._id}`, `C${image._id}`)}>Copy URL!</button>
                <form id={`R${image._id}`}
                    onSubmit={(e) => { removeImage(e, `R${image._id}`, props.csrf) }}
                    name={`R${image._id}`}
                    action="/remove"
                    method="post"
                    >
                <input type="hidden" name="_id" value={image._id} />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="imageSubmit" type="submit" value="Remove" />
            </form>
            </div>
        );
    });

    return (
        <div className="imgList">
            {imageNodes}
        </div>
    );
};

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

const loadImagesFromServer = (csrf) => {
    sendAjax('GET', '/getImages', null, (data) => {
        ReactDOM.render(
            <ImageList images={data.images} csrf={csrf} />, document.querySelector("#imgDisplay")
        );
    });
};

const createDisplayWindow = (csrf) => {
    ReactDOM.render(
        <ImgForm csrf={csrf} />, document.querySelector("#uploader")
    );

    ReactDOM.render(
        <ImageList images={[]} csrf={csrf} />, document.querySelector("#imgDisplay")
    );

    loadImagesFromServer(csrf);
};

const createUpgradeWindow = (csrf) => {
    ReactDOM.render(
        <PremiumForm csrf={csrf} />, document.querySelector("#imgDisplay")
    );
    ReactDOM.render(
        <EmptySpace />,
        document.querySelector("#uploader")
    );
};

const handleAds = () => {
    sendAjax('GET', '/user', null, (data) => {
        ReactDOM.render(
            <Advertisement isPremium={data.isPremium} />, document.querySelector("#ads")
        );
    });
};

const updateSlots = () => {
    sendAjax('GET', '/user', null, (data) => {
        ReactDOM.render(
            <SlotStatus slots={data.slots} />, document.querySelector("#slots")
        );
    });
}

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

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});