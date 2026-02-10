import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SavedItemsComponent() {
  const { all_profile_fetched } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [all_profile_fetched]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Saved items</h1>

          <p
            style={{
              margin: "2rem 0",
              minHeight: "8rem",
              background: "#fff",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            🚧 This feature is currently under development. We’re writing clean
            code & fixing bugs. Stay tuned.
          </p>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
