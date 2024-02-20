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

  useEffect(() => {
    //get data from db
    const fetchData = async () => {
      const valRef = collection(db, "students");
      const querySnapshot = await getDocs(valRef);
      const studentData = [];
      querySnapshot.forEach((doc) => {
        studentData.push({ id: doc.id, ...doc.data() });
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

  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    scores: {
      jumpPlace: ['', '', '', ''],
      jumpHeight: ['', '', '', ''],
      run: ['', '', '', ''],
      setUp: ['', '', '', '']
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleScoreChange = (e, scoreType, index) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      scores: {
        ...prevData.scores,
        [scoreType]: [
          ...prevData.scores[scoreType].slice(0, index),
          value,
          ...prevData.scores[scoreType].slice(index + 1)
        ]
      }
    }));
  };

  const handleAddStudent = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'students'), where('student_id', '==', formData.student_id)));
      if (!querySnapshot.empty) {
        console.error('Student ID already exists.');
        return;
      }
      await addDoc(collection(db, 'students'), formData);
      console.log('Student added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      name: '',
      scores: {
        jumpPlace: ['', '', '', ''],
        jumpHeight: ['', '', '', ''],
        run: ['', '', '', ''],
        setUp: ['', '', '', '']
      }
    });
  };

  return (
    <div>
      <div>
        <h2>Add Student</h2>
        <div>
          <label htmlFor="student_id">ID:</label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {Object.entries(formData.scores).map(([scoreType, scoreList]) => (
          <div key={scoreType}>
            <label htmlFor={`${scoreType}Scores`}>{scoreType.replace(/_/g, ' ')} Scores:</label>
            {scoreList.map((score, index) => (
              <input
                key={index}
                type="text"
                value={score}
                onChange={(e) => handleScoreChange(e, scoreType, index)}
              />
            ))}
          </div>
        ))}
        <div>
          <button onClick={handleAddStudent}>Add Student</button>
        </div>
      </div>

      <div>
        <h2>Student List</h2>
        <ul>
          {students.map((entry) => (
            <li key={entry.id}>
              <div>id: {entry.student_id}</div>
              <div>Name: {entry.name}</div>
              <div>
                <h3>Scores:</h3>
                <ul>
                  {Object.entries(entry.scores).map(([scoreType, score]) => (
                    <li key={scoreType}>
                      <strong>{scoreType}</strong>: {score}
                    </li>
                  ))}
                </ul>
              </div>
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
