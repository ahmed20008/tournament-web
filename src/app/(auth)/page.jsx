import Link from "next/link";
import Image from "next/image";
import styles from "@/assets/css/landing-page.module.css?v1.0";
import buttonStyles from "@/assets/css/buttons.module.css?v1.1";
import landingImage from "@/assets/images/landing-page-image.jpg";
import imageShadow from "@/assets/images/auth-image-shadow.png";

export const metadata = {
  title: "Tournament App",
};

const page = () => {
  return (
    <div className={styles.authChildren}>
      <div className={styles.authContentContainer}>
        <div className={styles.authContent}>
          <h1 className="mb-35">Welcome to Tournament App.</h1>
          <p className="mb-2">Welcome to the Tournament App, your all-in-one platform for managing sports tournaments effortlessly. Log in to stay updated on scores, track progress, and engage with your team like never before!</p>
          <div className="d-flex gap-5 my-4">
            <Link href="/login-teacher" aria-disabled="false" className={buttonStyles.buttonDarkPink}>
              Login as Teacher
            </Link>
            <Link href="/login-student" aria-disabled="false" className={buttonStyles.buttonDarkPink}>
              Login as Student
            </Link>
          </div>
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
