import React from "react";

export default function AddStudent() {
  return (
    <div className="p-12">
      <div className="form-title">Tiếp nhận học sinh</div>
      <div className="form-container">
        <div className="flex items-center">
          <div className="basis-[18%] text-lg">Họ và tên</div>
          <input type="text" className="basis-[82%] custom-form-input" />
        </div>
        <div className="flex items-center space-x-20">
          <div className="basis-[50%] flex items-center">
            <div className="basis-[66%] text-lg">Ngày sinh</div>
            <input type="text" className=" custom-form-input" />
          </div>
          <div className="basis-[50%] flex items-center">
            <div className="basis-[66%] text-lg">Giới tính</div>
            <input type="text" className=" custom-form-input" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="basis-[18%] text-lg">Địa chỉ</div>
          <input type="text" className="basis-[82%] custom-form-input" />
        </div>
        <div className="flex items-center">
          <div className="basis-[18%] text-lg">Email</div>
          <input type="email" className="basis-[82%] custom-form-input" />
        </div>
        <div className="flex justify-center">
          <button className="button-primary h-10 text-lg px-20 w-fit font-bold">
            Thêm học sinh
          </button>
        </div>
      </div>
    </div>
  );
}
