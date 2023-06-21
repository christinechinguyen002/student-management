import { createBrowserRouter, Outlet } from "react-router-dom";
import Dashboard from "./layouts/main";
import AddStudent from "./pages/AddStudent";
import ClassList from "./pages/ClassList";
import CreateClassList from "./pages/CreateClassList";
import FinalReport from "./pages/FinalReport";
import FindStudent from "./pages/FindStudent";
import Login from "./pages/Login";
import Transcript from "./pages/Transcript";
import LandingPage from "./pages/LandingPage";
import RequireAuth from "./components/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: <RequireAuth><Dashboard /></RequireAuth>,
    children: [
      { index: true, element: <AddStudent /> },
      {
        path: "add-student",
        element: <AddStudent />,
      },
      {
        path: "class-list",
        children: [
          {
            path: "create-class-list",
            element: <CreateClassList />,
          },
          {
            path: "",
            element: <ClassList />,
          },
        ],
      },
      {
        path: "find-student",
        element: <FindStudent />,
      },
      {
        path: "transcript",
        element: <Transcript />,
      },
      {
        path: "final-report",
        element: <FinalReport />,
      },
    ],
  },
]);
