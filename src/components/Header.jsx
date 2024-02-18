"use client";
import styles from "../assets/css/header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import {deleteCookie} from "cookies-next";
// import PulseBackdrop from "./PulseBackdrop";
import { useState, useEffect } from "react";
// import {useRouter} from "next/navigation";
// import {useSelector} from "react-redux";
// import {getCurrentUser} from "@/redux/selectors";
// import {useDispatch} from "react-redux";
// import {updateCurrentUser} from "@/redux/actionCreators";
// import {enqueueSnackbar} from "notistack";
import userIcon from "../assets/images/user.svg";

const Header = () => {
  const pathname = usePathname();
  // const dispatch = useDispatch();
  // const router = useRouter();

  // let goBackLink;
  // const loggedInUser = useSelector((state) => getCurrentUser(state));
  const [loggingOut, setLoggingOut] = useState(false);
  const [userFetched, setUserFetched] = useState(false);

  // useEffect(() => {
  //   const refreshUser = async () => {
  //     setUserFetched(false);

  //     import("@/api/AuthApi").then(function (module) {
  //       const {me} = module;

  //       me()
  //         .then((response) => {
  //           dispatch(updateCurrentUser(response.data.user));
  //         })
  //         .catch((errors) => {
  //           enqueueSnackbar(errors.message, {variant: "error"});
  //         })
  //         .finally(() => {
  //           setUserFetched(true);
  //         });
  //     });
  //   };

  //   refreshUser();
  // }, [dispatch]);

  // const handleLogout = async () => {
  //   setLoggingOut(true);

  //   import("@/api/AuthApi").then(function (module) {
  //     const {logout} = module;

  //     logout()
  //       .then((response) => {
  //         deleteCookie(`${process.env.NEXT_PUBLIC_NAME}_token`);
  //         router.push("/login");
  //       })
  //       .catch((errors) => {
  //         enqueueSnackbar(errors.message, {variant: "error"});
  //       });
  //   });
  // };

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
        <div className="dropdown">
          <Image src={userIcon} width={10} height={10} className={`rounded-circle ${styles.navbarAvatarPlaceholder}`} alt="Avatar" data-bs-toggle="dropdown" data-bs-offset="0,10" aria-expanded="false" />
          <ul className={`dropdown-menu ${styles.headerDropdown}`}>
            <li>
              <Link className="dropdown-item" href="/profile">
                Profile
              </Link>
            </li>
            <li>
              <button className="dropdown-item border-0 bg-transparent">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>
      {/* {(loggingOut || !userFetched) && <PulseBackdrop />} */}
    </>
  );
};

export default Header;
