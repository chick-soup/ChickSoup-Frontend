const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
const userInfo = {
    "errorText": document.querySelectorAll(".errorText"),
    "nickname": document.querySelector("#userInfo_input_nickname"),
    "imgInput": document.querySelector("#userInfo_profileimage_input"),
    "errorText": document.querySelectorAll(".error_text"),
}

const setTextDisplay = (el, dis) => {
    el.style.display = dis;
};

const checkNicknameLength = () => {
    const errorText = userInfo.errorText[0];
    const len = userInfo.nickname.value.length;
    if (len < 3 || len > 9) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
        return false;
    }
    setTextDisplay(errorText, "none");
    return true;
};

const signup = () => {
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
        userInfo.errorText[0].innerHTML = "오류가 발생하였습니다. 잠시만 기다려주세요.";
    })
};

const encodeImageFileAsURL = (el) => {
    const file = el.files[0];
    let reader = new FileReader();
    reader.onloadend = (e) => {
        userInfo.img.setAttribute("src", e.target.result);
    }
    reader.readAsDataURL(file);
    // ? convertImageFileAsFormData를 사용하기 위해서 
    sessionStorage.setItem("profile", true);
};

window.onload = () => {
    sessionStorage.removeItem("profile");
}