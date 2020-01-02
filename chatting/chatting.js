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
    "files": document.querySelector('#camera-file'),
},
    accessToken = localStorage.getItem('access_token'),
    userId = localStorage.getItem("userId"),
    roomId = localStorage.getItem("chicksoup-roomId");
let socket;
// const usernickname = localStorage.getItem('username');

const numberWithTenDigit = (n, width = 2) => { // 10자리 숫자로 만드는 함수
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const axiosRefresh = () => {
    axios({
        method: "GET",
        url: "http://ec2-13-125-190-40.ap-northeast-2.compute.amazonaws.com:8080/refresh",
        headers: {
            "Authorization": localStorage.getItem("refresh_token"),
        }
    }).then((datas) => {
        localStorage.setItem("access_token", datas.data.access_token);
        location.reload();
    }).catch((error) => {
        if (error.response.status === 403) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            checkUserIsLogined();
        }
    })
};

const otherChatListTemplate = (name, text, time, type) => {
    const date = new Date(time * 1000),
        chatTime = document.querySelectorAll('.other-chat-time'),
        lastTime = chatTime.length !== 0 ? chatTime[chatTime.length - 1].children[1].children[0].innerText : "",
        timeSentence = `${date.getHours() <= 11 ? '오전' : '오후'} 
            ${date.getHours()}: ${numberWithTenDigit(date.getMinutes())}`,
        template = `<div class="other-chat-list">
        <div class="profile">
            <a href="#">
            <!-- 프로필 이동 -->
                <img src="http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${1}.png" alt="profileImage">
            </a>
        </div>
        <ul>
            <h4><span>${name}</span></h4>
            <li>
                <div ${text ? `class= "other-first-message"` : ""}>
                    <h2>${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}</h2>
                </div>
                <div class="other-chat-time">
                    <h4><span>99</span></h4>
                    <h4><span>${timeSentence === lastTime ? `${chatTime[chatTime.length - 1].children[1].innerText = ''}${timeSentence}` : timeSentence}</span></h4>
                </div>
            </li>
        </ul>
    </div>`;
    return template;
};

const myChatListTemplate = (text, type) => {
    const template = `<div class="my-chat-list">
        <ul>
            <li>
                <div ${text ? `class="my-first-message"` : ""}>
                    <h2>
                        ${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}
                    </h2>
                </div>
            </li>
        </ul>
    </div>`;
    return template
};

const chattingItemTemplate = (text, time, way, type) => {
    if (chatting.sendButton.getAttribute('src').split('/')[2] !== 'hashtag.png' || text) {
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
            const date = new Date(time * 1000),
                chatTime = document.querySelectorAll('.other-chat-time'),
                lastTime = chatTime.length !== 0 || chatTime[chatTime.length - 1].children[1].children[0].innerHTML,
                timeSentence = `${date.getHours() <= 11 ? '오전' : '오후'} ${date.getHours()}: ${numberWithTenDigit(date.getMinutes())}`,
                template = `<li>
                <div>
                    <h2>${type === 'str' ? `<span>${text}</span>` : type === 'img' ? `<img src=${text} />` : ''}</h2>
                </div>
                <div class="other-chat-time">
                    <h4><span>99</span></h4>
                    <h4><span>
                        ${timeSentence === lastTime ? `${chatTime[chatTime.length - 1].children[1].innerText = ''}${timeSentence}` : timeSentence}
                    </span></h4>
                </div>
            </li>`;
            return template;
        }
    }
};

const chatDayTemplate = (time) => {
    const week = ['일', '월', '화', '수', '목', '금', '토'],
        date = new Date(time * 1000),
        template = `<div class="chat-day">
            <div class="line"></div>
            <h4><span>${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${week[date.getDay()]}요일</span></h4>
    </div>`;
    return template;
};

