import styles from "../assets/css/loader.module.css";

const CircularProgress = ({width, height}) => {
  return (
    <span className={styles.customCircularProgress} style={{width: `${width ?? "20"}px`, height: `${height ?? "20"}px`}} role="progressbar">
      <svg viewBox="22 22 44 44">
        <circle cx={44} cy={44} r="20.2" fill="none" strokeWidth="3.6" />
      </svg>
    </span>
  );
};

export default CircularProgress;
