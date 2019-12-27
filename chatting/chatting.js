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
    "chatDiv": document.querySelector('#chat-sentence'),
    "emoticonList": document.querySelectorAll('#emoticon-list > .center-view > ul > div > li > div > img'),
    "sendButton": document.querySelector('#hash_tag-btn > img'),
    "chatDate": document.querySelectorAll('.chat-day > h4 > span'),
    "chatTite": document.getElementById('chat-title'),
    "files": document.querySelector('#camera-file'),
};
let socket;
const accessToken = localStorage.getItem('access_token');
const userId = localStorage.getItem("userId");
const roomId = localStorage.getItem("chicksoup-roomId");
// const usernickname = localStorage.getItem('username');

const otherChatListTemplate = (name, text, time, type) => {
    const date = new Date(time * 1000);
    let lastTime;
    const chatTime = document.querySelectorAll('.other-chat-time');
    if (chatTime.length !== 0) 
        lastTime = chatTime[chatTime.length - 1].children[1].children[0].innerText;
    const timeSentence = `${date.getHours() <= 11 ? '오전' : '오후'}` + ` ${date.getHours()}: ${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}`;
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
                                ${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}
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
                    </li>a
                </ul>
            </div>`
    return template;
};

const myChatListTemplate = (text, type) => {
    const template = `
        <div class="my-chat-list">
                <ul>
                    <li>
                        <div ${text ? `class="my-first-message"` : ""}>
                            <h2>
                                ${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}
                            </h2>
                        </div>
                    </li>
                </ul>
            </div>
    `;
    return template
};

const chattingItemTemplate = (text, time, way = 'i', type) => {
    console.log(text, time, way, type);
    if (chatting.sendButton.getAttribute('src').split('/')[2] !== 'hashtag.png' || !text) {
        if (way === 'i') {
            const template = `<li>
                <div>
                    <h2>
                        ${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}
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
            const template = `<li>
                <div>
                    <h2>
                        ${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}
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
    }
// document.querySelector('.my-chat-list').insertAdjacentHTML('afterend', testFrame(text));
};

const chatDayTemplate = (time) => { 
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(time * 1000);
    const template = `
        <div class="chat-day">
                <div class="line"></div>
                <h4><span>${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${week[date.getDay()]}요일</span></h4>
        </div>
    `;
    return template;
}

const memberItemTemplate = (name) => {
    const template = `
    <li>
        <div>
            <div class="profile-img">
                <a>
                    <img src="../img/addBtn.png" alt="">
                </a>
            </div>
            <div class="profile-name">
                <span>${name}</span>
            </div>
        </div>
    </li>`;

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
    if (input.readOnly)
    axios({
        method: 'put',
        url: 'http://10.156.147.139:3000/room',
        headers: {
            Authorization: accessToken
        },
        data: {
            roomId: roomId,
            roomName: input.value
        }
    }).then(res => {
        console.log(res);
        input.readOnly = true;
    }).catch(err => {
        console.log(err);
        input.readOnly = false;
    })
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
    const hashButtonImg = chatting.hashButton.childNodes[1];
    const imageValue = document.querySelector('.image > img');
    console.log(imageValue);
    if (inputValue.length >= 1 || imageValue !== null) 
        hashButtonImg.src = '../img/moreOptionOn.png';
    else
        hashButtonImg.src = '../img/hashtag.png';
    if (inputValue === "")
        return;
    if (e.keyCode === 13) {
        sendChatting(inputValue);
        return;
    }
    document.querySelectorAll('.image > img')
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
    const image = document.querySelector('.image > img');
    console.log(chatting.chatInput.value);
    if ((image && chatting.chatInput.value)) {
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": image.src, 'token': localStorage.getItem('access_token'), 'type': 'img' });
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": chatting.chatInput.value, 'token': localStorage.getItem('access_token'), 'type': 'str' })
        image.parentNode.remove();
    } else if (image) {
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": image.src, 'token': localStorage.getItem('access_token'), 'type': 'img' })
        image.parentNode.remove();
    }
    else
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": chatting.chatInput.value, 'token': localStorage.getItem('access_token'), 'type': 'str' })
    chatting.chatInput.value = '';
    checkUserDidInput({ keyCode: null });
}

const axiosGETProfile = (url) => {
    return axios({
        url: `http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080/users${url}`,
        //   url: "http://10.156.147.139/users/my/profile",
        method: "GET",
        headers: {
            "Authorization": accessToken
        }
    });
}
const getMyProfile = () => {
    axiosGETProfile('/my/profile')
    .then(res => {
        console.log(res);
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', res.data.nickname);
    })
    .catch(err => {
        console.log(err);
    });
}

const getMemberProfile = (userId) => {
    console.log(userId);
    axiosGETProfile(`/${parseInt(userId)}`)
    .then(res => {
        console.log(res);
        memberItemTemplate(res.nickname);
    }).catch(err => {
        console.log(err);
    })
}

const insertChatDate = (time, i) => {
    chatting.chatDate = document.querySelectorAll('.chat-day > h4 > span');
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(time * 1000);
    const lastChatDate = chatting.chatDate[chatting.chatDate.length - 1] === undefined ? undefined : chatting.chatDate[chatting.chatDate.length - 1].innerText;
    const dateSentence = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${week[date.getDay()]}요일`;
    if (lastChatDate !== dateSentence) {
        chatting.chatMain.insertAdjacentHTML('beforeend', chatDayTemplate(time));
    }
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
    socket = io.connect("http://10.156.147.139:3000");
}
const connectGetChat = () => {
    socket.emit("getChat", { roomId: roomId, token: accessToken });
    socket.on('chatData', (data) => {
        console.log(data);
    // const data = [
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1577070463.436579 },
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1577070463.436579 },
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1677070463.436579 },
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1777070463.436579 },
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1877070463.436579 },
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1877070463.436579 },
    //     { userId: "48", name: `{"nickname":"leewoochan"}`, chat: "화이팅", time: 1877070463.436579 },
    // ];
        data.forEach((data, index) => {
            data.name = JSON.parse(data.name);
            const chk = document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1];
            const otherName = chk === undefined ? undefined : chk.children[1].children[0].children[0].innerText;
            // const otherName = document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[1].children[0].children[0].innerText;
            let lastChattingName = chatting.chatMain.children[chatting.chatMain.children.length - 1] === undefined ? 'chat-day' : chatting.chatMain.children[chatting.chatMain.children.length - 1].className;
            const myLastChatList = document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1];
            const otherLastChatList = document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1];
            insertChatDate(data.time, index);
            console.log(data.type);
            if (data.userId === userId) {
                if (lastChattingName === 'other-chat-list' || lastChattingName === 'chat-day') {
                    chatting.chatMain.insertAdjacentHTML('beforeend', myChatListTemplate(data.chat, data.type));
                }
                else if (lastChattingName === 'my-chat-list') {
                    document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].insertAdjacentHTML('beforeend', chattingItemTemplate(chat = data.chat, data.time, way = 'i', data.type));
                }
                // document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'i'));
            } else if (data.userId !== userId) {
                lastChattingName = chatting.chatMain.children[chatting.chatMain.children.length - 1].className;
                if (lastChattingName === 'chat-day' || (lastChattingName === 'my-chat-list' || otherName !== data.name.nickname)) {
                    chatting.chatMain.insertAdjacentHTML('beforeend', otherChatListTemplate(data.name.nickname, data.chat, data.time, data.type));
                }
                else if (lastChattingName === 'other-chat-list') {
                    document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].insertAdjacentHTML('beforeend', chattingItemTemplate(chat = data.chat, data.time, way = 'you', data.type));
                }
                // document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'you'));
            }
        });
        chatting.chatMain.scrollTop = chatting.chatMain.scrollHeight;
        // document.querySelector('.my-chat-list:nth-last-child(1)').insertAdjacentHTML('afterend', myChatListTemplate(data.chat));
    })
}
const connectGetLiveChat = () => {
    socket.on('realTimeChat', (data) => {
        console.log(data);
        data.name = JSON.parse(data.name);
        const lastChattingName = chatting.chatMain.children[chatting.chatMain.children.length - 1] === undefined ? 'chat-day' : chatting.chatMain.children[chatting.chatMain.children.length - 1].className;
        insertChatDate(data.time);
        if (data.userId === userId) {
            if (lastChattingName === "other-chat-list" || lastChattingName === "chat-day") {
                chatting.chatMain.insertAdjacentHTML("beforeend", myChatListTemplate(data.chat, data.type));
            } else if (lastChattingName === "my-chat-list") {
                // chattingItemTemplate((chat = data.chatData), (way = "i"));
                document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].insertAdjacentHTML('beforeend', chattingItemTemplate(chat = data.chat, data.time, way = 'i', data.type));
            }
            // document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children[document.querySelectorAll('.my-chat-list')[document.querySelectorAll('.my-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'i'));
        } else if (data.userId !== userId) {
            if (lastChattingName === "my-chat-list" || lastChattingName === "chat-day") {
                chatting.chatMain.insertAdjacentHTML("beforeend", otherChatListTemplate(data.name.nickname, data.chat, data.time, data.type));
            } else if (lastChattingName === "other-chat-list") {
                // chattingItemTemplate((chat = data.chatData), (way = "you"));
                document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].insertAdjacentHTML('beforeend', chattingItemTemplate(chat = data.chat, data.time, way = 'you', data.type));
            }
            // document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children[document.querySelectorAll('.other-chat-list')[document.querySelectorAll('.other-chat-list').length - 1].children.length - 1].appendChild(chattingItemTemplate(data.chat, 'you'));
        }
        chatting.chatMain.scrollTop = chatting.chatMain.scrollHeight;
    });
}

