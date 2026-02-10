import {
  acceptConnectionRequest,
  getAllUsers,
  getConnections,
  getReceivedRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionComponent() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { receivedRequests, connections, all_profile_fetched, user } =
    useSelector((state) => state.auth);

  // ================= FETCH CONNECTION DATA =================
  useEffect(() => {
    dispatch(getReceivedRequests());
    dispatch(getConnections());
  }, [dispatch]);

  // ================= FETCH USERS FOR SIDEBAR =================
  useEffect(() => {
    if (!all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [all_profile_fetched, dispatch]);

  // ================= ACCEPT REQUEST =================
  const handleAccept = async (requestId) => {
    await dispatch(
      acceptConnectionRequest({
        requestId,
        action: "accept",
      }),
    );
    dispatch(getReceivedRequests());
    dispatch(getConnections());
  };

  const loggedInUserId = user?.userId?._id || user?._id;

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          {/* ================= RECEIVED REQUESTS ================= */}
          <h1 style={{ marginBottom: "1rem" }}>My Connection</h1>

          <div className={styles.all_user_profile}>
            {receivedRequests?.filter((r) => r.status === "pending").length >
            0 ? (
              receivedRequests
                .filter((req) => req.status === "pending")
                .map((req) => (
                  <div key={req._id} className={styles.userCardContainer}>
                    <div className={styles.userCard}>
                      <img
                        onClick={() =>
                          router.push(`/view_profile/${req.userId.username}`)
                        }
                        className={styles.userCard_image}
                        src={`${BASE_URL}/${req.userId.profilePicture}`}
                        alt="profilePicture"
                      />
                      <div className={styles.userCard_profile_Details}>
                        <h1
                          onClick={() =>
                            router.push(`/view_profile/${req.userId.username}`)
                          }
                        >
                          {req.userId.name}
                        </h1>
                        <p>@{req.userId.username}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(req._id);
                      }}
                      className={styles.connectBtn}
                    >
                      Accept
                    </button>
                  </div>
                ))
            ) : (
              <p style={{ marginTop: "0.6rem", color: "#777" }}>
                No pending requests
              </p>
            )}
          </div>

          {/* ================= MY NETWORK ================= */}
          <h1 style={{ margin: "2rem 0 1rem" }}>My Network</h1>

          <div className={styles.all_user_profile}>
            {connections?.length > 0 ? (
              connections.map((conn) => {
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
                        <h1
                          onClick={() =>
                            router.push(`/view_profile/${otherUser.username}`)
                          }
                        >
                          {otherUser.name}
                        </h1>
                        <p>@{otherUser.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "#777" }}>No connections yet</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
