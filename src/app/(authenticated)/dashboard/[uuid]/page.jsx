"use client"
import React, { useState, useEffect } from 'react';
import { db } from '@/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { enqueueSnackbar } from 'notistack';
import styles from "@/assets/css/student-details.module.css";
import Skeleton from "react-loading-skeleton";
import Link from 'next/link';
import { ArrowHeadIcon } from '@/components/IconSVG';
import { useParams } from 'next/navigation';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

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
        <Link href="/dashboard" className={`d-flex flex-row align-items-center ${styles.headerGoBack}`}>
          <ArrowHeadIcon />
          <p className="px-1 m-0">Go Back</p>
        </Link>
        <h2 className={`${styles.studentDetailMainHeading}`}>Student Score Details</h2>
        <div>
          {student && (
            <Line
              data={{
                labels: student.scores.jumpPlace.map((data, index) => `Attempt ${index + 1}`),
                datasets: [
                  {
                    label: "Jump from Place",
                    data: student.scores.jumpPlace.map((data) => data.score),
                    backgroundColor: "#064FF0",
                    borderColor: "#064FF0",
                  },
                  {
                    label: "Jump from Height",
                    data: student.scores.jumpHeight.map((data) => data.score),
                    backgroundColor: "#FF3030",
                    borderColor: "#FF3030",
                  },
                  {
                    label: "Run",
                    data: student.scores.run.map((data) => data.score),
                    backgroundColor: "#00FF00",
                    borderColor: "#00FF00",
                  },
                  {
                    label: "Set-up Workout",
                    data: student.scores.setUp.map((data) => data.score),
                    backgroundColor: "#FFFF00",
                    borderColor: "#FFFF00",
                  },
                ],
              }}
              options={{
                elements: {
                  line: {
                    tension: 0.5,
                  },
                },
                plugins: {
                  title: {
                    text: "Student Scores",
                  },
                },
              }}
            />
          )}
        </div>

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
                <>
                  <p key={index}>Score {index + 1}: <span className='fw-bold'>{score.score ? score.score : 'N/A'}</span></p>
                  <p key={index}>Time {index + 1}: <span className='fw-bold'>{score.time ? score.time : 'N/A'}</span></p>
                </>
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
                <>
                  <p key={index}>Score {index + 1}: <span className='fw-bold'>{score.score ? score.score : 'N/A'}</span></p>
                  <p key={index}>Time {index + 1}: <span className='fw-bold'>{score.time ? score.time : 'N/A'}</span></p>
                </>
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
