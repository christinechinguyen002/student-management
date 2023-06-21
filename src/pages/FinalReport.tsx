import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import db from "../firebase";

export default function FinalReport() {
  const [formValue1, setFormValue1] = useState({
    subject: "all",
    semester: 1,
    year: "all",
  });
  const [formValue2, setFormValue2] = useState({
    semester: 1,
    year: "all",
  });
  const [yearsToDisplay, setYearsToDisplay] = useState<any[]>([]);
  let classID: string[] = [];
  const [classDataArray, setClassDataArray] = useState<any[]>([]);
  const [classArray1, setClassArray1] = useState<any[]>([]);
  const [classArray2, setClassArray2] = useState<any[]>([]);
  const [subjectList, setSubjectList] = useState<any[]>([]);
  const isMounted = useRef(false);

  const handleSelectChange1 = (
    sender: "subject" | "semester" | "year",
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    switch (sender) {
      case "subject":
        setFormValue1({ ...formValue1, subject: `${event.target.value}` });
        break;
      case "semester":
        setFormValue1({ ...formValue1, semester: Number(event.target.value) });
        break;
      case "year":
        setFormValue1({ ...formValue1, year: `${event.target.value}` });
        break;
    }
  };

  const handleSelectChange2 = (
    sender: "semester" | "year",
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    switch (sender) {
      case "semester":
        setFormValue2({ ...formValue2, semester: Number(event.target.value) });
        break;
      case "year":
        setFormValue2({ ...formValue2, year: `${event.target.value}` });
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

  function fetchSubject() {
    (async () => {
      const collectionRef = collection(db, "subject");
      const q = query(collectionRef);
      setSubjectList((await getDocs(q)).docs.map((doc) => doc.data()));
    })();
  }

  async function handleSubmitFilter1() {
    const updatedClassDataArray = await classDataArray.reduce(
      async (accPromise, classItem) => {
        const acc = await accPromise;

        const collectionRef = collection(db, "student");
        const q = query(collectionRef, where("ClassID", "==", classItem.ID));
        const querySnapshot = await getDocs(q);

        const studentData = querySnapshot.docs.map((doc) => doc.data());

        const q2 = query(collection(db, "score"));
        const scoreSnap = (await getDocs(q2)).docs.map((doc) => doc.data());

        const enrichedStudentSnap = studentData.reduce((acc, student) => {
          const matchingScores = scoreSnap.filter(
            (score) =>
              score.IDHS === student.ID &&
              score.IDMon === formValue1.subject &&
              score.HocKy === formValue1.semester
          );

          const { ID, ...rest } = student;
          const enrichedStudent = {
            ...rest,
            IsPass: matchingScores[0]?.DTBHK >= 3,
          };

          acc.push(enrichedStudent);
          return acc;
        }, []);

        const passCount = enrichedStudentSnap.filter(
          (student: any) => student.IsPass === true
        ).length;

        const updatedClassItem = {
          ...classItem,
          students: enrichedStudentSnap,
          passCount,
        };

        return [...acc, updatedClassItem];
      },
      Promise.resolve([])
    );
    setClassArray1(updatedClassDataArray);
  }

  async function handleSubmitFilter2() {
    const updatedClassDataArray = await classDataArray.reduce(
      async (accPromise, classItem) => {
        const acc = await accPromise;

        const collectionRef = collection(db, "student");
        const q = query(collectionRef, where("ClassID", "==", classItem.ID));
        const querySnapshot = await getDocs(q);

        const studentData = querySnapshot.docs.map((doc) => doc.data());

        const q2 = query(collection(db, "score"));
        const scoreSnap = (await getDocs(q2)).docs.map((doc) => doc.data());

        const enrichedStudentSnap = studentData.reduce((acc, student) => {
          const matchingScores = scoreSnap.filter(
            (score) =>
              score.IDHS === student.ID && score.HocKy === formValue2.semester
          );

          const scores = matchingScores.map((score) => score.DTBHK);
          const sum = scores.reduce(
            (accumulator, currentScore) => accumulator + currentScore,
            0
          );
          const Average = sum / scores.length;

          const { ID, ...rest } = student;
          const enrichedStudent = {
            ...rest,
            Average,
            IsPass: Average >= 3,
          };

          acc.push(enrichedStudent);
          return acc;
        }, []);

        const passCount = enrichedStudentSnap.filter(
          (student: any) => student.IsPass === true
        ).length;

        const updatedClassItem = {
          ...classItem,
          students: enrichedStudentSnap,
          passCount,
        };

        return [...acc, updatedClassItem];
      },
      Promise.resolve([])
    );
    setClassArray2(updatedClassDataArray);
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
    setYearsToDisplay(
      classDataArray.reduce((uniqueClasses, item) => {
        if (!uniqueClasses.includes(item.Year)) {
          uniqueClasses.push(item.Year);
        }
        return uniqueClasses;
      }, [])
    );
  }, [classDataArray]);

  return (
    <div className="p-12 bg-grey-2">
      <div className="form-title">Báo cáo tổng kết môn học</div>
      <div className="form-container">
        <div className="flex items-center space-x-10">
          <div className="flex space-x-4 items-center">
            <div className="whitespace-nowrap">Môn học</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Môn học"
                className="w-32 h-10 focus-visible:outline-none"
                value={formValue1.subject}
                onChange={(event) =>
                  setFormValue1({ ...formValue1, subject: event.target.value })
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
                value={formValue1.semester}
                onChange={(event: any) =>
                  handleSelectChange1("semester", event)
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
                className="w-44 h-10 focus-visible:outline-none"
                value={formValue1.year}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  handleSelectChange1("year", event)
                }
              >
                <option value="all">Chọn niên khóa</option>
                {yearsToDisplay.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <button
            className="button-primary w-fit h-10 px-5 whitespace-nowrap"
            onClick={handleSubmitFilter1}
            disabled={formValue1.subject === "all" || formValue1.year === "all"}
          >
            Tìm kiếm
          </button>
        </div>
        {classArray1.length > 0 && (
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
              {classArray1.map((student, idx) => (
                <tr key={idx} className="h-10">
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.ClassName}</td>
                  <td className="border">{student.students?.length}</td>
                  <td className="border">{student.passCount}</td>
                  <td className="border">
                    {Number.parseFloat(
                      `${student.passCount / student.students?.length}`
                    ).toFixed(2)}
                    %
                  </td>
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
            <div className="whitespace-nowrap">Học kì</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Học kì"
                className="w-[5.5rem] h-10 focus-visible:outline-none"
                value={formValue2.semester}
                onChange={(event: any) =>
                  handleSelectChange2("semester", event)
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
                className="w-44 h-10 focus-visible:outline-none"
                value={formValue2.year}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  handleSelectChange2("year", event)
                }
              >
                <option value="all">Chọn niên khóa</option>
                {yearsToDisplay.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <button
            className="button-primary w-fit h-10 px-5 whitespace-nowrap"
            onClick={handleSubmitFilter2}
            disabled={formValue2.year === "all"}
          >
            Tìm kiếm
          </button>
        </div>
        {classArray2.length > 0 && (
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
              {classArray2.map((student, idx) => (
                <tr key={idx} className="h-10">
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.ClassName}</td>
                  <td className="border">{student.students?.length}</td>
                  <td className="border">{student.passCount}</td>
                  <td className="border">
                    {Number.parseFloat(
                      `${student.passCount / student.students?.length}`
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
