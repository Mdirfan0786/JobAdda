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
      router.push(`/view_profile/${authState.user.userId.username}`);
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
            {/* if User is Logged in then show */}
            {authState.profileFetched && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <p>hey, {authState.user.userId.name} 👋</p>
                  <p
                    onClick={handleProfileNav}
                    className={styles.hoverProfile}
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                      paddingInline: "0.8rem",
                      paddingBlock: "0.3rem",
                      borderRadius: "0.25rem",
                    }}
                  >
                    {getPageTitle()}
                  </p>
                  <p
                    onClick={(e) => {
                      localStorage.removeItem("token");
                      router.push("/auth?mode=login");
                      dispatch(reset());
                    }}
                    className={styles.hoverLogout}
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                      paddingInline: "0.8rem",
                      paddingBlock: "0.3rem",
                      borderRadius: "0.25rem",
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
