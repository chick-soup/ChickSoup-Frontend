import React, { useRef } from "react";
import * as S from "./style";
import "../reset.css";

const UserInfo = () => {
    const errorText = useRef();

    const handleClick = () => {
        console.log(1);
    };

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
                            <img src="" alt="profileImage" />
                        </S.ProfileImageInputLabel>
                        <S.ProfileImageInput type="file" id="profileImageInput"/>
                        <S.SignupInputBox>
                            <S.SignupInput type="text" id="userInfo_input_nickname"
                                placeholder="닉네임(최소 3자 최대 12자)" />
                        </S.SignupInputBox>
                        <S.ErrorText ref={errorText}></S.ErrorText>
                    </S.SignupInputBoxWrap>
                    <S.SignupButton>완료</S.SignupButton>
                </S.SignupWrap>
            </S.Signup>
        </div>
    );
};

export default UserInfo;