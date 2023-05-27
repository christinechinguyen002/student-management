import React from "react";
import logo from "../assets/images/logo.svg";

export default function Header() {
  return (
    <div className="bg-white flex w-screen">
      <div className="w-12">
        <img src={logo} alt="" />
      </div>
    </div>
  );
}
