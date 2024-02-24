"use client"
import "@/assets/css/authenticated-layout.css";
import styles from "@/assets/css/authenticated-layout.module.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SnackbarProvider } from 'notistack';

export default async function AuthenticatedLayout({ children }) {

  return (
    <SnackbarProvider>
      <div id="authenticatedLayoutMain" className="layoutPinned">
        <Sidebar />
        <div className={styles.mainContentContainer}>
          <Header />
          <main className={styles.mainContent}>{children}</main>
        </div>
      </div>
    </SnackbarProvider>
  );
}
