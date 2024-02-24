"use client"
import "@/assets/css/auth-layout.css";
import styles from "@/assets/css/auth.module.css";
import { SnackbarProvider } from 'notistack';

export default function AuthLayout({ children }) {
  return (
    <main className={styles.authContainer}>
      <SnackbarProvider>
        {children}
      </SnackbarProvider>
    </main>
  );
}
