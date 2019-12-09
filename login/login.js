const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
const login = {
    "email": document.querySelector("#login_input_email"),
    "password": document.querySelector("#login_input_password"),
    "errorText": document.querySelectorAll(".error_text"),
};

const setTextDisplay = (el, dis) => {
    el.style.display = dis;
};

const axiosPost = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
};

const isKeyupEnter = (e, callback) => {
    if (e.keyCode === 13) {
        callback();
    }
};

const signin = () => {
    const errorText = login.errorText[0];
    const url = "/login";
    const data = {
        "email": login.email.value.trim(),
        "password": login.password.value.trim(),
    };
    errorText.innerHTML = "잠시만 기다려 주세요.";
    axiosPost(url, data).then((datas) => {
        localStorage.setItem("access_token", datas.data.access_token);
        location.href = "../friendList/friendList.html";
    }).catch((error) => {
        const state = error.response.status;
        if (state === 470) {
            setTextDisplay(errorText, "inline");
            errorText.innerHTML = "존재하지 않는 이메일입니다.";
        } else if (state === 471) {
            setTextDisplay(errorText, "inline");
            errorText.innerHTML = "이메일과 비밀번호가 일치하지 않습니다.";
        } else {
            errorText.innerHTML = "오류가 발생 하였습니다. 잠시후 다시 시도해주세요.";
        }
    })
};

window.onload = () => {
    login.email.addEventListener("keyup", () => {
        isKeyupEnter(event, signin);
    });
};
