import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  });
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {/* Card Container left */}
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {" "}
              {userLoginMethod ? "Sign in" : "Sign Up"}{" "}
            </p>

            <div className={styles.inpuContainers}>
              <div className={styles.inputRow}>
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Name"
                />

                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Username"
                />
              </div>

              <input
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />

              <input
                className={styles.inputField}
                type="text"
                placeholder="Password"
              />

              <button className={styles.authBtn}>
                <p> {userLoginMethod ? "Sign in" : "Sign Up"} </p>
              </button>
            </div>
          </div>

          {/* Card Container right */}
          <div className={styles.cardContainer_right}></div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