const memberItemTemplate = (name, id) => {
    const template = `<li>
        <div>
            <div class="profile-img">
                <a><img src="http://chicksoup.s3.ap-northeast-2.amazonaws.com/media/image/user/profile/${id}.png" alt=""></a>
            </div>
            <div class="profile-name">
                <span>${name}</span>
            </div>
        </div>
    </li>`;
    return template;
};

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
    if (input.readOnly) {
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
        }).then(() => {
            input.readOnly = true;
        }).catch(() => {
            input.readOnly = false;
        })
    }
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
    const emoList = chatting.emoList,
        moreFunction = chatting.moreFunction,
        emoButtonImg = chatting.emoButton.childNodes[1],
        moreOptionImg = chatting.moreOption.childNodes[1],
        hashButtonImg = chatting.hashButton.childNodes[1];
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
    const inputValue = chatting.chatInput.value,
        hashButtonImg = chatting.hashButton.childNodes[1],
        imageValue = document.querySelector('.image > img');
    if (inputValue.length >= 1 || imageValue !== null)
        hashButtonImg.src = '../img/moreOptionOn.png';
    else
        hashButtonImg.src = '../img/hashtag.png';
    if (inputValue === "")
        return;
    if (e.keyCode === 13) {
        sendChatting();
        return;
    }
};

const getClickedEmo = (e) => {
    const emoPath = e.target.getAttribute("src").split("/"),
        emo = emoPath[emoPath.length - 1].split(".")[0];
    return emo;
};

const sendChatting = () => {
    const inputValue = chatting.chatInput.value,
        image = document.querySelector('.image > img');
    if ((image && inputValue)) {
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": image.src, 'token': localStorage.getItem('access_token'), 'type': 'img' });
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": inputValue, 'token': localStorage.getItem('access_token'), 'type': 'str' })
        image.parentNode.remove();
    } else if (image) {
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": image.src, 'token': localStorage.getItem('access_token'), 'type': 'img' })
        image.parentNode.remove();
    } else {
        socket.emit('chatting', { 'roomId': roomId, "userId": userId, "chat": inputValue, 'token': localStorage.getItem('access_token'), 'type': 'str' })
    }
    chatting.chatInput.value = "";
    checkUserDidInput({ keyCode: null });
};

const axiosGETProfile = (url) => {
    return axios({
        url: `http://ec2-13-125-190-40.ap-northeast-2.compute.amazonaws.com:8080/users${url}`,
        method: "GET",
        headers: {
            "Authorization": accessToken
        }
    });
};

const getMyProfile = () => {
    axios({
        method: "GET",
        url: "http://ec2-13-125-190-40.ap-northeast-2.compute.amazonaws.com:8080/users/my/profile",
        headers: {
            "Authorization": accessToken
        }
    }).then((res) => {
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userName', res.data.nickname);
    }).catch((err) => {
        if (err.response.status === 403) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            checkUserIsLogined();
        }
    });
};

const getMemberProfile = (userId) => {
    axiosGETProfile(`/${parseInt(userId)}`).then(res => {
        document.querySelector("#member-list > ul").insertAdjacentHTML("afterbegin", memberItemTemplate(res.data.nickname, res.data.id));
    }).catch(err => {
        console.log(err);
    })
};

const insertChatDate = (time) => {
    const chatDate = document.querySelectorAll('.chat-day > h4 > span'),
        week = ['일', '월', '화', '수', '목', '금', '토'],
        date = new Date(time * 1000),
        dateSentence = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${week[date.getDay()]}요일`,
        lastChatDate = chatDate[chatDate.length - 1] === undefined ? undefined : chatDate[chatDate.length - 1].innerText;
    if (lastChatDate !== dateSentence) {
        chatting.chatMain.insertAdjacentHTML('beforeend', chatDayTemplate(time));
    }
};

const insertEmoList = () => {
    const emoDiv = document.querySelector('#emoticon-list > div > ul'),
        template = `<li>
        <div><img src="../img/😀.png" alt="😀"></div>
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
};

const connectSocket = () => {
    socket = io.connect("http://10.156.147.139:3000");
};

