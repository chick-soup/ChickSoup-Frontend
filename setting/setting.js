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
    })
};

const logout = () => {
    localStorage.removeItem("access_token");
};

window.onload = () => {
    new ClipboardJS("#setting_show_id_clipboard");
    setting.idLi.addEventListener("click", showUserIdModal);
    getUserId();
};