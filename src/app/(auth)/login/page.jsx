'use client'
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import { collection, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function test() {

  // for me API
  const [user] = useAuthState(auth);
  const userSession = sessionStorage.getItem('user');
  console.log({ user })
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    //get data from db
    const fetchData = async () => {
      const valRef = collection(db, "students");
      const querySnapshot = await getDocs(valRef);
      const studentData = [];
      querySnapshot.forEach((doc) => {
        const { name, email } = doc.data();
        const id = doc.id;
        studentData.push({ id, name, email });
      });
      setStudents(studentData);
      console.log(studentData)
    };
    fetchData();
  }, []);

  //check if no auth user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // if (!user && !userSession){
  //   router.push('/sign-up')
  // }

  //filter param
  // const filterData = async () => {
  //   const valRef = collection(db, "students");
  //   // const querySnapshot = await getDocs(valRef);
  //   const q = query(valRef, where("name", "==", "help"));
  //   const querySnapshot = await getDocs(q);
  //   const studentData = [];
  //   querySnapshot.forEach((doc) => {
  //     const { name, email } = doc.data(q);
  //     const id = doc.id;
  //     studentData.push({ id, name, email });
  //   });
  //   setStudents(studentData);
  //   console.log(studentData)
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const valRef = collection(db, "students");
      await addDoc(valRef, formData);
      console.log("Data added to Firestore successfully");

      // Reset form after submission
      setFormData({
        name: '',
        email: ''
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label><br />
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        /><br />
        <label htmlFor="email">Email:</label><br />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        /><br /><br />
        <button type="submit" onClick={handleSubmit}>Save</button>
      </form>

      <div>
        <h2>Student List</h2>
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              <strong>Name:</strong> {student.name}, <strong>Email:</strong> {student.email}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => {
        signOut(auth)
        sessionStorage.removeItem('user')
      }}>
        Log out
      </button>
    </div>
  );
}
