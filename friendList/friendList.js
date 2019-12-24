const friendList = {
    "searchInput": document.querySelector("#friendList_searchmyfriend_input"),
    "myprofile": document.querySelector("#friendList_myprofile > div > div"),
    "pageTitle": document.querySelector("#friendList_seemyfriend > h1"),
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "addfriend": document.querySelector("#friendList_addfriend"),
    "bookmark": document.querySelector("#friendList_bookmark"),
};

const friendFrame = (info) => {
    let frame =
        `<li class="friendList_profile_list">
            <img src="http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${info.id}.png" onclick="goFriendProfile(${info.id})" alt="userImage" />
            <div class="friendList_profile_userInfo">
                <div>
                    <img src="../img/${info.bookmark ? "starYellow.svg" : "star.svg"}" 
                        onclick="${info.bookmark ? "releaseBookmarkFriend(" + info.id + ")" : "bookmarkFriend(" + info.id + ")"}"
                    <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
                </div>
                <p class="friendList_profile_userInfo_status_message">${info.status_message}</p>
            </div>
            <div class="friendList_details">
                <img src="../img/details.svg" alt="friendListDetails" onclick="detailImgInit(this);">
                <nav class="friendList_details_nav">
                    <ul>
                        <li class="friendList_details_nav_item" onclick="deleteFriend(${info.id});">
                            <img src="../img/removeFriend.svg" alt="remove">
                            <span>친구 삭제하기</span>
                        </li>
                        <li class="friendList_details_nav_item" onclick="muteFriend(${info.id})">
                            <img src="../img/blockFriend.svg" alt="block">
                            <span>차단하기</span>
                        </li>
                        <li class="friendList_details_nav_item" onclick="hideFriend(${info.id})">
                            <img src="../img/hideFriend.svg" alt="hide">
                            <span>숨기기</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </li>`;
    return frame;
};

const sideFeature = (method, userId, data) => {
    const url = `${server}/users/my/friends/${userId}`;
    if (!confirm("정말 하시겠습니까?"))
        return;
    axios({
        method: `${method}`,
        url: url,
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        },
    }).then(() => {
        location.reload();
    }).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
        else if (state === 470)
            alert("존재하지 않는 유저입니다.");
        else if (state === 471)
            alert("해당 사용자와 친구 관계가 아닙니다.");
        else if (state === 472)
            alert("해당 사용자와 이미 차단 관계입니다.");
        else if (state === 473)
            alert("자기 자신에게 친구 삭제를 할 수 없습니다.");
        else
            alert("오류가 발생하였습니다. 다시 시도해 주세요.");
    })
};

const goFriendProfile = (id) => {
    axiosGETWithToken(`/users/${id}`).then((users) => {
        const user = users.data;
        console.log(user);
        if (user.myself) {
            setMyprofile(user);
        } else {
            setOtherprofile(user);
        }
    }).catch ((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
    })
};

const releaseBookmarkFriend = (userId) => {
    const data = { "bookmark": "0" };
    sideFeature("PUT", userId, data);
};

const bookmarkFriend = (userId) => {
    const data = { "bookmark": "1" };
    sideFeature("PUT", userId, data);
};

const hideFriend = (userId) => {
    const data = { "hidden": "1" };
    sideFeature("PUT", userId, data);
};

const muteFriend = (userId) => {
    const data = { "mute": "1" };
    sideFeature("PUT", userId, data);
};

const deleteFriend = (userId) => {
    sideFeature("DELETE", userId);
};

const removeOtherprofileInnerHTML = () => {
    friendList.otherprofile.innerHTML = "";
};

const IsMutedAndHided = (list) => {
    if (list.mute || list.hidden)
        return true;
    return false;
};

const IsOnBookmark = (list) => {
    if (list.bookmark)
        return true;
    return false;
};

const IsMatched = (list) => {
    const value = friendList.searchInput.value.trim();
    if (list.nickname.indexOf(value) !== -1)
        return true;
    return false;
};

const insertHTMLIntoOther = (infoObj) => {
    friendList.otherprofile.insertAdjacentHTML(
        "beforeend",
        friendFrame(infoObj)
    );
};

const makeSearchFrinedList = (list) => {
    removeOtherprofileInnerHTML();
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (IsMatched(userList))
            insertHTMLIntoOther(userList);
    });
};

const makeBookmarkFriendList = (list) => {
    removeOtherprofileInnerHTML();
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (IsOnBookmark(userList) && !IsMutedAndHided(userList))
            insertHTMLIntoOther(userList);
    });
};

const makeFriendList = (list) => {
    removeOtherprofileInnerHTML();
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (!IsMutedAndHided(userList))
            insertHTMLIntoOther(userList);
    });
};

const makeMyList = (myData) => {
    friendList.myprofile.querySelector("img").setAttribute("src", `http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${myData.id}.png`);
    friendList.myprofile.querySelector(".friendList_profile_userInfo_name").innerHTML = myData.nickname;
    friendList.myprofile.querySelector(".friendList_profile_userInfo_status_message").innerHTML = myData.status_message;
};

const showDetails = (el) => {
    el.parentNode.childNodes[3].classList.add("showDetails");
};

const disShowDetails = (el) => {
    el.parentNode.childNodes[3].classList.remove("showDetails");
};

const defaultDetails = () => {
    friendList.detailImg.forEach((el) => {
        el.parentNode.childNodes[3].classList.remove("showDetails");
    })
};

const IsOnDetails = (el) => {
    if (el.parentNode.childNodes[3].classList[1])
        return true;
    return false;
};

const detailImgInit = (el) => {
    if (IsOnDetails(el)) {
        disShowDetails(el);
        return;
    }
    defaultDetails();
    showDetails(el);
};

const setBookmarkStar = (path) => {
    friendList.bookmark.setAttribute("src", path);
};

window.onload = () => {
    checkUserIsLogined();
    const url = "/users/my/profile";
    axiosGETWithToken(url).then((datas) => {
        makeMyList(datas.data);
        axiosGETWithToken("/users/my/friends").then((friends) => {
            friendList.myFriendsList = friends.data;
            makeFriendList(friends.data);
        }).finally(() => {
            friendList.detailImg = document.querySelectorAll(".friendList_details > img");
        })
    }).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
    })

    friendList.searchInput.addEventListener("keyup", function (e) {
        const value = this.value.trim();
        const list = friendList.myFriendsList;
        if (value === "")
            makeFriendList(list);
        if (e.keyCode === 13)
            makeSearchFrinedList(list);
    });

    friendList.bookmark.addEventListener("click", () => {
        if (friendList.bookmark.getAttribute("src").indexOf("star.svg") !== -1) {
            setBookmarkStar("../img/starYellow.svg");
            makeBookmarkFriendList(friendList.myFriendsList);
            return;
        }
        setBookmarkStar("../img/star.svg");
        makeFriendList(friendList.myFriendsList);
    });
};