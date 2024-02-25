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

const Page = () => {
  const [students, setStudents] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedClass]);
  console.log(students)

  const fetchData = async () => {
    setFetchingData(true);
    try {
      const studentsRef = collection(db, "students");
      let q = query(studentsRef, orderBy('name'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));

      if (selectedClass !== "") {
        q = query(studentsRef, orderBy('name'), where('class', '==', selectedClass), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
      }

      const querySnapshot = await getDocs(q);
      const studentData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentData);
    } catch (error) {
      enqueueSnackbar(`Error fetching data: ${error}`, { variant: "error" });
    } finally {
      setFetchingData(false);
    }
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchData();
              }
            }}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="student-class" className={styles.studentFilterLabel}>
            Filter by class
          </label>
          <select
            id="student-class"
            type="text"
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
                <th scope="col" className='text-center'></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr className="align-middle" key={student.id}>
                  <td className='text-center'>{index + 1}</td>
                  <td className='text-center'>{student.studentId}</td>
                  <td className='text-center'>{student.name}</td>
                  <td className='text-center'>{student.class}</td>
                  <td className='text-center'>
                    <Link href={`/dashboard/${student.id}`}>
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
