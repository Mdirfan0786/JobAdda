import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";
import {
  deleteComment,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLikes,
  postComment,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducers/postReducer";

export default function ProfileComponent() {
  const [commentText, setCommentText] = useState("");
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showUpdateWork, setShowUpdateWork] = useState(false);
  const [showWorkHistory, setShowWorkHistory] = useState(false);
  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [showEditEducationDetails, setShowEditEducationDetails] =
    useState(false);

  const PostState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);
  const userProfile = authState.user;

  // user Profile Updation
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [currentPost, setCurrentPost] = useState("");

  // user Work Updation
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [workId, setWorkId] = useState(null);

  // user education details
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [educationId, setEducationId] = useState(null);

  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // user Profile Updation logic
  useEffect(() => {
    if (showUpdateProfile && userProfile?.userId?.name) {
      setName(userProfile.userId.name);
      setBio(userProfile.bio);
      setCurrentPost(userProfile.currentPost);
    }
  }, [showUpdateProfile, userProfile]);

  //Fetching posts user details only when token is confirmed
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch]);

  // handling Delete Post functionality
  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!isConfirmed) return;

    await dispatch(
      deletePost({ token: localStorage.getItem("token"), post_id: postId }),
    );

    await dispatch(getAllPosts());
  };

  // handling Delete Comment functionality
  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!isConfirmed) return;

    await dispatch(deleteComment({ comment_id: commentId }));
    await dispatch(getAllComments({ post_id: PostState.postId }));
  };

  // Handling Share functionality
  const handleShare = async (postId) => {
    try {
      const shareUrl = `${window.location.origin}/post/${postId}`;

      if (navigator.share) {
        await navigator.share({
          title: "Check out this post",
          text: "Mujhe ye post interesting laga",
          url: shareUrl,
        });
        console.log("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("Share karne me problem aa gayi");
    }
  };

  // handle Likes functionality
  const handleLikes = async (post) => {
    await dispatch(incrementPostLikes(post._id));
    dispatch(getAllPosts());
  };

  // handle comments functionality
  const handleComments = (post) => {
    dispatch(getAllComments({ post_id: post._id }));
  };

  // handling profile navigation
  const handleProfileNavigation = (postUser) => {
    const loggedInUserId = authState.user?.userId?._id;

    if (postUser?._id === loggedInUserId) {
      router.push(`/profile/${postUser.username}`);
    } else {
      router.push(`/view_profile/${postUser.username}`);
    }
  };

  // Getting all users
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  // Alert
  const handleAlert = () => {
    alert(
      `🚧 This feature is currently under development  We’re writing clean code & fixing bugs. Stay tuned.`,
    );
  };

  // Handling BackGround Pic Upload
  const handleBackgroundPicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("profile_background_picture", file);
    formData.append("token", token);

    try {
      await clientServer.post("/upload_profile_background_picture", formData);

      dispatch(getAboutUser({ token }));
    } catch (err) {
      console.error("Background upload failed", err);
      alert("Background upload failed");
    }
  };

  // Handling Profile Pic Updation
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", token);

    try {
      await clientServer.post("/upload_profile_picture", formData);

      dispatch(getAboutUser({ token }));
    } catch (err) {
      console.error("Background upload failed", err);
      alert("Background upload failed");
    }
  };

  // updating user Profile Details

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      await clientServer.patch("/user_update", {
        token,
        name,
      });
      await clientServer.put("/update_user_profile", {
        token,
        bio,
        currentPost,
      });

      dispatch(getAboutUser({ token }));
      setShowUpdateProfile(false);
    } catch (err) {
      console.error("Failed during user details Updation!");
    }
  };

  // updating user Work Details
  const handleUpdateWork = async () => {
    if (!workId) {
      alert("Work ID missing");
      return;
    }

    const token = localStorage.getItem("token");
    const yearsValue = fromYear && toYear ? `${fromYear} - ${toYear}` : "";

    try {
      await clientServer.put(`/update_work_history/${workId}`, {
        token,
        company,
        position,
        years: yearsValue,
      });

      dispatch(getAboutUser({ token }));
      setShowUpdateWork(false);
      setWorkId(null);
    } catch (err) {
      console.error("Failed during user work details Updation!", err.message);
    }
  };

  // Handling ADD WORK DETAILS!
  const handleAddWork = async () => {
    const token = localStorage.getItem("token");

    if (!company || !position || !fromYear) {
      alert("Please fill all required fields");
      return;
    }

    const yearsValue =
      fromYear && toYear ? `${fromYear} - ${toYear}` : `${fromYear}`;

    await clientServer.post("/add_work_history", {
      token,
      company,
      position,
      years: yearsValue,
    });

    dispatch(getAboutUser({ token }));

    setCompany("");
    setPosition("");
    setFromYear("");
    setToYear("");
    setShowWorkHistory(false);
  };

  // handling Delete Work
  const handleDeleteWork = async (workID) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this work experience?",
      );

      if (!isConfirmed) return;

      if (!workID) return alert("Work ID Missing!");

      const token = localStorage.getItem("token");

      await clientServer.delete(`/delete_User_Work_details/${workID}`, {
        data: { token },
      });

      dispatch(getAboutUser({ token }));
    } catch (err) {
      console.error("Error While Deleting Education Details!", err);
    }
  };

  // handling createion of Education Details
  const handleEducation = async () => {
    const token = localStorage.getItem("token");

    if (!school || !degree || !fieldOfStudy) {
      alert("Please fill all required fields");
      return;
    }

    await clientServer.post("/add_Education_details", {
      token,
      school,
      degree,
      fieldOfStudy,
    });

    dispatch(getAboutUser({ token }));

    setSchool("");
    setDegree("");
    setFieldOfStudy("");
    setShowEducationDetails(false);
  };

  // updating education Details
  const handleUpdateEducation = async () => {
    if (!educationId) {
      alert("education ID missing");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await clientServer.put(`/update_Education_details/${educationId}`, {
        token,
        school,
        degree,
        fieldOfStudy,
      });

      dispatch(getAboutUser({ token }));
      setShowEditEducationDetails(false);
      setEducationId(null);
    } catch (err) {
      console.error(
        "Failed during user education details Updation!",
        err.message,
      );
    }
  };

  // handling Delete Education
  const handleDeleteEducation = async (eduID) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this education details?",
      );

      if (!isConfirmed) return;

      if (!eduID) return alert("Education ID Missing!");

      const token = localStorage.getItem("token");

      await clientServer.delete(`/delete_User_Education_details/${eduID}`, {
        data: { token },
      });

      dispatch(getAboutUser({ token }));
    } catch (err) {
      console.error("Error While Deleting Work Details!", err);
    }
  };

  // Own prifile
  const isOwnProfile = authState.user?.userId?._id === userProfile?.userId?._id;

  if (!userProfile || !userProfile.userId) {
    return (
      <UserLayout>
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading profile...
        </p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {authState.user && userProfile?.userId && (
        <div className={styles.conteiner}>
          <div className={styles.profile_container}>
            <div className={styles.profile_container_left}>
              <div className={styles.profile_left_wrapper}>
                <div className={styles.profile_left_details_container}>
                  <div className={styles.profile_left_backgroundImg}>
                    <img
                      src={`${BASE_URL}/${userProfile.userId.profileBackgroundPicture}`}
                      alt="background Picture"
                    />

                    {isOwnProfile && (
                      <>
                        <div
                          title="Edit Profile Background Picture"
                          onClick={() =>
                            document
                              .getElementById("backgroundPicInput")
                              .click()
                          }
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
                        <input
                          type="file"
                          id="backgroundPicInput"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleBackgroundPicUpload}
                        />
                      </>
                    )}

                    <div className={styles.profile_pic}>
                      <div className={styles.profilePicUpdate}>
                        <div
                          title="Edit Profile Picture"
                          onClick={() =>
                            document.getElementById("ProfilePicInput").click()
                          }
                          className={styles.profilePic_edit_btn}
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
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </div>

                        <input
                          type="file"
                          id="ProfilePicInput"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleProfilePicUpload}
                        />
                      </div>
                      <img
                        src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                        alt="profilePicture"
                      />
                    </div>
                  </div>

                  <div className={styles.profile_left_container_bottom}>
                    <div className={styles.whitespace}>
                      <div
                        title="Update Profile Details"
                        className={styles.profilePic_edit}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                          onClick={() => setShowUpdateProfile(true)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </div>
                    </div>

                    {showUpdateProfile && (
                      <>
                        <div
                          className={styles.updateProfile_backdrop}
                          onClick={() => setShowUpdateProfile(false)}
                        />

                        <div className={styles.updateProfile_details}>
                          <div
                            style={{
                              borderBottom: "1px solid #d0d0d0",
                              paddingBottom: "1rem",
                            }}
                          >
                            <p
                              style={{
                                color: "#191919",
                                fontWeight: "bold",
                                fontSize: "1.3rem",
                              }}
                            >
                              Edit Profile Details
                            </p>
                          </div>

                          <div className={styles.profilDetails}>
                            <p style={{ marginTop: "1rem", color: "#404040" }}>
                              Name :{" "}
                            </p>

                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your name"
                            />
                          </div>

                          <div className={styles.profilDetails}>
                            <p style={{ marginTop: "1rem", color: "#404040" }}>
                              Bio :{" "}
                            </p>

                            <textarea
                              type="text"
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              placeholder="bio"
                              maxLength={100}
                            />

                            <p
                              style={{
                                color: "#c5c3bd",
                                fontSize: "0.7rem",
                                marginLeft: "0.2rem",
                              }}
                            >
                              {bio.length}/120
                            </p>
                          </div>

                          <div className={styles.profilDetails}>
                            <p style={{ marginTop: "1rem", color: "#404040" }}>
                              Current Post :{" "}
                            </p>

                            <input
                              type="text"
                              value={currentPost}
                              onChange={(e) => setCurrentPost(e.target.value)}
                              placeholder="currentPost"
                            />
                          </div>

                          <button
                            className={styles.saveBtn}
                            onClick={handleUpdateProfile}
                          >
                            Save
                          </button>
                        </div>
                      </>
                    )}

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

                    <div
                      className={styles.connection_request}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                      }}
                    >
                      {isOwnProfile ? (
                        <button className={styles.editProfileBtn}>
                          Open to
                        </button>
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
                                    (r) => r.userId?._id === profileUserId,
                                  )?._id,
                                  action: "accept",
                                }),
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
                                }),
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

                {/* Work history */}
                <div className={styles.work_history}>
                  <div className={styles.work_history_head}>
                    <h1>Work history</h1>
                    <div
                      title="Add work experience"
                      className={styles.work_history_edit}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        onClick={() => setShowWorkHistory(true)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className={styles.work_history_container}>
                    {userProfile?.pastWork &&
                    userProfile.pastWork.length > 0 ? (
                      userProfile.pastWork.map((work, index) => (
                        <div key={index} className={styles.work_history_Card}>
                          <div className={styles.workHistory_details}>
                            <p
                              style={{
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.8rem",
                              }}
                            >
                              {work.company} - {work.position}
                            </p>
                            <p>{work.years}</p>
                          </div>

                          <div className={styles.work_history_edit}>
                            <div
                              title="Edit work experience"
                              className={styles.work_history_edit}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                                onClick={() => {
                                  setWorkId(work._id);
                                  setCompany(work.company);
                                  setPosition(work.position);

                                  if (work.years) {
                                    const [from, to] = work.years.split(" - ");
                                    setFromYear(from || "");
                                    setToYear(to || "");
                                  } else {
                                    setFromYear("");
                                    setToYear("");
                                  }

                                  setShowUpdateWork(true);
                                }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </div>

                            <div
                              title="Delete work experience"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWork(work._id);
                              }}
                              className={styles.deleteEducation_work_Details}
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
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#888", fontStyle: "italic" }}>
                        No work history added
                      </p>
                    )}
                  </div>
                </div>

                {/* this Modal for Create work History */}
                {showWorkHistory && (
                  <>
                    <div
                      className={styles.updateProfile_backdrop}
                      onClick={() => setShowWorkHistory(false)}
                    />

                    <div className={styles.updateProfile_details}>
                      <div
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          paddingBottom: "1rem",
                        }}
                      >
                        <p
                          style={{
                            color: "#191919",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                          }}
                        >
                          Add Work Details
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          Company :{" "}
                        </p>

                        <input
                          type="text"
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company"
                        />
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          position :{" "}
                        </p>

                        <textarea
                          type="text"
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder="Position"
                          maxLength={100}
                        />

                        <p
                          style={{
                            color: "#c5c3bd",
                            fontSize: "0.7rem",
                            marginLeft: "0.2rem",
                          }}
                        >
                          {bio.length}/120
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          Years :
                        </p>

                        {/* FROM YEAR */}
                        <select
                          className={styles.selectYr}
                          onChange={(e) => {
                            setFromYear(Number(e.target.value));
                            setToYear("");
                          }}
                        >
                          <option value="">From</option>
                          {Array.from({ length: 30 }, (_, i) => 1995 + i).map(
                            (year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ),
                          )}
                        </select>

                        {/* TO YEAR */}
                        <select
                          className={styles.selectYr}
                          value={toYear}
                          onChange={(e) => setToYear(e.target.value)}
                          disabled={!fromYear}
                        >
                          <option value="">To</option>
                          <option value="Present">Present</option>

                          {fromYear &&
                            Array.from(
                              {
                                length: new Date().getFullYear() - fromYear + 1,
                              },
                              (_, i) => fromYear + i,
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        className={styles.saveBtn}
                        onClick={handleAddWork}
                      >
                        Create
                      </button>
                    </div>
                  </>
                )}

                {/* this Modal for Show Update Work */}
                {showUpdateWork && (
                  <>
                    <div
                      className={styles.updateProfile_backdrop}
                      onClick={() => setShowUpdateWork(false)}
                    />

                    <div className={styles.updateProfile_details}>
                      <div
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          paddingBottom: "1rem",
                        }}
                      >
                        <p
                          style={{
                            color: "#191919",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                          }}
                        >
                          Edit Work Details
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          Company :{" "}
                        </p>

                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company"
                        />
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          position :{" "}
                        </p>

                        <textarea
                          type="text"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder="Position"
                          maxLength={100}
                        />

                        <p
                          style={{
                            color: "#c5c3bd",
                            fontSize: "0.7rem",
                            marginLeft: "0.2rem",
                          }}
                        >
                          {bio.length}/120
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          Years :
                        </p>

                        {/* FROM YEAR */}
                        <select
                          className={styles.selectYr}
                          value={fromYear}
                          onChange={(e) => {
                            setFromYear(Number(e.target.value));
                            setToYear("");
                          }}
                        >
                          <option value="">From</option>
                          {Array.from({ length: 30 }, (_, i) => 1995 + i).map(
                            (year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ),
                          )}
                        </select>

                        {/* TO YEAR */}
                        <select
                          className={styles.selectYr}
                          value={toYear}
                          onChange={(e) => setToYear(e.target.value)}
                          disabled={!fromYear}
                        >
                          <option value="">To</option>
                          <option value="Present">Present</option>

                          {fromYear &&
                            Array.from(
                              {
                                length: new Date().getFullYear() - fromYear + 1,
                              },
                              (_, i) => fromYear + i,
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        className={styles.saveBtn}
                        onClick={handleUpdateWork}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}

                {/* Education Details */}
                <div className={styles.work_history}>
                  <div className={styles.work_history_head}>
                    <h1>Education Details</h1>
                    <div
                      title="Add education details"
                      className={styles.work_history_edit}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        onClick={() => setShowEducationDetails(true)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className={styles.work_history_container}>
                    {userProfile?.education &&
                    userProfile.education.length > 0 ? (
                      userProfile.education.map((education, index) => (
                        <div key={index} className={styles.work_history_Card}>
                          <div className={styles.workHistory_details}>
                            <p
                              style={{
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.8rem",
                              }}
                            >
                              {education.school} - {education.degree}
                            </p>
                            <p>{education.fieldOfStudy}</p>
                          </div>

                          <div className={styles.work_history_edit}>
                            <div
                              title="Edit education details"
                              className={styles.work_history_edit}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                                onClick={() => {
                                  setEducationId(education._id);
                                  setSchool(education.school);
                                  setDegree(education.degree);
                                  setFieldOfStudy(education.fieldOfStudy);
                                  setShowEditEducationDetails(true);
                                }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </div>

                            <div
                              title="Delete education details"
                              onClick={() => {
                                e.stopPropagation();
                                handleDeleteEducation(education._id);
                              }}
                              className={styles.deleteEducation_work_Details}
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
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#888", fontStyle: "italic" }}>
                        No Education Details added
                      </p>
                    )}
                  </div>
                </div>

                {/* this Modal for Create work History */}
                {showEducationDetails && (
                  <>
                    <div
                      className={styles.updateProfile_backdrop}
                      onClick={() => setShowEducationDetails(false)}
                    />

                    <div className={styles.updateProfile_details}>
                      <div
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          paddingBottom: "1rem",
                        }}
                      >
                        <p
                          style={{
                            color: "#191919",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                          }}
                        >
                          Add Education Details
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          School :{" "}
                        </p>

                        <input
                          type="text"
                          onChange={(e) => setSchool(e.target.value)}
                          placeholder="School"
                        />
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          degree :{" "}
                        </p>

                        <textarea
                          type="text"
                          onChange={(e) => setDegree(e.target.value)}
                          placeholder="Degree"
                          maxLength={100}
                        />

                        <p
                          style={{
                            color: "#c5c3bd",
                            fontSize: "0.7rem",
                            marginLeft: "0.2rem",
                          }}
                        >
                          {degree.length}/120
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          Field Of Study :
                        </p>

                        <input
                          type="text"
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          placeholder="Field of study"
                        />
                      </div>

                      <button
                        className={styles.saveBtn}
                        onClick={handleEducation}
                      >
                        Create
                      </button>
                    </div>
                  </>
                )}

                {/* this Modal for Show Update Education Details */}
                {showEditEducationDetails && (
                  <>
                    <div
                      className={styles.updateProfile_backdrop}
                      onClick={() => setShowEditEducationDetails(false)}
                    />

                    <div className={styles.updateProfile_details}>
                      <div
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          paddingBottom: "1rem",
                        }}
                      >
                        <p
                          style={{
                            color: "#191919",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                          }}
                        >
                          Edit Education Details
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          School :{" "}
                        </p>

                        <input
                          type="text"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          placeholder="School"
                        />
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          degree :{" "}
                        </p>

                        <textarea
                          type="text"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          placeholder="Degree"
                          maxLength={100}
                        />

                        <p
                          style={{
                            color: "#c5c3bd",
                            fontSize: "0.7rem",
                            marginLeft: "0.2rem",
                          }}
                        >
                          {degree.length}/120
                        </p>
                      </div>

                      <div className={styles.profilDetails}>
                        <p style={{ marginTop: "1rem", color: "#404040" }}>
                          Field Of Study :
                        </p>

                        <input
                          type="text"
                          value={fieldOfStudy}
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          placeholder="Field Of Study"
                        />
                      </div>

                      <button
                        className={styles.saveBtn}
                        onClick={handleUpdateEducation}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}

                {/* All Posts */}
                <div className={styles.Dashboard_component}>
                  <div className={styles.all_posts_Container}>
                    {userProfile?.userId?._id &&
                      PostState.posts
                        ?.filter(
                          (post) =>
                            post.userId?._id === userProfile?.userId?._id,
                        )
                        .map((post) => {
                          return (
                            <div key={post._id} className={styles.singleCard}>
                              <div className={styles.singleCardContainer}>
                                <div
                                  className={styles.singleCard_postContainer}
                                >
                                  <div className={styles.postDetails_container}>
                                    <img
                                      onClick={() =>
                                        handleProfileNavigation(post.userId)
                                      }
                                      className={styles.user_profile_picture}
                                      src={`${BASE_URL}/${post?.userId?.profilePicture}`}
                                      alt=""
                                    />

                                    <div
                                      className={styles.singleCard_userDetails}
                                      style={{ marginTop: "0.5rem" }}
                                    >
                                      <p
                                        onClick={() =>
                                          handleProfileNavigation(post.userId)
                                        }
                                        style={{
                                          fontWeight: "bold",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {post?.userId?.name}
                                      </p>

                                      <p
                                        style={{
                                          color: "grey",
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        @{post?.userId?.username}
                                      </p>
                                    </div>
                                  </div>

                                  {post.userId._id ===
                                  authState.user?.userId?._id ? (
                                    <div
                                      onClick={() => handleDelete(post._id)}
                                      className={styles.delete}
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
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                      </svg>

                                      <p>Delete</p>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={handleAlert}
                                      className={styles.follow}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={3}
                                        stroke="currentColor"
                                        className="size-6"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                      </svg>

                                      <p>Follow</p>
                                    </div>
                                  )}
                                </div>

                                <div
                                  className={
                                    styles.singleCard_postContainer_body
                                  }
                                >
                                  <p style={{ color: "grey" }}>{post?.body}</p>
                                </div>

                                <div className={styles.post_img}>
                                  {post.media && (
                                    <img
                                      src={`${BASE_URL}/${post.media}` || ""}
                                      alt=""
                                    />
                                  )}
                                </div>

                                <div className={styles.post_footer}>
                                  <div
                                    onClick={() => handleLikes(post)}
                                    className={styles.like}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1}
                                      stroke="currentColor"
                                      className="size-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                      />
                                    </svg>

                                    <p>{post.likes} Likes</p>
                                  </div>

                                  <div
                                    onClick={() => handleComments(post)}
                                    className={styles.comment}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1}
                                      stroke="currentColor"
                                      className="size-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                      />
                                    </svg>
                                    <p>Comment</p>
                                  </div>

                                  <div
                                    onClick={() => handleShare(post._id)}
                                    className={styles.share}
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
                                        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                      />
                                    </svg>

                                    <p>Share</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>

                {PostState.postId && (
                  <div
                    onClick={() => dispatch(resetPostId())}
                    className={styles.comments_Container}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={styles.all_Comments_Container}
                    >
                      {/* COMMENTS */}
                      <div className={styles.commentsList}>
                        <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                          Total comments - {PostState.comments.length}
                        </p>
                        {PostState.comments.map((comment) => (
                          <div key={comment._id} className={styles.commentCard}>
                            <img
                              onClick={() =>
                                router.push(
                                  `/view_profile/${comment.userId.username}`,
                                )
                              }
                              src={`${BASE_URL}/${comment.userId.profilePicture}`}
                              className={styles.avatar}
                            />
                            <div className={styles.content}>
                              <p className={styles.username}>
                                {comment.userId.name}
                                <span>@{comment.userId.username}</span>
                              </p>
                              <p className={styles.text}>{comment.body}</p>
                            </div>
                            {comment.userId._id ===
                              authState.user?.userId?._id && (
                              <div
                                onClick={() => handleDeleteComment(comment._id)}
                                className={styles.deleteComment}
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* INPUT BAR */}
                      <div className={styles.Post_Comment_Container}>
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add your comment..."
                        />

                        <div
                          onClick={async (e) => {
                            if (!commentText.trim()) return;
                            await dispatch(
                              postComment({
                                post_id: PostState.postId,
                                body: commentText,
                              }),
                            );
                            await dispatch(
                              getAllComments({ post_id: PostState.postId }),
                            );
                            setCommentText("");
                          }}
                          className={styles.comment_button}
                        >
                          <p>Comment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                          profile.userId._id !== authState.user?.userId?._id,
                      )
                      .map((profile) => (
                        <div
                          key={profile.userId._id}
                          className={styles.premium_Profiles_details}
                        >
                          <img
                            onClick={async () => {
                              await router.push(
                                `/view_profile/${profile.userId.username}`,
                              );
                            }}
                            className={styles.premium_profile_picture}
                            src={`${BASE_URL}/${profile.userId.profilePicture}`}
                            alt="profile Picture"
                          />

                          <div className={styles.premium_profile_data}>
                            <p
                              onClick={async () => {
                                await router.push(
                                  `/view_profile/${profile.userId.username}`,
                                );
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
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "#808080",
                                  }}
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
      )}
    </UserLayout>
  );
}
