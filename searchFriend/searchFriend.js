const searchFriend = {
    "result": document.querySelector("#search_result"),
    "person": document.querySelector("#search_person"),
    "input": document.querySelector("#search_div_div > input"),
    "searchButton": document.querySelector("#search_div_div > img"),
    "detailButton": document.querySelector(".friendList_details_button"),
};

const shakeElement = () => {
    searchFriend.input.parentNode.classList.add("shake");
    setTimeout(() => {
        searchFriend.input.parentNode.classList.remove("shake");
    }, 500);
};

const setResultText = (value) => {
    searchFriend.result.innerHTML = value;
};

const resultFrame = (info) => {
    let frame = `<div class="friendList_profile_list">
    <img src="${S3HOST}/media/image/user/profile/${info.id}.png" alt="profileImage">
        <div class="friendList_profile_userInfo">
            <div>
                <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
            </div>
        </div>
        <div class="friendList_details">
            <button class="friendList_details_button" onclick="showButtonResult();">${getButtonText(info)}</button>
        </div>
    </div>`;
    return frame;
};

const getButtonText = (data) => {
    if (data.relate === 0) { return "추가"; }
    else if (data.relate === 1) { return "수락 대기 중"; }
    else if (data.relate === 2) { return "수락"; }
    else { return "이미 친구입니다."; }
};

const showSearchResult = (kakaoId) => {
    const url = `/kakao-id/${kakaoId}`,
        div = document.querySelector("#search_div_div");
    div.insertAdjacentHTML("beforeend", "<img src='../img/DualRing.gif' id='loadingRing' />");
    axiosGETWithToken(url).then((datas) => {
        searchFriend.person.innerHTML = resultFrame(datas.data);
    }).catch((error) => {
        if (error.response.status === 403)
            axiosRefresh();
        setResultText("오류가 발생하였습니다. 다시 시도해 주세요.");
    }).finally(() => {
        document.querySelector("#loadingRing").remove();
    })
};

const showButtonResult = () => {
    const imgSrcSplit = document.querySelector(".friendList_profile_list > img").getAttribute("src").split("/"),
        id = parseInt(imgSrcSplit[imgSrcSplit.length - 1]),
        url = `/users/${id}`;
    axiosPOSTWithToken(url).then((datas) => {
        if (datas.status === 200)
            setResultText("친구 추가를 요청했습니다.");
        else
            setResultText("친구 추가 요청을 수락했습니다.");
    }).catch((error) => {
        const state = error.response.status;
        document.querySelector(".friendList_profile_list").remove();
        shakeElement();
        if (state === 470)
            setResultText("존재하지 않는 아이디입니다.");
        else if (state === 471)
            setResultText("이미 친구 추가 요청을 보냈습니다.");
        else if (state === 472)
            setResultText("이미 해당 사용자와 친구 관계입니다.");
        else if (state === 473)
            setResultText("자기 자신은 친구 추가할 수 없습니다.");
    })
};

window.onload = () => {
    checkUserIsLogined();
    searchFriend.input.addEventListener("keyup", 
        (e) => e.keyCode === 13 && showSearchResult(searchFriend.input.value));
    searchFriend.searchButton.addEventListener("click", 
        () => showSearchResult(searchFriend.input.value));
};