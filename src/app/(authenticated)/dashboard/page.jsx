"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config';
import styles from "@/assets/css/dashboard.module.css";
import formStyles from "@/assets/css/form-elements.module.css";
import DashboardStudentTableSkeleton from '@/skeletons/DashboardStudentTableSkeleton';
import { enqueueSnackbar } from 'notistack';
import Link from 'next/link';
import StudentClasses from '@/utils/classAttributes';
import { getHighestScore } from '@/utils/helperMethod';
import buttonStyles from '@/assets/css/buttons.module.css';

const Page = () => {
  const [students, setStudents] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedScore, setSelectedScore] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchingData(true);
    try {
      const studentsRef = collection(db, "students");
      let q = query(studentsRef, orderBy('name'));

      // search by student name 
      if (searchTerm.trim() !== "") {
        q = query(studentsRef, orderBy('name'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
      }

      // filter by student class 
      if (selectedClass !== "") {
        q = query(studentsRef, orderBy('name'), where('class', '==', selectedClass));
      }

      const querySnapshot = await getDocs(q);
      const studentData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // setStudents(studentData);

      //  filter by highest score code  
      if (selectedScore !== "") {
        const filteredStudents = studentData.filter(student => {
          const scores = student.scores[selectedScore];
          if (scores && scores.length > 0) {
            const highestScore = Math.max(...scores.map(score => parseInt(score.score)));
            return highestScore > 0;
          }
          return false;
        });
        setStudents(filteredStudents);
      } else {
        setStudents(studentData);
      }

    } catch (error) {
      enqueueSnackbar(`Error fetching data: ${error}`, { variant: "error" });
    } finally {
      setFetchingData(false);
    }
  };


  const handleSearch = () => {
    fetchData();
  };

  return (
    <div className="col-12 mt-2 d-flex flex-column">
      <h3 className={styles.dashboardHeading}>Students Table</h3>
      <div className='row'>
        <div className="col-md-3 mb-3">
          <label htmlFor="student-name" className={styles.studentFilterLabel}>
            Student Name
          </label>
          <input
            autoComplete="off"
            id="student-name"
            type="text"
            className={`form-control ${formStyles.inputFieldWhite} ${styles.studentFilterInput}`}
            placeholder="Enter Student Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="student-class" className={styles.studentFilterLabel}>
            Filter by class
          </label>
          <select
            id="student-class"
            className={`form-control ${formStyles.customSelectField} form-select`}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Filter by Class</option>
            {StudentClasses.map((classItem, index) => (
              <option key={index} value={classItem}>{classItem}</option>
            ))}
          </select>
        </div>
        <div className='col-md-3 mb-3'>
          <label htmlFor="student-class" className={styles.studentFilterLabel}>
            Filter by Score
          </label>
          <select
            id="student-class"
            type="text"
            className={`form-control ${formStyles.customSelectField} form-select`}
            value={selectedScore}
            onChange={(e) => setSelectedScore(e.target.value)}
          >
            <option value="">Filter by Score</option>
            <option value="jumpPlace">highest in jump from place</option>
            <option value="jumpHeight">highest in jump from height</option>
            <option value="run">highest in run</option>
            <option value="setUp">highest in set-up</option>
          </select>
        </div>
        <div className="col-md-3 mb-3 d-flex align-items-end">
          <button className={buttonStyles.buttonDarkPink} onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className={styles.studentTableContainer}>
        <div className={styles.studentTable}>
          <table className="table m-0">
            <thead className="table-secondary">
              <tr>
                <th scope="col" className='text-center'>#</th>
                <th scope="col" className='text-center'>Student Id</th>
                <th scope="col" className='text-center'>Student Name</th>
                <th scope="col" className='text-center'>Student Class</th>
                <th scope="col" className='text-center'>highest jump place</th>
                <th scope="col" className='text-center'>highest jump height</th>
                <th scope="col" className='text-center'>highest run</th>
                <th scope="col" className='text-center'>highest set-up</th>
                <th scope="col" className='text-center'></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr className="align-middle" key={student.id}>
                  <td className='text-center'>{index + 1}</td>
                  <td className='text-center'>{student.studentId ?? 'N/A'}</td>
                  <td className='text-center'>{student.name ?? 'N/A'}</td>
                  <td className='text-center'>{student.class ?? 'N/A'}</td>
                  <td className='text-center'>{getHighestScore(student.scores.jumpPlace) ?? '--'}</td>
                  <td className='text-center'>{getHighestScore(student.scores.jumpHeight) ?? '--'}</td>
                  <td className='text-center'>{getHighestScore(student.scores.run) ?? '--'}</td>
                  <td className='text-center'>{getHighestScore(student.scores.setUp) ?? '--'}</td>
                  <td className='text-center'>
                    <Link href={`/dashboard/${student.studentId}`}>
                      <button className={`${styles.viewBtn}`}>
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {fetchingData && <DashboardStudentTableSkeleton rows={5} />}
            </tbody>
          </table>
          {!fetchingData && students.length < 1 && <div className={styles.emptyTable}>There are not any Students to show here yet</div>}
        </div>
      </div>
    </div>
  );
};

export default Page;
