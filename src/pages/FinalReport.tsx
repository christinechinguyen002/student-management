import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import db from "../firebase";

export default function FinalReport() {
  const data1 = [
    {
      class: "10A1",
      numberOfStudents: 40,
      pass: 40,
      percentPass: 100,
    },
    {
      class: "10A1",
      numberOfStudents: 40,
      pass: 40,
      percentPass: 100,
    },
    {
      class: "10A1",
      numberOfStudents: 40,
      pass: 40,
      percentPass: 100,
    },
  ];

  const data2 = [
    {
      class: "10A1",
      numberOfStudents: 40,
      pass: 40,
      percentPass: 100,
    },
    {
      class: "10A1",
      numberOfStudents: 40,
      pass: 40,
      percentPass: 100,
    },
    {
      class: "10A1",
      numberOfStudents: 40,
      pass: 40,
      percentPass: 100,
    },
  ];

  const [formValue, setFormValue] = useState({
    class: "all",
    year: "all",
  });
  const [yearsToDisplay, setYearsToDisplay] = useState<any[]>([]);
  let classID: string[] = [];
  const [classDataArray, setClassDataArray] = useState<any[]>([]);
  const isMounted = useRef(false);

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

  const [uniqueClassNames, setUniqueClassNames] = useState<string[]>([]);
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
    <div className="p-12 bg-grey">
      <div className="form-title">Báo cáo tổng kết môn học</div>
      <div className="form-container">
        <div className="flex items-center space-x-10">
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Lớp</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Lớp"
                className="w-[5.5rem] h-10 focus-visible:outline-none"
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
            <div className="whitespace-nowrap">Môn học</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Môn học"
                className="w-32 h-10 focus-visible:outline-none"
              >
                <option value="1">One Two</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Học kì</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Học kì"
                className="w-[5.5rem] h-10 focus-visible:outline-none"
              >
                <option value="1">I</option>
                <option value="2">II</option>
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Niên khóa</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Niên khóa"
                className="w-32 h-10 focus-visible:outline-none"
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
          <button className="button-primary w-full h-10 px-5 whitespace-nowrap">
            Tìm kiếm
          </button>
        </div>
        {data1.length > 0 && (
          <table className="table-auto text-center border border-collapse">
            <thead>
              <tr className="font-bold h-10">
                <td className="border">STT</td>
                <td className="border">Lớp</td>
                <td className="border">Sĩ số</td>
                <td className="border">Số lượng đạt</td>
                <td className="border">Tỉ lệ</td>
              </tr>
            </thead>
            <tbody>
              {data1.map((student, idx) => (
                <tr key={idx} className="h-10">
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.class}</td>
                  <td className="border">{student.numberOfStudents}</td>
                  <td className="border">{student.pass}</td>
                  <td className="border">{student.percentPass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="form-title pt-12">Báo cáo tổng kết học kì</div>
      <div className="form-container">
        <div className="flex items-center space-x-10">
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Lớp</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Lớp"
                className="w-[5.5rem] h-10 focus-visible:outline-none"
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
            <div className="whitespace-nowrap">Môn học</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Môn học"
                className="w-32 h-10 focus-visible:outline-none"
              >
                <option value="1">One Two</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Học kì</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Học kì"
                className="w-[5.5rem] h-10 focus-visible:outline-none"
              >
                <option value="1">I</option>
                <option value="2">II</option>
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Niên khóa</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Niên khóa"
                className="w-32 h-10 focus-visible:outline-none"
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
          <button className="button-primary w-full h-10 px-5 whitespace-nowrap">
            Tìm kiếm
          </button>
        </div>
        {data2.length > 0 && (
          <table className="table-auto text-center border border-collapse">
            <thead>
              <tr className="font-bold h-10">
                <td className="border">STT</td>
                <td className="border">Lớp</td>
                <td className="border">Sĩ số</td>
                <td className="border">Số lượng đạt</td>
                <td className="border">Tỉ lệ</td>
              </tr>
            </thead>
            <tbody>
              {data2.map((student, idx) => (
                <tr key={idx} className="h-10">
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.class}</td>
                  <td className="border">{student.numberOfStudents}</td>
                  <td className="border">{student.pass}</td>
                  <td className="border">{student.percentPass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
