import { useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/icons/arrow-left.svg";

export default function CreateClassList() {
  const navigate = useNavigate();

  const data = [
    {
      name: "Latte",
      gender: "female",
      birthYear: 2000,
      address: "abc Town",
    },
    {
      name: "Latte",
      gender: "female",
      birthYear: 2000,
      address: "abc Town",
    },
    {
      name: "Latte",
      gender: "female",
      birthYear: 2000,
      address: "abc Town",
    },
  ];

  return (
    <div className="p-12">
      <div className="flex justify-center relative">
        <div
          className="absolute left-0 top-0 w-16 h-10 bg-white flex justify-center items-center rounded-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <img src={ArrowLeft} alt="" />
        </div>
        <div className="form-title">Lập danh sách lớp</div>
      </div>
      <div className="form-container">
        <div className="flex items-center space-x-11">
          <div className="flex space-x-4">
            <div>Lớp</div>
            <div></div>
          </div>
          <div className="flex space-x-4">
            <div>Niên khóa</div>
            <div></div>
          </div>
          <button className="green-button-primary w-fit h-10 px-5">
            Lập danh sách
          </button>
        </div>
        {data.length > 0 && (
          <>
            <table className="table-auto text-center border border-collapse">
              <thead>
                <tr className="font-bold h-10">
                  <td className="border">Chọn</td>
                  <td className="border">STT</td>
                  <td className="border">Họ và tên</td>
                  <td className="border">Giới tính</td>
                  <td className="border">Năm sinh</td>
                  <td className="border">Địa chỉ</td>
                </tr>
              </thead>
              <tbody>
                {data.map((student, idx) => (
                  <tr key={idx} className="h-10">
                    <td className="border">ch</td>
                    <td className="border">{idx + 1}</td>
                    <td className="border">{student.name}</td>
                    <td className="border">{student.gender}</td>
                    <td className="border">{student.birthYear}</td>
                    <td className="border">{student.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="button-primary w-fit px-6 py-3">Thêm học sinh</button>
          </>
        )}
      </div>
    </div>
  );
}
