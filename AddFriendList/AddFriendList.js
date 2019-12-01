const addFriendList = {
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "pageTitle": document.querySelector("#friendList_seemyfriend > h1"),
    "searchInput": document.querySelector("#friendList_searchmyfriend_input"),
};
const addFriendListObj = [
    {
        "name": "이지수",
        "id": "jisoo_lee",
    }, {
        "name": "상수",
        "id": "jisoo_lee",
    }, {
        "name": "고수",
        "id": "jisoo_lee",
    }, {
        "name": "과자",
        "id": "jisoo_lee",
    }
];

function addFrame(name, id) {
    let frame =
    `<li class="friendList_profile_list">
        <img src="../img/unknownProfile.svg" alt="profileImage">
        <div class="friendList_profile_userInfo">
            <div>
                <h3 class="friendList_profile_userInfo_name">${name}</h3>
            </div>
            <p class="friendList_profile_userInfo_id">${id}</p>
        </div>
        <div class="friendList_details">
            <button class="friendList_details_button">추가</button>
        </div>
    </li>`;
    return frame;
}

function makeAddFrinedList(list, value) {
    // makeAddFrinedList -> list
    addFriendList.otherprofile.innerHTML = "";
    addFriendListObj.filter((datas) => datas.name === value).map((datas) => {
        addFriendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            addFrame(datas.name, datas.id)
        );
    });
}

function setTitle(value) {
    addFriendList.pageTitle.innerHTML = `"${value}" 검색결과`;
}

addFriendList.searchInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        makeAddFrinedList("", e.target.value);
        setTitle(e.target.value);
    }
});