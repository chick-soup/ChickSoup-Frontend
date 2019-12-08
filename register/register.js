const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
const register = {
    "inputEmail": document.querySelector("#register_input_email"),
    "inputEmailCheck": document.querySelector("#register_input_email_check"),
    "inputPassword": document.querySelector("#register_input_password"),
    "inputPasswordCheck": document.querySelector("#register_input_password_check"),
    "errorText": document.querySelectorAll(".error_text"),
}

const axiosPost = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
}

const checkPassword = () => {
    const errorText = register.errorText[2];
    if (register.inputPassword.value === register.inputPasswordCheck.value) {
        setTextDisplay(errorText, "none");
        return true;
    } else {
        setTextDisplay(errorText, "inline");
        return false;
    }
}

const registerEmailCheck = () => {
    const errorText = register.errorText[0];
    const value = register.inputEmail.value;
    const url = "/email/check";
    const data = {
        "email": value,
    };
    setTextDisplay(errorText, "inline");
    errorText.innerHTML = "이메일을 전송 중입니다.";
    axiosPost(url, data).then(() => {
        errorText.innerHTML = "이메일을 전송하였습니다.";
    }).catch((error) => {
        const state = error.response.status;
        if(state === 470) {
            errorText.innerHTML = "이미 생성된 이메일입니다.";
        } else if (state === 400) {
            errorText.innerHTML = "이메일을 입력해주세요.";
        }
    })
}

const registerEmailAuth = () => {
    const errorText = register.errorText[1];
    const url = "/email/auth";
    const data = {
        "email": register.inputEmail.value.trim(),
        "auth_code": register.inputEmailCheck.value.trim(),
    };
    setTextDisplay(errorText, "inline");
    errorText.innerHTML = "인증코드를 전송 중입니다.";
    axiosPost(url, data).then(() => {
        errorText.innerHTML = "인증에 성공했습니다."
        errorText.classList.add("goodText");
    }).catch((error) => {
        const state = error.response.status;
        if(state === 470) {
            errorText.innerHTML = "이메일이 중복되었습니다.";
        } else if (state === 471) {
            errorText.innerHTML = "이메일을 확인해주세요.";
        } else if (state === 472) {
            errorText.innerHTML = "인증코드가 올바르지 않습니다.";
        }
    })
}

const signup = () => {
    const errorText = register.errorText[2];
    const url = "/user/signup";
    const data = {
        "email": register.inputEmail.value.trim(),
        "password": register.inputPassword.value.trim(),
    };
    if(!checkPassword())
        return;
    setTextDisplay(errorText, "inline");
    errorText.innerHTML = "잠시만 기다려 주세요.";
    axiosPost(url, data).then((datas) => {
        localStorage.setItem("access_token", datas.data.access_token);
        location.href = "../userInfo/userInfo.html";
    }).catch((error) => {
        const state = error.response.status;
        if (state === 470) {
            errorText.innerHTML = "이메일이 중복되었습니다.";
        } else if (state === 471) {
            errorText.innerHTML = "이메일을 확인해주세요.";
        } else if (state === 473) {
            errorText.innerHTML = "오류가 발생하였습니다.";
        }
    })
}

const setTextDisplay = (el, dis) => {
    el.style.display = dis;
}

window.onload = () => {
    document.querySelector("#userfakediv").style.display = "none";
}