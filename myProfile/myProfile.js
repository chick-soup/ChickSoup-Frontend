const profileObj = {
    "backImg": document.querySelector("#backImg"),
    "myprofile": document.querySelector("#myprofile"),
    "content": document.querySelector("#myprofile_content"),
}

const myFrame = (id, name, message) => {
    const my = `<div id="myprofile_userinfo">
        <h1 id="myprofile_userinfo_name">${name}</h1>
        <p id="myprofile_userinfo_message">${message}</p>
    </div>
    <div id="myprofile_userinfo_nav">
        <ul>
            <li>
                <img src="../img/chatting.svg" alt="chatting">
                <p>나와의 채팅</p>
            </li>
            <li onclick="setEditprofile(${id}, '${name}', '${message}');">
                <img src="../img/setting.svg" alt="profileEdit">
                <p>프로필 수정</p>
            </li>
        </ul>
    </div>`;
    return my;
};

const otherFrame = () => {
    const other = `<div id="otherprofile_userinfo_nav">
        <ul>
            <li>
                <img src="../img/chatting.svg" alt="chatting">
                <p>1 대 1 채팅</p>
            </li>
        </ul>
    </div>`;
    return other;
}

const editFrame = (id, name, message) => {
    const edit = `<div id="editprofile_change_photo">
        <label for="editprofile_profilephoto">프로필 사진 변경</label>
        <input type="file" onchange="changeImageFile()" id="editprofile_profilephoto">
        <label for="editprofile_backphoto">배경 사진 변경</label>
        <input type="file" onchange="changeBackImageFile()" id="editprofile_backphoto">
    </div>
    <div id="editprofile_change_info">
        <input type="text" id="editprofile_change_name" placeholder="이름" value="${name}">
        <input type="text" id="editprofile_change_message" placeholder="상태 메세지" value="${message}">
        <span class="error_text"></span>
    </div>
    <div id="myprofile_userinfo_nav">
        <ul>
            <li onclick="checkNicknameLength();">
                <img src="../img/complete.svg" alt="profileEdit">
                <p>프로필 수정</p>
            </li>
        </ul>
    </div>`;
    return edit;
};

const checkNicknameLength = () => {
    const errorText = profileObj.errorText;
    const nameLen = profileObj.changeName.value.length;
    if (nameLen < 2 || nameLen > 13) {
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
        return false;
    }
    setTextDisplay(errorText, "none");
    editMyProfile();
    return true;
};

const editMyProfile = () => {
    let fd = new FormData();
    fd.append("nickname", profileObj.changeName.value.trim());
    fd.append("status_message", profileObj.changeMessage.value.trim());
    fd.append("where", "web")
    if (sessionStorage.getItem("chicksoup_profile"))
        fd.append("profile", profileObj.file.files[0]);
    if (sessionStorage.getItem("chicksoup_profileBack"))
        fd.append("background", profileObj.backFile.files[0]);

    axios.put(`${server}/users/my/profile`, fd, {
        headers: {
            "Authorization": localStorage.getItem("access_token"),
            "Content-Type": "multipart/form-data",
        }
    })
    location.reload();
};

const changeImageFile = () => {
    const file = profileObj.file.files[0];
    const fileSplit = file.name.split('.');
    const fileExtension = fileSplit[fileSplit.length - 1];
    if (!(fileExtension === "png"
        || fileExtension === "jpg"
        || fileExtension === "jpeg")) {
        return alert("파일 형식은 png, jpg, jpeg만 허용합니다. ");
    }
    let reader = new FileReader();
    reader.onloadend = (e) => profileObj.photo.setAttribute("src", e.target.result);
    reader.readAsDataURL(file);
    // ? For editMyProfile
    sessionStorage.setItem("chicksoup_profile", true);
};

const changeBackImageFile = () => {
    const file = profileObj.backFile.files[0];
    const fileSplit = file.name.split('.');
    const fileExtension = fileSplit[fileSplit.length - 1];
    if (!(fileExtension === "png"
        || fileExtension === "jpg"
        || fileExtension === "jpeg")) {
        return alert("파일 형식은 png, jpg, jpeg만 허용합니다. ");
    }
    let reader = new FileReader();
    reader.onloadend = (e) => {
        profileObj.backImg.style.backgroundImage = `url("${e.target.result}")`
    }
    reader.readAsDataURL(file);
    // ? For editMyProfile
    sessionStorage.setItem("chicksoup_profileBack", true);
};

const setUserImg = (id) => {
    profileObj.content.innerHTML = `<img src="https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${id}.png" id="editprofile_userImg" alt="userImage" />`;
};

const setUserBackImg = (id) => {
    profileObj.backImg.style.backgroundImage = `url("${S3HOST}/media/image/user/background/web/${id}.png")`
}

const setMyprofile = (id, name, message) => {
    setUserImg(id);
    setUserBackImg(id);
    profileObj.content.insertAdjacentHTML("beforeend", myFrame(id, name, message));
};

const setEditprofile = (id, name, message) => {
    sessionStorage.removeItem("chicksoup_profile");
    sessionStorage.removeItem("chicksoup_profileBack");
    setUserImg(id);
    profileObj.content.insertAdjacentHTML("beforeend", editFrame(id, name, message));
    profileObj.changeMessage = document.querySelector("#editprofile_change_message");
    profileObj.changeName = document.querySelector("#editprofile_change_name");
    profileObj.backFile = document.querySelector("#editprofile_backphoto");
    profileObj.file = document.querySelector("#editprofile_profilephoto");
    profileObj.photo = document.querySelector("#editprofile_userImg");
    profileObj.errorText = document.querySelector(".error_text");
};

const getUserInfo = () => {
    const url = "/users/my/profile";
    axiosGETWithToken(url).then((datas) => {
        const data = datas.data;
        axiosGETWithToken(`/users/${data.id}`).then((users) => {
            const user = users.data;
            if (user.myself) {
                setMyprofile(user.id, user.nickname, user.status_message);
            } else {
                profileObj.nav.innerHTML = otherFrame();
                console.log("남 프로필 상태");
            }
        }).catch((error) => {
            const state = error.response.status;
            if (state === 470) {
                alert("볼 수 없는 프로필 입니다.");
            } else if (state === 404) {
                alert("존재하지 않는 유저입니다.");
            }
            location.href = "../friendList/friendList.html";
        })
    })
};

const getUserBackground = () => {
    const url = "/users/my/profile";
    axiosGETWithToken(url).then((datas) => {
        setUserBackImg(datas.data.id);
    })
};

window.onload = () => {
    getUserInfo();
    profileObj.nav = document.querySelector("#myprofile_userinfo_nav");
};