import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function EventsComponent() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Events</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
