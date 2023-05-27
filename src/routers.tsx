import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./layouts/main";
import AddStudent from "./pages/AddStudent";
import ClassList from "./pages/ClassList";
import FinalReport from "./pages/FinalReport";
import FindStudent from "./pages/FindStudent";
import Login from "./pages/Login";
import Transcript from "./pages/Transcript";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "add-student",
        element: <AddStudent />,
      },
      {
        path: "class-list",
        element: <ClassList />,
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
