const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
const userInfo = {
    "nickname": document.querySelector("#userInfo_input_nickname"),
    "img": document.querySelector("#userInfo_profileimage_input_label > img"),
    "imgInput": document.querySelector("#userInfo_profileimage_input"),
    "errorText": document.querySelectorAll(".error_text"),
}

const signup = () => {
    const url = "/user/signup/profile";
    const data = {
        "nickname": userInfo.nickname.value.trim(),
        "profile": convertImageFileAsFormData(),
    };
    if (!checkNicknameLength())
        return;
    axiosPostWithToken(url, data).then(() => {
        location.href = "../login/login.html";
    }).catch(() => {
        userInfo.errorText[0].innerHTML = "오류가 발생하였습니다.\n잠시만 기다려주세요.";
    })
}

const axiosPostWithToken = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    })
}

// const readURL = (input) => {
//     if (input.files && input.files[0]) {
//         let reader = new FileReader();
//         reader.onload = (e) => userInfo.img.setAttribute("src", e.target.result);
//         reader.readAsDataURL(input.files[0]);
//     }
// }

const encodeImageFileAsURL = (element) => {
    let file = element.files[0];
    let reader = new FileReader();
    reader.onloadend = (e) => {
        userInfo.img.setAttribute("src", e.target.result);
        localStorage.setItem("img_base64", reader.result.split(",")[1]);
    }
    reader.readAsDataURL(file);
}

const convertImageFileAsFormData = (el) => {
    const file = el.files[0];
    let fd = new FormData();
    let fr = new FileReader();

    fr.readAsDataURL(file);
    fd.append("img-file", file);
    fr.onloadend = (e) => userInfo.img.setAttribute("src", e.target.result);
    axios.post("http://192.168.137.95:8080/image/", fd, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(() => {
        console.log("successful");
    }).catch(() => {
        console.log("error!");
    })
}

const checkNicknameLength = (len) => {
    const errorText = userInfo.errorText[0];
    if (len < 3 || len > 9) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
        return false;
    }
    setTextDisplay(errorText, "none");
    return true;
}

const setTextDisplay = (el, dis) => {
    el.style.display = dis;
}

window.onload = () => {
    localStorage.removeItem("img_base64");
}