import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function NavbarComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <h1 className={styles.logo} onClick={() => router.push("/")}>
            Job<span>Adda</span>
          </h1>

          <div className={styles.navBarOptionContainer}>
            {/* if User is Logged in then show */}
            {authState.profileFetched && (
              <div>
                <div style={{ display: "flex", gap: "1.2rem" }}>
                  <p>hey, {authState.user.userId.name} 👋</p>
                  <p style={{ fontWeight: "bold", cursor: "pointer" }}>
                    Profile
                  </p>
                </div>
              </div>
            )}

            {/* Show Only if User is not loggedIn */}
            {!authState.profileFetched && (
              <>
                <div
                  onClick={() => router.push("/auth?mode=register")}
                  className={styles.buttonJoin}
                >
                  <p>Be a Part</p>
                </div>

                <button
                  onClick={() => router.push("/auth?mode=login")}
                  className={styles.linkedinLoginBtn}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavbarComponent;
