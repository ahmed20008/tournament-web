import styles from "../assets/css/loader.module.css";

const Loader = ({loaderColor}) => {
  return <span style={{color: loaderColor}} className={styles.tournamentLoader}></span>;
};

export default Loader;
