const searchFriend = {
    "result": document.querySelector("#search_result"),
    "input": document.querySelector("#search_div > input"),
    "searchButton": document.querySelector("#search_div > img"),
    
};
const searchResult = {
    "img": "unknownProfile.svg",
    "name": "이지수",
};

const resultFrame = (name, img) => {
    let frame = `<div class="friendList_profile_list">
        <img src="../img/${img}" alt="profileImage">
        <div class="friendList_profile_userInfo">
            <div>
                <h3 class="friendList_profile_userInfo_name">${name}</h3>
            </div>
        </div>
        <div class="friendList_details">
            <button class="friendList_details_button">추가</button>
        </div>
    </div>`;
    return frame;
};

const showSearchResult = (e) => {
    if(searchFriend.input.value === "이지수") {
        searchFriend.result.innerHTML = resultFrame(searchResult.name, searchResult.img);
    } else {
        
    }
};

const handleInput = (e) => {
    if(e.keyCode === 13) 
        showSearchResult(e);
}

window.onload = () => {
    searchFriend.input.addEventListener("keyup", handleInput);
    searchFriend.searchButton.addEventListener("click", showSearchResult);
};