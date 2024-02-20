import Loader from "@/components/Loader";
import styles from "../assets/css/loader.module.css";

const Loading = () => {
  return (
    <div className={styles.loaderContainer}>
      <Loader loaderColor="rgb(46, 46, 46)" />
    </div>
  );
};

export default Loading;
