import styles from "@/assets/css/login-page.module.css?v1.0";
import Image from "next/image";
import Login from "./Login";
import landingImage from "@/assets/images/landing-page-image.jpg";
import imageShadow from "@/assets/images/auth-image-shadow.png";

export const metadata = {
  title: "Login - Teacher",
};

const page = () => {
  return (
    <div className={styles.authChildren}>
      <div className={styles.authContentContainer}>
        <div className={styles.authContent}>
          <h1 className="mb-35">Login as Teacher</h1>
          <p className="mb-2">Welcome to the Tournament App, your all-in-one platform for managing sports tournaments effortlessly. Log in to stay updated on scores, track progress, and engage with your team like never before!</p>
          <Login />
        </div>
      </div>
      <div
        className={styles.authImg}
        style={{
          backgroundImage: `url(${landingImage.src})`,
        }}
      >
        <Image src={imageShadow} alt="shadow" width={406} height={207} />
      </div>
    </div>
  );
};

export default page;
