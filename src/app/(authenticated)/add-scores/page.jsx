'use client'
import React, { useState, useEffect } from 'react';
import formStyles from "@/assets/css/form-elements.module.css";
import styles from "@/assets/css/add-student.module.css";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";
import { collection, getDoc, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from '@/config';
import CircularProgress from '@/components/CircularProgress';
import { enqueueSnackbar } from "notistack";
import { calculateAverage } from '@/utils/helperMethod';

const Page = () => {

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [addStudent, setAddStudent] = useState({ name: '' });
  const [selectedSport, setSelectedSport] = useState('');
  const [scoreValues, setScoreValues] = useState([]);
  const [timeValues, setTimeValues] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
      } catch (error) {
        enqueueSnackbar(`Error fetching students: ${error}`, { variant: "error" })
      }
    };
    fetchStudents();
  }, []);

  const handleStudentChange = (e) => {
    setAddStudent({ name: e.target.value });
    setSelectedSport('');
    setScoreValues([]);
    setTimeValues([]);
  };

  const handleSportChange = (sport) => {
    setSelectedSport(sport);

    const selectedStudent = students.find(student => student.name === addStudent.name);
    if (selectedStudent && selectedStudent.scores && selectedStudent.scores[sport]) {
      const sportScores = selectedStudent.scores[sport];
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
      const selectedStudent = students.find(student => student.name === addStudent.name);
      if (!selectedStudent) {
        throw new Error('Selected student not found.');
      }
      const studentRef = doc(db, 'students', selectedStudent.id);

      const updatedScores = {
        [selectedSport]: scoreValues.map((score, index) => {
          const time = (selectedSport === 'run' || selectedSport === 'setUp') ? timeValues[index] : undefined;
          return { score, ...(time !== undefined && { time }) }; // Include time if it's defined
        })
      };

      await updateDoc(studentRef, { [`scores.${selectedSport}`]: updatedScores[selectedSport] });
      const updatedDocSnapshot = await getDoc(studentRef);
      const updatedStudent = { id: updatedDocSnapshot.id, ...updatedDocSnapshot.data() };
      setStudents(students.map(student => student.id === updatedStudent.id ? updatedStudent : student));

      enqueueSnackbar('Scores updated successfully!', { variant: "success" });
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
            <form className="w-75 mx-auto" onSubmit={handleSubmit}>
              <div className="mt-5 mb-3 mx-4">
                <select
                  required
                  className={`${formStyles.customSelectField} w-100 form-select`}
                  id="name"
                  aria-label="name"
                  value={addStudent.name}
                  onChange={handleStudentChange}
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.name}>{student.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2 mb-3 mx-4">
                <select
                  required
                  className={`${formStyles.customSelectField} w-100 form-select`}
                  value={selectedSport}
                  onChange={(e) => handleSportChange(e.target.value)}
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
              <div className="mt-3 mb-3 mx-4">
                <button type="submit" className={`${buttonStyles.buttonDarkPink} `}>
                  {!loading ? "Update Record" : <CircularProgress width={22} height={22} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Page;