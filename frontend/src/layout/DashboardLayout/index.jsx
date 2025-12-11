import React from "react";
import styles from "./style.module.css";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.homeContainer}>
          <div className={styles.homeContainer__leftBar}></div>
          <div className={styles.homeContainer__feedContainer}>{children}</div>
          <div className={styles.homeContainer__extraContainer}></div>
        </div>
      </div>
    </div>
  );
}
