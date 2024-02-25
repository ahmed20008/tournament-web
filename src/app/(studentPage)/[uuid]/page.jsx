"use client"
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config';
import { enqueueSnackbar } from 'notistack';
import styles from "@/assets/css/student-details.module.css"
import Skeleton from "react-loading-skeleton";

const Page = () => {
  const [student, setStudent] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  const id = "0Q1tByOINDqHkEjQ0A8q";

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (studentId) => {
    setFetchingData(true);
    const valRef = doc(db, "students", studentId);
    getDoc(valRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setStudent({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          enqueueSnackbar(`No student found with ID: ${studentId}`, { variant: "error" });
        }
      })
      .catch((error) => {
        enqueueSnackbar(`Error fetching data: ${error}`, { variant: "error" });
      })
      .finally(() => {
        setFetchingData(false);
      });
  };

  return (
    <>
      <div className={`${styles.detailPageContainer}`}>
        <h2 className={`${styles.studentDetailMainHeading}`}>Student Score Details</h2>
        <div className="row">
          <h3>{!fetchingData ? student?.name : <Skeleton width={120} />}</h3>
          <p>Class: {!fetchingData ? student?.class : <Skeleton width={80} />}</p>
          <div className="col-md-6">
            <h4 className={`${styles.studentDetailHeading}`}>Jump from Place</h4>
            {!fetchingData ? (
              student.scores.jumpPlace.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score ? score : 'N/A'}</span></p>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} height={25} width={120} />
              ))
            )}
          </div>
          <div className="col-md-6">
            <h4 className={`${styles.studentDetailHeading}`}>Jump from Height</h4>
            {!fetchingData ? (
              student.scores.jumpHeight.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score ? score : 'N/A'}</span></p>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} height={25} width={120} />
              ))
            )}
          </div>
          <div className="col-md-6">
            <h4 className={`${styles.studentDetailHeading}`}>Run</h4>
            {!fetchingData ? (
              student.scores.run.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score ? score : 'N/A'}</span></p>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} height={25} width={120} />
              ))
            )}
          </div>
          <div className="col-md-6">
            <h4 className={`${styles.studentDetailHeading}`}>Set-up Workout</h4>
            {!fetchingData ? (
              student.scores.setUp.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score ? score : 'N/A'}</span></p>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} height={25} width={120} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Page;
