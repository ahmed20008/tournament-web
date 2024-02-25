"use client"
import React, { useState, useEffect } from 'react';
import formStyles from "@/assets/css/form-elements.module.css";
import styles from "@/assets/css/add-student.module.css";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '@/config';
import CircularProgress from '@/components/CircularProgress';
import { enqueueSnackbar } from "notistack";
import StudentClasses from '@/utils/classAttributes';

const page = () => {
  const initialState = {
    name: '',
    studentId: '',
    class: '',
    scores: {
      jumpPlace: Array(4).fill({ score: '' }),
      jumpHeight: Array(4).fill({ score: '' }),
      run: Array(4).fill({ score: '', time: '' }),
      setUp: Array(4).fill({ score: '', time: '' })
    }
  }
  const [addStudent, setAddStudent] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const idExistsQuery = query(collection(db, 'students'), where('studentId', '==', addStudent.studentId));
      const idExistsSnapshot = await getDocs(idExistsQuery);
      if (!idExistsSnapshot.empty) {
        throw new Error('ID already exists!');
      }

      const docRef = await addDoc(collection(db, 'students'), addStudent);
      setAddStudent(initialState);
      setLoading(false);
      enqueueSnackbar('Student added successfully!', { variant: "success" })
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" })
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <h2 className={styles.pageHeading}>Add Student</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className={`card ${styles.addStudentCard}`}>
            <form className="w-75 mx-auto" onSubmit={handleSubmit}>
              <div className="mt-5 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="name"
                  aria-label="name"
                  type="text"
                  placeholder="Enter Student Name"
                  value={addStudent.name}
                  onChange={(e) => setAddStudent({ ...addStudent, name: e.target.value })}
                />
              </div>
              <div className="mt-3 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="studentId"
                  aria-label="studentId"
                  type="text"
                  placeholder="Enter Student Id"
                  value={addStudent.studentId}
                  onChange={(e) => setAddStudent({ ...addStudent, studentId: e.target.value })}
                />
              </div>
              <div className="mt-3 mb-3 mx-4">
                <select
                  required
                  className={`${formStyles.customSelectField} w-100 form-select`}
                  id="class"
                  aria-label="class"
                  placeholder="Enter Student Class"
                  value={addStudent.class}
                  onChange={(e) => setAddStudent({ ...addStudent, class: e.target.value })}
                >
                  <option value="">Select Class</option>
                  {StudentClasses.map((classItem, index) => (
                    <option key={index} value={classItem}>{classItem}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 mb-3 mx-4">
                <button type="submit" className={`${buttonStyles.buttonDarkPink} `}>
                  {!loading ? "Add Student" : <CircularProgress width={22} height={22} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div >
  )
}

export default page