import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import db from "../firebase";

export default function ClassList() {
  let studentID: string[] = [];
  const [studentDataArray, setStudentDataArray] = useState<any[]>([]);
  let classID: string[] = [];
  const [classDataArray, setClassDataArray] = useState<any[]>([]);

  const isMounted = useRef(false);

  const [formValue, setFormValue] = useState({
    class: "all",
    year: "all",
  });

  function fetchStudentData() {
    (async () => {
      const collectionRef = collection(db, "student");
      const snapshot = await getDocs(collectionRef);

      snapshot.forEach((doc: any) => {
        if (!studentID.includes(doc.id)) {
          studentID.push(doc.id);
        }
      });

      studentID.map(async (id) => {
        const docRef = doc(db, "student", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.data() !== undefined) {
          setStudentDataArray((prevArray) => [docSnap.data(), ...prevArray]);
        }
      });
    })();
  }

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

  const onClickSubmitFilter = () => {
    const selectedClassID = classDataArray.find(
      (item) =>
        item.ClassName === formValue.class && item.Year === formValue.year
    );
    fetchData(selectedClassID.ID);
  };

  const [yearsToDisplay, setYearsToDisplay] = useState<any[]>([]);

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

  useEffect(() => {
    if (isMounted.current) {
      fetchClass();
      fetchStudentData();
    } else {
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

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const fetchData = async (value: any) => {
    const collectionRef = collection(db, "student");

    const q = query(collectionRef, where("ClassID", "==", value));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => doc.data());
    setFilteredData(data);
  };

  return (
    <div className="p-12">
      <div className="form-title">Danh sách lớp</div>
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
          <button
            className="button-primary w-fit h-10 px-5"
            disabled={formValue.class === "all" || formValue.year === "all"}
            onClick={onClickSubmitFilter}
          >
            Xem danh sách
          </button>
          <Link
            to="create-class-list"
            className="green-button-primary w-fit h-10 px-5 flex items-center"
          >
            Lập danh sách
          </Link>
        </div>
        {studentDataArray.length > 0 && (
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
              {(filteredData.length > 0 ? filteredData : studentDataArray).map(
                (student, idx) => (
                  <tr key={idx} className="h-10">
                    <td className="border">{idx + 1}</td>
                    <td className="border">{student?.Name}</td>
                    <td className="border">{student.Gender}</td>
                    <td className="border">{student.DoB}</td>
                    <td className="border">{student.Address}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
