import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducers/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { mode } = router.query;

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authState.message) {
      const timer = setTimeout(() => {
        dispatch(emptyMessage());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [authState.message, dispatch]);

  // Show/Hide Password
  const handleEnterSubmit = (e) => {
    if (e.key === "Enter") {
      if (userLoginMethod) {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  // if Login then go to /dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  // Login & Register Mode
  useEffect(() => {
    if (mode === "login") {
      setUserLoginMethod(true);
    } else if (mode === "signup") {
      setUserLoginMethod(false);
    }
  }, [mode]);

  // redirect /dashboard after Login
  useEffect(() => {
    if (authState.loggedIn) {
      router.replace("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (authState.isSuccess && !userLoginMethod) {
      setUserLoginMethod(true);
      router.replace("/auth?mode=login");
      dispatch(emptyMessage());
    }
  }, [authState.isSuccess, userLoginMethod, router, dispatch]);

  // setting showPass Hide
  useEffect(() => {
    setShowPassword(false);
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ email, username, password, name }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign in" : "Sign Up"}
            </p>

            {/* MESSAGE */}
            {authState.message && (
              <p
                className={
                  authState.isError
                    ? styles.errorMessage
                    : styles.successMessage
                }
                style={{ display: authState.message ? "block" : "none" }}
              >
                {typeof authState.message === "string"
                  ? authState.message
                  : authState.message.message}
              </p>
            )}

            <div className={styles.inpuContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    onKeyDown={handleEnterSubmit}
                  />

                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    onKeyDown={handleEnterSubmit}
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={styles.inputField}
                type="email"
                placeholder="Email"
                onKeyDown={handleEnterSubmit}
              />

              <div className={styles.passwordWrapper}>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className={styles.inputField}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onKeyDown={handleEnterSubmit}
                />

                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.authBtn}
              >
                {userLoginMethod ? "Sign in" : "Sign Up"}
              </button>

              {/* Toggle Sign In / Sign Up */}
              <p
                style={{
                  marginTop: "0.75rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
                onClick={() => {
                  router.push(
                    `/auth?mode=${userLoginMethod ? "signup" : "login"}`
                  );
                  setEmail("");
                  setPassword("");
                  setName("");
                  setUsername("");
                }}
              >
                {userLoginMethod
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign in"}
              </p>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Learn the skills you need to succeed
              </h2>
              <img
                src="/images/rightImg.svg"
                alt="Networking Illustration"
                style={{ width: "80%", maxWidth: "300px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
