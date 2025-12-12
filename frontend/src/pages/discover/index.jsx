import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function DiscoverComponent() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
