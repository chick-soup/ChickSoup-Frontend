const friendList = {
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "pageTitle": document.querySelector("#friendList_seemyfriend > h1"),
};
const friendListObj = [
    {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "유재민",
        "phone": "010-1111-3333",
        "block": false,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": false,
        "name": "김어진",
        "phone": "010-2222-4444",
        "block": true,
        "hide": false,
    }, {
        "profileImg": "face.svg",
        "bookmark": false,
        "name": "용석현",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": false,
        "name": "손민기",
        "phone": "010-2222-4444",
        "block": false,
        "hide": false,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "이성진",
        "phone": "010-2222-4444",
        "block": true,
        "hide": false,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "김어진",
        "phone": "010-2222-4444",
        "block": true,
        "hide": false,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "이지수",
        "phone": "010-2222-4444",
        "block": true,
        "hide": false,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    }, {
        "profileImg": "face.svg",
        "bookmark": true,
        "name": "박진홍",
        "phone": "010-2222-4444",
        "block": true,
        "hide": true,
    },
];

function friendFrame(profileImg, bookmark, name, phone) {
    let frame =
        `<li class="friendList_profile_list">
            <img src="../img/${profileImg}" alt="profileImage">
            <div class="friendList_profile_userInfo">
                <div>
                    <img src="../img/${bookmark ? "starYellow.svg" : "star.svg"}" alt="bookmark">
                    <h3 class="friendList_profile_userInfo_name">${name}</h3>
                </div>
                <p class="friendList_profile_userInfo_phonenum">${phone}</p>
            </div>
            <div class="friendList_details">
                <img src="../img/details.svg" alt="friendListDetails" onclick="detailImgInit(this);">
                <nav class="friendList_details_nav">
                    <ul>
                        <li class="friendList_details_nav_item">
                            <img src="../img/removeFriend.svg" alt="remove">
                            <span>친구 삭제하기</span>
                        </li>
                        <li class="friendList_details_nav_item">
                            <img src="../img/blockFriend.svg" alt="block">
                            <span>차단하기</span>
                        </li>
                        <li class="friendList_details_nav_item">
                            <img src="../img/hideFriend.svg" alt="hide">
                            <span>숨기기</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </li>`;
    return frame;
}

function friendFrameTwo(profileImg, name, phone, title) {
    let frame =
        `<li class="friendList_profile_list">
            <img src="../img/${profileImg}" alt="profileImage">
            <div class="friendList_profile_userInfo">
                <div>
                    <h3 class="friendList_profile_userInfo_name">${name}</h3>
                </div>
                <p class="friendList_profile_userInfo_phonenum">${phone}</p>
            </div>
            <div class="friendList_details">
                <img src="../img/details.svg" alt="friendListDetails" onclick="detailImgInit(this);">
                <nav class="friendList_details_nav">
                    <ul>
                        <li class="friendList_details_nav_item">
                            <img src="../img/blockFriend.svg" alt="block">
                            <span>${title} 해제하기</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </li>`;
    return frame;
}

function makeBookmarkFriendList(list) {
    removeOtherprofileInnerHTML();
    setPageTitle("내 친구 보기");
    friendListObj.filter(IsOnBookmark).map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrame(datas.profileImg, datas.bookmark, datas.name, datas.phone)
        );
    });
}

function makeHideFriendList(list) {
    // friendListObj -> list
    removeOtherprofileInnerHTML();
    defaultStar();
    setPageTitle("숨김 목록 보기");
    friendListObj.filter(IsHided).map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrameTwo(datas.profileImg, datas.name, datas.phone, "숨김")
        );
    });
}

function makeBlockFriendList(list) {
    // friendListObj -> list
    removeOtherprofileInnerHTML();
    defaultStar();
    setPageTitle("차단 목록 보기");
    friendListObj.filter(IsBlocked).map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrameTwo(datas.profileImg, datas.name, datas.phone, "차단")
        );
    });
}

function makeFriendList(list) {
    // friendListObj -> list
    removeOtherprofileInnerHTML();
    setPageTitle("내 친구 보기");
    friendListObj.map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrame(datas.profileImg, datas.bookmark, datas.name, datas.phone)
        );
    });
}

function removeOtherprofileInnerHTML() {
    friendList.otherprofile.innerHTML = "";
}

function showDetails(el) {
    el.parentNode.childNodes[3].classList.add("showDetails");
}

function defaultDetails() {
    friendList.detailImg.forEach((el) => {
        el.parentNode.childNodes[3].classList.remove("showDetails");
    })
}

function defaultStar() {
    let star = document.querySelector("#friendList_bookmark");
    star.setAttribute("src", "../img/star.svg");
}

function setPageTitle(title) {
    friendList.pageTitle.innerHTML = title;
}

function disShowDetails(el) {
    el.parentNode.childNodes[3].classList.remove("showDetails");
}

function IsHided(data) {
    if(data.hide)
        return true;
    return false;
}

function IsBlocked(data) {
    if (data.block)
        return true;
    return false;
}

function IsOnBookmark(data) {
    if (data.bookmark)
        return true;
    return false;
}

function IsOnDetails(el) {
    if (el.parentNode.childNodes[3].classList[1])
        return true;
    return false;
}

function detailImgInit(el) {
    if (IsOnDetails(el)) {
        disShowDetails(el);
    } else {
        defaultDetails();
        showDetails(el);
    }
}

function setBookmarkStar(path) {
    friendList.bookmark.setAttribute("src", path);
}

function bookmarkInit() {
    if (friendList.bookmark.getAttribute("src").split("/")[2] === "star.svg") {
        setBookmarkStar("../img/starYellow.svg");
        makeBookmarkFriendList();
    } else {
        setBookmarkStar("../img/star.svg");
        makeFriendList();
    }
}

window.onload = () => {
    makeFriendList();
    friendList.detailImg = document.querySelectorAll(".friendList_details > img");
    friendList.bookmark = document.querySelector("#friendList_bookmark");
    friendList.addfriend = document.querySelector("#friendList_addfriend");
}