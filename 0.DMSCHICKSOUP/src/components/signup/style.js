import styled from "styled-components";

export const Signup = styled.main`
    flex: 1;
`;

export const SignupWrap = styled.div`
    width: 350px;
    margin: 15vh auto 0;
`;

export const SignupHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

export const SignupChicksoup = styled.h1`
    font-size: 40px;
    font-weight: bold;
`;

export const SignupSignup = styled.h2`
    font-size: 20px;
    font-weight: bold;
`;

export const SignupInputBoxWrap = styled.div`
    padding: 20px 0;
`;
// 만약 register_input_box 인증 칸이었다면 display: none;이 기본값
// 인증을 성공했을 시 display: block으로 바꿔줌
export const SignupInputBox = styled.label`
    display: block;
    position: relative;
    margin: 20px auto 0;
    padding: 10px 20px;
    border: 1.5px solid hsl(53, 100%, 50%);
    border-radius: 17px;
    box-shadow: 0 1px 5px hsl(0, 0%, 65%);
    background-color: #ffffff;
`;
// 만약 register_input_box > input 인 경우 width: 85%;
export const SignupInput = styled.input`
    width: 100%;
    height: 15px;
    font-size: 13px;
    border: 0;
    padding: 0;
    outline: none;
`;

export const SignupEmailButton = styled.button`
    position: absolute;
    top: 50%;
    right: 0;
    height: 100%;
    line-height: 100%;
    padding: 10px 15px;
    border: 1.5px solid hsl(53, 100%, 50%);
    border-radius: 17px;
    transform: translateY(-50%);
    background-color: #3B1C1C;
    color: white;
    font-weight: bold;
    cursor: pointer;
`;

export const SignupButton = styled.button`
    width: 100%;
    margin: 20px 0 0;
    padding: 10px 20px;
    border: 0;
    border-radius: 5px;
    background-color: hsl(0, 36%, 17%);
    box-shadow: 0 0 5px hsl(0, 0%, 43%);
    color: white;
    cursor: pointer;
`;

export const ProfileImageInputLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 350px;
    height: 250px;
    border-radius: 15px;
    cursor: pointer;
`;

export const ProfileImageInputLabelImage = styled.label`
    min-width: 30%;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
`;

export const ProfileImageInput = styled.input`
    display: none;
`;

export const ErrorText = styled.span`
    display: none;
    font-size: 12px;
    margin-left: 16px;
`;