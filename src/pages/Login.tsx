import React from "react";
import logo from "../assets/images/logo.svg";

export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[486px] h-fit">
        <div className="flex flex-col items-center pb-[30px]">
          <img src={logo} alt="" />
          <div className="pt-[10px] text-2xl font-bold">ĐĂNG NHẬP</div>
        </div>
        <div>
          <div className="text-xl">Tên đăng nhập</div>
          <input
            className="h-12 w-full focus:border-b focus-visible:outline-none"
            type="text"
            placeholder="username"
          />
          <div className="text-xl pt-[30px]">Mật khẩu</div>
          <input
            className="h-12 w-full focus:border-b focus-visible:outline-none"
            type="password"
            placeholder="Password"
          />
          <button className="button-primary h-20 text-2xl font-bold w-full mt-12">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
