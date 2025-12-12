import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function MyConnectionComponent() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>My Connection</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
