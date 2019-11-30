const childNodesOne = document.body.childNodes[1],
    childNodesId = childNodesOne.getAttribute("id"),
    goBack = `<div id="go_back">
        <img src="../img/${IsSetting() ? "leftArrowBrown" : "leftArrow"}.svg" alt="leftArrow">
    </div>`,
    header = `<header id="header_header">
        <main>
            <div id="header_chicksoup">
                <h1>Chick Soup</h1>
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
    if (childNodesId === "friendList" || childNodesId === "setting" || childNodesId === "identify" || childNodesId === "searchFriend")
        return true;
    return false;
}