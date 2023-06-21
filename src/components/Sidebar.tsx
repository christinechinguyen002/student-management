import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const sidebarRoutes = [
    {
      route: "add-student",
      title: "Tiếp Nhận Học Sinh",
    },
    {
      route: "class-list",
      title: "Danh Sách Lớp",
    },
    {
      route: "find-student",
      title: "Tra Cứu Học Sinh",
    },
    {
      route: "transcript",
      title: "Bảng Điểm Môn Học",
    },
    {
      route: "final-report",
      title: "Báo Cáo Tổng Kết",
    },
  ];

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(
    sidebarRoutes.filter((item) => location.pathname.includes(item.route))
      .length > 0
      ? sidebarRoutes.filter((item) =>
          location.pathname.includes(item.route)
        )[0].route
      : sidebarRoutes[0].route
  );

  return (
    <div className="flex flex-col">
      {sidebarRoutes.map((item, idx) => (
        <Link
          to={item.route}
          key={idx}
          className={`${
            activeTab === item.route ? "active-tab " : ""
          }w-full h-12 pl-4 text-lg flex items-center`}
          onClick={() => setActiveTab(item.route)}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
