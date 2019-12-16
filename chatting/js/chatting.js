const menuButton = document.querySelector('#menu-btn');
const emoButton = document.querySelector('#emoticon-btn');
const alarmButton = document.querySelector('#alarm');
const moreOption = document.querySelector('#option-btn');
const chatMain = document.getElementById('chat-main');
const emoList = document.getElementById('emoticon-list');
const moreFunction = document.getElementById('more-function');
const chatInput = document.querySelector('#chat-sentence > input');
const hashButton = document.querySelector('#hash_tag-btn');
const emoticonList = document.querySelectorAll('#emoticon-list > .center-view > ul > div > li > div > img');
console.log(emoticonList);

menuButton.addEventListener('click', () => {
    const hiddenDiv = document.getElementById('hidden-div');
    hiddenDiv.style.right = "0px";
    hiddenDiv.classList.add('show');
    hiddenDiv.addEventListener('click', (e) => {
        if (e.target !== e.currentTarget) return;
        hiddenDiv.classList.remove('show');
    });
    document.querySelector('#change-btn').addEventListener('click', () => {
        document.querySelector('#title > input').readOnly = !document.querySelector('#title > input').readOnly;
    });
});

emoButton.addEventListener('click', () => {
    emoButton.childNodes[1].src = '../img/emoticonOn.png';    
    emoList.style.display = 'block';
    emoList.classList.add('emo-show');
    moreOption.childNodes[1].src = '../img/moreOption.png'
    moreFunction.classList.remove('emo-show');
    moreFunction.style.display = 'none';
});

alarmButton.addEventListener('click', () => {
    if (alarmButton.childNodes[1].getAttribute('src') === '../img/alarmOn.png')
        alarmButton.childNodes[1].src = '../img/alarmOff.png';
    else
        alarmButton.childNodes[1].src = '../img/alarmOn.png';
});

moreOption.addEventListener('click', () => {
    moreFunction.style.display = 'block';
    moreFunction.classList.add('emo-show');
    moreOption.childNodes[1].src = '../img/moreOptionOn.png';
    emoButton.childNodes[1].src = '../img/emoticon.png'
    emoList.classList.remove('emo-show');
    emoList.style.display = 'none';    
});

chatMain.addEventListener('click', () => {
    emoButton.childNodes[1].src = '../img/emoticon.png';
    emoList.classList.remove('emo-show');
    moreOption.childNodes[1].src = '../img/moreOption.png';
    moreFunction.classList.remove('emo-show');
    hashButton.childNodes[1].src = '../img/hashtag.png';
    setTimeout(() => {
        emoList.style.display = 'none';
        moreFunction.style.display = 'none';
    }, 300);
});

chatInput.addEventListener('input', () => {
    if (chatInput.value.length >= 1) {
        hashButton.childNodes[1].src = '../img/moreOptionOn.png';
        console.log('if');
    } else {
        hashButton.childNodes[1].src = '../img/hashtag.png';
        console.log('else');
    }
});


emoticonList.forEach(e => {
    e.addEventListener('click', (e) => {
        chatInput.value += e.target.alt;
        hashButton.childNodes[1].src = '../img/moreOptionOn.png';
    });
});