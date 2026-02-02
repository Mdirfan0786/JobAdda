import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducers/authReducer";

function NavbarComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const profileRoutes = [
    "/dashboard",
    "/discover",
    "/myConnections",
    "/Jobs",
    "/Saved_items",
    "/Groups",
    "/Events",
  ];

  const getPageTitle = () => {
    return profileRoutes.includes(router.pathname) ? "Profile" : "Dashboard";
  };

  const handleProfileNav = () => {
    if (profileRoutes.includes(router.pathname)) {
      router.push(`/profile/${authState.user.userId.username}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <h1 className={styles.logo} onClick={() => router.push("/")}>
            Job<span>Adda</span>
          </h1>

          <div className={styles.navBarOptionContainer}>
            {authState.profileFetched ? (
              <div className={styles.userNav}>
                <span className={styles.greeting}>
                  Hi, {authState.user.userId.name} 👋
                </span>

                <button
                  onClick={handleProfileNav}
                  className={styles.profileBtn}
                >
                  {getPageTitle()}
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/auth?mode=login");
                    dispatch(reset());
                  }}
                  className={styles.logoutBtn}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth?mode=register")}
                  className={styles.buttonJoin}
                >
                  Be a Part
                </button>

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
