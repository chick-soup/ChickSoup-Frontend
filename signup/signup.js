const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
const register = {
    "inputEmail": document.querySelector("#register_input_email"),
    "inputEmailCheck": document.querySelector("#register_input_email_check"),
    "inputPassword": document.querySelector("#register_input_password"),
    "inputPasswordCheck": document.querySelector("#register_input_password_check"),
    "errorText": document.querySelectorAll(".error_text"),
};
const userInfo = {
    "errorText": document.querySelectorAll(".errorText"),
    "nickname": document.querySelector("#userInfo_input_nickname"),
    "imgInput": document.querySelector("#userInfo_profileimage_input"),
    "img": document.querySelector("#userInfo_profileimage_input_label > img"),
    "errorText": document.querySelectorAll(".error_text"),
};

// about register

const axiosPost = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
};

const checkPasswordEqual = () => {
    const errorText = register.errorText[2];
    if (register.inputPassword.value === register.inputPasswordCheck.value) {
        setTextDisplay(errorText, "none");
        return true;
    } else {
        register.errorText[2].innerHTML = "비밀번호가 일치하지 않습니다.";
        setTextDisplay(errorText, "inline");
        return false;
    }
};

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
        register.inputEmailCheck.parentNode.style.display = "block";
    }).catch((error) => {
        const state = error.response.status;
        if (state === 470) {
            errorText.innerHTML = "이미 인증된 이메일입니다. 계속 진행 해주세요.";
        } else if (state === 474) {
            errorText.innerHTML = "이미 인증된 이메일입니다. 다른 이메일을 사용 해주세요.";
        } else if (state === 400) {
            errorText.innerHTML = "이메일을 입력해주세요.";
        }
    })
};

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
        errorText.innerHTML = "인증에 성공했습니다.";
    }).catch((error) => {
        const state = error.response.status;
        if (state === 470) {
            errorText.innerHTML = "이메일이 중복되었습니다.";
        } else if (state === 471) {
            errorText.innerHTML = "이메일을 확인해주세요.";
        } else if (state === 472) {
            errorText.innerHTML = "인증코드가 올바르지 않습니다.";
        }
    })
};

const registerSignup = () => {
    const errorText = register.errorText[2];
    const url = "/signup";
    const data = {
        "email": register.inputEmail.value.trim(),
        "password": register.inputPassword.value.trim(),
    };
    if (!checkPasswordEqual())
        return;
    setTextDisplay(errorText, "inline");
    errorText.innerHTML = "잠시만 기다려 주세요.";
    axiosPost(url, data).then((datas) => {
        localStorage.setItem("access_token", datas.data.access_token);
        document.body.style.transform = "translateX(-100vw)";
    }).catch((error) => {
        const state = error.response.status;
        if (state === 470) {
            errorText.innerHTML = "이메일이 중복되었습니다.";
        } else if (state === 471) {
            errorText.innerHTML = "이메일을 확인해주세요.";
        } else if (state === 473) {
            errorText.innerHTML = "접근 권한이 없는 이메일입니다.";
        } else {
            errorText.innerHTML = "오류가 발생 하였습니다. 잠시만 기다려 주세요.";
        }
    })
};

// about userInfo

const checkNicknameLength = () => {
    const errorText = userInfo.errorText[3];
    const len = userInfo.nickname.value.length;
    if (len < 3 || len > 9) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
        return false;
    }
    setTextDisplay(errorText, "none");
    return true;
};

const userInfoSignupProfile = () => {
    const url = "/signup/profile";
    const file = userInfo.imgInput.files[0];
    let fd = new FormData();
    fd.append("nickname", userInfo.nickname.value.trim());

    if (!checkNicknameLength()) {
        return;
    }
    if (sessionStorage.getItem("profile")) {
        fd.append("profile", file);
    }

    axios.post(`${server}${url}`, fd, {
        headers: {
            "Authorization": localStorage.getItem("access_token"),
            "Content-Type": "multipart/form-data",
        }
    }).then(() => {
        location.href = "../login/login.html";
    }).catch(() => {
        setTextDisplay(userInfo.errorText[0], "inline");
        userInfo.errorText[3].innerHTML = "오류가 발생 하였습니다. 잠시만 기다려주세요.";
    })
};

const encodeImageFileAsURL = (el) => {
    const file = el.files[0];
    const fileSplit = file.name.split('.');
    const fileExtension = fileSplit[fileSplit.length - 1];
    if (!(fileExtension === "png"
        || fileExtension === "jpg"
        || fileExtension === "jpeg")) {
            return alert("파일 형식은 png, jpg, jpeg만 허용합니다. ");
        }
    let reader = new FileReader();
    reader.onloadend = (e) => {
        userInfo.img.setAttribute("src", e.target.result);
    }
    reader.readAsDataURL(file);
    // ? convertImageFileAsFormData를 사용하기 위해서 
    sessionStorage.setItem("profile", true);
};

const isKeyupEnter = (e, callback) => {
    if (e.keyCode === 13) {
        callback();
    }
};

const addKeyupEvent = (el, callback) => {
    el.addEventListener("keyup", () => {
        isKeyupEnter(event, callback);
    });
};

const addClickEvent = (el, callback) => {
    el.addEventListener("click", callback);
}

window.onload = () => {
    sessionStorage.removeItem("profile");

    document.querySelectorAll(".userfakediv").forEach((el) => {
        setTextDisplay(el, "none");
    });

    addClickEvent(document.querySelector("#join_button"), userInfoSignupProfile);
    addClickEvent(document.querySelector("#next_button"), registerSignup);

    addKeyupEvent(register.inputEmail, registerEmailCheck);
    addKeyupEvent(register.inputEmailCheck, registerEmailAuth);
    addKeyupEvent(register.inputPasswordCheck, registerSignup);
    addKeyupEvent(userInfo.nickname, userInfoSignupProfile);
};