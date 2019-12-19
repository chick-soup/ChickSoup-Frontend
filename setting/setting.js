const setting = {
    "idLi": document.querySelector("#setting_id"),
    "idSpan": document.querySelector("#setting_userId"),
    "modal": document.querySelector("#setting_modal"),
    "modalClose": document.querySelector("#setting_show_id_close"),
    "logout": document.querySelector("#setting_logout"),
};

const showUserIdModal = () => {
    setting.modal.style.display = "block";
};

const closeUserIdModal = () => {
    setting.modal.style.display = "";
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
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
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
};