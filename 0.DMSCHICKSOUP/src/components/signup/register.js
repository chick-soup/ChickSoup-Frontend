import React, { useRef } from "react";
import * as S from "./style";
import "../reset.css";
import axios from "axios";
import SignupInputBox from "./SignupInputBox";

const Register = () => {
    const server = "http://ec2-13-209-99-114.ap-northeast-2.compute.amazonaws.com:8080";
    const errorText1 = useRef();
    const errorText2 = useRef();
    const errorText3 = useRef();
    const email = useRef();
    const emailCheck = useRef();
    const password = useRef();
    const passwordCheck = useRef();

    const axiosPost = (url, data) => {
        return axios({
            method: "POST",
            url: `${server}${url}`,
            data: data,
        })
    };

    const setTextDisplay = (el, dis) => {
        el.style.display = dis;
    };

    const checkPasswordEqual = () => {
        const errorText = errorText3.current;
        if (password.current.value === passwordCheck.current.value) {
            setTextDisplay(errorText, "none");
            return true;
        } else {
            errorText.innerHTML = "비밀번호가 일치하지 않습니다.";
            setTextDisplay(errorText, "inline");
            return false;
        }
    };

    const registerEmailCheck = () => {
        const errorText = errorText1.current;
        const value = email.current.value;
        const url = "/email/check";
        const data = {
            "email": value,
        };
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "이메일을 전송 중입니다.";
        axiosPost(url, data).then(() => {
            errorText.innerHTML = "이메일을 전송하였습니다.";
            emailCheck.current.parentNode.style.display = "block";
        }).catch((error) => {
            const state = error.response.status;
            if (state === 470) {
                errorText.innerHTML = "이미 인증된 이메일입니다. 계속 진행 해주세요.";
            } else if (state === 474) {
                errorText.innerHTML = "이미 인증된 이메일입니다. 다른 이메일을 사용 해주세요.";
            } else if (state === 400) {
                errorText.innerHTML = "이메일을 입력해주세요.";
            }
        })
    };

    const registerEmailAuth = () => {
        const errorText = errorText2.current;
        const url = "/email/auth";
        const data = {
            "email": email.current.value.trim(),
            "auth_code": emailCheck.current.value.trim(),
        };
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "인증코드를 전송 중입니다.";
        axiosPost(url, data).then(() => {
            errorText.innerHTML = "인증에 성공했습니다.";
        }).catch((error) => {
            const state = error.response.status;
            if (state === 470) {
                errorText.innerHTML = "이메일이 중복되었습니다.";
            } else if (state === 471) {
                errorText.innerHTML = "이메일을 확인해주세요.";
            } else if (state === 472) {
                errorText.innerHTML = "인증코드가 올바르지 않습니다.";
            }
        })
    };

    const registerSignup = () => {
        const errorText = errorText3.current;
        const url = "/signup";
        const data = {
            "email": email.current.value.trim(),
            "password": password.current.value.trim(),
        };
        if (!checkPasswordEqual())
            return;
        setTextDisplay(errorText, "inline");
        errorText.innerHTML = "잠시만 기다려 주세요.";
        axiosPost(url, data).then((datas) => {
            localStorage.setItem("access_token", datas.data.access_token);
            document.querySelector(".signup_signup").style.transform = "translateX(-100vw)";
        }).catch((error) => {
            const state = error.response.status;
            if (state === 470) {
                errorText.innerHTML = "이메일이 중복되었습니다.";
            } else if (state === 471) {
                errorText.innerHTML = "이메일을 확인해주세요.";
            } else if (state === 473) {
                errorText.innerHTML = "접근 권한이 없는 이메일입니다.";
            } else {
                errorText.innerHTML = "오류가 발생 하였습니다. 잠시만 기다려 주세요.";
            }
        })
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
                        <SignupInputBox
                            type="text"
                            refer={email}
                            onEvent={registerEmailCheck}
                            placeholder="이메일(최대 30자)"
                            buttonText="확인" />
                        <S.ErrorText ref={errorText1}></S.ErrorText>

                        <SignupInputBox
                            type="text"
                            refer={emailCheck}
                            onEvent={registerEmailAuth}
                            placeholder="인증 번호 입력"
                            buttonText="인증" />
                        <S.ErrorText ref={errorText2}></S.ErrorText>

                        <SignupInputBox
                            type="password"
                            refer={password}
                            placeholder="비밀번호(최소 8자)" />
                        <SignupInputBox
                            type="password"
                            refer={passwordCheck}
                            placeholder="비밀번호 확인"
                            onEvent={() => { checkPasswordEqual(); }} />
                        <S.ErrorText ref={errorText3}></S.ErrorText>
                    </S.SignupInputBoxWrap>
                    <S.SignupButton onClick={registerSignup}>회원가입</S.SignupButton>
                </S.SignupWrap>
            </S.Signup>
        </div>
    );
};

export default Register;