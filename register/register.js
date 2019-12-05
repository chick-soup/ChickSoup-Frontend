const server = "http://chicksoup.pythonanywhere.com";
const register = {
    "inputEmail": document.querySelector("#register_input_email"),
    "inputEmailCheck": document.querySelector("#register_input_email_check"),
    "inputPassword": document.querySelector("#register_input_password"),
    "inputPasswordCheck": document.querySelector("#register_input_password_check"),
    "passwordNotMath": document.querySelector("#passwordNotMatch"),
    "errorText": document.querySelectorAll(".errorText"),
}

function registerEmailCheck() {
    const errorText = register.errorText[0];
    const value = register.inputEmail.value;
    const url = "/email/check";
    const data = {
        "email": value,
    };
    axiosPost(url, data).then(() => {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "이메일을 전송하였습니다."
        errorText.style.color = "#005aff";
    }).catch((error) => {
        const state = error.response.status;
        setTextDisplay(errorText, "inline");
        if(state === 470) {
            register.inputEmail.setAttribute("readOnly", false);
            errorText.innerHTML = "이미 생성된 이메일입니다.";
        } else if (state === 400) {
            errorText.innerHTML = "이메일을 입력해주세요.";
        }
    })
}

function registerEmailAuth() {
    const errorText = register.errorText[1];
    const url = "/email/auth";
    const data = {
        "email": register.inputEmail.value.trim(),
        "auth_code": register.inputEmailCheck.value.trim(),
    };
    axiosPost(url, data).then(() => {
        errorText.innerHTML = "인증에 성공했습니다."
        errorText.classList.add("goodText");
    }).catch((error) => {
        const state = error.response.status;
        setTextDisplay(errorText, "inline");
        if (state === 471) {
            errorText.innerHTML = "이메일을 확인해주세요.";
        } else if (state === 472) {
            errorText.innerHTML = "인증코드가 올바르지 않습니다.";
        }
    })
}

function signup() {
    const errorText = register.errorText[2];
    const url = "/user/signup";
    const data = {
        "email": register.inputEmail.value.trim(),
        "password": register.inputPassword.value.trim(),
    };
    if(!checkPassword())
        return;
    axiosPost(url, data).then((datas) => {
        localStorage.setItem("access_token", datas.data.access_token);
        location.href = "../userInfo/userInfo.html";
    }).catch((error) => {
        const state = error.response.status;
        setTextDisplay(errorText, "inline");
        if (state === 471) {
            errorText.innerHTML = "이메일을 확인해주세요.";
        } else if (state === 473) {
            errorText.innerHTML = "오류가 발생하였습니다.";
        }
    })
}

function axiosPost(url, data) {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
}

function checkPassword() {
    const errorText = register.errorText[2];
    if (register.inputPassword.value === register.inputPasswordCheck.value) {
        setTextDisplay(errorText, "none");
        return true;
    } else {
        setTextDisplay(errorText, "inline");
        return false;
    }
}

function setTextDisplay(el, dis) {
    el.style.display = dis;
}

window.onload = () => {
    document.querySelector("#userfakediv").style.display = "none";
}