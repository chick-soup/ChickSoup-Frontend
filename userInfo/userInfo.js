const server = "http://chicksoup.pythonanywhere.com";
const userInfo = {
    "nickname": document.querySelector("#userInfo_input_nickname"),
    "img": document.querySelector("#userInfo_profileimage_input_label > img"),
    "imgInput": document.querySelector("#userInfo_profileimage_input"),
    "errorText": document.querySelectorAll(".error_text"),
}
function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => userInfo.img.setAttribute("src", e.target.result);
        reader.readAsDataURL(input.files[0]);
    }
}

function encodeImageFileAsURL(element) {
    let file = element.files[0];
    let reader = new FileReader();
    reader.onloadend = (e) => {
        userInfo.img.setAttribute("src", e.target.result);
        localStorage.setItem("img_base64", reader.result.split(",")[1]);
    }
    reader.readAsDataURL(file);
}

function signup() {
    const url = "/user/signup/profile";
    const data = {
        "nickname": userInfo.nickname.value.trim(),
        "img_base64": localStorage.getItem("img_base64"),
    };
    if(!checkNicknameLength())
        return;
    axiosPostWithToken(url, data).then((datas) => {
        location.href = "../login/login.html";
    }).catch((error) => {
        userInfo.errorText[0].innerHTML = "오류가 발생하였습니다.\n잠시만 기다려주세요.";
    })
}

function axiosPostWithToken(url, data) {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    })
}

function checkNicknameLength(len) {
    let errorText = userInfo.errorText[0];
    if (len < 3 || len > 9) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
        return false;
    }
    setTextDisplay(errorText, "none");
    return true;
}

function setTextDisplay(el, dis) {
    el.style.display = dis;
}

window.onload = () => {
    localStorage.removeItem("img_base64");
}