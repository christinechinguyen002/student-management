import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie, COOKIE_USER } from "../helpers/cookie";
import logo from "../assets/images/logo.svg";

export default function Login() {
  const initialError = {
    status: 0,
    message: "Unknown",
  }

  const navigate = useNavigate();

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(initialError);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    console.log("handle login: ", formValue);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password regex pattern
    const passwordPattern = /^.{8,}$/;

    if (!emailPattern.test(formValue.email)) {
      setError({
        status: -1,
        message: 'Email address must contain @ and .com',
      });
      return;
    }

    if (!passwordPattern.test(formValue.password)) {
      setError({
        status: -1,
        message: 'Password must be 8 characters or more',
      });
      return;
    }

    setError({
      status: 0,
      message: "success"
    });

    // send it to server

    /**
     * Get docs
     * compare 2 type
     * if right then pass
     * else error
     */

    if (formValue.email == "teo@gmail.com" && formValue.password == "12345678") {
      setCookie(COOKIE_USER, JSON.stringify(formValue.email));
      navigate("/dashboard");
    } else {
      setError({
        status: 401,
        message: "Email or Password is wrong. Try again!",
      });
    }

  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[486px] h-fit">
        <div className="flex flex-col items-center pb-[30px]">
          <img src={logo} alt="" />
          <div className="pt-[10px] text-2xl font-bold">ĐĂNG NHẬP</div>
          {error.status != 0 && <h4 style={{ color: "red" }}>{error.message}</h4>}
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <div className="text-xl">Tên đăng nhập</div>
            <input
              className="h-12 w-full focus:border-b focus-visible:outline-none"
              type="text"
              placeholder="username"
              value={formValue.email}
              onChange={(e) => setFormValue({ ...formValue, email: e.target.value })}
            />
            <div className="text-xl pt-[30px]">Mật khẩu</div>
            <input
              className="h-12 w-full focus:border-b focus-visible:outline-none"
              type="password"
              placeholder="Password"
              value={formValue.password}
              onChange={(e) => setFormValue({ ...formValue, password: e.target.value })}
            />
            <button className="button-primary h-20 text-2xl font-bold w-full mt-12" type="submit">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
