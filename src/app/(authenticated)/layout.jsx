import "@/assets/css/authenticated-layout.css";
import styles from "@/assets/css/authenticated-layout.module.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default async function AuthenticatedLayout({ children }) {

  return (
    <div id="authenticatedLayoutMain" className="layoutPinned">
      <Sidebar />
      <div className={styles.mainContentContainer}>
        <Header />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
