import UserLayout from "@/layout/userLayout";
import { BASE_URL, clientServer } from "@/config";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  sendConnectionRequest,
  getSentRequests,
  getReceivedRequests,
  getConnections,
  acceptConnectionRequest,
} from "@/config/redux/action/authAction";

import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ViewProfile({ userProfile }) {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userPost, setUserPost] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [localPending, setLocalPending] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // getting User Post
  const getUserPost = async () => {
    await dispatch(getAllPosts());
  };

  const profileUserId = userProfile?.userId?._id;

  const isConnected = authState.connections.some(
    (c) =>
      c.userId?._id === profileUserId || c.connectionId?._id === profileUserId
  );

  const isSent = authState.sentRequests.some(
    (r) => r.connectionId?._id === profileUserId
  );

  const finalIsSent = isSent || localPending;

  const isReceived = authState.receivedRequests.some(
    (r) => r.userId?._id === profileUserId
  );

  useEffect(() => {
    if (!token) return;

    dispatch(getSentRequests(token));
    dispatch(getReceivedRequests(token));
    dispatch(getConnections(token));
  }, [token, router.query.username, dispatch]);

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });

    setUserPost(post);
  }, [postState.posts]);

  // Getting all users
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  useEffect(() => {
    if (router.query.username) {
      getUserPost();
    }
  }, [router.query.username]);

  // Alert
  const handleAlert = () => {
    alert(
      `🚧 This feature is currently under development  We’re writing clean code & fixing bugs. Stay tuned.`
    );
  };

  const isOwnProfile = authState.user?.userId?._id === userProfile?.userId?._id;
  return (
    <UserLayout>
      <div className={styles.conteiner}>
        <div className={styles.profile_container}>
          <div className={styles.profile_container_left}>
            <div className={styles.profile_left_details_container}>
              <div className={styles.profile_left_backgroundImg}>
                <img
                  src={`${BASE_URL}/${userProfile.userId.profileBackgroundPicture}`}
                  alt="background Picture"
                />

                <div
                  onClick={() => setuploadBackgroundPic(true)}
                  className={styles.backgroundPic_edit}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                </div>

                <div className={styles.profile_pic}>
                  <img
                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                    alt="profilePicture"
                  />
                </div>
              </div>

              <div className={styles.profile_left_container_bottom}>
                <div className={styles.whitespace}>
                  <div className={styles.profilePic_edit}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </div>
                </div>

                <div className={styles.profile_username}>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "1.7rem",
                      color: "#171739",
                    }}
                  >
                    {userProfile.userId.name}
                  </p>

                  <p style={{ color: "#808080", fontSize: "1.3rem" }}>
                    {userProfile.bio || userProfile.userId.username} |{" "}
                    {userProfile.currentPost || "Student"} at{" "}
                    {userProfile.education?.[0]?.school || "N/A"},{" "}
                    {userProfile.education?.[0]?.degree || ""}{" "}
                    {userProfile.education?.[0]?.fieldOfStudy || ""}
                  </p>

                  <p
                    style={{
                      color: "#808080",
                    }}
                  ></p>
                </div>

                <div className={styles.connection_request}>
                  {isOwnProfile ? (
                    <button className={styles.editProfileBtn}>Open to</button>
                  ) : isConnected ? (
                    <button className={styles.connectedBtn} disabled>
                      Connected
                    </button>
                  ) : finalIsSent ? (
                    <button className={styles.pendingBtn} disabled>
                      Pending...
                    </button>
                  ) : isReceived ? (
                    <button
                      className={styles.connectBtn}
                      disabled={isRequesting}
                      onClick={async () => {
                        if (isRequesting) return;
                        if (!token) return;

                        setIsRequesting(true);

                        try {
                          await dispatch(
                            acceptConnectionRequest({
                              token,
                              requestId: authState.receivedRequests.find(
                                (r) => r.userId?._id === profileUserId
                              )?._id,
                              action_type: "accept",
                            })
                          );
                        } finally {
                          setIsRequesting(false);
                        }
                      }}
                    >
                      {isRequesting ? "Accepting..." : "Accept"}
                    </button>
                  ) : (
                    <button
                      className={styles.connectBtn}
                      disabled={isRequesting}
                      onClick={async () => {
                        if (isRequesting) return;
                        if (!token) return;

                        setLocalPending(true);
                        setIsRequesting(true);

                        try {
                          await dispatch(
                            sendConnectionRequest({
                              token,
                              user_id: profileUserId,
                            })
                          );

                          await dispatch(getSentRequests(token));
                        } finally {
                          setIsRequesting(false);
                        }
                      }}
                    >
                      {isRequesting ? "Sending..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>
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
                  authState.all_users
                    .filter(
                      (profile) =>
                        profile.userId._id !== authState.user?.userId?._id
                    )
                    .map((profile) => (
                      <div
                        key={profile.userId._id}
                        className={styles.premium_Profiles_details}
                      >
                        <img
                          onClick={async () => {
                            await router.replace(
                              `/view_profile/${profile.userId.username}`
                            );
                            window.location.reload();
                          }}
                          className={styles.premium_profile_picture}
                          src={`${BASE_URL}/${profile.userId.profilePicture}`}
                          alt="profile Picture"
                        />

                        <div className={styles.premium_profile_data}>
                          <p
                            onClick={async () => {
                              await router.replace(
                                `/view_profile/${profile.userId.username}`
                              );
                              window.location.reload();
                            }}
                            style={{ fontWeight: "bold" }}
                          >
                            {profile.userId.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#808080",
                              marginBottom: "0.5rem",
                            }}
                          >
                            @{profile.userId.username}
                          </p>

                          {profile.currentPost &&
                            profile.currentPost.length > 0 && (
                              <p
                                style={{ fontSize: "0.8rem", color: "#808080" }}
                              >
                                {profile.currentPost} at{" "}
                                {profile.education?.[0]?.school || "N/A"}
                              </p>
                            )}

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
