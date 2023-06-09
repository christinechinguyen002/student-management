import { Link } from "react-router-dom";

export default function ClassList() {
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
      <div className="form-title">Danh sách lớp</div>
      <div className="form-container">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div>Lớp</div>
            <div></div>
          </div>
          <div className="flex space-x-4">
            <div>Niên khóa</div>
            <div></div>
          </div>
          <button className="button-primary w-fit h-10 px-5">
            Xem danh sách
          </button>
          <Link
            to="create-class-list"
            className="green-button-primary w-fit h-10 px-5 flex items-center"
          >
            Lập danh sách
          </Link>
        </div>
        {data.length > 0 && (
          <table className="table-auto text-center border border-collapse">
            <thead>
              <tr className="font-bold h-10">
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
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.name}</td>
                  <td className="border">{student.gender}</td>
                  <td className="border">{student.birthYear}</td>
                  <td className="border">{student.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
