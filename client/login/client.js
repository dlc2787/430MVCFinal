//login
const handleLogin = (e) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("Username or password is empty.");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

//signup
const handleSignup = (e) => {
    e.preventDefault();

    $("#serverMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
}

//JSX login window
const LogInWindow = (props) => {
    return (
    <form   id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
    >
    <label htmlFor="username">Username: </label>
    <input id="user" type ="text" name="username" placeholder="username"/><br/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type ="password" name="pass" placeholder="password"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Sign In" />
    </form>
    );
};

//JSX sign up window
const SignupWindow = (props) => {
    return (
    <form   id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
    >
    <label htmlFor="username">Username: </label>
    <input id="user" type ="text" name="username" placeholder="username"/><br/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type ="password" name="pass" placeholder="password"/><br/>
    <label htmlFor="pass2">Password: </label>
    <input id="pass2" type ="password" name="pass2" placeholder="retype password"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Sign up" />
    </form>
    );
};

//render login window
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LogInWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//render sign up window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//setup login pages
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

//get csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});