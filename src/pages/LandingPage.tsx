import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COOKIE_USER, getCookie } from "../helpers/cookie";

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const cookie = getCookie(COOKIE_USER);

        if (cookie) {
            const user = JSON.parse(cookie);
        } else {
            navigate("/login");
        }

        console.log("cookie: ", cookie);
        
    }, []);

    return (
        <div>Chào mừng bạn đến với web site của chúng tôi</div>
    );
}
