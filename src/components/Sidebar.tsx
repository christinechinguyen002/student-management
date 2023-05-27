import React from "react";
import { Link } from "react-router-dom";

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

  return (
    <div className="flex flex-col">
      {sidebarRoutes.map((item, idx) => (
        <Link to={item.route} key={idx} className="w-full h-12 pl-4 text-lg flex items-center">
          {item.title}
        </Link>
      ))}
    </div>
  );
}
