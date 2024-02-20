import React from 'react'
import formStyles from "@/assets/css/form-elements.module.css";
import styles from "@/assets/css/add-student.module.css";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";

export const metadata = {
  title: "Add Student",
};

const page = () => {
  return (
    <div className="container">
      <h2 className={styles.pageHeading}>Add Student</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className={`card ${styles.addStudentCard}`}>
            <form className="w-75 mx-auto">
              <div className="mt-5 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="name"
                  aria-label="name"
                  type="text"
                  placeholder="Enter Student Name"
                />
              </div>
              <div className="mt-3 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="id"
                  aria-label="id"
                  type="text"
                  placeholder="Enter Student Id"
                />
              </div>
              <div className="mt-3 mb-3 mx-4">
                <input
                  required
                  className={`${formStyles.inputFieldWhite}`}
                  id="class"
                  aria-label="class"
                  type="text"
                  placeholder="Enter Student Class"
                />
              </div>
              <div className="mt-3 mb-3 mx-4">
                <button type="submit" className={`${buttonStyles.buttonDarkPink} `}>
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div >
  )
}

export default page