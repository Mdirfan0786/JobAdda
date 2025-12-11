import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";

function DashboardComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [isTokenThere, setTokenThere] = useState(false);

  //   checking token available
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth?mode=login");
      return;
    }

    setTokenThere(true);
  }, []);

  //Fetching posts user details only when token is confirmed
  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [isTokenThere]);

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
