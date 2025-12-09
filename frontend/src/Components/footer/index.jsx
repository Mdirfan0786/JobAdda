import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

function FooterComponent() {
  const router = useRouter();
  return (
    <>
      <footer className={styles.linkedinFooter}>
        <div className={styles.footerContainer}>
          <div onClick={() => router.push("/")} className={styles.footerLogo}>
            Job<span>Adda</span> © 2025
          </div>

          <div className={styles.footerLinks}>
            <a href="#">About</a>
            <a href="#">Accessibility</a>
            <a href="#">Help Center</a>
            <a href="#">Privacy & Terms</a>
            <a href="#">Ad Choices</a>
            <a href="#">Business Services</a>
            <a href="#">Get the App</a>
            <a href="#">More</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterComponent;
