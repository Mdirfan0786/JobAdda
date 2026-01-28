import {
  acceptConnectionRequest,
  getAllUsers,
  getConnections,
  getReceivedRequests,
  getSentRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionComponent() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getReceivedRequests());
    dispatch(getConnections());
  }, []);

  useEffect(() => {
    if (authState.receivedRequests?.length !== 0) {
      console.log(authState.receivedRequests);
    }
  }, [authState.receivedRequests]);

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1 style={{ marginBottom: "1rem" }}>My Connection</h1>

          <div className={styles.all_user_profile}>
            {authState.receivedRequests?.length > 0 ? (
              authState.receivedRequests
                .filter((connection) => connection.status === "pending")
                .map((user) => (
                  <div key={user._id} className={styles.userCardContainer}>
                    <div key={user._id} className={styles.userCard}>
                      <img
                        onClick={() =>
                          router.push(`/view_profile/${user.userId.username}`)
                        }
                        className={styles.userCard_image}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="profilePicture"
                      />
                      <div className={styles.userCard_profile_Details}>
                        <h1
                          onClick={() =>
                            router.push(`/view_profile/${user.userId.username}`)
                          }
                        >
                          {user.userId.name}
                        </h1>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        dispatch(
                          acceptConnectionRequest({
                            requestId: user._id,
                            action: "accept",
                          }),
                        ).then(() => {
                          dispatch(getReceivedRequests());
                          dispatch(getConnections());
                        });
                      }}
                      className={styles.connectBtn}
                    >
                      Accept
                    </button>
                  </div>
                ))
            ) : (
              <p style={{ marginTop: "0.6rem" }}>No sent requests</p>
            )}
          </div>

          <h1 style={{ marginBottom: "1rem" }}>My network</h1>

          <div className={styles.all_user_profile}>
            {authState.connections?.map((conn) => {
              const loggedInUserId =
                authState.user?.userId?._id || authState.user?._id;

              const otherUser =
                String(conn.userId._id) === String(loggedInUserId)
                  ? conn.connectionId
                  : conn.userId;

              return (
                <div key={conn._id} className={styles.userCardContainer}>
                  <div className={styles.userCard}>
                    <img
                      onClick={() =>
                        router.push(`/view_profile/${otherUser.username}`)
                      }
                      className={styles.userCard_image}
                      src={`${BASE_URL}/${otherUser.profilePicture}`}
                      alt="profilePicture"
                    />
                    <div className={styles.userCard_profile_Details}>
                      <h1>{otherUser.name}</h1>
                      <p>@{otherUser.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
