import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function DiscoverComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1 style={{ marginBottom: "1rem" }}>Discover</h1>
        <div className={styles.all_user_profile}>
          {authState.all_profile_fetched &&
            authState.all_users?.map((user) => (
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
            ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
