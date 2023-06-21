import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/icons/arrow-left.svg";
import db from "../firebase";

export default function CreateClassList() {
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState({
    class: "all",
    year: "all",
  });
  let classID: string[] = [];
  const [classNames, setClassNames] = useState<string[]>([]);
  let studentID: string[] = [];
  const [studentDataArray, setStudentDataArray] = useState<any[]>([]);
  const [classDataArray, setClassDataArray] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const isMounted = useRef(false);

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
        if (
          docSnap.data() &&
          !studentDataArray.includes({ ...docSnap.data(), docID: id }) &&
          docSnap.data()?.ClassID === undefined
        ) {
          setStudentDataArray((prevArray) => [
            { ...docSnap.data(), docID: id },
            ...prevArray,
          ]);
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

  const handleCheckboxChange = (event: any, docID: any) => {
    if (event.target.checked) {
      setSelectedStudents((prevSelectedStudents) => [
        ...prevSelectedStudents,
        docID,
      ]);
    } else {
      setSelectedStudents((prevSelectedStudents) =>
        prevSelectedStudents.filter((id) => id !== docID)
      );
      setSelectAll(false);
    }
  };

  const handleSelectAllChange = (event: any) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      const docIDs = studentDataArray.map((student) => student.docID);
      setSelectedStudents(docIDs);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleAddToClass = () => {
    selectedStudents.forEach((studentID) => {
      addFieldToDocument(studentID, formValue.class);
    });
    setSelectedStudents([]);
  };

  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue((value) => value + 1);
  }

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (isMounted.current) {
      fetchClass();
      fetchStudentData();
    } else {
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    setClassNames(
      classDataArray
        .filter((item) => item.Year === "2022 - 2023")
        .map((item) => item.ClassName)
    );
  }, [classDataArray]);

  const addFieldToDocument = async (documentId: string, className: string) => {
    const documentRef = doc(db, "student", documentId);

    try {
      // Retrieve the existing document data
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        // Update the document with the new field
        const updatedData = {
          ...documentSnapshot.data(),
          ClassID: `${className}_22_23`,
        };

        // Save the updated document to Firestore
        await updateDoc(documentRef, updatedData);

        console.log("Field added successfully!");
      } else {
        console.log("Document not found!");
      }
    } catch (error) {
      console.error("Error adding field to document:", error);
    }
  };

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
                {classNames.map((className, idx) => {
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
                disabled
              >
                <option value="2022 - 2023">2022 - 2023</option>
              </Form.Select>
            </div>
          </div>
        </div>
        {studentDataArray.length > 0 && (
          <>
            <table className="table-auto text-center border border-collapse">
              <thead>
                <tr className="font-bold h-10">
                  <td className="border">
                    <InputGroup.Checkbox
                      aria-label="Checkbox for following text input"
                      onChange={handleSelectAllChange}
                      checked={selectAll}
                    />
                  </td>
                  <td className="border">STT</td>
                  <td className="border">Họ và tên</td>
                  <td className="border">Giới tính</td>
                  <td className="border">Năm sinh</td>
                  <td className="border">Địa chỉ</td>
                </tr>
              </thead>
              <tbody>
                {studentDataArray.map((student, idx) => (
                  <tr key={idx} className="h-10">
                    <td className="border">
                      <InputGroup.Checkbox
                        aria-label="Checkbox for following text input"
                        checked={
                          selectedStudents.includes(student.docID) || selectAll
                        }
                        onChange={(event: any) =>
                          handleCheckboxChange(event, student.docID)
                        }
                      />
                    </td>
                    <td className="border">{idx + 1}</td>
                    <td className="border">{student.Name}</td>
                    <td className="border">{student.Gender}</td>
                    <td className="border">{student.DoB}</td>
                    <td className="border">{student.Address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="button-primary w-fit px-6 py-3"
              disabled={formValue.class === "all"}
              onClick={() => {
                handleAddToClass();
                forceUpdate();
              }}
            >
              Thêm học sinh
            </button>
          </>
        )}
      </div>
    </div>
  );
}
