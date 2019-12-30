const server = "http://ec2-13-125-190-40.ap-northeast-2.compute.amazonaws.com:8080";
const S3HOST = "http://chicksoup.s3.ap-northeast-2.amazonaws.com";
const childNodesOne = document.body.childNodes[1];
const IsSetting = () => {
    const cId = childNodesOne.getAttribute("id");
    if (cId === "friendList"
        || cId === "setting"
        || cId === "searchFriend")
        return true;
    return false;
};
const headerObj = {
    "header": `<header id="header_header">
        <main>
            <div id="header_chicksoup">
                <h1><a href="../friendList/friendList.html">Chick Soup</a></h1>
            </div>
            <nav id="header_nav">
                <ul>
                    <li><a href="../friendList/friendList.html">친구목록보기</a></li>
                    <li><a href="../chattingRoom/chattingRoom.html">채팅하기</a></li>
                    <li><a href="../setting/setting.html"><img id="header_nav_setting" 
                    src="../img/${IsSetting()
                        ? "settingBlack"
                        : "setting"}.svg" alt="setting"></a>
                    </li>
                </ul>
            </nav>
            ${IsSetting() ? "" : `<div id="go_back"><img src="../img/${IsSetting() ? "leftArrowBrown" : "leftArrow"}.svg" alt="leftArrow"></div>`}
        </main>
    </header>`
};
childNodesOne.insertAdjacentHTML("afterbegin", headerObj.header);

const axiosGETWithToken = (url) => {
    return axios({
        method: "GET",
        url: `${server}${url}`,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    })
};

const axiosGET = (url) => {
    return axios({
        method: "GET",
        url: `${server}${url}`,
    })
};

const axiosPOSTWithToken = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    })
};

const axiosPOST = (url, data) => {
    return axios({
        method: "POST",
        url: `${server}${url}`,
        data: data,
    })
};

const setTextDisplay = (el, dis) => {
    el.style.display = dis;
};

const checkUserIsLogined = () => {
    if (!localStorage.getItem("access_token")) {
        alert("로그인 후 이용해주시기 바랍니다.");
        location.href = "../login/login.html";
    }
};

const axiosRefresh = () => {
    axios({
        method: "GET",
        url: `${server}/refresh`,
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

const addClassToAllaTag = () => {
    document.querySelectorAll("a").forEach((el) => {
        el.classList.add("aTag");
    });
};

addClassToAllaTag();