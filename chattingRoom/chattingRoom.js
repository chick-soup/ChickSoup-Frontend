const chattingRoom = {
    "roomArr": [],
    "makeRoom": document.querySelector("#make_room"),
    "bell": document.querySelector("#friendList_bell"),
    "newRoomButton": document.querySelector(".newRoomButton"),
    "veiwroom": document.querySelector("#friendList_viewroom"),
    "bookmark": document.querySelector("#friendList_bookmark"),
    "modal": document.querySelector("#friendList_newRoomModal"),
    "cancleModalIcon": document.querySelector("#cancel_modal_icon"),
    "otherprofile": document.querySelector("#friendList_otherprofile"),
    "modalRoomNameInput": document.querySelector("#modalRoomNameInput"),
    "modalSearchFriendInput": document.querySelector("#modalSearchFriendInput"),
    "searchRoomInput": document.querySelector("#friendList_searchmyfriend_input"),
};

const removeRooms = () => {
    chattingRoom.veiwroom.innerHTML = "";
};

const removeFrinedInRoom = (id) => {
    chattingRoom.roomArr.splice(chattingRoom.roomArr.indexOf(id), 1);
};

const appendFriendInRoom = (id) => {
    chattingRoom.roomArr.push(id);
};

const toggleAddButton = () => {
    event.target.classList.toggle("added");
};

const addShowModal = () => {
    chattingRoom.modal.classList.add("showModal");
};

const removeShowModal = () => {
    chattingRoom.modal.classList.remove("showModal");
};

const addNewButton = () => {
    const chatting = `<div class="friendList_room newchatting newRoomButton" onclick="addShowModal();">
        <div>
            <img src="../img/newChatting.svg" alt="newChatting">
            <p>새 채팅</p>
        </div>
    </div>`;
    chattingRoom.veiwroom.insertAdjacentHTML("beforeend", chatting);
};

const IsBookmarked = (room) => {
    if (room.bookmarked)
        return true;
    return false;
};

const IsMatched = (room, value) => {
    if (room.roomName.toUpperCase().indexOf(value.toUpperCase()) !== -1)
        return true;
    return false;
};

const IsMutedAndHided = (list) => {
    if (list.mute || list.hidden)
        return true;
    return false;
};

const friendFrame = (info) => {
    let frame =
        `<li class="friendList_profile_list">
            <div class="friendList_profile_preview">
                <img src="http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${info.id}.png" alt="userImage" />
            </div>
            <div class="friendList_profile_userInfo">
                <div>
                    <h3 class="friendList_profile_userInfo_name">${info.nickname}</h3>
                </div>
                <p class="friendList_profile_userInfo_status_message">${info.status_message}</p>
            </div>
            <nav class="friendList_details_nav">
                <button onclick="toggleAddButton(); friendInRoomInit('${info.id}');" class="friendList_details_button">추가</button>
            </nav>
        </li>`;
    return frame;
};

const roomFrame = (rInfo) => {
    const room = `<div class="friendList_room" onclick="goChatting(${rInfo.roomId});">
            <div class="friendList_room_preview">
                <img src="http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${parseInt(rInfo.people[0])}.png" alt="${parseInt(rInfo.people[0])}">
                ${rInfo.bookmarked ? '<div class="friendList_bookmark_circle"></div>' : ""}
            </div>
            <h1>${rInfo.roomName}</h1>
            <p>${rInfo.people.length}명</p>
        </div>`;
    return room;
};

const makeFriendList = (list) => {
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (!IsMutedAndHided(userList))
            chattingRoom.otherprofile.insertAdjacentHTML("beforeend", friendFrame(userList));
    });
};

const makeModalFriendSearchResult = (list) => {
    const value = chattingRoom.searchRoomInput.value.trim();
    Object.keys(list).map((key) => {
        const userList = list[key];
        if (IsMatched(userList, value) && !IsMutedAndHided(userList))
            chattingRoom.otherprofile.insertAdjacentHTML("beforeend", friendFrame(userList));
    });
};

const makeSearchRoom = () => {
    const value = chattingRoom.searchRoomInput.value.trim();
    removeRooms();
    chattingRoom.myRoomList.map((room) => {
        if (IsMatched(room, value)) {
            chattingRoom.veiwroom.insertAdjacentHTML("beforeend", roomFrame(room))
        }
    })
};

const makeRoom = (rooms) => {
    removeRooms();
    rooms.map((room) => {
        chattingRoom.veiwroom.insertAdjacentHTML("beforeend", roomFrame(room))
    });
};

const createNewRoom = (roomArr, roomName) => {
    console.log(roomArr, roomName);
    const data = {
        "people": roomArr,
        "roomName": roomName,
    };
    axios({
        method: "POST",
        url: "http://10.156.147.139:3000/room",
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    }).then(() => {
        location.reload();
    })
};

const getRooms = () => {
    axios({
        method: "GET",
        url: "http://10.156.147.139:3000/room",
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    }).then((datas) => {
        chattingRoom.myRoomList = datas.data.rooms;
        makeRoom(datas.data.rooms);
        addNewButton();
    })
};

const getFriendList = () => {
    axiosGETWithToken("/users/my/profile").then(() => {
        axiosGETWithToken("/users/my/friends").then((friends) => {
            chattingRoom.myFriendsList = friends.data;
            makeFriendList(friends.data);
        })
    }).catch((error) => {
        const state = error.response.status;
        if (state === 403)
            axiosRefresh();
    })
};

const friendInRoomInit = (id) => {
    if (event.target.classList[1] === "added") {
        appendFriendInRoom(id);
        return;
    }
    removeFrinedInRoom(id);
};

const chattingRoomInit = () => {
    if (chattingRoom.searchRoomInput.value === "") {
        removeRooms();
        makeRoom(chattingRoom.myRoomList);
        addNewButton();
        return;
    }
    removeRooms();
    makeSearchRoom();
};

const goChatting = (roomId) => {
    localStorage.setItem("chicksoup-roomId", roomId);
    location.href = "../chatting/chatting.html";
};

window.onload = () => {
    checkUserIsLogined();
    getRooms();
    getFriendList();
    chattingRoom.cancleModalIcon.addEventListener("click", removeShowModal);
    chattingRoom.searchRoomInput.addEventListener("keyup", chattingRoomInit);
    chattingRoom.makeRoom.addEventListener("click", () => {
        if (chattingRoom.modalRoomNameInput.value === "")
            return alert("채팅방 이름을 입력해주세요.");
        if (chattingRoom.roomArr.length === 0)
            return alert("채팅방 인원을 추가해주세요.(최소 1명)");
        createNewRoom(chattingRoom.roomArr, chattingRoom.modalRoomNameInput.value);
    });
};

/*
? About bookmark -> do later
chattingRoom.bookmark.addEventListener("click", bookmarkInit);
const makeBookmarkedRooom = (rooms) => {
    removeRooms();
    rooms.filter(IsBookmarked).map((room) =>
        chattingRoom.veiwroom.insertAdjacentHTML("beforeend", roomFrame(room))
    );
};
const bookmarkInit = () => {
    const star = event.target;
    if (star.src.indexOf("star.svg") !== -1) {
        star.setAttribute("src", "../img/starYellow.svg");
        makeBookmarkedRooom(roomData);
        return;
    }
    star.setAttribute("src", "../img/star.svg");
    makeRoom(roomData);
};
*/