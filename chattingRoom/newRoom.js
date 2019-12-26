const newRoom = {
    "roomArr": [],
    "roomName": document.querySelector("#roomName"),
    "makeRoom": document.querySelector("#make_room"),
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "searchFriendInput": document.querySelector("#friendList_searchmyfriend_input"),
};

const friendFrame = (info) => {
    let frame =
        `<li class="friendList_profile_list">
            <div class="friendList_profile_preview">
                <img src="http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${info.id}.png" onclick="goFriendProfile(${info.id})" alt="userImage" />
            </div>
            <div class="friendList_profile_userInfo">
                <div>
                    <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
                </div>
                <p class="friendList_profile_userInfo_status_message">${info.status_message}</p>
            </div>
            <nav class="friendList_details_nav">
                <button onclick="toggleAddButton(); friendInRoomInit('${info.id}');">추가</button>
            </nav>
        </li>`;
    return frame;
};

const removeFrinedInRoom = (id) => {
    newRoom.roomArr.splice(newRoom.roomArr.indexOf(id), 1);
};

const appendFriendInRoom = (id) => {
    newRoom.roomArr.push(id);
};

const friendInRoomInit = (id) => {
    if (event.target.classList.value === "added") {
        appendFriendInRoom(id);
        return;
    }
    removeFrinedInRoom(id);
};

const toggleAddButton = () => {
    event.target.classList.toggle("added");
};

const IsMutedAndHided = (list) => {
    if (list.mute || list.hidden)
        return true;
    return false;
};

const IsMatched = (userName, value) => {
    if (userName.toUpperCase().indexOf(value.toUpperCase()) !== -1)
        return true;
    return false;
};

const makeFriendList = (list) => {
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (!IsMutedAndHided(userList))
            newRoom.otherprofile.insertAdjacentHTML("beforeend", friendFrame(userList));
    });
};

const makeSearchRoom = (rooms) => {
    const value = newRoom.searchFriendInput.value.trim();
    Object.keys(rooms).map((index) => {
        const room = rooms[index];
        if (IsMatched(room.nickname, value))
            newRoom.otherprofile.insertAdjacentHTML("beforeend", friendFrame(room));
    });
};

const createNewRoom = () => {
    const data = {
        "people": newRoom.roomArr,
        "roomName": newRoom.roomName.value,
    };
    axios({
        method: "POST",
        url: "http://10.156.147.139:3000/room",
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    }).then((datas) => {
        console.log(datas);
    }).catch((error) => {
        console.log(error);
    })
};

window.onload = () => {
    checkUserIsLogined();
    axiosGETWithToken("/users/my/profile").then(() => {
        axiosGETWithToken("/users/my/friends").then((friends) => {
            newRoom.myFriendsList = friends.data;
            makeFriendList(friends.data);
        })
    }).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
    })

    newRoom.searchFriendInput.addEventListener("keyup", () => {
        if(newRoom.searchFriendInput.value === "") {
            newRoom.otherprofile.innerHTML = "";
            makeFriendList(newRoom.myFriendsList);
            return;
        }
        newRoom.otherprofile.innerHTML = "";
        makeSearchRoom(newRoom.myFriendsList);
    });
    newRoom.makeRoom.addEventListener("click", () => {
        if(newRoom.roomName.value === "")
            return alert("채팅방 이름을 입력해주세요.");
        if(newRoom.roomArr.length === 0)
            return alert("채팅방 인원을 추가해주세요.(최소 1명)");
        createNewRoom();
    });
};