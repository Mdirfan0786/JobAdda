import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

function NavbarComponent() {
  const router = useRouter();
  return (
    <>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <h1 className={styles.logo} onClick={() => router.push("/")}>
            Job<span>Adda</span>
          </h1>

          <div className={styles.navBarOptionContainer}>
            <div
              onClick={() => {
                router.push("/auth?mode=login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a Part</p>
            </div>
            <button
              onClick={() => router.push("/auth?mode=register")}
              className={styles.linkedinLoginBtn}
            >
              Sign in
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavbarComponent;
