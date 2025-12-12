import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";

function DashboardComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  //Fetching posts user details only when token is confirmed
  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [authState.isTokenThere]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Dashboard</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DashboardComponent;
