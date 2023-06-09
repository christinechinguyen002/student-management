import React from "react";
import logo from "../assets/images/logo.svg";
import avatar from "../assets/images/avatar.png";
import chevronDown from "../assets/icons/chevron_down.svg";

export default function Header() {
  return (
    <div className="bg-white flex justify-between items-center w-screen h-20 py-4 px-8">
      <div className="flex w-12 space-x-4 items-center">
        <img src={logo} alt="" />
        <div className="font-bold text-2xl text-blue-primary">MENU</div>
      </div>
      <div className="flex space-x-3 items-center">
        <img src={avatar} alt="" />
        <img src={chevronDown} alt="" />
      </div>
    </div>
  );
}
