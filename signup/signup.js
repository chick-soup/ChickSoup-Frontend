const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080",
    register = {
        "inputEmail": document.querySelector("#register_input_email"),
        "inputEmailCheck": document.querySelector("#register_input_email_check"),
        "inputPassword": document.querySelector("#register_input_password"),
        "inputPasswordCheck": document.querySelector("#register_input_password_check"),
        "emailButton": document.querySelectorAll(".register_email_button"),
        "nextButton": document.querySelector("#next_button"),
        "errorText": document.querySelectorAll(".error_text"),
    },
    userInfo = {
        "errorText": document.querySelectorAll(".errorText"),
        "nickname": document.querySelector("#userInfo_input_nickname"),
        "imgInput": document.querySelector("#userInfo_profileimage_input"),
        "img": document.querySelector("#userInfo_profileimage_input_label > img"),
        "joinButton": document.querySelector("#join_button"),
        "errorText": document.querySelectorAll(".error_text"),
    };

// common
// el의 display를 바꿔주는 함수: 많이 사용하는 코드라 함수로 쉽게 만듬
const setTextDisplay = (el, dis) => {
    el.style.display = dis;
};

// about register

// url과 data를 주면 post로 요청을 해줌
const axiosPost = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
};
// 비밀번호와 비밀번호 확인의 값이 일치하는지 비교함
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
// 입력한 이메일이 사용해도 되는지 확인함
const registerEmailCheck = () => {
    const errorText = register.errorText[0],
        value = register.inputEmail.value,
        url = "/email/check",
        data = {
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
// 인증코드를 보내는 함수
const registerEmailAuth = () => {
    const errorText = register.errorText[1],
        url = "/email/auth",
        data = {
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
// 이메일 인증, 비밀번호를 적합하게 입력하면 다음 페이지로 이동함
const registerSignup = () => {
    const errorText = register.errorText[2]
    url = "/signup"
    data = {
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

const createMyChat = (userName) => {
    const data = {
        "people": [],
        "roomName": `${userName}`,
    };
    axios({
        method: "POST",
        url: "http://10.156.147.139:3000/room",
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    }).then(() => {
        location.href = "../login/login.html";
    })
};
// 닉네임 길이가 적합한지 확인함
const checkNicknameLength = () => {
    const errorText = userInfo.errorText[3],
        len = userInfo.nickname.value.length;
    if (len < 3 || len > 12) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
        return false;
    }
    setTextDisplay(errorText, "none");
    return true;
};
// 회원가입을 마무리하는 함수
const userInfoSignupProfile = () => {
    const url = "/signup/profile",
        file = userInfo.imgInput.files[0],
        fd = new FormData();
    fd.append("nickname", userInfo.nickname.value.trim());

    if (!checkNicknameLength())
        return;
    if (sessionStorage.getItem("profile"))
        fd.append("profile", file);

    axios.post(`${server}${url}`, fd, {
        headers: {
            "Authorization": localStorage.getItem("access_token"),
            "Content-Type": "multipart/form-data",
        }
    }).then(() => {
        // 자신 채팅방을 만든 후에 로그인 페이지로 이동
        createMyChat(userInfo.nickname.value.trim());
    }).catch(() => {
        setTextDisplay(userInfo.errorText[0], "inline");
        userInfo.errorText[3].innerHTML = "오류가 발생하였습니다. 다시 시도해 주세요.";
    })
};
// 사용자가 올린 허용가능한 파일을 보여줌
const encodeImageFileAsURL = () => {
    const file = event.target.files[0],
        fileSplit = file.name.split('.'),
        fileExtension = fileSplit[fileSplit.length - 1];
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
};

window.onload = () => {
    sessionStorage.removeItem("profile");
    // chrome 기본 input 자동 완성 피하기 위한 속임수
    document.querySelectorAll(".userfakediv").forEach((el) => setTextDisplay(el, "none"));

    addClickEvent(userInfo.joinButton, userInfoSignupProfile);
    addClickEvent(register.nextButton, registerSignup);
    addClickEvent(register.emailButton[0], registerEmailCheck);
    addClickEvent(register.emailButton[1], registerEmailAuth);

    addKeyupEvent(register.inputEmail, registerEmailCheck);
    addKeyupEvent(register.inputEmailCheck, registerEmailAuth);
    addKeyupEvent(register.inputPasswordCheck, registerSignup);
    addKeyupEvent(userInfo.nickname, userInfoSignupProfile);
    
    userInfo.imgInput.addEventListener("change", encodeImageFileAsURL);
    userInfo.nickname.addEventListener("keyup", checkNicknameLength);
    register.inputPasswordCheck.addEventListener("keyup", checkPasswordEqual);
};