const chattingRoom = {
    "bell": document.querySelector("#friendList_bell"),
    "veiwroom": document.querySelector("#friendList_viewroom"),
    "bookmark": document.querySelector("#friendList_bookmark"),
    "searchRoomInput": document.querySelector("#friendList_searchmyfriend_input"),
};
const roomData = [
    {
        "img": "../img/DMSLogo.svg",
        "name": "A",
        "numOfPeople": 16,
        "bookmarked": false,
    }, {
        "img": "../img/defaultBackImgOther.png",
        "name": "b",
        "numOfPeople": 8,
        "bookmarked": false,
    }, {
        "img": "../img/DMSLogo.svg",
        "name": "C",
        "numOfPeople": 4,
        "bookmarked": true,
    }, {
        "img": "../img/DMSLogo.svg",
        "name": "aBc",
        "numOfPeople": 2,
        "bookmarked": true,
    },
];

const removeRooms = () => {
    chattingRoom.veiwroom.innerHTML = "";
};

const addNewButton = () => {
    const chatting = `<div class="friendList_room newchatting">
        <img src="../img/newChatting.svg" alt="newChatting">
        <p>새 채팅</p>
    </div>`;
    chattingRoom.veiwroom.insertAdjacentHTML("beforeend", chatting);
};

const IsBookmarked = (room) => {
    if (room.bookmarked)
        return true;
    return false;
};

const IsMatched = (room, value) => {
    if (room.name.toUpperCase().indexOf(value.toUpperCase()) !== -1)
        return true;
    return false;
};

const roomFrame = (rInfo) => {
    const room = `<a href="#">
        <div class="friendList_room">
            <div class="friendList_room_preview">
                <img src="${rInfo.img}" alt="${rInfo.img}">
                ${rInfo.bookmarked ? '<div class="friendList_bookmark_circle"></div>' : ""}
            </div>
            <h1>${rInfo.name}</h1>
            <p>${rInfo.numOfPeople}명</p>
        </div>
    </a>`;
    return room;
};

const makeRoom = (rooms) => {
    removeRooms();
    rooms.map((room) =>
        chattingRoom.veiwroom.insertAdjacentHTML("beforeend", roomFrame(room))
    );
};

const makeBookmarkedRooom = (rooms) => {
    removeRooms();
    rooms.filter(IsBookmarked).map((room) =>
        chattingRoom.veiwroom.insertAdjacentHTML("beforeend", roomFrame(room))
    );
};

const makeSearchRoom = (rooms) => {
    const value = chattingRoom.searchRoomInput.value.trim();
    chattingRoom.veiwroom.innerHTML = "";
    rooms.filter((room) => IsMatched(room, value)).map((room) =>
        chattingRoom.veiwroom.insertAdjacentHTML("beforeend", roomFrame(room))
    );
};

const getRoom = () => {
    // axiosGETWithToken("10.156.147.139:3000/room").then((datas) => {
    //     console.log(datas);
    //     chattingRoom.roomData = datas.data;
    // }).catch((error) => {
    //     console.log(error);
    // })
    makeRoom(roomData);
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

window.onload = () => {
    getRoom();
    addNewButton();
    chattingRoom.bookmark.addEventListener("click", bookmarkInit);
    chattingRoom.searchRoomInput.addEventListener("keyup", () => {
        makeSearchRoom(roomData);
    });
};