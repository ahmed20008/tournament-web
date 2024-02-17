import "@/assets/css/auth-layout.css";
import styles from "@/assets/css/auth.module.css";

export default function AuthLayout({ children }) {
  return <main className={styles.authContainer}>{children}</main>;
}
