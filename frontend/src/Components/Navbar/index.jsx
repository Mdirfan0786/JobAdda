import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducers/authReducer";

function NavbarComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

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
                  <p
                    onClick={(e) => {
                      localStorage.removeItem("token");
                      router.push("/auth?mode=login");
                      dispatch(reset());
                    }}
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Logout
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
