import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/icons/arrow-left.svg";
import db from "../firebase";

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

  const [formValue, setFormValue] = useState({
    class: "all",
    year: "all",
  });
  let classID: string[] = [];

  function fetchClass() {
    (async () => {
      const collectionRef = collection(db, "class");
      const snapshot = await getDocs(collectionRef);

      snapshot.forEach((doc: any) => {
        if (!classID.includes(doc.id)) {
          classID.push(doc.id);
        }
      });

      classID.map(async (id) => {
        const docRef = doc(db, "class", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.data() !== undefined) {
          setClassDataArray((prevArray) => [docSnap.data(), ...prevArray]);
        }
      });
    })();
  }

  const handleSelectChange = (
    sender: "class" | "year",
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    switch (sender) {
      case "class":
        setFormValue({ ...formValue, class: `${event.target.value}` });
        break;
      case "year":
        setFormValue({ ...formValue, year: `${event.target.value}` });
        break;
    }
  };

  const [uniqueClassNames, setUniqueClassNames] = useState<string[]>([]);
  const [classDataArray, setClassDataArray] = useState<any[]>([]);
  const [yearsToDisplay, setYearsToDisplay] = useState<any[]>([]);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      // This code will run on subsequent renders after the initial mount
      // Put your logic here that you want to execute after the initial mount
      // ...
      fetchClass();
    } else {
      // This code will run only on the initial mount
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    const classNames = classDataArray.map((item) => item.ClassName);
    const uniqueClassNames = classNames.filter(
      (className, index) => classNames.indexOf(className) === index
    );
    setUniqueClassNames(uniqueClassNames);
  }, [classDataArray]);

  useEffect(() => {
    const selectedClass = classDataArray.find(
      (item) => item.ClassName === formValue.class
    );

    setYearsToDisplay(
      selectedClass
        ? classDataArray
            .filter((item) => item.ClassName === selectedClass.ClassName)
            .map((classItem, idx) => (
              <option key={idx} value={classItem.Year}>
                {classItem.Year}
              </option>
            ))
        : []
    );
  }, [formValue.class]);

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
          <div className="flex space-x-4 items-center">
            <div>Lớp</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Lớp"
                className="w-44 h-10 focus-visible:outline-none"
                value={formValue.class}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  handleSelectChange("class", event)
                }
              >
                <option value="all">Chọn lớp</option>
                {uniqueClassNames.map((className, idx) => {
                  const classItem = classDataArray.find(
                    (item) => item.ClassName === className
                  );
                  if (classItem) {
                    return (
                      <option key={idx} value={className}>
                        {className}
                      </option>
                    );
                  }
                  return null;
                })}
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div>Niên khóa</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Niên khóa"
                className="w-44 h-10 focus-visible:outline-none"
                value={formValue.year}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  handleSelectChange("year", event)
                }
              >
                <option value="all">Chọn niên khóa</option>
                {yearsToDisplay}
              </Form.Select>
            </div>
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
                  <td className="border">
                    <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                  </td>
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
                    <td className="border">
                      <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                    </td>
                    <td className="border">{idx + 1}</td>
                    <td className="border">{student.name}</td>
                    <td className="border">{student.gender}</td>
                    <td className="border">{student.birthYear}</td>
                    <td className="border">{student.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="button-primary w-fit px-6 py-3">
              Thêm học sinh
            </button>
          </>
        )}
      </div>
    </div>
  );
}
