const server = "http://ec2-13-125-190-40.ap-northeast-2.compute.amazonaws.com:8080";
const login = {
    "email": document.querySelector("#login_input_email"),
    "password": document.querySelector("#login_input_password"),
    "loginButton": document.querySelector("#login_button"),
    "errorText": document.querySelectorAll(".error_text"),
};

// 같은 기능하는 코드 반복되서 함수로 만듬
const setTextDisplay = (el, dis) => {
    el.style.display = dis;
};
// axios post 요청 보내는 것을 함수로 만듬 ?? 많이 사용하니까!
const axiosPost = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
};
// 로그인하는 함수
const signin = () => {
    const errorText = login.errorText[0],
        url = "/login",
        data = {
            "email": login.email.value.trim(),
            "password": login.password.value.trim(),
        };
    errorText.innerHTML = "잠시만 기다려 주세요.";
    axiosPost(url, data).then((datas) => {
        sessionStorage.removeItem("chicksoup-myFriendList");
        localStorage.removeItem("chicksoup-roomId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.setItem("access_token", datas.data.access_token);
        localStorage.setItem("refresh_token", datas.data.refresh_token);
        location.href = "../myProfile/myProfile.html";
    }).catch((error) => {
        const state = error.response.status;
        if (state === 470)
            errorText.innerHTML = "존재하지 않는 이메일입니다.";
        else if (state === 471)
            errorText.innerHTML = "이메일과 비밀번호가 일치하지 않습니다.";
        else
            errorText.innerHTML = "오류가 발생 하였습니다. 잠시후 다시 시도해주세요.";
        setTextDisplay(errorText, "inline");
    })
};

window.onload = () => {
    // signin 함수 dom에 적용
    login.loginButton.addEventListener("click", signin);
    login.password.addEventListener("keyup", () => event.keyCode === 13 && signin())
}