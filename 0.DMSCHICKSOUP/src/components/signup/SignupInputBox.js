import React from "react";
import * as S from "./style";
import "../reset.css";

const Register = ({ type, refer, onEvent, placeholder, buttonText }) => {
    const isKeyupEnter = (e, callback) => {
        if (e.keyCode === 13) {
            callback();
        }
    };

    return (
        <S.SignupInputBox>
            <S.SignupInput
                type={type}
                ref={refer}
                onKeyUp={(e) => {
                    placeholder === "비밀번호 확인"
                        ? onEvent()
                        : isKeyupEnter(e, onEvent);
                }}
                placeholder={placeholder} />
            {buttonText && <S.SignupEmailButton onClick={onEvent}>{buttonText}</S.SignupEmailButton>}
        </S.SignupInputBox>
    );
};

export default Register;