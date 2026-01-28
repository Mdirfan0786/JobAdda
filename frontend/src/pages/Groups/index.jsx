import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function GroupsComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Groups</h1>
          <p
            style={{
              margin: "2rem 0",
              minHeight: "8rem",
              background: "#fff",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            🚧 This feature is currently under development We’re writing clean
            code & fixing bugs. Stay tuned.
          </p>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
