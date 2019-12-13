const friendList = {
    "myprofile": document.querySelector("#friendList_myprofile > div > div"),
    "pageTitle": document.querySelector("#friendList_seemyfriend > h1"),
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "block": document.querySelector("#friendList_blockfriend"),
    "hide": document.querySelector("#friendList_hidefriend"),
};

const friendFrame = (info) => {
    let frame =
        `<li class="friendList_profile_list">
            <img src="https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${info.id}.png" alt="userImage" />
            <div class="friendList_profile_userInfo">
                <div>
                    <img src="../img/${info.bookmark ? "starYellow.svg" : "star.svg"}" alt="bookmark">
                    <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
                </div>
                <p class="friendList_profile_userInfo_status_message">${info.status_message}</p>
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
    if (!data.hidden)
        return true;
    return false;
};

const IsBlocked = (data) => {
    if (!data.mute)
        return true;
    return false;
};

const IsOnBookmark = (data) => {
    if (!data.bookmark)
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
    Object.keys(list).filter(IsOnBookmark && IsBlocked && IsHided).map((info) => {
        info !== null
            && friendList.otherprofile.insertAdjacentHTML(
                "beforeend",
                friendFrame(info)
            );
    });
};

const makeFriendList = (list = {}) => {
    removeOtherprofileInnerHTML();
    setPageTitle("내 친구 보기");
    Object.keys(list).map((key) => {
        const info = list[key];
        IsBlocked(info)
            && IsHided(info)
            && friendList.otherprofile.insertAdjacentHTML(
                "beforeend",
                friendFrame(info)
            );
    });
};

const makeMyList = (myData) => {
    friendList.myprofile.querySelector("img").setAttribute("src", `https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${myData.id}.png`);
    friendList.myprofile.querySelector(".friendList_profile_userInfo_name").innerHTML = myData.nickname;
    friendList.myprofile.querySelector(".friendList_profile_userInfo_status_message").innerHTML = myData.status_message;
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

const bookmarkInit = () => {
    if (friendList.bookmark.getAttribute("src").split("/")[2] === "star.svg") {
        setBookmarkStar("../img/starYellow.svg");
        makeBookmarkFriendList();
    } else {
        setBookmarkStar("../img/star.svg");
        makeFriendList();
    }
};

window.onload = () => {
    checkUserIsLogined();
    const url = "/users/my/profile";
    axiosGETWithToken(url).then((datas) => {
        makeMyList(datas.data);
        axiosGETWithToken("/users/my/friends").then((friends) => {
            makeFriendList(friends.data);
        }).finally(() => {
            friendList.detailImg = document.querySelectorAll(".friendList_details > img");
            friendList.bookmark = document.querySelector("#friendList_bookmark");
            friendList.addfriend = document.querySelector("#friendList_addfriend");
        })
    }).catch((error) => {
        const state = error.response.status;
        if(state === 403)
            axiosRefresh();
    })
};



// ! 다른 페이지로 옮김

// let img = `<img src="../img/blockFriend.svg" id="friendList_blockfriend" onclick="blockInit();" alt="blockFriend">
// <img src="../img/hideFriend.svg" id="friendList_hidefriend" onclick="hideInit();" alt="hideFriend">`

// const friendFrameTwo = (id, name, status_message, title) => {
//     let frame =
//         `<li class="friendList_profile_list">
//             <img src="https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${id}.png" alt="userImage" />
//             <div class="friendList_profile_userInfo">
//                 <div>
//                     <h3 class="friendList_profile_userInfo_name">${name}</h3>
//                 </div>
//                 <p class="friendList_profile_userInfo_status_message">${status_message}</p>
//             </div>
//             <div class="friendList_details">
//                 <img src="../img/details.svg" alt="friendListDetails" onclick="detailImgInit(this);">
//                 <nav class="friendList_details_nav">
//                     <ul>
//                         <li class="friendList_details_nav_item">
//                             <img src="../img/blockFriend.svg" alt="block">
//                             <span>${title} 해제하기</span>
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//         </li>`;
//     return frame;
// };

// const IsHided = (data) => {
//     if (data.hide)
//         return true;
//     return false;
// };

// const IsBlocked = (data) => {
//     if (data.block)
//         return true;
//     return false;
// };

// const makeHideFriendList = (list = {}) => {
//     setPageTitle("숨김 목록 보기");
//     friendList.block.classList.add("hided");
//     Object.keys(list).filter(IsHided).map((info) => {
//         info !== null
//             && friendList.otherprofile.insertAdjacentHTML(
//                 "beforeend",
//                 friendFrameTwo(info.id, info.nickname, info.status_message, "숨김")
//             );
//     });
// };

// const makeBlockFriendList = (list = {}) => {
//     removeOtherprofileInnerHTML();
//     defaultStar();
//     setPageTitle("차단 목록 보기");
//     friendList.block.classList.add("blocked");
//     Object.keys(list).filter(IsBlocked).map((info) => {
//         info !== null
//             && friendList.otherprofile.insertAdjacentHTML(
//                 "beforeend",
//                 friendFrameTwo(info.id, info.nickname, info.status_message, "차단")
//             );
//     });
// };

// const hideInit = () => {
//     const list = friendList.hide.classList;
//     if (list[0] === "hided") {
//         list.remove("hided");
//         makeFriendList();
//     } else {
//         list.add("hided");
//         makeHideFriendList();
//     }
// };

// const blockInit = () => {
//     const list = friendList.block.classList;
//     if (list[0] === "blocked") {
//         list.remove("blocked");
//         makeFriendList();
//     } else {
//         list.add("blocked");
//         makeBlockFriendList();
//     }
// };