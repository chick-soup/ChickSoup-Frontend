const reqResList = {
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "reqList": document.querySelector("#requestList"),
    "resList": document.querySelector("#responseList"),
};

const reqResFrame = (info, mode) => {
    let frame =
        `<li class="friendList_profile_list">
            <div class="friendList_profile_list_img_wrap">
                <img src="https://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${info.id}.png" alt="userImage" />
            </div>
            <div class="friendList_profile_userInfo">
                <div>
                    <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
                </div>
                <p class="friendList_profile_userInfo_status_message">${info.status_message}</p>
            </div>
            ${mode === "res" ? `<div class="friendList_details">
                <button class="friendList_details_button" onclick="acceptFriendRequest(${info.id}); removeRequestItem(this);">수락</button>
            </div>` : ""}
        </li>`;
    return frame;
};

const removeRequestItem = (el) => {
    el.parentNode.parentNode.remove();
};

const acceptFriendRequest = (userId) => {
    const url = `/users/${userId}`;
    axiosPOSTWithToken(url).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
        else if (state === 472)
            setResultText("이미 해당 사용자와 친구 관계입니다.");
    })
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

const insertHTMLIntoRes = (infoObj) => {
    reqResList.resList.insertAdjacentHTML(
        "beforeend",
        reqResFrame(infoObj, "res")
    );
};

const insertHTMLIntoReq = (infoObj) => {
    reqResList.reqList.insertAdjacentHTML(
        "beforeend",
        reqResFrame(infoObj)
    );
};

const IsMutedAndHided = (list) => {
    if (list.mute || list.hidden)
        return true;
    return false;
};

const makeResFriendList = (list) => {
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (!IsMutedAndHided(userList))
            insertHTMLIntoRes(userList);
    });
};

const makeReqFriendList = (list) => {
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (!IsMutedAndHided(userList)) {
            insertHTMLIntoReq(userList);
        }
    });
};

window.onload = () => {
    const reqUrl = "/users/my/friends/request";
    const resUrl = "/users/my/friends/response";
    checkUserIsLogined();
    // ? make req list
    axiosGETWithToken(reqUrl).then((datas) => {
        makeReqFriendList(datas.data);
    })
    // ? make res list
    axiosGETWithToken(resUrl).then((datas) => {
        makeResFriendList(datas.data);
    }).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
    })
};