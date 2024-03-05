'use client'
import React, { useState } from 'react';
import formStyles from "@/assets/css/form-elements.module.css";
import styles from "@/assets/css/add-student.module.css";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from '@/config';
import CircularProgress from '@/components/CircularProgress';
import { enqueueSnackbar } from "notistack";
import { calculateAverage } from '@/utils/helperMethod';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const page = () => {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [findStudent, setFindStudent] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [scoreValues, setScoreValues] = useState([]);
  const [timeValues, setTimeValues] = useState([]);
  const [check, setCheck] = useState(true);
  const router = useRouter();

  const id = params.uuid;

  console.log(id);

  const handleStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const studentQuery = query(collection(db, 'students'), where('studentId', '==', findStudent.studentId));
      const studentQuerySnapshot = await getDocs(studentQuery);
      if (!studentQuerySnapshot.empty) {
        const studentDocSnapshot = studentQuerySnapshot.docs[0];
        const studentData = { id: studentDocSnapshot.id, ...studentDocSnapshot.data() };
        setLoading(false);
        setCheck(false);
        setStudent(studentData);
        setSelectedSport('');
        setScoreValues([]);
        setTimeValues([]);
      } else {
        throw new Error('Student with this ID doesnot exists!');
      }
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" })
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (sport) => {
    setSelectedSport(sport);

    if (student && student.scores && student.scores[sport]) {
      const sportScores = student.scores[sport];
      const newScoreValues = Array(4).fill('');
      let newTimeValues = [];
      if (sport === 'run' || sport === 'setUp') {
        newTimeValues = Array(4).fill('');
      }
      sportScores.forEach((entry, index) => {
        newScoreValues[index] = entry.score;
        if (sport === 'run' || sport === 'setUp') {
          newTimeValues[index] = entry.time;
        }
      });
      setScoreValues(newScoreValues);
      setTimeValues(newTimeValues);
    }
  };

  const handleScoreChange = (index, value) => {
    const newValues = [...scoreValues];
    newValues[index] = value;
    setScoreValues(newValues);
  };

  const handleTimeChange = (index, value) => {
    const newValues = [...timeValues];
    newValues[index] = value;
    setTimeValues(newValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const studentRef = doc(db, 'students', student.id);
      const updatedScores = {
        [selectedSport]: scoreValues.map((score, index) => {
          const time = (selectedSport === 'run' || selectedSport === 'setUp') ? timeValues[index] : undefined;
          return { score, ...(time !== undefined && { time }) };
        })
      };

      await updateDoc(studentRef, { [`scores.${selectedSport}`]: updatedScores[selectedSport] });
      enqueueSnackbar('Scores added successfully!', { variant: "success" });
      router.push(`/dashboard/${student.studentId}`);
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className={styles.pageHeading}>Add Score</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className={`card ${styles.addStudentCard}`}>
            <form className="w-75 mx-auto" onSubmit={handleStudent}>
              <div className="mt-5 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="studentId"
                  aria-label="studentId"
                  type="text"
                  placeholder="Enter Student Id"
                  value={findStudent.studentId}
                  onChange={(e) => setFindStudent({ ...findStudent, studentId: e.target.value })}
                  disabled={!check}
                />
              </div>
              {(check) &&
                <div className="mt-3 mb-3 mx-4">
                  <button type="submit" className={`${buttonStyles.buttonDarkPink} `}>
                    {!loading ? "Find Student" : <CircularProgress width={22} height={22} />}
                  </button>
                </div>
              }
            </form>
            <form className="w-75 mx-auto" onSubmit={handleSubmit}>
              <div className="mt-2 mb-3 mx-4">
                <select
                  required
                  className={`${formStyles.customSelectField} w-100 form-select`}
                  value={selectedSport}
                  onChange={(e) => handleSportChange(e.target.value)}
                  disabled={check}
                >
                  <option value="">Select Sport</option>
                  <option value="jumpHeight">Jump from Height</option>
                  <option value="jumpPlace">Jump from Place</option>
                  <option value="run">Run</option>
                  <option value="setUp">Set-up Workout</option>
                </select>
              </div>
              {selectedSport && (
                <div className='mb-3 mx-4'>
                  {/* <h5 className={`${styles.sportHeading}`}>{selectedSport}</h5> */}
                  {scoreValues.map((value, index) => (
                    <>
                      <label htmlFor="scores" className="form-label px-1">
                        <b>Score {index + 1}</b>
                      </label>
                      <input
                        key={index}
                        type="number"
                        value={value}
                        className={`${formStyles.inputFieldWhite} mb-3`}
                        onChange={(e) => handleScoreChange(index, e.target.value)}
                        required={true}
                        min={0}
                        max={100}
                      />
                    </>
                  ))}
                  {(selectedSport === 'run' || selectedSport === 'setUp') && (
                    timeValues.map((value, index) => (
                      <>
                        <label htmlFor="distances" className="form-label px-1">
                          <b>Distance {index + 1}</b>
                        </label>
                        <input
                          key={index}
                          type="number"
                          value={value}
                          className={`${formStyles.inputFieldWhite} mb-3`}
                          onChange={(e) => handleTimeChange(index, e.target.value)}
                          required={true}
                          min={0}
                          max={100}
                        />
                      </>
                    ))
                  )}
                  <p>Automatic Grade: {calculateAverage(scoreValues)}</p>
                </div>
              )}
              {(!check) &&
                <div className="mt-3 mb-3 mx-4">
                  <button type="submit" className={`${buttonStyles.buttonDarkPink} `}>
                    {!loading ? "Add Score" : <CircularProgress width={22} height={22} />}
                  </button>
                </div>
              }
            </form>
          </div>
        </div>
      </div >
    </div >
  )
}

export default page;