const setting = {
    "idLi": document.querySelector("#setting_id"),
    "modal": document.querySelector("#setting_modal"),
    "idSpan": document.querySelector("#setting_userId"),
    "logout": document.querySelector("#setting_logout"),
    "profile": document.querySelector("#setting_profile"),
    "modalClose": document.querySelector("#setting_show_id_close"),
};

const showUserIdModal = () => {
    setting.modal.style.display = "block";
};

const closeUserIdModal = () => {
    setting.modal.style.display = "";
};

const removeProfileSession = () => {
    sessionStorage.removeItem("chicksoup-profile");
};

const getUserId = () => {
    axiosGETWithToken("/users/my/kakao-id").then((datas) => {
        setting.idSpan.innerHTML = datas.data.kakao_id;
    }).catch((error) => {
        const state = error.response.status;
        if(state === 403) {
            alert("오류가 발생하였습니다. 다시 시도해 주세요.");
            axiosRefresh();
        }
    })
};

const logout = () => {
    sessionStorage.removeItem("chicksoup-myFriendList");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("chicksoup-roomId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
};

window.onload = () => {
    checkUserIsLogined();
    getUserId();
    // ? for Clipboard -> copy user id
    // setting_show_id_clipboard에 생성자로 객체 생성
    new ClipboardJS("#setting_show_id_clipboard");
    setting.logout.addEventListener("click", logout);
    setting.idLi.addEventListener("click", showUserIdModal);
    setting.modalClose.addEventListener("click", closeUserIdModal);
    setting.profile.addEventListener("click", removeProfileSession);
};