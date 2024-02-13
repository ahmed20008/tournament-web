import styles from "@/assets/css/error-page.module.css";
import Image from "next/image";
import error404 from "@/assets/images/error-404.png"; 

const Error404 = ({height}) => {
  return (
    <div style={{height: `${height ?? ""}`}} className={styles.errorPageConatiner}>
      <Image src={error404} alt="something went wrong" />
      <h1>Something&#39;s wrong here.</h1>
      <p>This is a 404 error, which means you&#39;ve clicked on a bad link or entered an invalid URL. Use the button below to go back to the homepage.</p>
      <a href="/dashboard">Back to Homapage</a>
    </div>
  );
};

export default Error404;
