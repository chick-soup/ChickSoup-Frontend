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


const chattingTemplate = (text) => {
    let li = document.createElement('li');
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let span = document.createElement('span');
    span.innerText = text;
    h2.insertAdjacentElement('afterbegin', span);
    div.insertAdjacentElement('afterbegin', h2);
    li.insertAdjacentElement('afterbegin', div);
    // document.querySelectorAll('.my-chat-list > ul > li:nth-last-child(1)').
    document.querySelector('.my-chat-list:nth-last-child(1) > ul').appendChild(li);
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
        emoList.classList.add('emo-show');
        moreFunction.classList.remove('emo-show');
        emoButtonImg.src = "../img/emoticonOn.png";
        moreOptionImg.src = "../img/moreOption.png"
    }
    else if (mode === "func") {
        emoList.classList.remove('emo-show');
        moreFunction.classList.add('emo-show');
        emoButtonImg.src = "../img/emoticon.png"
        moreOptionImg.src = "../img/moreOptionOn.png"
    }
    else if (mode === "main") {
        emoList.classList.remove('emo-show');
        moreFunction.classList.remove('emo-show');
        hashButtonImg.src = '../img/hashtag.png';
        emoButtonImg.src = "../img/emoticon.png"
        moreOptionImg.src = "../img/moreOption.png"
    }
};

const checkUserDidInput = () => {
    const inputValue = chatting.chatInput.value;
    const hashButtonImg = chatting.hashButton.childNodes[1];
    if (inputValue.length >= 1)
    hashButtonImg.src = '../img/moreOptionOn.png';
    else
<<<<<<< Updated upstream
    hashButtonImg.src = '../img/hashtag.png';
});

chatting.emoticonList.forEach(emo => {
    const hashButtonImg = chatting.hashButton.childNodes[1];
    emo.addEventListener('click', (e) => {
        const input = chatting.chatInput;
        const emoPath = e.target.getAttribute("src").split("/");
        const emo = emoPath[emoPath.length - 1].split(".")[0];
        // ? get Emoticon And push it into the value
        input.value += emo;
        hashButtonImg.src = '../img/moreOptionOn.png';
    });
});
=======
        hashButtonImg.src = '../img/hashtag.png';
}
const getClickedEmo = (e) => {
    const emoPath = e.target.getAttribute("src").split("/");
    const emo = emoPath[emoPath.length - 1].split(".")[0];
    return emo;
};
>>>>>>> Stashed changes

chatting.sendButton.addEventListener('click', () => {
    chattingTemplate(chatting.chatInput.value);
});

window.onload = () => {
    chatting.alarmButton.addEventListener('click', alarmSwitch);
    chatting.menuButton.addEventListener('click', showHiddenDiv);
    chatting.changeDiv.addEventListener('click', toggleReadonly);
    chatting.hiddenDiv.addEventListener('click', disShowHiddenDiv);
    chatting.chatInput.addEventListener('input', checkUserDidInput);
    chatting.chatMain.addEventListener('click', () => showModeOption("main"));
    chatting.emoButton.addEventListener('click', () => showModeOption("emo"));
    chatting.moreOption.addEventListener('click', () => showModeOption("func"));
    chatting.emoticonList.forEach(emo => {
        emo.addEventListener('click', (e) => {
            // ? get Emoticon And push it into the value
            chatting.chatInput.value += getClickedEmo(e);
            checkUserDidInput();
        });
    });
};