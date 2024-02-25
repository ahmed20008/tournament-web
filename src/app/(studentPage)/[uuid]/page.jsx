"use client"
import React, { useState, useEffect } from 'react';
import { db } from '@/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { enqueueSnackbar } from 'notistack';
import styles from "@/assets/css/student-details.module.css";
import Skeleton from "react-loading-skeleton";
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const [student, setStudent] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  const id = params.uuid;

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = (studentId) => {
    setFetchingData(true);
    const q = query(collection(db, "students"), where("studentId", "==", studentId));
    getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((docSnapshot) => {
            const studentData = docSnapshot.data();
            setStudent({ id: docSnapshot.id, ...studentData });
          });
        } else {
          enqueueSnackbar(`No student found with studentId: ${studentId}`, { variant: "error" });
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
              student?.scores.jumpPlace.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score.score ? score.score : 'N/A'}</span></p>
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
              student?.scores.jumpHeight.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score.score ? score.score : 'N/A'}</span></p>
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
              student?.scores.run.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score.score ? score.score : 'N/A'}</span></p>
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
              student?.scores.setUp.map((score, index) => (
                <p key={index}>Score {index + 1}: <span className='fw-bold'>{score.score ? score.score : 'N/A'}</span></p>
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
