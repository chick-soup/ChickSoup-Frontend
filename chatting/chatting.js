const chatting = {
    "alarmButton": document.querySelector('#alarm'),
    "chatMain": document.querySelector('#chat-main'),
    "menuButton": document.querySelector('#menu-btn'),
    "hiddenDiv": document.querySelector('#hidden-div'),
    "changeDiv": document.querySelector('#change-btn'),
    "emoList": document.querySelector('#emoticon-list'),
    "moreOption": document.querySelector('#option-btn'),
    "emoButton": document.querySelector('#emoticon-btn'),
    "hashButton": document.querySelector('#hash_tag-btn'),
    "moreFunction": document.querySelector('#more-function'),
    "chatInput": document.querySelector('#chat-sentence > input'),
    "emoticonList": document.querySelectorAll('#emoticon-list > .center-view > ul > div > li > div > img'),
    "sendButton": document.querySelector('#hash_tag-btn > img'),
};
let socket;
const userId = localStorage.getItem("userId");
const roomId = "12345";
// const usernickname = localStorage.getItem('username');

const otherChatListTemplate = (name, text, time) => {
    const date = new Date(time * 1000);
    let lastTime;
    const chatTime = document.querySelectorAll('.other-chat-time');
    if (chatTime.length !== 0) 
        lastTime = chatTime[chatTime.length - 1].children[1].children[0].innerText;
    const timeSentence = `${date.getHours() <= 11 ? '오전' : '오후'}` + ` ${date.getHours()}: ${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}`;
    console.log(timeSentence);
    const template = `<div class="other-chat-list">
                <div class="profile">
                    <a href="javascript:history.back()">
                        <img src="../img/profile.png" alt="">
                    </a>
                </div>
                <ul>
                    <h4>
                        <span>${name}</span></h4>
                    <li>
                        <div ${text ? `class= "other-first-message"` : ""}>
                            <h2>
                                <span>${text}</span>
                            </h2>
                        </div>
                        <div class="other-chat-time">
                            <h4>
                                <span>99</span>
                            </h4>
                            <h4>
                                <span>${timeSentence === lastTime ? `${chatTime[chatTime.length - 1].children[1].innerText = ''}${timeSentence}`  : timeSentence}</span>
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>`
    return template;
};

const myChatListTemplate = (text) => {
    const template = `
        <div class="my-chat-list">
                <ul>
                    <li>
                        <div ${text ? `class="my-first-message"` : ""}>
                            <h2>
                                <span>${text}</span>
                            </h2>
                        </div>
                    </li>
                </ul>
            </div>
    `;
    return template
};

const chattingItemTemplate = (chat, time, way = 'i') => {
    if (chatting.sendButton.getAttribute('src').split('/')[2] !== 'hashtag.png' || chat)
        if (way === 'i') {
            const template = `<li>
                <div>
                    <h2>
                        <span>${chat}</span>
                    </h2>
                </div>
            </li>`;
            return template;
        } else if (way === 'you') {
            const date = new Date(time * 1000);
            let lastTime;
            const chatTime = document.querySelectorAll('.other-chat-time');
            if (chatTime.length !== 0)
                lastTime = chatTime[chatTime.length - 1].children[1].children[0].innerText;
            const timeSentence = `${date.getHours() <= 11 ? '오전' : '오후'}` + ` ${date.getHours()}: ${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}`;    
            console.log(timeSentence);
            const template = `<li>
                <div>
                    <h2>
                        <span>${chat}</span>
                    </h2>
                </div>
                <div class="other-chat-time">
                    <h4>
                        <span>99</span>
                    </h4>
                    <h4>
                        <span>${timeSentence === lastTime ? `${chatTime[chatTime.length - 1].children[1].innerText = ''}${timeSentence}` : timeSentence}</span>
                    </h4>
                </div>
            </li>`;
            return template;
        }
// document.querySelector('.my-chat-list').insertAdjacentHTML('afterend', testFrame(text));
};

const chatDayTemplate = (time) => {
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(time * 1000);
    console.log(date);
    const template = `
        <div class="chat-day">
                <div class="line"></div>
                <h4><span>${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${week[date.getDay()]}요일</span></h4>
        </div>
    `;
    return template;
}

const alarmSwitch = () => {
    const alarmImg = chatting.alarmButton.childNodes[1];
    if (alarmImg.getAttribute('src') === '../img/alarmOn.png')
        alarmImg.src = '../img/alarmOff.png';
    else
        alarmImg.src = '../img/alarmOn.png';
};

const toggleReadonly = () => {
    const input = document.querySelector('#title > input');
    input.readOnly = !input.readOnly;
};

const showHiddenDiv = () => {
    chatting.hiddenDiv.classList.add('show');
};

const disShowHiddenDiv = (event) => {
    if (event.target !== event.currentTarget)
        return;
    chatting.hiddenDiv.classList.remove('show');
};

