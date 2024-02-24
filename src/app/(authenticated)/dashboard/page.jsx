"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config';
import styles from "@/assets/css/dashboard.module.css";
import DashboardStudentTableSkeleton from '@/skeletons/DashboardStudentTableSkeleton';
import { enqueueSnackbar } from 'notistack';

const Page = () => {
  const [students, setStudents] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setFetchingData(true);
    const valRef = collection(db, "students");
    getDocs(valRef)
      .then((querySnapshot) => {
        const studentData = [];
        querySnapshot.forEach((doc) => {
          studentData.push({ id: doc.id, ...doc.data() });
        });
        setStudents(studentData);
      })
      .catch((error) => {
        enqueueSnackbar(`Error fetching data: ${error}`, { variant: "error" });
      })
      .finally(() => {
        setFetchingData(false);
      });
  };

  return (
    <div className="col-12 mt-5 d-flex flex-column">
      <h3 className={styles.dashboardHeading}>Students Table</h3>
      <div className={styles.studentTableContainer}>
        <div className={styles.studentTable}>
          <table className="table m-0">
            <thead className="table-secondary">
              <tr>
                <th scope="col" className='text-center'>#</th>
                <th scope="col" className='text-center'>Student Id</th>
                <th scope="col" className='text-center'>Student Name</th>
                <th scope="col" className='text-center'>Student Class</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr className="align-middle" key={student.id}>
                  <td className='text-center'>{index + 1}</td>
                  <td className='text-center'>{student.studentId}</td>
                  <td className='text-center'>{student.name}</td>
                  <td className='text-center'>{student.class}</td>
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