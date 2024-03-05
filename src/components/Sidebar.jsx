"use client";
import React from "react";
import Link from "next/link";
import styles from "../assets/css/sidebar.module.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import PulseBackdrop from "./PulseBackdrop";
import { auth } from "@/config";
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const router = useRouter();
  const currentRoute = usePathname();
  const pathArray = currentRoute.split("/").filter(Boolean);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const accordionBodyRef = useRef(null);

  const handleMenuClick = () => {
    const sidebarPinicon = document.querySelectorAll(".sidebarPinButtonIcon");
    const layoutContainer = document.getElementById("authenticatedLayoutMain");
    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebarSpan = document.querySelectorAll(".sidebarSpan");
    const sidebarPinButton = document.getElementById("sidebarPinButton");
    const sidebarLinksContainer = document.getElementById("sidebarLinksContainer");
    const sidebarParentContainer = document.getElementById("sidebarParentContainer");

    if (sidebarPinButton.getAttribute("data-pinned") === "true") {
      const accordionBody = accordionBodyRef.current;
      accordionBody.style.maxHeight = null;
      setIsActive(false);
      sidebarPinButton.setAttribute("data-pinned", false);
      sidebarPinicon.forEach((element) => {
        element.classList.remove("sidenavIconPinned");
      });
      layoutContainer.classList.remove("layoutPinned");
      layoutContainer.classList.add("layoutUnpinned");
      sidebarLogo.classList.add("hideSidebarImage");
      sidebarSpan.forEach((element) => {
        element.classList.remove("showSidebarSpan");
        element.classList.add("hideSidebarSpan");
      });
      sidebarLinksContainer.classList.add("unpinContainer");
      sidebarLinksContainer.classList.remove("pinContainer");
      sidebarParentContainer.classList.add("sidebarContentUnpinned");
      sidebarParentContainer.classList.remove("sidebarContentPinned");
    } else {
      sidebarPinButton.setAttribute("data-pinned", true);
      sidebarPinicon.forEach((element) => {
        element.classList.add("sidenavIconPinned");
      });
      layoutContainer.classList.add("layoutPinned");
      layoutContainer.classList.remove("layoutUnpinned");
      sidebarLogo.classList.remove("hideSidebarImage");
      sidebarSpan.forEach((element) => {
        element.classList.add("showSidebarSpan");
        element.classList.remove("hideSidebarSpan");
      });
      sidebarLinksContainer.classList.remove("unpinContainer");
      sidebarLinksContainer.classList.add("pinContainer");
      sidebarParentContainer.classList.remove("sidebarContentUnpinned");
      sidebarParentContainer.classList.add("sidebarContentPinned");
    }
  };

  const handleSidebarHover = () => {
    const sidebarPinButton = document.getElementById("sidebarPinButton");
    const sidebarLinksContainer = document.getElementById("sidebarLinksContainer");
    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebarSpan = document.querySelectorAll(".sidebarSpan");

    if (sidebarPinButton.getAttribute("data-pinned") === "false" && window.innerWidth > 1199) {
      sidebarLinksContainer.classList.remove("unpinContainer");
      sidebarLinksContainer.classList.add("pinContainer");
      sidebarLogo.classList.remove("hideSidebarImage");
      sidebarSpan.forEach((element) => {
        element.classList.add("showSidebarSpan");
        element.classList.remove("hideSidebarSpan");
      });
    }
  };

  const handleSidebarHoverLeave = () => {
    const sidebarPinButton = document.getElementById("sidebarPinButton");
    const sidebarLinksContainer = document.getElementById("sidebarLinksContainer");
    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebarSpan = document.querySelectorAll(".sidebarSpan");

    if (sidebarPinButton.getAttribute("data-pinned") === "false" && window.innerWidth > 1199) {
      const accordionBody = accordionBodyRef.current;
      accordionBody.style.maxHeight = null;
      setIsActive(false);
      sidebarLinksContainer.classList.add("unpinContainer");
      sidebarLinksContainer.classList.remove("pinContainer");
      sidebarLogo.classList.add("hideSidebarImage");
      sidebarSpan.forEach((element) => {
        element.classList.remove("showSidebarSpan");
        element.classList.add("hideSidebarSpan");
      });
    }
  };

  const handleClickOutsideSidebar = useCallback((e) => {
    const sidebarLinksContainer = document.getElementById("sidebarLinksContainer");
    if (!sidebarLinksContainer.contains(e.target)) {
      handleMenuClick();
    }
  }, []);

  const handleLinkCLick = useCallback(() => {
    if (window.innerWidth <= 1199) {
      handleMenuClick();
    }
  }, []);

  useEffect(() => {
    const sidebarPinButton = document.getElementById("sidebarPinButton");
    const sidebarParentContainer = document.getElementById("sidebarParentContainer");
    const sidebarLinksContainer = document.getElementById("sidebarLinksContainer");
    const sidebarLink = document.querySelectorAll(".sidebarLink");

    if (sidebarPinButton && sidebarParentContainer && sidebarLinksContainer && sidebarLink.length > 0) {
      sidebarPinButton.addEventListener("click", handleMenuClick);
      sidebarParentContainer.addEventListener("click", handleClickOutsideSidebar);
      sidebarLinksContainer.addEventListener("mouseover", handleSidebarHover);
      sidebarLinksContainer.addEventListener("mouseleave", handleSidebarHoverLeave);
      sidebarLink.forEach((link) => {
        link.addEventListener("click", handleLinkCLick);
      });
    }

    return () => {
      if (sidebarPinButton && sidebarParentContainer && sidebarLinksContainer && sidebarLink.length > 0) {
        sidebarPinButton.removeEventListener("click", handleMenuClick);
        sidebarParentContainer.removeEventListener("click", handleClickOutsideSidebar);
        sidebarLinksContainer.removeEventListener("mouseover", handleSidebarHover);
        sidebarLinksContainer.removeEventListener("mouseleave", handleSidebarHoverLeave);
        sidebarLink.forEach((link) => {
          link.removeEventListener("click", handleLinkCLick);
        });
      }
    };
  }, [handleClickOutsideSidebar, handleLinkCLick]);


  const handleLogout = async () => {
    setLoggingOut(true);
    signOut(auth)
    sessionStorage.removeItem('user')
    deleteCookie(`${process.env.NEXT_PUBLIC_NAME}_token`);
    router.push("/");
  };

  const handleAccordionClick = () => {
    const accordionBody = accordionBodyRef.current;
    if (isActive) {
      accordionBody.style.maxHeight = null;
    } else {
      accordionBody.style.maxHeight = `${accordionBody.scrollHeight}px`;
    }
    setIsActive((prevIsActive) => !prevIsActive);
  };

  return (
    <>
      <div id="sidebarParentContainer" className={`${styles.sidebarContent} sidebarContentPinned`}>
        <div id="sidebarLinksContainer" className={`${styles.sidebarContainer} ${styles.sidebarScrollBar} pinContainer`}>
          <nav>
            <ul className={styles.listContainer}>
              <li className={styles.listItemLogo}>
                <Link className="sidebarLink" href="/dashboard">
                  <div id="sidebarLogo">
                  </div>
                </Link>
              </li>
              <li className={`mb-2 ${styles.listItem} ${pathArray[0] === "dashboard" ? styles.sidebarActive : ""}`}>
                <Link className="sidebarLink" href="/dashboard">
                  <div>
                    <svg className={styles.dashboardIcon} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        opacity="0.5"
                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                        stroke="#1C274C"
                        strokeWidth="2"
                      />
                      <path d="M12 15L12 18" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className={` sidebarSpan showSidebarSpan`}>Dashboard</span>
                </Link>
              </li>
              <li className={`mb-2 ${styles.listItem} ${pathArray[0] === "add-student" ? styles.sidebarActive : ""}`}>
                <Link className="sidebarLink" href="/add-student">
                  <div>
                    <svg className={styles.userIcon} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx={9} cy={6} r={4} stroke="#1C274C" strokeWidth="2" />
                      <path d="M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
                      <path
                        d="M5.88915 20.5843C6.82627 20.8504 7.88256 21 9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 17.3453 2.07657 17.6804 2.22053 18"
                        stroke="#1C274C"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className={`sidebarSpan showSidebarSpan`}>Add Student</span>
                </Link>
              </li>
              <li className={`mb-2 ${styles.listItem} ${pathArray[0] === "add-scores" ? styles.sidebarActive : ""}`}>
                <Link className="sidebarLink" href="/add-scores">
                  <div>
                    <svg className={styles.calendarIcon} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                        stroke="#000000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className={` sidebarSpan showSidebarSpan`}>Add Score</span>
                </Link>
              </li>
              {/* <div className="mb-2">
                <li className={`${styles.listItem} ${pathArray[0] === "members" || pathArray[0] === "non-members" ? styles.sidebarActive : ""}`}>
                  <button className={`${styles.customaccordion} ${isActive ? styles.active : ""}`} onClick={handleAccordionClick}>
                    <div>
                      <svg className={styles.userIcon} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx={9} cy={6} r={4} stroke="#1C274C" strokeWidth="2" />
                        <path d="M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M5.88915 20.5843C6.82627 20.8504 7.88256 21 9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 17.3453 2.07657 17.6804 2.22053 18"
                          stroke="#1C274C"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className={`sidebarSpan showSidebarSpan`}>Students</span>
                  </button>
                </li>
                <div ref={accordionBodyRef} className={`${styles.accordionBody}`}>
                  <div className="mt-2">
                    <Link className={`sidebarLink ${pathArray[0] === "add-student" ? styles.usersActive : styles.usersNotActive}`} href="/add-student">
                      Add Student
                    </Link>
                  </div>
                  <div>
                    <Link className={`sidebarLink ${pathArray[0] === "add-scores" ? styles.usersActive : styles.usersNotActive}`} href="/add-scores">
                      Add Scores
                    </Link>
                  </div>
                </div>
              </div> */}
              <li className={`mb-2 ${styles.listItem}`}>
                <button onClick={handleLogout}>
                  <div>
                    <svg className={styles.dashboardIcon} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 4L17.5 4C20.5577 4 20.5 8 20.5 12C20.5 16 20.5577 20 17.5 20H14M3 12L15 12M3 12L7 8M3 12L7 16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`sidebarSpan showSidebarSpan`}>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {loggingOut && <PulseBackdrop />}
    </>
  );
};

export default Sidebar;