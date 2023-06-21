import React from "react";
import logo from "../assets/images/logo.svg";
import { removeCookie, COOKIE_USER } from "../helpers/cookie";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    removeCookie(COOKIE_USER);
    navigate("/");
  }

  return (
    <div className="bg-white flex justify-between items-center w-screen h-20 py-4 px-8">
      <div className="flex w-12 space-x-4 items-center">
        <img src={logo} alt="" />
        <div className="font-bold text-2xl text-blue-primary">MENU</div>
      </div>
      <div
        onClick={handleLogout}
        className="underline text-red-600 cursor-pointer"
      >
        Đăng xuất
      </div>
    </div>
  );
}
