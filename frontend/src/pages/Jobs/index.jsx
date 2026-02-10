import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function JobsComponent() {
  const { all_profile_fetched } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // ================= FETCH USERS (for sidebar) =================
  useEffect(() => {
    if (!all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [all_profile_fetched, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Jobs</h1>

          <div
            style={{
              margin: "2rem 0",
              minHeight: "8rem",
              background: "#fff",
              borderRadius: "0.5rem",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              textAlign: "center",
            }}
          >
            🚧 This feature is currently under development. We’re writing clean
            code & fixing bugs. Stay tuned.
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
