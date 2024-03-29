import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Dashboard(): JSX.Element {
  return (
    <div className="h-screen bg-white">
      <div className="fixed top-0 left-0 w-56">
        <Header />
        <Sidebar />
      </div>
      <div className="h-full ml-56 pt-20 bg-grey-2">
        <Outlet />
      </div>
    </div>
  );
}
