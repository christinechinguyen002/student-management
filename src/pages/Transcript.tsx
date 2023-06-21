import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import db from "../firebase";

export default function Transcript() {
  const [formValue, setFormValue] = useState({
    class: "all",
    subject: "all",
    semester: 1,
    year: "all",
  });
  let classID: string[] = [];
  const [subjectList, setSubjectList] = useState<any[]>([]);
  const [uniqueClassNames, setUniqueClassNames] = useState<string[]>([]);
  const [classDataArray, setClassDataArray] = useState<any[]>([]);
  const [yearsToDisplay, setYearsToDisplay] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

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

  function fetchSubject() {
    (async () => {
      const collectionRef = collection(db, "subject");
      const q = query(collectionRef);
      setSubjectList((await getDocs(q)).docs.map((doc) => doc.data()));
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

  function onClickSubmitFilter() {
    (async () => {
      const collectionRef = collection(db, "student");
      const q2 = query(collection(db, "score"));

      const selectedClassID = classDataArray.find(
        (item) =>
          item.ClassName === formValue.class && item.Year === formValue.year
      );
      const q3 = query(
        collectionRef,
        where("ClassID", "==", selectedClassID.ID)
      );
      const studentFilteredByClass = (await getDocs(q3)).docs.map((doc) =>
        doc.data()
      );

      const scoreSnap = (await getDocs(q2)).docs.map((doc) => doc.data());

      const enrichedStudentSnap = studentFilteredByClass.reduce(
        (acc, student) => {
          const matchingScores = scoreSnap.filter(
            (score) =>
              score.IDHS === student.ID &&
              score.IDMon === formValue.subject &&
              score.HocKy === formValue.semester
          );

          const { ID, ...rest } = student;
          const enrichedStudent = {
            ...rest,
            Diem15phut: matchingScores[0]?.Diem15phut,
            Diem1tiet: matchingScores[0]?.Diem1tiet,
            DTBHK: matchingScores[0]?.DTBHK,
          };

          acc.push(enrichedStudent);
          return acc;
        },
        []
      );
      setFilteredData(enrichedStudentSnap as any[]);
    })();
  }

  useEffect(() => {
    if (isMounted.current) {
      fetchClass();
      fetchSubject();
    } else {
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
  }, [classDataArray, formValue.class]);

  return (
    <div className="p-12">
      <div className="form-title">Bảng điểm môn học</div>
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
                value={formValue.subject}
                onChange={(event) =>
                  setFormValue({ ...formValue, subject: event.target.value })
                }
              >
                <option value="all">Chọn môn học</option>
                {subjectList.map((item, idx) => (
                  <option key={idx} value={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Học kì</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Học kì"
                className="w-[5.5rem] h-10 focus-visible:outline-none"
                value={formValue.semester}
                onChange={(event) =>
                  setFormValue({
                    ...formValue,
                    semester: Number(event.target.value),
                  })
                }
              >
                <option value={1}>I</option>
                <option value={2}>II</option>
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
          <button
            className="button-primary w-fit h-10 px-5 whitespace-nowrap"
            onClick={onClickSubmitFilter}
            disabled={
              formValue.class === "all" ||
              formValue.subject === "all" ||
              formValue.year === "all"
            }
          >
            Tìm kiếm
          </button>
        </div>
        {filteredData.length > 0 && (
          <table className="table-auto text-center border border-collapse">
            <thead>
              <tr className="font-bold h-10">
                <td className="border">STT</td>
                <td className="border">Họ và tên</td>
                <td className="border">Điểm 15’</td>
                <td className="border">Điểm 1 tiết</td>
                <td className="border">Điểm trung bình</td>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student, idx) => (
                <tr key={idx} className="h-10">
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.Name}</td>
                  <td className="border">{student?.Diem15phut}</td>
                  <td className="border">{student?.Diem1tiet}</td>
                  <td className="border">{student?.DTBHK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
