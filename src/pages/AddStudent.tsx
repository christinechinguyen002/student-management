import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Form } from "react-bootstrap";
import db from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStudent() {
  const [formValue, setFormValue] = useState({
    Name: "",
    DoB: "",
    Gender: "Nam",
    Address: "",
    Email: "",
  });

  function handleSubmitForm() {
    const collectionRef = collection(db, "student");

    if (Object.values(formValue).every((value) => value !== "")) {
      (async () => {
        try {
          const docRef = await addDoc(collectionRef, formValue);
          console.log("Document added with ID: ", docRef.id);
          setFormValue({
            Name: "",
            DoB: "",
            Gender: "",
            Address: "",
            Email: "",
          });
          toast.success("Thêm học sinh thành công!", {
            position: toast.POSITION.TOP_CENTER,
          });
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error("Thêm học sinh thất bại! Vui lòng thử lại.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })();
    }
  }

  return (
    <div className="p-12">
      <ToastContainer />
      <div className="form-title">Tiếp nhận học sinh</div>
      <div className="form-container">
        <div className="flex items-center">
          <div className="basis-[18%] text-lg">Họ và tên</div>
          <input
            type="text"
            className="basis-[82%] custom-form-input"
            value={formValue.Name}
            onChange={(event) =>
              setFormValue({ ...formValue, Name: event.target.value })
            }
          />
        </div>
        <div className="flex items-center space-x-20">
          <div className="basis-[50%] flex items-center">
            <div className="basis-[66%] text-lg">Ngày sinh</div>
            <input
              type="text"
              className="custom-form-input"
              value={formValue.DoB}
              onChange={(event) =>
                setFormValue({ ...formValue, DoB: event.target.value })
              }
            />
          </div>
          <div className="basis-[50%] flex items-center">
            <div className="basis-[66%] text-lg">Giới tính</div>
            <div className="border border-grey-2 rounded-md px-1.5">
              <Form.Select
                aria-label="Giới tính"
                className="w-72 h-10 focus-visible:outline-none"
                value={formValue.Gender}
                onChange={(event) =>
                  setFormValue({ ...formValue, Gender: event.target.value })
                }
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </Form.Select>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="basis-[18%] text-lg">Địa chỉ</div>
          <input
            type="text"
            className="basis-[82%] custom-form-input"
            value={formValue.Address}
            onChange={(event) =>
              setFormValue({ ...formValue, Address: event.target.value })
            }
          />
        </div>
        <div className="flex items-center">
          <div className="basis-[18%] text-lg">Email</div>
          <input
            type="email"
            className="basis-[82%] custom-form-input"
            value={formValue.Email}
            onChange={(event) =>
              setFormValue({ ...formValue, Email: event.target.value })
            }
          />
        </div>
        <div className="flex justify-center">
          <button
            className="button-primary h-10 text-lg px-20 w-fit font-bold"
            onClick={handleSubmitForm}
          >
            Thêm học sinh
          </button>
        </div>
      </div>
    </div>
  );
}