const showModeOption = (mode) => {
    const emoList = chatting.emoList;
    const moreFunction = chatting.moreFunction;
    const emoButtonImg = chatting.emoButton.childNodes[1];
    const moreOptionImg = chatting.moreOption.childNodes[1];
    const hashButtonImg = chatting.hashButton.childNodes[1];
    if (mode === "emo") {
        const emoButtonImgSrc = emoButtonImg.src.split('/')[4];
        if (emoButtonImgSrc === 'emoticon.png') {
            emoList.classList.add('emo-show');
            moreFunction.classList.remove('emo-show');
            emoButtonImg.src = "../img/emoticonOn.png";
            moreOptionImg.src = "../img/moreOption.png"
        } else if (emoButtonImgSrc === 'emoticonOn.png') {
            emoList.classList.remove('emo-show');
            emoButtonImg.src = "../img/emoticon.png";
        }
    }
    else if (mode === "func") {
        const moreOptionImgSrc = moreOptionImg.src.split('/')[4];
        if (moreOptionImgSrc === 'moreOption.png') {
            emoList.classList.remove('emo-show');
            moreFunction.classList.add('emo-show');
            emoButtonImg.src = "../img/emoticon.png"
            moreOptionImg.src = "../img/moreOptionOn.png"
        } else if (moreOptionImgSrc === 'moreOptionOn.png') {
            emoList.classList.remove('emo-show');
            moreFunction.classList.remove('emo-show');
            moreOptionImg.src = "../img/moreOption.png"
        }
    }
    else if (mode === "main") {
        emoList.classList.remove('emo-show');
        moreFunction.classList.remove('emo-show');
        hashButtonImg.src = '../img/hashtag.png';
        emoButtonImg.src = "../img/emoticon.png"
        moreOptionImg.src = "../img/moreOption.png"
    }
};

const checkUserDidInput = (e) => {
    const inputValue = chatting.chatInput.value;
    if (e.keyCode === 13) {
        sendChatting(inputValue);
        return;
    }
    const hashButtonImg = chatting.hashButton.childNodes[1];
    if (inputValue.length >= 1) 
        hashButtonImg.src = '../img/moreOptionOn.png';
    else
        hashButtonImg.src = '../img/hashtag.png';
};

const getClickedEmo = (e) => {
    const emoPath = e.target.getAttribute("src").split("/");
    const emo = emoPath[emoPath.length - 1].split(".")[0];
    return emo;
};

const addClickEvent = (el, callback) => {
    el.addEventListener("click", callback);
};

const addClickEventPlusArg = (el, callback, argu) => {
    el.addEventListener("click", () => callback(argu));
};

const sendChatting = () => {
    console.log(localStorage.getItem('access_token'));
    socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": chatting.chatInput.value, 'token': localStorage.getItem('access_token') })
    chatting.chatInput.value = '';
    checkUserDidInput({ keyCode: null });
}

const getMyProfile = () => {
    const accessToken = localStorage.getItem('access_token');
    axios({
        url: 'http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080/users/my/profile',
        //   url: "http://10.156.147.139/users/my/profile",
        method: "GET",
        headers: {
            "Authorization": accessToken
        }
    })
    .then(res => {
        console.log(res);
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', res.data.nickname);
    })
    .catch(err => {
        console.log(err);
    });
}

const insertEmoList = () => {
    const emoDiv = document.querySelector('#emoticon-list > div > ul');
    const template = `
    <li>
    <div>
    <img src="../img/😀.png" alt="😀">
    </div>
    </li>`;
    let emoLineDiv = document.createElement('div');
    for (i = 1; i <= 43; i++) {
        if (((i - 1) % 12 === 0) && (i - 1) !== 0) {
            emoDiv.appendChild(emoLineDiv);
            emoLineDiv = document.createElement('div');
        }
        emoLineDiv.insertAdjacentHTML('beforeend', template)       
    }
    chatting.emoticonList = document.querySelectorAll('#emoticon-list > .center-view > ul > div > li > div > img');
}

