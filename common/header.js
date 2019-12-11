const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
const S3HOST = "https://chicksoup.s3.ap-northeast-2.amazonaws.com";
const childNodesOne = document.body.childNodes[1],
    childNodesId = childNodesOne.getAttribute("id"),
    goBack = `<div id="go_back">
        <img src="../img/${IsSetting() ? "leftArrowBrown" : "leftArrow"}.svg" alt="leftArrow">
    </div>`,
    header = `<header id="header_header">
        <main>
            <div id="header_chicksoup">
                <h1><a href="../login/login.html">Chick Soup</a></h1>
            </div>
            <nav id="header_nav">
                <ul>
                    <li><a>친구목록보기</a></li>
                    <li><a>채팅하기</a></li>
                    <li><a><img id="header_nav_setting" 
                    src="../img/${IsSetting()
                ? "settingBlack"
                : "setting"}.svg" alt="setting"></a></li>
                </ul>
            </nav>
            ${IsSetting() ? "" : goBack}
        </main>
    </header>`
childNodesOne.insertAdjacentHTML("afterbegin", header);

function IsSetting() {
    if (childNodesId === "friendList" 
        || childNodesId === "setting" 
        || childNodesId === "identify"
        || childNodesId === "searchFriend")
        return true;
    return false;
}

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
        method: "GET",
        url: `${server}${url}`,
        data: data,
        headers: {
            "Authorization": localStorage.getItem("access_token"),
        }
    })
};

const axiosPOST = (url, data) => {
    return axios({
        method: "GET",
        url: `${server}${url}`,
        data: data,
    })
};

const setTextDisplay = (el, dis) => {
    el.style.display = dis;
};