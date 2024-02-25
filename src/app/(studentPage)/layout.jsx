"use client"
import styles from "@/assets/css/student-layout.module.css";

export default async function StudentLayout({ children }) {

  return (
    <div className={styles.mainContentContainer}>
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}