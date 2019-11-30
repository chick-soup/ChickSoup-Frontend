const friendListDetailImg = document.querySelectorAll(".friendList_details > img");

function showDetails(el) {
    el.parentNode.childNodes[3].classList.add("showDetails");
}

function defaultDetails() {
    friendListDetailImg.forEach((el) => {
        el.parentNode.childNodes[3].classList.remove("showDetails");
    })
}

function disShowDetails(el) {
    el.parentNode.childNodes[3].classList.remove("showDetails");
}

function IsOnDetails(el) {
    if (el.parentNode.childNodes[3].classList[1])
        return true;
    return false;
}

friendListDetailImg.forEach((el) => {
    el.addEventListener("click", ()=> {
        if(IsOnDetails(el)) {
            disShowDetails(el);
        } else {
            defaultDetails();
            showDetails(el);
        }
    });
});

