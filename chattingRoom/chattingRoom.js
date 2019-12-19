const chattingRoom = {
    "veiwroom": document.querySelector("#friendList_viewroom"),
};

const addNewChatting = () => {
    let chatting = `<div class="friendList_room newchatting">
        <img src="../img/newChatting.svg" alt="newChatting">
        <p>새 채팅</p>
    </div>`;
    chattingRoom.veiwroom.insertAdjacentHTML("beforeend", chatting);
};

window.onload = () => {
    addNewChatting();
};