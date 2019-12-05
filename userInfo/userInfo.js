const userInfo = {
    "nickname": document.querySelector("#userInfo_input_nickname"),
    "img": document.querySelector("#userInfo_profileimage_input_label > img"),
    "imgInput": document.querySelector("#userInfo_profileimage_input"),
    "errorText": document.querySelectorAll(".errorText"),
}
function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => userInfo.img.setAttribute("src", e.target.result);
        reader.readAsDataURL(input.files[0]);
        console.log(input.files[0]);
    }
}

function signup() {
    const url = "user/signup/profile";
    const data = {
        "nickname": userInfo.nickname.value.trim(),
        "status_message": ""
    };
    axiosPost(url, data).then((datas) => {

    }).catch((error) => {

    })
}

function axiosPost(url, data) {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
}

function checkNicknameLength(len) {
    let errorText = userInfo.errorText[0];
    if(len < 3) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자입니다.";
    } else if(len > 9) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최대 12자입니다.";
    } else {
        setTextDisplay(errorText, "none");
    }
}

function setTextDisplay(el, dis) {
    el.style.display = dis;
}

userInfo.imgInput.addEventListener("change", function () {
    readURL(this);
});

