import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function SavedItemsComponent() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Saved items</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
