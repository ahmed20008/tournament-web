"use client";
import { useState, useEffect } from "react";
import styles from "../assets/css/header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import PulseBackdrop from "./PulseBackdrop";
import { auth } from "@/config";
import { signOut } from 'firebase/auth';
import { useRouter } from "next/navigation";
import userIcon from "../assets/images/user.svg";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    signOut(auth)
    sessionStorage.removeItem('user')
    deleteCookie(`${process.env.NEXT_PUBLIC_NAME}_token`);
    router.push("/");
  };

  return (
    <>
      <header className={styles.headerContainer}>
        <div>
          <button data-pinned="true" className={styles.sidenavToggler} id="sidebarPinButton">
            <div className={styles.sidenavTogglerInner}>
              <i className={`${styles.sidenavTogglerLine} sidebarPinButtonIcon sidenavIconPinned`}></i>
              <i className={styles.sidenavTogglerLine}></i>
              <i className={`${styles.sidenavTogglerLine} sidebarPinButtonIcon sidenavIconPinned`}></i>
            </div>
          </button>
          {pathname === "/dashboard" && (
            <p className={styles.welcomeBack}>Welcome back</p>
          )}
        </div>
      </header>
      {loggingOut && <PulseBackdrop />}
    </>
  );
};

export default Header;
