const server = "http://chicksoup.pythonanywhere.com";
const login = {
    "email": document.querySelector("#login_input_email"),
    "password": document.querySelector("#login_input_password"),
    "errorText" : document.querySelectorAll(".error_text"),
};

function signin() {
    const errorText = login.errorText[0];
    const url = "/user/login";
    const data = {
        "email": login.email.value.trim(),
        "password": login.password.value.trim(),
    };
    axiosPost(url, data).then((datas) => {
        localStorage.setItem("access_token", datas.data.access_token);
    }).catch((error) => {
        const state = error.response.status;
        if(state === 470) {
            setTextDisplay(errorText, "inline");
            errorText.innerHTML = "존재하지 않는 이메일입니다.";
        } else if(state === 471) {
            setTextDisplay(errorText, "inline");
            errorText.innerHTML = "이메일과 비밀번호가 일치하지 않습니다.";
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

function setTextDisplay(el, dis) {
    el.style.display = dis;
}