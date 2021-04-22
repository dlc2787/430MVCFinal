const handleUpload = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if(!$("#domoName").val()){
        handleError("Please add an image to host!");
        return false;
    }

    const data = new FormData($("#imgForm")[0]);

    sendImageAjax('post', $("#imgForm").attr("action"), data, function() {
        loadDomosFromServer();
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

const EmptySpace = () => {
    return (<div></div>);
}

const DomoList = function(props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo"> No Domos yet</h3>
            </div>
        );
    };

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
                <h3 className="domoAge">Height: {domo.height} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
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

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const createDomoWindow = (csrf) => {
    ReactDOM.render(
        <ImgForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
}

const setup = function(csrf) {
    const updateButton = document.querySelector("#updateButton");
    const domoButton = document.querySelector("#domoButton");

    updateButton.addEventListener("click", (e) => {
        e.preventDefault();
        createUpdateWindow(csrf);
        return false;
    });

    domoButton.addEventListener("click", (e) => {
        e.preventDefault();
        createDomoWindow(csrf);
        return false;
    });

    createDomoWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});