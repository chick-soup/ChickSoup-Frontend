const profileObj = {
    "content": document.querySelector("#myprofile_content"),
}

const axiosGET = (url) => {
    return axios({
        method: "GET",
        url: `${server}${url}`,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    })
};

const myFrame = (id, name, message) => {
    let my = `<div id="myprofile_userinfo">
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

const editFrame = (id, name, message) => {
    let edit = `<div id="editprofile_change_photo">
        <label for="editprofile_profilephoto">프로필 사진 변경</label>
        <input type="file" onchange="changeImageFile()" id="editprofile_profilephoto">
        <label for="editprofile_backphoto">배경 사진 변경</label>
        <input type="file" id="editprofile_backphoto">
    </div>
    <div id="editprofile_change_info">
        <input type="text" id="editprofile_change_name" placeholder="이름" value="${name}">
        <input type="text" id="editprofile_change_message" placeholder="상태 메세지" value="${message}">
    </div>
    <div id="myprofile_userinfo_nav">
        <ul>
            <li  onclick="editMyProfile();">
                <img src="../img/complete.svg" alt="profileEdit">
                <p>프로필 수정</p>
            </li>
        </ul>
    </div>`;
    return edit;
};

const editMyProfile = () => {
    const file = profileObj.file.files[0];
    let fd = new FormData();
    fd.append("nickname", profileObj.changeName.value.trim());
    fd.append("status_message", profileObj.changeMessage.value.trim());
    if (sessionStorage.getItem("chicksoup_profile")) {
        fd.append("profile", file);
    }
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
    reader.onloadend = (e) => {
        profileObj.photo.setAttribute("src", e.target.result);
    }
    reader.readAsDataURL(file);
    // ? convertImageFileAsFormData를 사용하기 위해서 
    sessionStorage.setItem("chicksoup_profile", true);
};

const setUserImg = (id) => {
    profileObj.content.innerHTML = `<img src="https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/${id}.png" id="editprofile_userImg" alt="userImage">`;
};

const setMyprofile = (id, name, message) => {
    setUserImg(id);
    profileObj.content.insertAdjacentHTML("beforeend", myFrame(id, name, message));
};

const setEditprofile = (id, name, message) => {
    sessionStorage.removeItem("chicksoup_profile");
    setUserImg(id);
    profileObj.content.insertAdjacentHTML("beforeend", editFrame(id, name, message));
    profileObj.changeMessage = document.querySelector("#editprofile_change_message");
    profileObj.changeName = document.querySelector("#editprofile_change_name");
    profileObj.file = document.querySelector("#editprofile_profilephoto");
    profileObj.photo = document.querySelector("#editprofile_userImg");
};

const getUserInfo = () => {
    const url = "/users/my/profile";
    axiosGET(url).then((datas) => {
        setMyprofile(datas.data.id, datas.data.nickname, datas.data.status_message);
        console.log(datas);
    }).catch((error) => {
        console.log(error);
    })
};

window.onload = () => {
    getUserInfo();
};