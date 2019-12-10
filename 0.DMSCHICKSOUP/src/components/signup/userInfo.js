import React, { useRef } from "react";
import * as S from "./style";
import defaultImage from "../img/signup/도라에몽.png";
import axios from "axios";

const UserInfo = () => {
    const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
    const img = useRef();
    const imgInput = useRef();
    const nickName = useRef();
    const errorText = useRef();

    const setTextDisplay = (el, dis) => {
        el.style.display = dis;
    };

    const checkNicknameLength = () => {
        const len = nickName.current.value.length;
        if (len < 3 || len > 9) {
            setTextDisplay(errorText.current, "inline");
            errorText.current.innerHTML = "닉네임은 최소 3자 최대 12자입니다.";
            return false;
        }
        setTextDisplay(errorText.current, "none");
        return true;
    };

    const userInfoSignupProfile = () => {
        const url = "/signup/profile";
        const file = imgInput.current.files[0];
        let fd = new FormData();
        fd.append("nickname", nickName.current.value.trim());

        if (!checkNicknameLength()) {
            return;
        }
        if (sessionStorage.getItem("profile")) {
            fd.append("profile", file);
        }

        axios.post(`${server}${url}`, fd, {
            headers: {
                "Authorization": localStorage.getItem("access_token"),
                "Content-Type": "multipart/form-data",
            }
        }).catch(() => {
            setTextDisplay(errorText.current, "inline");
            errorText.current.innerHTML = "오류가 발생 하였습니다. 잠시만 기다려주세요.";
        })
    };

    const encodeImageFileAsURL = () => {
        const file = imgInput.current.files[0];
        const fileSplit = file.name.split('.');
        const fileExtension = fileSplit[fileSplit.length - 1];
        if (!(fileExtension === "png"
            || fileExtension === "jpg"
            || fileExtension === "jpeg")) {
            return alert("파일 형식은 png, jpg, jpeg만 허용합니다. ");
        }
        let reader = new FileReader();
        reader.onloadend = (e) => {
            img.current.setAttribute("src", e.target.result);
        }
        reader.readAsDataURL(file);
        // ? convertImageFileAsFormData를 사용하기 위해서 
        sessionStorage.setItem("profile", true);
    };

    const isKeyupEnter = (e, callback) => {
        if (e.keyCode === 13) {
            callback();
        }
    };

    window.onload = () => {
        sessionStorage.removeItem("profile");
    }

    return (
        <div>
            <S.Signup>
                <S.SignupWrap>
                    <S.SignupHeader>
                        <S.SignupChicksoup>Chick Soup</S.SignupChicksoup>
                        <S.SignupSignup>회원가입</S.SignupSignup>
                    </S.SignupHeader>
                    <S.SignupInputBoxWrap>
                        <S.ProfileImageInputLabel htmlFor="profileImageInput">
                            <img src={defaultImage} ref={img} alt="profileImage" />
                        </S.ProfileImageInputLabel>
                        <S.ProfileImageInput type="file" onChange={encodeImageFileAsURL} ref={imgInput} id="profileImageInput"/>
                        <S.SignupInputBox>
                            <S.SignupInput type="text" onKeyUp={(e) => {
                                    checkNicknameLength();
                                    isKeyupEnter(e, userInfoSignupProfile);
                                }}
                                ref={nickName}
                                placeholder="닉네임(최소 3자 최대 12자)" />
                        </S.SignupInputBox>
                        <S.ErrorText ref={errorText}></S.ErrorText>
                    </S.SignupInputBoxWrap>
                    <S.SignupButton onClick={userInfoSignupProfile}>완료</S.SignupButton>
                </S.SignupWrap>
            </S.Signup>
        </div>
    );
};

export default UserInfo;