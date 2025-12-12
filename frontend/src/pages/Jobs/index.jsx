import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function JobComponent() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Jobs</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