const connectSocket = () => {
    // socket = io.connect("http://10.156.147.139:3000");
}
const connectGetChat = () => {
    // socket.emit("getChat", { roomId: roomId, userId: userId });
    // socket.on('chatData', (data) => {
        // console.log(data);
    const data = [
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1577070463.436579 },
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1577070463.436579 },
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1677070463.436579 },
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1777070463.436579 },
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1877070463.436579 },
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1877070463.436579 },
        { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1877070463.436579 },
    ];
        data.forEach((data, index) => {
            if (index === 0) {
                chatting.chatMain.insertAdjacentHTML('beforeend', chatDayTemplate(data.time));
            }
            data.name = JSON.parse(data.name);
            const chk = document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1];
            const otherName = chk === undefined ? undefined : chk.children[1].children[0].children[0].innerText;
            // const otherName = document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[1].children[0].children[0].innerText;
            const lastChattingName = chatting.chatMain.children[chatting.chatMain.children.length - 1].className;
            // console.log(data);
            // console.log(index);
            const myLastChatList = document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1];
            const otherLastChatList = document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1];
            
            if (data.userId === userId) {
                if (lastChattingName === 'other-chat-list' || lastChattingName === 'chat-day') {
                    chatting.chatMain.insertAdjacentHTML('beforeend', myChatListTemplate(data.chat));
                }
                else if (lastChattingName === 'my-chat-list') {
                    document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].insertAdjacentHTML('beforeend', chattingItemTemplate(chat = data.chat, way = 'i'));
                }
                // document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'i'));
            } else if (data.userId !== userId) {
                if (lastChattingName === 'my-chat-list' || lastChattingName === 'chat-day' || otherName !== data.name.nickname) {
                    chatting.chatMain.insertAdjacentHTML('beforeend', otherChatListTemplate(data.name.nickname, data.chat, data.time));
                }
                else if (lastChattingName === 'other-chat-list') {
                    document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].insertAdjacentHTML('beforeend', chattingItemTemplate(chat = data.chat, data.time, way = 'you'));
                }
                // document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'you'));
            }
        });
        chatting.chatMain.scrollTop = chatting.chatMain.scrollHeight;
        // document.querySelector('.my-chat-list:nth-last-child(1)').insertAdjacentHTML('afterend', myChatListTemplate(data.chat));
    // })
}
const connectGetLiveChat = () => {
    socket.on('realTimeChat', (data) => {
        data.name = JSON.parse(data.name);
        const lastChattingName = chatting.chatMain.children[chatting.chatMain.children.length - 1].className;
        if (data.userId === userId) {
            if (lastChattingName === "other-chat-list" || lastChattingName === "chat-day") {
                chatting.chatMain.insertAdjacentHTML("beforeend", myChatListTemplate(data.chatData));
            } else if (lastChattingName === "my-chat-list") {
                chattingItemTemplate((chat = data.chatData), (way = "i"));
            }
            // document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'i'));
        } else if (data.userId !== userId) {
            if (lastChattingName === "my-chat-list" || lastChattingName === "chat-day") {
                chatting.chatMain.insertAdjacentHTML("beforeend", otherChatListTemplate(data.name.nickname, data.chatData));
            } else if (lastChattingName === "other-chat-list") {
                chattingItemTemplate((chat = data.chatData), (way = "you"));
            }
            // document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'you'));
        }
        chatting.chatMain.scrollTop = chatting.chatMain.scrollHeight;
    });
}






// socket.on('connection', (sockets) => {
    //     console.log(1);
    //     console.log(sockets);
    //     socket.join("12345");
    //     console.log(2);
    // });
    
    // socket.on("disconnect", function(socket) {
        //     console.log(1);
        //     console.log(socket);
        //   console.log("disconnected..");
        // });
        
        // socket.to('34567').emit('chatting', { 'roomId': "34567", "userId": "2345", "chat": chatting.chatInput.value })
        // socket.to('34567').emit('chatting', { 'roomId': "34567", "userId": userId, "chat": chatting.chatInput.value })
        // socket.on('connection', function(socket) {
            //     socket.join('34567');
            // });
            // io.to('34567').emit();
        

            // socket.emit('chatting', {'roomId': "34567", "userId": "2345",  "chat": "우찬"})
            // socket.emit('chatting', { 'roomId': "34567", "userId": "12341", "chat": "너" })
window.onload = () => {
    insertEmoList();
    addClickEvent(chatting.alarmButton, alarmSwitch);
    addClickEvent(chatting.alarmButton, alarmSwitch);
    addClickEvent(chatting.menuButton, showHiddenDiv);
    addClickEvent(chatting.changeDiv, toggleReadonly);
    addClickEvent(chatting.hiddenDiv, disShowHiddenDiv);
    addClickEvent(chatting.sendButton, sendChatting);
    addClickEventPlusArg(chatting.chatMain, showModeOption, "main");
    addClickEventPlusArg(chatting.emoButton, showModeOption, "emo");
    addClickEventPlusArg(chatting.moreOption, showModeOption, "func");
    chatting.chatInput.addEventListener('keyup', checkUserDidInput);
    chatting.emoticonList.forEach(emo => {
        emo.addEventListener('click', (e) => {
            // ? get Emoticon And push it into the value
            chatting.chatInput.value += getClickedEmo(e);
            checkUserDidInput({ keyCode: null });
        });
    });
    getMyProfile();
    connectSocket();
    connectGetChat();
    connectGetLiveChat();
    // socket.emit('chatting', { 'roomId': "34567", "userId": "12341", "chat": "hi?" })
    // addClickEvent(chatting.chatInput, checkUserDidInput);
};