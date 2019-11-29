const profileImg = document.querySelector("#userInfo_profileimage_input_label > img");
const profileImgInput = document.querySelector("#userInfo_profileimage_input");

function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => profileImg.setAttribute("src", e.target.result);
        reader.readAsDataURL(input.files[0]);
    }
}

profileImgInput.addEventListener("change", function() {
    readURL(this);
});






