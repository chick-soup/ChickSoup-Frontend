const muteHiddenList = {
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "hiddenList": document.querySelector("#hiddenList"),
    "muteList": document.querySelector("#muteList"),
};

const muteHiddenFrame = (info, title) => {
    let frame =
        `<li class="friendList_profile_list">
            <img src="https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${info.id}.png" alt="userImage" />
            <div class="friendList_profile_userInfo">
                <div>
                    <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
                </div>
                <p class="friendList_profile_userInfo_status_message">${info.status_message}</p>
            </div>
            <div class="friendList_details">
                <img src="../img/details.svg" alt="friendListDetails" onclick="detailImgInit(this);">
                <nav class="friendList_details_nav">
                    <ul>
                        
                        <li class="friendList_details_nav_item" onclick="${title === "숨김" ? "releaseHiddenFriend(" + info.id + ")" : "releaseMuteFriend(" + info.id + ")"}">
                            <img src="../img/blockFriend.svg" alt="block">
                            <span>차단 해제하기</span>
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

const releaseHiddenFriend = (userId) => {
    const data = { "hidden": "0" };
    sideFeature("PUT", userId, data);
};

const releaseMuteFriend = (userId) => {
    const data = { "mute": "0" };
    sideFeature("PUT", userId, data);
};

const insertHTMLIntoMute = (infoObj) => {
    muteHiddenList.muteList.insertAdjacentHTML(
        "beforeend",
        muteHiddenFrame(infoObj, "차단")
    );
};

const insertHTMLIntoHidden = (infoObj) => {
    muteHiddenList.hiddenList.insertAdjacentHTML(
        "beforeend",
        muteHiddenFrame(infoObj, "숨김")
    );
};

const IsHided = (list) => {
    if (list.hidden)
        return true;
    return false;
};

const IsMuted = (list) => {
    if (list.mute)
        return true;
    return false;
};

const makeHideFriendList = (list) => {
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (IsHided(userList))
            insertHTMLIntoHidden(userList);
    });
};

const makeMuteFriendList = (list) => {
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (IsMuted(userList)) {
            insertHTMLIntoMute(userList);
        }
    });
};

const showDetails = (el) => {
    el.parentNode.childNodes[3].classList.add("showDetails");
};

const disShowDetails = (el) => {
    el.parentNode.childNodes[3].classList.remove("showDetails");
};

const defaultDetails = () => {
    muteHiddenList.detailImg.forEach((el) => {
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

window.onload = () => {
    const muteUrl = "/users/my/friends/mute";
    const hiddenUrl = "/users/my/friends/hidden";
    checkUserIsLogined();
    // ? make mute list
    axiosGETWithToken(muteUrl).then((datas) => {
        const data = datas.data;
        makeMuteFriendList(data);
    })
    // ? make hidden list
    axiosGETWithToken(hiddenUrl).then((datas) => {
        const data = datas.data;
        makeHideFriendList(data);
    }).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
    }).finally(() => {
        muteHiddenList.detailImg = document.querySelectorAll(".friendList_details > img");
    })
};