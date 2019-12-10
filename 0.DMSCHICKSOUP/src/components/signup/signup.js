import React from "react";
import "../reset.css";
import "./signup.css";
import Register from "./register";
import UserInfo from "./userInfo";

const Signup = () => {
    return (
        <div className="signup_signup">
            <Register />
            <UserInfo />
        </div>
    );
};

export default Signup;