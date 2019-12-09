const friendList = {
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "pageTitle": document.querySelector("#friendList_seemyfriend > h1"),
    "block": document.querySelector("#friendList_blockfriend"),
    "hide": document.querySelector("#friendList_hidefriend"),

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
    },
];

const friendFrame = (profileImg, bookmark, name, phone) => {
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
};

const friendFrameTwo = (profileImg, name, phone, title) => {
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
};

const removeOtherprofileInnerHTML = () => {
    friendList.otherprofile.innerHTML = "";
};

const defaultDetails = () => {
    friendList.detailImg.forEach((el) => {
        el.parentNode.childNodes[3].classList.remove("showDetails");
    })
};

const defaultStar = () => {
    let star = document.querySelector("#friendList_bookmark");
    star.setAttribute("src", "../img/star.svg");
};

const setPageTitle = (title) => {
    friendList.pageTitle.innerHTML = title;
};

const IsHided = (data) => {
    if (data.hide)
        return true;
    return false;
};

const IsBlocked = (data) => {
    if (data.block)
        return true;
    return false;
};

const IsOnBookmark = (data) => {
    if (data.bookmark)
        return true;
    return false;
};

const IsOnDetails = (el) => {
    if (el.parentNode.childNodes[3].classList[1])
        return true;
    return false;
};

const makeBookmarkFriendList = (list) => {
    removeOtherprofileInnerHTML();
    setPageTitle("내 친구 보기");
    friendListObj.filter(IsOnBookmark).map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrame(datas.profileImg, datas.bookmark, datas.name, datas.phone)
        );
    });
};

const makeHideFriendList = (list) => {
    // friendListObj -> list
    removeOtherprofileInnerHTML();
    defaultStar();
    setPageTitle("숨김 목록 보기");
    friendList.hide.classList.add("hided");
    friendListObj.filter(IsHided).map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrameTwo(datas.profileImg, datas.name, datas.phone, "숨김")
        );
    });
};

const makeBlockFriendList = (list) => {
    // friendListObj -> list
    removeOtherprofileInnerHTML();
    defaultStar();
    setPageTitle("차단 목록 보기");
    friendList.block.classList.add("blocked");
    friendListObj.filter(IsBlocked).map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrameTwo(datas.profileImg, datas.name, datas.phone, "차단")
        );
    });
};

const makeFriendList = (list) => {
    // friendListObj -> list
    removeOtherprofileInnerHTML();
    setPageTitle("내 친구 보기");
    friendListObj.map((datas) => {
        friendList.otherprofile.insertAdjacentHTML(
            "beforeend",
            friendFrame(datas.profileImg, datas.bookmark, datas.name, datas.phone)
        );
    });
};

const showDetails = (el) => {
    el.parentNode.childNodes[3].classList.add("showDetails");
};

const disShowDetails = (el) => {
    el.parentNode.childNodes[3].classList.remove("showDetails");
};

const detailImgInit = (el) => {
    if (IsOnDetails(el)) {
        disShowDetails(el);
    } else {
        defaultDetails();
        showDetails(el);
    }
};

const setBookmarkStar = (path) => {
    friendList.bookmark.setAttribute("src", path);
};

const iconInit = () => {
    friendList.block.classList.remove("blocked");
    friendList.hide.classList.remove("hided");
    defaultStar();
};

const bookmarkInit = () => {
    // iconInit();
    if (friendList.bookmark.getAttribute("src").split("/")[2] === "star.svg") {
        setBookmarkStar("../img/starYellow.svg");
        makeBookmarkFriendList();
    } else {
        setBookmarkStar("../img/star.svg");
        makeFriendList();
    }
};

const blockInit = () => {
    const list = friendList.block.classList;
    // iconInit();
    if (list[0] === "blocked") {
        list.remove("blocked");
        makeFriendList();
    } else {
        list.add("blocked");
        makeBlockFriendList();
    }
};

const hideInit = () => {
    const list = friendList.hide.classList;
    // iconInit();
    if (list[0] === "hided") {
        list.remove("hided");
        makeFriendList();
    } else {
        list.add("hided");
        makeHideFriendList();
    }
};

window.onload = () => {
    makeFriendList();
    friendList.detailImg = document.querySelectorAll(".friendList_details > img");
    friendList.bookmark = document.querySelector("#friendList_bookmark");
    friendList.addfriend = document.querySelector("#friendList_addfriend");
};