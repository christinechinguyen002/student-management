import { useEffect } from "react";
import { COOKIE_USER, getCookie } from "../helpers/cookie";
import { useNavigate, Navigate } from "react-router-dom";

export default function RequireAuth({ children }: {children: JSX.Element}) {
    const navigate = useNavigate();
  
    const cookie = getCookie(COOKIE_USER);
  
    if (cookie) {
      const user = JSON.parse(cookie);
  
      if (!user || user == "") {
        return <Navigate to="/login" replace={true}/>;
      }
    } else {
      return <Navigate to="/login" replace={true} />;
    }
  
    return children;
  }
  