const socketGetRoomStatus = () => {
    socket.on('chatStatus', (data) => {
        console.log(data);
        chatting.chatTite.innerText = data.name;
        const changeTiteInput = document.querySelector('#title > input');
        changeTiteInput.value = data.name;
        changeTiteInput.setAttribute('readOnly', true);
        data.people.forEach(userId => {
            getMemberProfile(parseInt(userId));
        })
    })
    
}

const checkUserIsLogined = () => {
    if (!localStorage.getItem("access_token")) {
        alert("로그인 후 이용해주시기 바랍니다.");
        location.href = "../login/login.html";
    }
};

const readURL = (input) => {
    console.log(document.getElementsByClassName('image'));
    if (input.files && input.files[0]) {
        
        var reader = new FileReader();

        reader.onload = function (e) {
            const div = document.createElement('div');
            div.classList.add('image');
            const img = document.createElement('img');
            img.src = e.target.result;
            const button = document.createElement('button');
            button.innerText = 'x';
            div.appendChild(img);
            div.appendChild(button);
            // const template = `
            //     <div class="image">
            //         <img src=${e.target.result} />
            //         <button>x</button>
            //     </div>
            // `;
            // if ( document.getElementsByClassName('image').length === 1)
            chatting.chatDiv.insertAdjacentElement('beforeend', div);
            const deleteButton = document.querySelectorAll('.image > button');
            console.log(deleteButton);
            checkUserDidInput({ keyCode: null });
            deleteButton.forEach(e => {
                console.log(e);
                e.addEventListener('click', (e) => {
                    console.log(e.target.parentNode);
                    if (confirm('지울거니?'))
                        e.target.parentNode.remove();
                    chatting.hashButton.childNodes[1].src = '../img/hashtag.png';
                    });
                });
                // const formData = new FormData();
                // formData.append('image_data', e.target.result);
                // socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": e.target.result, 'token': localStorage.getItem('access_token'), 'type': 'img' })
            }
        reader.readAsDataURL(input.files[0]);
        return reader;
    }
}

chatting.files.addEventListener('change', function() {
        readURL(this);
});

window.onload = () => {
    checkUserIsLogined();
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
    socketGetRoomStatus();
};