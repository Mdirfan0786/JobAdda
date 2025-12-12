import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function GroupsComponent() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Groups</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
