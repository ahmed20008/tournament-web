"use client"
import React, { useState, useEffect } from 'react';
import formStyles from "@/assets/css/form-elements.module.css";
import styles from "@/assets/css/add-student.module.css";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '@/config';
import CircularProgress from '@/components/CircularProgress';

const page = () => {
  const initialState = {
    name: '',
    id: '',
    class: '',
  }
  const [addStudent, setAddStudent] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const idExistsQuery = query(collection(db, 'students'), where('id', '==', addStudent.id));
      const idExistsSnapshot = await getDocs(idExistsQuery);
      if (!idExistsSnapshot.empty) {
        throw new Error('ID already exists!');
      }
  
      const docRef = await addDoc(collection(db, 'students'), addStudent);
      console.log('Document written with ID: ', docRef.id);
      setAddStudent(initialState);
      setLoading(false);
      window.alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      setLoading(false);
      window.alert(error.message);
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
                  id="id"
                  aria-label="id"
                  type="text"
                  placeholder="Enter Student Id"
                  value={addStudent.id}
                  onChange={(e) => setAddStudent({ ...addStudent, id: e.target.value })}
                />
              </div>
              <div className="mt-3 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="class"
                  aria-label="class"
                  type="text"
                  placeholder="Enter Student Class"
                  value={addStudent.class}
                  onChange={(e) => setAddStudent({ ...addStudent, class: e.target.value })}
                />
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