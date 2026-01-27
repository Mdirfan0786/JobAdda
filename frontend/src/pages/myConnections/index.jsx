import {
  getConnections,
  getSentRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function MyConnectionComponent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSentRequests());
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>My Connection</h1>
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
