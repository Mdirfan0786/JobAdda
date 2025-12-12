import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
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

  //Fetching posts user details only when token is confirmed
  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }

    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.dashboard_component}>
          <div className={styles.create_post_container}>
            <img
              width={100}
              src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
              alt=""
            />

            <textarea name="" id=""></textarea>
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </label>
            <input type="file" hidden id="fileUpload" />
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DashboardComponent;
