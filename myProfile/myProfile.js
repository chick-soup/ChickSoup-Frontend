const profileObj = {
    "content": document.querySelector("#myprofile_content"),
}

function setUserImg() {
    profileObj.content.innerHTML = '<img src="../img/userImg.svg" alt="userImage">';
}

function setMyprofile(name, message) {
    setUserImg();
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
            <li onclick="setEditprofile('${name}', '${message}');">
                <img src="../img/setting.svg" alt="profileEdit">
                <p>프로필 수정</p>
            </li>
        </ul>
    </div>`;
    profileObj.content.insertAdjacentHTML("beforeend", my);
}

function setEditprofile(name, message) {
    setUserImg();
    let edit = `<div id="editprofile_change_photo">
        <label for="editprofile_profilephoto">프로필 사진 변경</label>
        <input type="file" id="editprofile_profilephoto">
        <label for="editprofile_backphoto">배경 사진 변경</label>
        <input type="file" id="editprofile_backphoto">
    </div>
    <div id="editprofile_change_info">
        <input type="text" id="editprofile_change_name" placeholder="이름" value="${name}">
        <input type="text" id="editprofile_change_message" placeholder="상태 메세지" value="${message}">
    </div>
    <div id="myprofile_userinfo_nav">
        <ul>
            <li onclick="setMyprofile();">
                <img src="../img/complete.svg" alt="profileEdit">
                <p>프로필 수정</p>
            </li>
        </ul>
    </div>`;
    profileObj.content.insertAdjacentHTML("beforeend", edit);
}

window.onload = () => {
    setMyprofile("이성진", "나는 이성진이다.");
}