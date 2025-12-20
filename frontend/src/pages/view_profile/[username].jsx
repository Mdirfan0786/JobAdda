import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { BASE_URL, clientServer } from "@/config";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";

export default function ViewProfile({ userProfile }) {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  // Getting all users
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  // Alert

  const handleAlert = () => {
    alert(
      `🚧 This feature is currently under development  We’re writing clean code & fixing bugs. Stay tuned.`
    );
  };
  return (
    <UserLayout>
      <div className={styles.conteiner}>
        <div className={styles.profile_container}>
          <div className={styles.profile_container_left}>
            <div className={styles.profile_left_details_container}>
              <div className={styles.profile_left_backgroundImg}></div>
            </div>
          </div>
          <div className={styles.profile_container_right}>
            <div className={styles.premium_profiles}>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                Explore Premium Profiles
              </p>

              {authState.all_profile_fetched &&
                (authState.all_users?.length > 0 ? (
                  authState.all_users.map((profile) => (
                    <div
                      key={profile.userId._id}
                      className={styles.premium_Profiles_details}
                    >
                      <img
                        onClick={() =>
                          router.push(
                            `/view_profile/${profile.userId.username}`
                          )
                        }
                        className={styles.premium_profile_picture}
                        src={`${BASE_URL}/${profile.userId.profilePicture}`}
                        alt="profile Picture"
                      />

                      <div className={styles.premium_profile_data}>
                        <p
                          onClick={() =>
                            router.push(
                              `/view_profile/${profile.userId.username}`
                            )
                          }
                          style={{ fontWeight: "bold" }}
                        >
                          {profile.userId.name}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#808080" }}>
                          @{profile.userId.username}
                        </p>
                        <div
                          onClick={handleAlert}
                          className={styles.premium_profile_message}
                        >
                          Message
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#888" }}>No premium profiles found</p>
                ))}

              <div
                onClick={() => router.push("/discover")}
                className={styles.Explore_job_adda}
              >
                <p>Explore Job Adda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const { username } = context.params;

    const res = await clientServer.get(
      `/user/get_Profile_based_on_username/${username}`,
      {
        params: { username },
      }
    );

    return {
      props: {
        userProfile: res.data,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};
