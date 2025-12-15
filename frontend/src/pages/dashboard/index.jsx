import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { CreatePost, getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";

function DashboardComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);

  //Fetching posts user details only when token is confirmed
  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [authState.isTokenThere, dispatch]);

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  // handling Post upload
  const handlePost = async () => {
    try {
      await dispatch(
        CreatePost({ file: fileContent, body: postContent })
      ).unwrap();

      setPostContent("");
      setFileContent(null);
    } catch (error) {
      console.error("Post failed:", error);
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.Dashboard_component}>
          <div className={styles.create_post_container}>
            <img
              className={styles.user_profile}
              width={100}
              src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
              alt=""
            />
            <textarea
              className={styles.textArea_content}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              name=""
              id=""
              placeholder={"What's in your mind?"}
            ></textarea>

            <label htmlFor="fileUpload">
              <div className={styles.fab}>
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
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
            </label>
            <input
              onChange={(e) => setFileContent(e.target.files[0])}
              type="file"
              hidden
              id="fileUpload"
            />

            {postContent.length > 0 && (
              <div onClick={handlePost} className={styles.upload_button}>
                Post
              </div>
            )}
          </div>
          <div className={styles.whiteSpace}></div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DashboardComponent;
