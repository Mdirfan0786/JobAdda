import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function SavedItemsComponent() {
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
            🚧 This feature is currently under development We’re writing clean
            code & fixing bugs. Stay tuned.
          </p>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
