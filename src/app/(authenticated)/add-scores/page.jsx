'use client'
import React, { useState, useEffect } from 'react';
import formStyles from "@/assets/css/form-elements.module.css";
import styles from "@/assets/css/add-student.module.css";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from '@/config';
import CircularProgress from '@/components/CircularProgress';
import { calculateAverage } from '../../../assets/utlis/helperMethod'

const Page = () => {
  const initialState = {
    name: '',
    id: '',
    class: '',
  }

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [addStudent, setAddStudent] = useState({ name: '' });
  const [selectedSport, setSelectedSport] = useState('');
  const [sportValues, setSportValues] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentChange = (e) => {
    setAddStudent({ name: e.target.value });
    setSelectedSport('');
    setSportValues([]);
  };

  const handleSportChange = (sport) => {
    setSelectedSport(sport);

    const selectedStudent = students.find(student => student.name === addStudent.name);
    if (selectedStudent && selectedStudent.scores && selectedStudent.scores[sport]) {
      setSportValues([...selectedStudent.scores[sport]]);
    } else {
      setSportValues(['', '', '', '']);
    }
  };

  const handleSportValueChange = (index, value) => {
    const newValues = [...sportValues];
    newValues[index] = value;
    setSportValues(newValues);
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
      const updatedScores = { ...selectedStudent.scores };
      updatedScores[selectedSport] = [...sportValues];
      await updateDoc(studentRef, { scores: updatedScores });
      window.location.reload();
    } catch (error) {
      console.error('Error updating scores:', error);
    }
    setLoading(false);
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
                  className={`${formStyles.inputFieldWhite}`}
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
              <select
                required
                className={`${formStyles.inputFieldWhite}`}
                value={selectedSport}
                onChange={(e) => handleSportChange(e.target.value)}
              >
                <option value="">Select Sport</option>
                <option value="jumpPlace">Jump Place</option>
                <option value="jumpHeight">Jump Height</option>
                <option value="run">Run</option>
                <option value="setUp">Set Up</option>
              </select>

              {selectedSport && (
                <div>
                  <h3>{selectedSport}</h3>
                  {sportValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      value={value}
                      onChange={(e) => handleSportValueChange(index, e.target.value)}
                    />
                  ))}
                  <p>Atomatic Grade: {calculateAverage(sportValues)}</p>
                </div>
              )}
              <div className="mt-3 mb-3 mx-4">
                <button type="submit" className={`${buttonStyles.buttonDarkPink} `}>
                  {!loading ? "Add Record" : <CircularProgress width={22} height={22} />}
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