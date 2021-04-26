const handleUpload = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if(!$("#domoName").val()){
        handleError("Please add an image to host!");
        return false;
    }

    const data = new FormData($("#imgForm")[0]);

    sendImageAjax('post', $("#imgForm").attr("action"), data, function() {
        loadImagesFromServer();
    });

    return false;
};

//password update
const handleUpdate = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

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

    $("#domoMessage").animate({width:'hide'},350);

    sendAjax('POST', $("#preForm").attr("action"), $("#preForm").serialize(), redirect);

    return false
}

const visitImage = (name) => {
    window.location = `/image?image=${name}`;
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
            onSubmit={handleUpload}
            name="imgForm"
            action="/upload"
            method="post"
            encType="multipart/form-data"
            className="domoForm"
            >
                <label htmlFor="pic">Image to Host: </label>
                <input id="domoName" accept="image/*" type="file" name="pic" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="nameDomoSubmit" type="submit" value="Upload" />
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
            className="domoForm"
            >
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="nameDomoSubmit" type="submit" value="Upgrade!" />
            </form>
        </div>
    );
};

const Advertisement = () => {
    return (
        <div>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            <img src="/assets/img/ad.png" alt="a wonderful advertisement :)"></img>
            </a>
        </div>
    );
};

const EmptySpace = () => {
    return (<div></div>);
}

const ImageList = function(props) {
    if (props.images.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo"> No Images yet</h3>
            </div>
        );
    };

    const imageNodes = props.images.map(function(image) {
        return (
            <div key={image._id} className="domo" onClick={() => visitImage(image.name)}>
                <img src="/assets/img/domoface.jpeg" alt="img" className="domoFace" />
                <h3 className="domoName">Name: {image.name} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {imageNodes}
        </div>
    );
};

const createUpdateWindow = (csrf) => {
    ReactDOM.render(
        <UpdateWindow csrf={csrf} />,
        document.querySelector("#domos")
    );
    ReactDOM.render(
        <EmptySpace />,
        document.querySelector("#makeDomo")
    );
};

const loadImagesFromServer = () => {
    sendAjax('GET', '/getImages', null, (data) => {
        ReactDOM.render(
            <ImageList images={data.images} />, document.querySelector("#domos")
        );
    });
};

const createDisplayWindow = (csrf) => {
    ReactDOM.render(
        <ImgForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <ImageList images={[]} />, document.querySelector("#domos")
    );

    loadImagesFromServer();
};

const createUpgradeWindow = (csrf) => {
    ReactDOM.render(
        <PremiumForm csrf={csrf} />, document.querySelector("#domos")
    );
    ReactDOM.render(
        <EmptySpace />,
        document.querySelector("#makeDomo")
    );
};

const handleAds = () => {
    ReactDOM.render(
        <Advertisement/>, document.querySelector("#ads")
    );
};

const setup = function(csrf) {
    const updateButton = document.querySelector("#updateButton");
    const displayButton = document.querySelector("#domoButton");
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