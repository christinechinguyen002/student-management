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

export default function FindStudent() {
  const [formValue, setFormValue] = useState({
    year: "all",
    name: "",
  });

  let classID: string[] = [];
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

  function handleSelectChange(
    sender: "name" | "year",
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) {
    switch (sender) {
      case "year":
        setFormValue({ ...formValue, year: `${event.target.value}` });
        break;
      case "name":
        const nonNumericValue = event.target.value.replace(/[0-9]/g, "");
        setFormValue({ ...formValue, name: nonNumericValue });
        break;
      default:
        break;
    }
  }

  const onClickSubmitFilter = async () => {
    const collectionRef = collection(db, "student");
    let q, q2;
    if (
      classDataArray
        .filter((item) => formValue.year === item.Year)
        .map((item) => item.ID).length === 0 ||
      formValue.year === "all"
    ) {
      q = query(collectionRef);
      q2 = query(collection(db, "score"));
    } else {
      q = query(
        collectionRef,
        where(
          "ClassID",
          "in",
          classDataArray
            .filter((item) => formValue.year === item.Year)
            .map((item) => item.ID)
        )
      );
      q2 = query(collection(db, "score"));
    }

    const scoreSnap = (await getDocs(q2)).docs.map((doc) => doc.data());
    const studentSnap = (await getDocs(q)).docs.map((doc) => doc.data());

    const scoreMap = scoreSnap.reduce((acc, score) => {
      const key = `${score.IDHS}_${score.HocKy}`;
      if (acc.hasOwnProperty(key)) {
        acc[key].push(score.DTBHK);
      } else {
        acc[key] = [score.DTBHK];
      }
      return acc;
    }, {});

    const enrichedStudentSnap = studentSnap.reduce((acc, student) => {
      const key1 = `${student.ID}_1`;
      const key2 = `${student.ID}_2`;

      const scores1 = scoreMap[key1];
      const scores2 = scoreMap[key2];

      const averageScore1 = scores1
        ? scores1.reduce((sum: any, score: any) => sum + score, 0) /
          scores1.length
        : null;
      const averageScore2 = scores2
        ? scores2.reduce((sum: any, score: any) => sum + score, 0) /
          scores2.length
        : null;

      const { IDHS, HocKy, ...rest } = student;
      const enrichedStudent = {
        ...rest,
        AverageScore1: averageScore1,
        AverageScore2: averageScore2,
      };
      acc.push(enrichedStudent);

      return acc;
    }, []);

    if (formValue.name !== "") {
      setFilteredData(
        enrichedStudentSnap.filter((item: any) =>
          item.Name.includes(formValue.name)
        )
      );
    } else {
      setFilteredData(enrichedStudentSnap as any[]);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      // This code will run on subsequent renders after the initial mount
      // Put your logic here that you want to execute after the initial mount
      // ...
      fetchClass();

      (async () => {
        const collectionRef = collection(db, "student");

        const q = query(collectionRef);
        const q2 = query(collection(db, "score"));

        const scoreSnap = (await getDocs(q2)).docs.map((doc) => doc.data());
        const studentSnap = (await getDocs(q)).docs.map((doc) => doc.data());

        const scoreMap = scoreSnap.reduce((acc, score) => {
          const key = `${score.IDHS}_${score.HocKy}`;
          if (acc.hasOwnProperty(key)) {
            acc[key].push(score.DTBHK);
          } else {
            acc[key] = [score.DTBHK];
          }
          return acc;
        }, {});

        const enrichedStudentSnap = studentSnap.reduce((acc, student) => {
          const key1 = `${student.ID}_1`;
          const key2 = `${student.ID}_2`;

          const scores1 = scoreMap[key1];
          const scores2 = scoreMap[key2];

          const averageScore1 = scores1
            ? scores1.reduce((sum: any, score: any) => sum + score, 0) /
              scores1.length
            : null;
          const averageScore2 = scores2
            ? scores2.reduce((sum: any, score: any) => sum + score, 0) /
              scores2.length
            : null;

          const { IDHS, HocKy, ...rest } = student;
          const enrichedStudent = {
            ...rest,
            AverageScore1: averageScore1,
            AverageScore2: averageScore2,
          };
          acc.push(enrichedStudent);

          return acc;
        }, []);

        setFilteredData(enrichedStudentSnap as any[]);
      })();
    } else {
      // This code will run only on the initial mount
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
    <div className="p-12">
      <div className="form-title">Tra cứu học sinh</div>
      <div className="form-container">
        <div className="flex items-center space-x-11">
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
                {yearsToDisplay.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div>Họ và tên</div>
            <input
              type="text"
              className="custom-form-input !w-80"
              value={formValue.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSelectChange("name", event)
              }
            />
          </div>
          <button
            className="button-primary w-fit h-10 px-5 disabled:bg-gray-500"
            onClick={onClickSubmitFilter}
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
                <td className="border">Lớp</td>
                <td className="border">TB học kì I</td>
                <td className="border">TB học kì II</td>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student, idx) => (
                <tr key={idx} className="h-10">
                  <td className="border">{idx + 1}</td>
                  <td className="border">{student.Name}</td>
                  <td className="border">{student.ClassID?.slice(0, 4)}</td>
                  <td className="border">{student.AverageScore1}</td>
                  <td className="border">{student.AverageScore2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