const connectGetChat = () => {
    socket.emit("getChat", { roomId: roomId, token: accessToken });
    socket.on("chatData", (data) => {
        data.forEach((data) => {
            data.name = JSON.parse(data.name);
            const chk = document.querySelectorAll('.other-chat-list'),
                chkArr = chk[chk.length - 1],
                otherName = chkArr === undefined ? undefined : chkArr.children[1].children[0].children[0].innerText,
                chatMainChildren = chatting.chatMain.children;
            let lastChattingName = chatMainChildren[chatMainChildren.length - 1] === undefined
                ? "chat-day"
                : chatMainChildren[chatMainChildren.length - 1].className;
            insertChatDate(data.time);
            if (data.userId === userId) {
                if (lastChattingName === 'other-chat-list' || lastChattingName === 'chat-day') {
                    chatting.chatMain.insertAdjacentHTML('beforeend', myChatListTemplate(data.chat, data.type));
                } else if (lastChattingName === 'my-chat-list') {
                    const myChatList = document.querySelectorAll('.my-chat-list');
                    myChatList[myChatList.length - 1].children[myChatList[myChatList.length - 1].children.length - 1]
                        .insertAdjacentHTML('beforeend', chattingItemTemplate(data.chat, data.time, 'i', data.type));
                }
            } else if (data.userId !== userId) {
                lastChattingName = chatMainChildren[chatMainChildren.length - 1].className;
                if (lastChattingName === 'chat-day' || (lastChattingName === 'my-chat-list' || otherName !== data.name.nickname)) {
                    chatting.chatMain.insertAdjacentHTML('beforeend', otherChatListTemplate(data.name.nickname, data.chat, data.time, data.type));
                } else if (lastChattingName === 'other-chat-list') {
                    const otherChatList = document.querySelectorAll('.other-chat-list');
                    otherChatList[otherChatList.length - 1].children[otherChatList[otherChatList.length - 1].children.length - 1]
                        .insertAdjacentHTML('beforeend', chattingItemTemplate(data.chat, data.time, 'you', data.type));
                }
            }
        });
        chatting.chatMain.scrollTop = chatting.chatMain.scrollHeight;
    });
};

const connectGetLiveChat = () => {
    socket.on('realTimeChat', (data) => {
        data.name = JSON.parse(data.name);
        const chatMainChildren = chatting.chatMain.children,
            lastChattingName = chatMainChildren[chatMainChildren.length - 1] === undefined
                ? 'chat-day'
                : chatMainChildren[chatMainChildren.length - 1].className;
        insertChatDate(data.time);
        if (data.userId === userId) {
            if (lastChattingName === "other-chat-list" || lastChattingName === "chat-day") {
                chatting.chatMain.insertAdjacentHTML("beforeend",
                    myChatListTemplate(data.chat, data.type));
            } else if (lastChattingName === "my-chat-list") {
                const myChatList = document.querySelectorAll('.my-chat-list');
                myChatList[myChatList.length - 1].children[myChatList[myChatList.length - 1].children.length - 1]
                    .insertAdjacentHTML('beforeend', chattingItemTemplate(data.chat, data.time, 'i', data.type));
            }
        } else if (data.userId !== userId) {
            if (lastChattingName === "my-chat-list" || lastChattingName === "chat-day") {
                chatting.chatMain.insertAdjacentHTML("beforeend",
                    otherChatListTemplate(data.name.nickname, data.chat, data.time, data.type));
            } else if (lastChattingName === "other-chat-list") {
                const otherChatList = document.querySelectorAll('.other-chat-list');
                otherChatList[otherChatList.length - 1].children[otherChatList[otherChatList.length - 1].children.length - 1]
                    .insertAdjacentHTML('beforeend', chattingItemTemplate(data.chat, data.time, 'you', data.type));
            }
        }
        chatting.chatMain.scrollTop = chatting.chatMain.scrollHeight;
    });
}

const socketGetRoomStatus = () => {
    socket.on('chatStatus', (data) => {
        const chatTitle = document.querySelector('#chat-title'),
            changeTiteInput = document.querySelector('#title > input');
        chatTitle.innerText = data.name;
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

const readURL = () => {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div'),
                img = document.createElement('img'),
                button = document.createElement('button');
            div.classList.add('image');
            img.src = e.target.result;
            button.innerText = 'x';
            div.appendChild(img);
            div.appendChild(button);
            button.addEventListener("click", (e) => {
                if (confirm('지울거니?')) {
                    e.target.parentNode.remove();
                    // 이거 아래처럼 하면 여러 개 일 때 문제..
                    // Todo: 좋은 방법 생각해보기
                    // chatting.hashButton.childNodes[1].src = '../img/hashtag.png';
                }
            });
            document.querySelector('#chat-sentence').insertAdjacentElement('beforeend', div);
            checkUserDidInput({ keyCode: null });
        };
        reader.readAsDataURL(input.files[0]);
    }
};

const addClickEvent = (el, callback) => {
    el.addEventListener("click", callback);
};

const addClickEventPlusArg = (el, callback, argu) => {
    el.addEventListener("click", () => callback(argu));
};

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
    chatting.files.addEventListener('change', readURL);
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