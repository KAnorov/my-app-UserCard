import styles from '@/styles/Spinner.module.css';

export default function Spinner() {
  return <>
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  </>;
};


