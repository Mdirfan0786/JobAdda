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

  const [userLoginMethod, setUserLoginMethod] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================= MESSAGE AUTO CLEAR =================
  useEffect(() => {
    if (!authState.message) return;

    const timer = setTimeout(() => {
      dispatch(emptyMessage());
    }, 3000);

    return () => clearTimeout(timer);
  }, [authState.message, dispatch]);

  // ================= MODE HANDLING =================
  useEffect(() => {
    setUserLoginMethod(mode !== "signup");
  }, [mode]);

  // ================= REDIRECT AFTER LOGIN =================
  useEffect(() => {
    if (authState.loggedIn) {
      router.replace("/dashboard");
    }
  }, [authState.loggedIn, router]);

  // ================= PASSWORD VISIBILITY RESET =================
  useEffect(() => {
    setShowPassword(false);
  }, [userLoginMethod]);

  // ================= VALIDATIONS =================
  const isLoginValid = email && password;
  const isRegisterValid = email && password && name && username;

  const handleRegister = () => {
    if (!isRegisterValid) return;
    dispatch(registerUser({ email, username, password, name }));
    router.push("/auth?mode=login");
  };

  const handleLogin = () => {
    if (!isLoginValid) return;
    dispatch(loginUser({ email, password }));
  };

  const handleEnterSubmit = (e) => {
    if (e.key !== "Enter") return;

    userLoginMethod ? handleLogin() : handleRegister();
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    placeholder="Name"
                    onKeyDown={handleEnterSubmit}
                  />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    placeholder="Username"
                    onKeyDown={handleEnterSubmit}
                  />
                </div>
              )}

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="Email"
                onKeyDown={handleEnterSubmit}
              />

              <div className={styles.passwordWrapper}>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                onClick={userLoginMethod ? handleLogin : handleRegister}
                className={styles.authBtn}
                disabled={userLoginMethod ? !isLoginValid : !isRegisterValid}
              >
                {userLoginMethod ? "Sign in" : "Sign Up"}
              </button>

              <p
                className={styles.toggleText}
                onClick={() => {
                  router.push(
                    `/auth?mode=${userLoginMethod ? "signup" : "login"}`,
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
              <h2 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
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
